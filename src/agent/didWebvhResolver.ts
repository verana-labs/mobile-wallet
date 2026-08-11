import {verify as verifyEd25519} from '@stablelib/ed25519';
import type {DIDDocument, DIDResolutionResult, ResolverRegistry} from 'did-resolver';
import {resolveDID} from 'didwebvh-ts';
import Debug, {Debugger} from 'debug';
import {APP_ID} from '../@config/constants';

const debug: Debugger = Debug(`${APP_ID}:didWebvhResolver`);

// didwebvh-ts requires an injected verifier for the DID log's Ed25519 data-integrity proofs.
const ed25519Verifier = {
  async verify(signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
    try {
      return verifyEd25519(publicKey, message, signature);
    } catch (error) {
      debug(`ed25519 verification failed: ${error}`);
      return false;
    }
  },
};

// The did:webvh convention publishes verification methods as generic 'Multikey', which the
// SSI-SDK key-utils cannot map to a key type. For Ed25519 (z6Mk…) and X25519 (z6LS…) multicodec
// prefixes the 2020 suite types use the exact same publicKeyMultibase encoding, so retyping is
// a lossless interop shim. Unknown prefixes are left untouched (and will fail closed downstream).
export const normalizeMultikeys = (doc: DIDDocument): DIDDocument => {
  if (!Array.isArray(doc?.verificationMethod)) {
    return doc;
  }
  const verificationMethod = doc.verificationMethod.map(method => {
    if (method?.type !== 'Multikey' || typeof method.publicKeyMultibase !== 'string') {
      return method;
    }
    if (method.publicKeyMultibase.startsWith('z6Mk')) {
      return {...method, type: 'Ed25519VerificationKey2020'};
    }
    if (method.publicKeyMultibase.startsWith('z6LS')) {
      return {...method, type: 'X25519KeyAgreementKey2020'};
    }
    return method;
  });
  return {...doc, verificationMethod};
};

export const getDidWebvhResolver = (): ResolverRegistry => ({
  webvh: async (did: string): Promise<DIDResolutionResult> => {
    try {
      const {doc, meta} = await resolveDID(did, {verifier: ed25519Verifier});
      if (!doc || (meta && 'error' in meta && meta.error)) {
        return {
          didResolutionMetadata: {error: 'notFound', message: `resolver_error: unable to resolve did '${did}': ${JSON.stringify(meta)}`},
          didDocument: null,
          didDocumentMetadata: {},
        };
      }
      return {
        didResolutionMetadata: {contentType: 'application/did+ld+json'},
        didDocument: normalizeMultikeys(doc as DIDDocument),
        didDocumentMetadata: {},
      };
    } catch (error) {
      debug(`error resolving ${did}: ${error}`);
      return {
        didResolutionMetadata: {error: 'notFound', message: `resolver_error: unable to resolve did '${did}': ${error}`},
        didDocument: null,
        didDocumentMetadata: {},
      };
    }
  },
});
