import {decodeJoseBlob} from '@sphereon/ssi-sdk.core';
import Debug, {Debugger} from 'debug';
import {APP_ID} from '../@config/constants';
import agent from '../agent';

const debug: Debugger = Debug(`${APP_ID}:veranaSignedIssuerMetadata`);

const WELL_KNOWN_SUFFIX = '/.well-known/openid-credential-issuer';
const METADATA_JWT_TYP = 'openidvci-issuer-metadata+jwt';
const FETCH_TIMEOUT_MS = 10000;

export type VeranaSignedIssuer = {
  did: string;
  didUrl: string;
};

export type VeranaSignedIssuerDeps = {
  verifyJws?: (jws: string) => Promise<boolean>;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const decodeJwtSegment = (segment: string): unknown => {
  try {
    return decodeJoseBlob(segment);
  } catch (error) {
    debug(`jwt segment decode failed: ${error}`);
    return undefined;
  }
};

const verifyJwsWithAgent = async (jws: string): Promise<boolean> => !(await agent.jwtVerifyJwsSignature({jws})).error;

// The bundled OID4VCI client never negotiates the application/jwt issuer-metadata variant, and the
// plain JSON variant carries no signed_metadata, so a DID-identified issuer would go undetected.
// Fetch the signed variant ourselves and verify it against the key resolved from the DID document
// before believing the DID claim. Fail-closed: undefined on any failure, never an unverified DID.
export const resolveSignedIssuerMetadata = async (
  credentialIssuer: string,
  deps?: VeranaSignedIssuerDeps,
): Promise<VeranaSignedIssuer | undefined> => {
  const verifyJws = deps?.verifyJws ?? verifyJwsWithAgent;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${credentialIssuer.replace(/\/$/, '')}${WELL_KNOWN_SUFFIX}`, {
      headers: {accept: 'application/jwt'},
      signal: controller.signal,
    });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/jwt')) {
      return undefined;
    }

    const jws = (await response.text()).trim();
    const parts = jws.split('.');
    if (parts.length !== 3 || parts.some(part => part.length === 0)) {
      return undefined;
    }

    const header = decodeJwtSegment(parts[0]);
    if (!isRecord(header) || header.typ !== METADATA_JWT_TYP || typeof header.kid !== 'string' || !header.kid.startsWith('did:')) {
      return undefined;
    }

    const payload = decodeJwtSegment(parts[1]);
    if (!isRecord(payload) || payload.credential_issuer !== credentialIssuer) {
      return undefined;
    }

    if (!(await verifyJws(jws))) {
      debug(`signature verification failed for ${header.kid}`);
      return undefined;
    }

    return {did: header.kid.split('#')[0], didUrl: header.kid};
  } catch (error) {
    debug(`signed issuer metadata failed for ${credentialIssuer}: ${error}`);
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
};
