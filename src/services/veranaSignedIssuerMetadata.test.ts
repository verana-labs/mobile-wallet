const mockJwtVerifyJwsSignature = jest.fn();
jest.mock('../agent', () => ({
  __esModule: true,
  default: {jwtVerifyJwsSignature: (...args: Array<unknown>) => mockJwtVerifyJwsSignature(...args)},
}));

import {resolveSignedIssuerMetadata} from './veranaSignedIssuerMetadata';

const issuer = 'https://issuer.example/oid4vci/demo';
const did = 'did:webvh:QmScid123:issuer.example';
const kid = `${did}#openid4vc-development-issuer`;

const liveIssuer = 'https://demo-issuer-accredited.playground.testnet.verana.network/oid4vci/demo-did';
const liveDid = 'did:webvh:QmWQWc6rcCvs9LLrDHvK2nBP5EmdMrwAb6sCWQSqexu3k8:demo-issuer-accredited.playground.testnet.verana.network';
// Captured 2026-08-03 from GET {liveIssuer}/.well-known/openid-credential-issuer with Accept: application/jwt.
const liveJws =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6Im9wZW5pZHZjaS1pc3N1ZXItbWV0YWRhdGErand0Iiwia2lkIjoiZGlkOndlYnZoOlFtV1FXYzZyY0N2czlMTHJESHZLMm5CUDVFbWRNcndBYjZzQ1dRU3FleHUzazg6ZGVtby1pc3N1ZXItYWNjcmVkaXRlZC5wbGF5Z3JvdW5kLnRlc3RuZXQudmVyYW5hLm5ldHdvcmsjb3BlbmlkNHZjLWRldmVsb3BtZW50LWlzc3VlciJ9.eyJpYXQiOjE3ODU3MjgwNjYsInN1YiI6Imh0dHBzOi8vZGVtby1pc3N1ZXItYWNjcmVkaXRlZC5wbGF5Z3JvdW5kLnRlc3RuZXQudmVyYW5hLm5ldHdvcmsvb2lkNHZjaS9kZW1vLWRpZCIsImNyZWRlbnRpYWxfaXNzdWVyIjoiaHR0cHM6Ly9kZW1vLWlzc3Vlci1hY2NyZWRpdGVkLnBsYXlncm91bmQudGVzdG5ldC52ZXJhbmEubmV0d29yay9vaWQ0dmNpL2RlbW8tZGlkIiwiY3JlZGVudGlhbF9lbmRwb2ludCI6Imh0dHBzOi8vZGVtby1pc3N1ZXItYWNjcmVkaXRlZC5wbGF5Z3JvdW5kLnRlc3RuZXQudmVyYW5hLm5ldHdvcmsvb2lkNHZjaS9kZW1vLWRpZC9jcmVkZW50aWFsIiwiZGVmZXJyZWRfY3JlZGVudGlhbF9lbmRwb2ludCI6Imh0dHBzOi8vZGVtby1pc3N1ZXItYWNjcmVkaXRlZC5wbGF5Z3JvdW5kLnRlc3RuZXQudmVyYW5hLm5ldHdvcmsvb2lkNHZjaS9kZW1vLWRpZC9kZWZlcnJlZC1jcmVkZW50aWFsIiwibm9uY2VfZW5kcG9pbnQiOiJodHRwczovL2RlbW8taXNzdWVyLWFjY3JlZGl0ZWQucGxheWdyb3VuZC50ZXN0bmV0LnZlcmFuYS5uZXR3b3JrL29pZDR2Y2kvZGVtby1kaWQvbm9uY2UiLCJkaXNwbGF5IjpbeyJuYW1lIjoiQWNjcmVkaXRlZCBJc3N1ZXIgKGRlbW8pIiwibG9jYWxlIjoiZW4ifV0sImNyZWRlbnRpYWxfY29uZmlndXJhdGlvbnNfc3VwcG9ydGVkIjp7ImRlbW8tY3JlZGVudGlhbCI6eyJmb3JtYXQiOiJkYytzZC1qd3QiLCJjcnlwdG9ncmFwaGljX2JpbmRpbmdfbWV0aG9kc19zdXBwb3J0ZWQiOlsiandrIl0sImNyZWRlbnRpYWxfc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NiJdLCJwcm9vZl90eXBlc19zdXBwb3J0ZWQiOnsiand0Ijp7InByb29mX3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTYiXX19LCJjcmVkZW50aWFsX21ldGFkYXRhIjp7ImRpc3BsYXkiOlt7Im5hbWUiOiJEZW1vQ3JlZGVudGlhbCIsImxvY2FsZSI6ImVuIiwiZGVzY3JpcHRpb24iOiJUaGUgRGVtb0NyZWRlbnRpYWwgb2YgdGhlIFBsYXlncm91bmQgRWNvc3lzdGVtIChkZW1vKSJ9XSwiY2xhaW1zIjpbeyJwYXRoIjpbIm5hbWUiXX0seyJwYXRoIjpbImRlbW9JZCJdfV19LCJ2Y3QiOiJodHRwczovL2RlbW8taXNzdWVyLWFjY3JlZGl0ZWQucGxheWdyb3VuZC50ZXN0bmV0LnZlcmFuYS5uZXR3b3JrL29pZDR2Yy92Y3QvZGVtby1jcmVkZW50aWFsIn19fQ.7fbaNCKsrCg4dR8aKx5cUiG_3wFYfOiMFLLeqjePIZB6WoCo5cJCinzv0cnwUxHl1UPeooWLqyRfVd8NdL92Uw';

const b64url = (value: Record<string, unknown>): string => Buffer.from(JSON.stringify(value)).toString('base64url');

const metadataJws = ({header, payload}: {header?: Record<string, unknown>; payload?: Record<string, unknown>} = {}): string =>
  [
    b64url({alg: 'ES256', typ: 'openidvci-issuer-metadata+jwt', kid, ...header}),
    b64url({credential_issuer: issuer, ...payload}),
    'c2lnbmF0dXJl',
  ].join('.');

const jwtResponse = (body: string, contentType = 'application/jwt; charset=utf-8') => ({
  ok: true,
  headers: {get: () => contentType},
  text: async () => body,
});

const mockFetch = jest.fn();
const verifyJws = jest.fn();

describe('veranaSignedIssuerMetadata', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockJwtVerifyJwsSignature.mockReset();
    verifyJws.mockReset();
    global.fetch = mockFetch as typeof fetch;
  });

  it('resolves the issuer DID from a verified signed-metadata JWS', async () => {
    const jws = metadataJws();
    mockFetch.mockResolvedValue(jwtResponse(jws));
    verifyJws.mockResolvedValue(true);

    await expect(resolveSignedIssuerMetadata(issuer, {verifyJws})).resolves.toEqual({did, didUrl: kid});
    expect(mockFetch).toHaveBeenCalledWith(
      `${issuer}/.well-known/openid-credential-issuer`,
      expect.objectContaining({headers: {accept: 'application/jwt'}}),
    );
    expect(verifyJws).toHaveBeenCalledWith(jws);
  });

  it('decodes base64url segments containing - and _', async () => {
    const payloadSegment = b64url({q: '~~~???', credential_issuer: issuer});
    expect(payloadSegment).toMatch(/-/);
    expect(payloadSegment).toMatch(/_/);
    mockFetch.mockResolvedValue(jwtResponse(`${metadataJws().split('.')[0]}.${payloadSegment}.c2lnbmF0dXJl`));
    verifyJws.mockResolvedValue(true);

    await expect(resolveSignedIssuerMetadata(issuer, {verifyJws})).resolves.toEqual({did, didUrl: kid});
  });

  it('resolves the DID from a live vs-agent capture', async () => {
    mockFetch.mockResolvedValue(jwtResponse(liveJws));
    verifyJws.mockResolvedValue(true);

    await expect(resolveSignedIssuerMetadata(liveIssuer, {verifyJws})).resolves.toEqual({
      did: liveDid,
      didUrl: `${liveDid}#openid4vc-development-issuer`,
    });
  });

  it('falls through when the issuer serves only plain JSON metadata', async () => {
    mockFetch.mockResolvedValue(jwtResponse(JSON.stringify({credential_issuer: issuer}), 'application/json; charset=utf-8'));

    await expect(resolveSignedIssuerMetadata(issuer, {verifyJws})).resolves.toBeUndefined();
    expect(verifyJws).not.toHaveBeenCalled();
  });

  it.each([
    {name: 'a body that is not a 3-segment JWS', jws: JSON.stringify({credential_issuer: issuer})},
    {name: 'an empty JWS segment', jws: metadataJws().replace(/\.c2lnbmF0dXJl$/, '.')},
    {name: 'a wrong typ header', jws: metadataJws({header: {typ: 'jwt'}})},
    {name: 'a missing kid', jws: metadataJws({header: {kid: undefined}})},
    {name: 'a non-DID kid', jws: metadataJws({header: {kid: 'https://issuer.example/keys/1'}})},
    {name: 'a credential_issuer mismatch', jws: metadataJws({payload: {credential_issuer: 'https://attacker.example'}})},
  ])('rejects $name without calling the verifier', async ({jws}) => {
    mockFetch.mockResolvedValue(jwtResponse(jws));

    await expect(resolveSignedIssuerMetadata(issuer, {verifyJws})).resolves.toBeUndefined();
    expect(verifyJws).not.toHaveBeenCalled();
  });

  it('never trusts a JWS the verifier rejects', async () => {
    mockFetch.mockResolvedValue(jwtResponse(metadataJws()));
    verifyJws.mockResolvedValue(false);

    await expect(resolveSignedIssuerMetadata(issuer, {verifyJws})).resolves.toBeUndefined();
  });

  it('fails closed when the verifier throws', async () => {
    mockFetch.mockResolvedValue(jwtResponse(metadataJws()));
    verifyJws.mockRejectedValue(new Error('resolver down'));

    await expect(resolveSignedIssuerMetadata(issuer, {verifyJws})).resolves.toBeUndefined();
  });

  it('verifies through the agent jwt service by default', async () => {
    const jws = metadataJws();
    mockFetch.mockResolvedValue(jwtResponse(jws));
    mockJwtVerifyJwsSignature.mockResolvedValue({error: false});

    await expect(resolveSignedIssuerMetadata(issuer)).resolves.toEqual({did, didUrl: kid});
    expect(mockJwtVerifyJwsSignature).toHaveBeenCalledWith({jws});
  });

  it('fails closed when the agent reports an invalid signature', async () => {
    mockFetch.mockResolvedValue(jwtResponse(metadataJws()));
    mockJwtVerifyJwsSignature.mockResolvedValue({error: true});

    await expect(resolveSignedIssuerMetadata(issuer)).resolves.toBeUndefined();
  });

  it('fails closed when the agent cannot resolve the DID', async () => {
    mockFetch.mockResolvedValue(jwtResponse(metadataJws()));
    mockJwtVerifyJwsSignature.mockRejectedValue(new Error('unable to resolve did'));

    await expect(resolveSignedIssuerMetadata(issuer)).resolves.toBeUndefined();
  });

  it('fails closed on network errors', async () => {
    mockFetch.mockRejectedValue(new Error('network down'));

    await expect(resolveSignedIssuerMetadata(issuer, {verifyJws})).resolves.toBeUndefined();
  });
});
