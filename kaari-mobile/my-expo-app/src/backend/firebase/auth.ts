import { auth, db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from '../entities';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
// Using Firebase Google provider sign-in with native/web SDK; AuthSession is not required for basic credential flow here.

export async function getCurrentUserProfile(): Promise<User | null> {
  const fb = auth.currentUser;
  if (!fb) return null;
  const snap = await getDoc(doc(db, 'users', fb.uid));
  if (!snap.exists()) return null;
  return ({ id: snap.id, ...snap.data() } as unknown) as User;
}

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
    } as any;
    await setDoc(userRef, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any);
    return profile as User;
  }
  return ({ id: snap.id, ...snap.data() } as unknown) as User;
}

// Placeholder for native/google sign-in flow. In production, integrate
// expo-google-sign-in (legacy) or Google Sign-In SKD for Android/iOS to obtain an ID token,
// then call signInWithGoogleIdToken(token). For web, use Firebase auth popup.
export async function startGoogleAuthSession(): Promise<User | null> {
  // Web: use Firebase popup
  if (typeof window !== 'undefined') {
    const provider = new GoogleAuthProvider();
    // @ts-ignore dynamic import to avoid bundling for native
    const { signInWithPopup } = await import('firebase/auth');
    const result = await signInWithPopup(auth, provider as any);
    const snap = await getDoc(doc(db, 'users', result.user.uid));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as any) : await signInWithGoogleIdToken((result as any)?._tokenResponse?.idToken || '');
  }

  // Native: use AuthSession to obtain ID token
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  } as const;
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const clientId = (Constants.expoConfig?.extra as any)?.googleClientIdWeb || (Constants.expoConfig?.extra as any)?.googleClientIdAndroid || (Constants.expoConfig?.extra as any)?.googleClientIdIOS;
  const req = new AuthSession.AuthRequest({
    clientId,
    responseType: AuthSession.ResponseType.IdToken,
    scopes: ['openid', 'email', 'profile'],
    redirectUri,
    extraParams: { nonce: Math.random().toString(36).slice(2) },
  });
  await req.makeAuthUrlAsync(discovery);
  const res = await req.promptAsync(discovery, { useProxy: true });
  if (res.type === 'success' && res.params?.id_token) {
    const user = await signInWithGoogleIdToken(res.params.id_token);
    return user;
  }
  return null;
}


