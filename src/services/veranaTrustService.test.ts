import {extractDidFromClientId, fetchVeranaTrustDetails, resolveVeranaTrust} from './veranaTrustService';

const did = 'did:webvh:example.com';
const mockFetch = jest.fn();

describe('veranaTrustService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch as typeof fetch;
  });

  it('extracts a DID from an OID4VP decentralized_identifier client id', () => {
    expect(extractDidFromClientId(`decentralized_identifier:${did}#key-1`)).toBe(did);
    expect(extractDidFromClientId('https://verifier.example')).toBeUndefined();
  });

  it('returns only a valid TRUSTED response for the requested DID', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({did, trustStatus: 'TRUSTED', production: true, evaluatedAtBlock: 42}),
    });

    await expect(resolveVeranaTrust(did)).resolves.toEqual({
      did,
      trustStatus: 'TRUSTED',
      production: true,
      evaluatedAtBlock: 42,
    });
  });

  it.each([
    {did: 'did:webvh:other.example', trustStatus: 'TRUSTED', production: true},
    {did, trustStatus: 'PARTIAL', production: true},
    {did, trustStatus: 'TRUSTED', production: 'yes'},
  ])('fails closed for an invalid or non-trusted response', async response => {
    mockFetch.mockResolvedValue({ok: true, json: async () => response});
    await expect(resolveVeranaTrust(did)).resolves.toBeUndefined();
  });

  it('sanitizes full-detail credentials', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        did,
        trustStatus: 'TRUSTED',
        production: true,
        credentials: [{ecsType: 'ECS-ORG', claims: {name: 'Example Org'}}, null],
      }),
    });

    await expect(fetchVeranaTrustDetails(did)).resolves.toEqual({
      did,
      trustStatus: 'TRUSTED',
      production: true,
      credentials: [{ecsType: 'ECS-ORG', claims: {name: 'Example Org'}}],
    });
  });
});
