import { validateReportPayload } from '../functions/src/validation.js';

const MAX_REQUEST_BYTES = 256_000;
const REPORT_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

export function createReportsHandler({ allowedOrigins, authenticate, reportStore, logger = console }) {
  return async function reportsHandler(req, res) {
    const origin = req.headers?.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'This origin is not allowed.' });
    }

    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    }

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
      res.setHeader('Allow', 'GET, POST, DELETE, OPTIONS');
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    if (req.method === 'POST') {
      const requestSize = Buffer.byteLength(JSON.stringify(req.body ?? null) ?? '');
      if (requestSize > MAX_REQUEST_BYTES) {
        return res.status(413).json({ error: 'Report request is too large.' });
      }
    }

    const authorization = req.headers?.authorization || '';
    const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) {
      return res.status(401).json({ error: 'A valid sign-in session is required.' });
    }

    let session;
    try {
      session = await authenticate(tokenMatch[1], allowedOrigins);
    } catch (error) {
      logger.warn('Rejected invalid Clerk session token', { error: error.name });
      return res.status(401).json({ error: 'Your sign-in session is invalid or expired.' });
    }

    const userId = session?.sub;
    if (typeof userId !== 'string' || !userId) {
      return res.status(401).json({ error: 'The sign-in session has no user identity.' });
    }

    if (req.method === 'GET') {
      try {
        const reports = await reportStore.list(userId);
        return res.status(200).json({ reports });
      } catch (error) {
        logger.error('Firestore report request failed', { errorCode: error.code || 'unknown' });
        return res.status(500).json({ error: 'The report operation failed. Please try again.' });
      }
    }

    if (req.method === 'POST') {
      let reportData;
      try {
        reportData = validateReportPayload(req.body);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

      try {
        const report = await reportStore.save(userId, reportData);
        return res.status(201).json({ report });
      } catch (error) {
        logger.error('Firestore report request failed', { errorCode: error.code || 'unknown' });
        return res.status(500).json({ error: 'The report operation failed. Please try again.' });
      }
    }

    const reportId = req.query?.id;
    if (typeof reportId !== 'string' || !REPORT_ID_PATTERN.test(reportId)) {
      return res.status(400).json({ error: 'A valid report ID is required.' });
    }

    try {
      await reportStore.delete(userId, reportId);
      return res.status(204).end();
    } catch (error) {
      logger.error('Firestore report request failed', { errorCode: error.code || 'unknown' });
      return res.status(500).json({ error: 'The report operation failed. Please try again.' });
    }
  };
}
