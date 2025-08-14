import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase config from app.json extras
const ex = (Constants.expoConfig?.extra || {}) as any;
const firebaseExtra = ex.firebase || {};
const firebaseConfig = {
  apiKey: firebaseExtra.apiKey,
  authDomain: firebaseExtra.authDomain,
  projectId: firebaseExtra.projectId,
  storageBucket: firebaseExtra.storageBucket,
  messagingSenderId: firebaseExtra.messagingSenderId,
  appId: firebaseExtra.appId,
  measurementId: firebaseExtra.measurementId,
} as const;

if (!firebaseConfig.projectId) {
  console.warn('Firebase config missing: ensure app.json extra.firebase has your Firebase keys.');
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Use persistent auth for React Native (must use the RN helper from firebase/auth/react-native)
export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : (() => {
      let getRNPersist: any;
      try {
        // Prefer official export when available
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require('firebase/auth');
        getRNPersist = mod.getReactNativePersistence;
      } catch {}
      if (!getRNPersist) {
        try {
          // Fallback legacy path
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const modRN = require('firebase/auth/react-native');
          getRNPersist = modRN.getReactNativePersistence;
        } catch {}
      }
      const persistence = getRNPersist ? getRNPersist(AsyncStorage) : ({ type: 'LOCAL', storage: AsyncStorage } as any);
      return initializeAuth(app, { persistence });
    })();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;


