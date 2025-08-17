import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';  
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Load Firebase config from app.json extras
const firebaseConfig = Constants.expoConfig?.extra?.firebase;

if (!firebaseConfig?.projectId) {
  console.warn(
    'Firebase config missing: ensure app.json extra.firebase has your Firebase keys.'
  );
}

// Initialize Firebase app (singleton)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistent storage
export const auth = initializeAuth(app, {
  persistence: AsyncStorage as any,
});

// Firestore and Storage
export const db = getFirestore(app); 
export const storage = getStorage(app);

export default app;
