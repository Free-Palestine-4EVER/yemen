import "server-only";
import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
  type App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * Lazily initialise the Firebase Admin SDK for server-side ID-token
 * verification. Returns null if no credentials are configured, so callers
 * can degrade gracefully (the admin UI still offers copy / mailto fallbacks).
 *
 * Configure with EITHER:
 *   FIREBASE_SERVICE_ACCOUNT  = full service-account JSON (recommended on Vercel)
 *   GOOGLE_APPLICATION_CREDENTIALS = path to the JSON file (local dev)
 */
let cached: App | null | undefined;

function getAdminApp(): App | null {
  if (cached !== undefined) return cached;

  if (getApps().length) {
    cached = getApps()[0];
    return cached;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  try {
    if (raw) {
      const sa = JSON.parse(raw);
      cached = initializeApp({ credential: cert(sa) });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      cached = initializeApp({ credential: applicationDefault() });
    } else {
      cached = null;
    }
  } catch {
    cached = null;
  }
  return cached;
}

export const adminConfigured = () => getAdminApp() !== null;

/** Verifies a Firebase ID token; returns the decoded token or null. */
export async function verifyIdToken(token?: string) {
  const app = getAdminApp();
  if (!app || !token) return null;
  try {
    return await getAuth(app).verifyIdToken(token);
  } catch {
    return null;
  }
}
