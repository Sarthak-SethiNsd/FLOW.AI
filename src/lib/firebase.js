/**
 * Firebase Initialization — FLOW.AI
 *
 * Single, centralized place where the Firebase client SDK is initialized.
 * All Firebase config is read from NEXT_PUBLIC_FIREBASE_* environment variables
 * so that no credentials are hard-coded in source files.
 *
 * Other modules should import `auth` from here rather than calling
 * `initializeApp` themselves. This keeps Firebase details isolated:
 *
 *   FLOW.AI UI → AuthContext → firebase.js → Firebase SDK
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Guard against re-initializing on Next.js hot reloads.
 * getApps() returns all currently initialized Firebase apps; if one already
 * exists we reuse it instead of calling initializeApp() again.
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export default app;
