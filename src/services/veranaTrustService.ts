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

export type VeranaTrustResolution = {
  did: string;
  trustStatus: 'TRUSTED' | 'PARTIAL' | 'UNTRUSTED';
  production: boolean;
  evaluatedAt?: string;
  evaluatedAtBlock?: number;
  expiresAt?: string;
};

export type VeranaTrustDetails = VeranaTrustResolution & {
  credentials: Array<VeranaTrustCredential>;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isTrustStatus = (value: unknown): value is VeranaTrustResolution['trustStatus'] =>
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

// Fast trust decision on detail=summary (a cached lookup on the resolver). Fail-closed: any
// non-200, network failure, timeout or non-TRUSTED status resolves to undefined so the wallet
// falls back to its other trust mechanisms instead of displaying unverified trust. The heavier
// detail=full evaluation is only fetched lazily by the detail screen, off the critical path.
export const resolveVeranaTrust = async (did: string): Promise<VeranaTrustResolution | undefined> => {
  const resolution = parseResolution(await fetchResolution(did, 'summary', DECISION_TIMEOUT_MS), did);
  if (resolution?.trustStatus !== 'TRUSTED') {
    return undefined;
  }
  return resolution;
};

export const fetchVeranaTrustDetails = async (did: string): Promise<VeranaTrustDetails | undefined> => {
  const value = await fetchResolution(did, 'full', DETAILS_TIMEOUT_MS);
  const resolution = parseResolution(value, did);
  if (resolution?.trustStatus !== 'TRUSTED' || !isRecord(value)) {
    return undefined;
  }

  const credentials = Array.isArray(value.credentials)
    ? value.credentials.map(parseCredential).filter((credential): credential is VeranaTrustCredential => credential !== undefined)
    : [];
  return {...resolution, credentials};
};
