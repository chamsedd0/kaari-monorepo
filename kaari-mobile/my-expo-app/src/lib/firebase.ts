import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { env } from '../config/env';

const firebaseConfig = env.firebase;

if (!firebaseConfig) {
  console.warn('Firebase config missing in env.extra.firebase');
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig as any);

export const firebaseAuth = getAuth(app);
export const firebaseStorage = getStorage(app);
export const firebaseFirestore = (() => {
  try {
    // Prefer long-polling auto-detect for RN/Expo environments
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    return getFirestore(app);
  }
})();


