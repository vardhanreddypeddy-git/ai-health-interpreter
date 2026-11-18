import assert from 'node:assert/strict';
import test from 'node:test';
import { createReportsHandler } from './reports-handler.js';

const origin = 'https://ai-health-interpreter-theta.vercel.app';

function createResponse() {
  return {
    headers: {},
    statusCode: undefined,
    body: undefined,
    ended: false,
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    }
  };
}

test('rejects disallowed origins before authenticating', async () => {
  let authenticated = false;
  const handler = createReportsHandler({
    allowedOrigins: [origin],
    authenticate: async () => {
      authenticated = true;
      return { sub: 'user_123' };
    },
    reportStore: {}
  });
  const res = createResponse();

  await handler({
    method: 'GET',
    headers: { origin: 'https://untrusted.example', authorization: 'Bearer token' }
  }, res);

  assert.equal(res.statusCode, 403);
  assert.equal(authenticated, false);
});

test('scopes report reads to the verified Clerk user', async () => {
  let listedUserId;
  const handler = createReportsHandler({
    allowedOrigins: [origin],
    authenticate: async (token, authorizedParties) => {
      assert.equal(token, 'valid-token');
      assert.deepEqual(authorizedParties, [origin]);
      return { sub: 'user_from_token' };
    },
    reportStore: {
      async list(userId) {
        listedUserId = userId;
        return [{ id: 'report_1' }];
      }
    }
  });
  const res = createResponse();

  await handler({
    method: 'GET',
    headers: { origin, authorization: 'Bearer valid-token' },
    query: { userId: 'attacker_supplied_user' }
  }, res);

  assert.equal(listedUserId, 'user_from_token');
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { reports: [{ id: 'report_1' }] });
  assert.equal(res.headers['Access-Control-Allow-Origin'], origin);
});

test('saves sanitized reports under the verified Clerk user', async () => {
  let savedUserId;
  let savedReport;
  const handler = createReportsHandler({
    allowedOrigins: [origin],
    authenticate: async () => ({ sub: 'user_from_token' }),
    reportStore: {
      async save(userId, report) {
        savedUserId = userId;
        savedReport = report;
        return { id: 'report_1', ...report };
      }
    }
  });
  const res = createResponse();

  await handler({
    method: 'POST',
    headers: { origin, authorization: 'Bearer valid-token' },
    body: {
      userId: 'attacker_supplied_user',
      rawText: 'Sample report',
      overallIndex: 76,
      overallUrgency: 'optimal',
      patient: { name: 'Sample Patient', unexpected: 'discard this' },
      biomarkers: []
    }
  }, res);

  assert.equal(savedUserId, 'user_from_token');
  assert.equal(res.statusCode, 201);
  assert.equal(savedReport.patient.unexpected, undefined);
  assert.equal(savedReport.userId, undefined);
  assert.equal(res.body.report.id, 'report_1');
});

test('rejects invalid bearer tokens', async () => {
  const handler = createReportsHandler({
    allowedOrigins: [origin],
    authenticate: async () => {
      throw new Error('invalid token');
    },
    reportStore: {},
    logger: { warn() {}, error() {} }
  });
  const res = createResponse();

  await handler({
    method: 'GET',
    headers: { origin, authorization: 'Bearer invalid-token' }
  }, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error, 'Your sign-in session is invalid or expired.');
});
