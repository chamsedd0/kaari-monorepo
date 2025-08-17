import { auth, db } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from '../entities';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Get current logged-in user profile from Firestore
 */
export async function getCurrentUserProfile(): Promise<User | null> {
  const fbUser = auth.currentUser;
  if (!fbUser) return null;

  const snap = await getDoc(doc(db, 'users', fbUser.uid));
  if (!snap.exists()) return null;

  return { id: snap.id, ...(snap.data() as any) } as User;
}

/**
 * Sign in to Firebase using Google ID token
 */
export async function signInWithGoogleIdToken(idToken: string): Promise<User> {
  const credential = GoogleAuthProvider.credential(idToken);
  const { user } = await signInWithCredential(auth, credential);

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const profile: Partial<User> = {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || 'User',
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: user.emailVerified,
      googleConnected: true,
      googleId: user.uid,
      googleEmail: user.email || '',
    };
    await setDoc(userRef, profile as any);
    return profile as User;
  }

  return { id: snap.id, ...(snap.data() as any) } as User;
}

/**
 * Start Google Sign-In session (Expo mobile-only)
 */
export async function startGoogleAuthSession(): Promise<User | null> {
  const extra = Constants.expoConfig?.extra || {
    googleClientIdAndroid: '706294886686-rlqu2oeel10gd25nnjjssqj69epvjfvd.apps.googleusercontent.com',
  };
  const clientId = extra.googleClientIdAndroid;

  const redirectUri = AuthSession.makeRedirectUri({
    // use Expo proxy in dev
  });

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };

  const req = new AuthSession.AuthRequest({
    clientId,
    responseType: AuthSession.ResponseType.IdToken,
    scopes: ['openid', 'email', 'profile'],
    redirectUri,
    extraParams: { nonce: Math.random().toString(36).slice(2) },
  });

  const result = await req.promptAsync(discovery);

  if (result.type === 'success' && result.params?.id_token) {
    return signInWithGoogleIdToken(result.params.id_token);
  }

  return null;
}
