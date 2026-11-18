import { verifyToken } from '@clerk/backend';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createReportsHandler } from './reports-handler.js';

const FIREBASE_APP_NAME = 'vercel-reports-api';
let firestore;

function getAllowedOrigins() {
  const origins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('ALLOWED_ORIGINS is not configured.');
  }

  return origins;
}

function getFirestoreDatabase() {
  if (firestore) return firestore;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured.');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.');
  }

  const app = getApps().find(({ name }) => name === FIREBASE_APP_NAME)
    || initializeApp(
      { credential: cert(serviceAccount), projectId: serviceAccount.project_id },
      FIREBASE_APP_NAME
    );
  firestore = getFirestore(app);
  return firestore;
}

const reportStore = {
  async list(userId) {
    const reportsCollection = getFirestoreDatabase()
      .collection('users')
      .doc(userId)
      .collection('reports');
    const snapshot = await reportsCollection.orderBy('savedAt', 'desc').limit(20).get();
    return snapshot.docs.map((report) => ({ id: report.id, ...report.data() }));
  },
  async save(userId, reportData) {
    const reportsCollection = getFirestoreDatabase()
      .collection('users')
      .doc(userId)
      .collection('reports');
    const reportRef = await reportsCollection.add(reportData);
    return { id: reportRef.id, ...reportData };
  },
  async delete(userId, reportId) {
    await getFirestoreDatabase()
      .collection('users')
      .doc(userId)
      .collection('reports')
      .doc(reportId)
      .delete();
  }
};

export default async function reports(req, res) {
  let allowedOrigins;
  try {
    allowedOrigins = getAllowedOrigins();
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY is not configured.');
    }
  } catch (error) {
    console.error('Reports API configuration error', { message: error.message });
    return res.status(500).json({ error: 'Report service is not configured.' });
  }

  const handler = createReportsHandler({
    allowedOrigins,
    authenticate: (token, authorizedParties) => verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties
    }),
    reportStore
  });

  return handler(req, res);
}
