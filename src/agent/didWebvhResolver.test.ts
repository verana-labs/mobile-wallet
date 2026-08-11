import {DIDDocument} from 'did-resolver';

jest.mock('@stablelib/ed25519', () => ({verify: jest.fn()}));
jest.mock('didwebvh-ts', () => ({resolveDID: jest.fn()}));

import {normalizeMultikeys} from './didWebvhResolver';

describe('normalizeMultikeys', () => {
  it('retypes supported Ed25519 and X25519 multikeys', () => {
    const document: DIDDocument = {
      id: 'did:webvh:example.com',
      verificationMethod: [
        {id: '#ed', controller: 'did:webvh:example.com', type: 'Multikey', publicKeyMultibase: 'z6Mktest'},
        {id: '#x', controller: 'did:webvh:example.com', type: 'Multikey', publicKeyMultibase: 'z6LStest'},
      ],
    };

    expect(normalizeMultikeys(document).verificationMethod?.map(method => method.type)).toEqual([
      'Ed25519VerificationKey2020',
      'X25519KeyAgreementKey2020',
    ]);
  });

  it('leaves unknown multikey encodings unchanged', () => {
    const document: DIDDocument = {
      id: 'did:webvh:example.com',
      verificationMethod: [{id: '#unknown', controller: 'did:webvh:example.com', type: 'Multikey', publicKeyMultibase: 'zUnknown'}],
    };

    expect(normalizeMultikeys(document)).toEqual(document);
  });
});
