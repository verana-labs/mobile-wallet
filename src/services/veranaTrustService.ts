import Debug, {Debugger} from 'debug';
import {APP_ID, VERANA_RESOLVER_URL} from '../@config/constants';

const debug: Debugger = Debug(`${APP_ID}:veranaTrustService`);

const DECISION_TIMEOUT_MS = 10000;
const DETAILS_TIMEOUT_MS = 15000;

export type VeranaTrustCredential = {
  ecsType?: string;
  result?: string;
  format?: string;
  issuedBy?: string;
  presentedBy?: string;
  claims?: Record<string, unknown>;
};

// UNVERIFIED is wallet-local: the peer identifies by DID but the resolver could not be
// reached or answered malformed. Could-not-determine, never a refusal.
export type VeranaTrustStatus = 'TRUSTED' | 'PARTIAL' | 'UNTRUSTED' | 'UNVERIFIED';

export type VeranaTrustResolution = {
  did: string;
  trustStatus: VeranaTrustStatus;
  production: boolean;
  evaluatedAt?: string;
  evaluatedAtBlock?: number;
  expiresAt?: string;
};

export type VeranaTrustDetails = VeranaTrustResolution & {
  credentials: Array<VeranaTrustCredential>;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isTrustStatus = (value: unknown): value is VeranaTrustStatus =>
  value === 'TRUSTED' || value === 'PARTIAL' || value === 'UNTRUSTED';

const parseResolution = (value: unknown, requestedDid: string): VeranaTrustResolution | undefined => {
  if (!isRecord(value) || value.did !== requestedDid || !isTrustStatus(value.trustStatus) || typeof value.production !== 'boolean') {
    return undefined;
  }

  return {
    did: value.did,
    trustStatus: value.trustStatus,
    production: value.production,
    evaluatedAt: typeof value.evaluatedAt === 'string' ? value.evaluatedAt : undefined,
    evaluatedAtBlock: typeof value.evaluatedAtBlock === 'number' ? value.evaluatedAtBlock : undefined,
    expiresAt: typeof value.expiresAt === 'string' ? value.expiresAt : undefined,
  };
};

const parseCredential = (value: unknown): VeranaTrustCredential | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    ecsType: typeof value.ecsType === 'string' ? value.ecsType : undefined,
    result: typeof value.result === 'string' ? value.result : undefined,
    format: typeof value.format === 'string' ? value.format : undefined,
    issuedBy: typeof value.issuedBy === 'string' ? value.issuedBy : undefined,
    presentedBy: typeof value.presentedBy === 'string' ? value.presentedBy : undefined,
    claims: isRecord(value.claims) ? value.claims : undefined,
  };
};

export const extractDidFromClientId = (clientId?: string): string | undefined => {
  if (!clientId) {
    return undefined;
  }
  const did = clientId.startsWith('decentralized_identifier:') ? clientId.slice('decentralized_identifier:'.length) : clientId;
  return did.startsWith('did:') ? did.split('#')[0] : undefined;
};

// did:web:host:a:b -> https://host/a/b/did.json, host-only -> /.well-known/did.json
const didWebDocumentUrl = (did: string): string | undefined => {
  if (!did.startsWith('did:web:')) {
    return undefined;
  }
  const [host, ...path] = did.slice('did:web:'.length).split(':').map(decodeURIComponent);
  if (!host) {
    return undefined;
  }
  return path.length ? `https://${host}/${path.join('/')}/did.json` : `https://${host}/.well-known/did.json`;
};

/**
 * The DID the Verana registry knows this counterparty by.
 *
 * A did:webvh agent also publishes a parallel did:web document, and request-object verification
 * hands us that did:web name. Only the did:webvh form carries a trust evaluation, so the parallel
 * document's `alsoKnownAs` is followed back before anything is asked of the registry. Any other
 * DID, and any failure, is used as given.
 */
export const canonicalVeranaDid = async (did?: string): Promise<string | undefined> => {
  const url = did ? didWebDocumentUrl(did) : undefined;
  if (!did || !url) {
    return did;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DECISION_TIMEOUT_MS);
  try {
    const response = await fetch(url, {signal: controller.signal});
    if (!response.ok) {
      debug(`${url} returned ${response.status}`);
      return did;
    }
    const document: unknown = await response.json();
    const alsoKnownAs = isRecord(document) ? document.alsoKnownAs : undefined;
    if (!Array.isArray(alsoKnownAs)) {
      return did;
    }
    return alsoKnownAs.find((entry): entry is string => typeof entry === 'string' && entry.startsWith('did:webvh:')) ?? did;
  } catch (error) {
    debug(`could not read ${url}: ${error}`);
    return did;
  } finally {
    clearTimeout(timeout);
  }
};

const fetchResolution = async (did: string, detail: 'summary' | 'full', timeoutMs: number): Promise<unknown> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${VERANA_RESOLVER_URL}/v1/trust/resolve?did=${encodeURIComponent(did)}&detail=${detail}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      debug(`resolver returned ${response.status} for ${did}`);
      return undefined;
    }
    return await response.json();
  } catch (error) {
    debug(`resolver call failed for ${did}: ${error}`);
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
};

// Fast trust decision on detail=summary (a cached lookup on the resolver). Every outcome is
// reported: TRUSTED/PARTIAL/UNTRUSTED as the resolver said, UNVERIFIED synthesized on any
// non-200, network failure, timeout or malformed body. Rendering and gating live with the
// consumers; this service reports, it does not filter. The heavier detail=full evaluation is
// only fetched lazily by the detail screen, off the critical path.
export const resolveVeranaTrust = async (did: string): Promise<VeranaTrustResolution> => {
  const resolution = parseResolution(await fetchResolution(did, 'summary', DECISION_TIMEOUT_MS), did);
  return resolution ?? {did, trustStatus: 'UNVERIFIED', production: true};
};

export const fetchVeranaTrustDetails = async (did: string): Promise<VeranaTrustDetails> => {
  const value = await fetchResolution(did, 'full', DETAILS_TIMEOUT_MS);
  const resolution = parseResolution(value, did);
  if (resolution === undefined || !isRecord(value)) {
    return {did, trustStatus: 'UNVERIFIED', production: true, credentials: []};
  }

  const credentials = Array.isArray(value.credentials)
    ? value.credentials.map(parseCredential).filter((credential): credential is VeranaTrustCredential => credential !== undefined)
    : [];
  return {...resolution, credentials};
};
