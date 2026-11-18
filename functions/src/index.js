import { verifyToken } from '@clerk/backend';
import { initializeApp } from 'firebase-admin/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query
} from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { defineSecret, defineString } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { validateReportPayload } from './validation.js';

const clerkSecretKey = defineSecret('CLERK_SECRET_KEY');
const allowedOriginsConfig = defineString('ALLOWED_ORIGINS', {
  default: 'http://localhost:3000',
  description: 'Comma-separated frontend origins allowed to call the reports API.'
});
const MAX_REQUEST_BYTES = 256_000;

initializeApp();
const firestore = getFirestore();

export const reports = onRequest(
  {
    region: 'us-central1',
    secrets: [clerkSecretKey]
  },
  async (req, res) => {
    const allowedOrigins = allowedOriginsConfig.value()
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    const origin = req.get('origin');

    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'This origin is not allowed.' });
    }

    if (origin) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Vary', 'Origin');
      res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    }

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.path !== '/') {
      return res.status(404).json({ error: 'Route not found.' });
    }

    if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
      res.set('Allow', 'GET, POST, DELETE, OPTIONS');
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    if (req.rawBody?.length > MAX_REQUEST_BYTES) {
      return res.status(413).json({ error: 'Report request is too large.' });
    }

    const authorization = req.get('authorization') || '';
    const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) {
      return res.status(401).json({ error: 'A valid sign-in session is required.' });
    }

    let userId;
    try {
      const session = await verifyToken(tokenMatch[1], {
        secretKey: clerkSecretKey.value(),
        authorizedParties: allowedOrigins
      });
      userId = session.sub;
    } catch (error) {
      logger.warn('Rejected invalid Clerk session token', { error: error.name });
      return res.status(401).json({ error: 'Your sign-in session is invalid or expired.' });
    }

    if (typeof userId !== 'string' || !userId) {
      return res.status(401).json({ error: 'The sign-in session has no user identity.' });
    }

    const reportsCollection = collection(firestore, 'users', userId, 'reports');

    try {
      if (req.method === 'GET') {
        const snapshot = await getDocs(query(reportsCollection, orderBy('savedAt', 'desc'), limit(20)));
        const savedReports = snapshot.docs.map((report) => ({ id: report.id, ...report.data() }));
        return res.status(200).json({ reports: savedReports });
      }

      if (req.method === 'POST') {
        let reportData;
        try {
          reportData = validateReportPayload(req.body);
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }

        const reportRef = await addDoc(reportsCollection, reportData);
        return res.status(201).json({
          report: { id: reportRef.id, ...reportData }
        });
      }

      const reportId = req.query.id;
      if (typeof reportId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(reportId)) {
        return res.status(400).json({ error: 'A valid report ID is required.' });
      }

      await deleteDoc(doc(reportsCollection, reportId));
      return res.status(204).end();
    } catch (error) {
      logger.error('Firestore report request failed', { errorCode: error.code || 'unknown' });
      return res.status(500).json({ error: 'The report operation failed. Please try again.' });
    }
  }
);
