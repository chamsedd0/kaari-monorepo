import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '../entities';

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string,
  role: 'client' | 'advertiser' = 'client'
): Promise<User> => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update the user profile
    await updateProfile(firebaseUser, { displayName: name });
    
    // Create a user document in Firestore
    const newUser: Omit<User, 'id'> = {
      email: email,
      name: name,
      role: role, // Use the provided role (client or advertiser)
      createdAt: new Date(),
      updatedAt: new Date(),
      properties: [],
      listings: [],
      requests: []
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Return the user data
    return {
      id: firebaseUser.uid,
      ...newUser
    };
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
};

/**
 * Sign in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get the user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      
      // Check if user is blocked
      if (userData.isBlocked) {
        // Sign out the user immediately since they are blocked
        await firebaseSignOut(auth);
        throw new Error('Your account has been blocked. Please contact support at support@kaari.com');
      }
      
      return {
        id: firebaseUser.uid,
        ...userData
      } as User;
    } else {
      throw new Error('User document not found in Firestore');
    }
  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (role: 'client' | 'advertiser' = 'client', isNewAdvertiser: boolean = false): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;
    
    // Check if user document exists in Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // If this is supposed to be a new advertiser registration but the account already exists,
      // throw an error to prevent existing accounts from being converted
      if (isNewAdvertiser && role === 'advertiser') {
        throw new Error('This email is already registered. Please use a different email to create an advertiser account.');
      }
      
      const userData = userDoc.data() as User;
      
      // Check if user is blocked
      if (userData.isBlocked) {
        // Sign out the user immediately since they are blocked
        await firebaseSignOut(auth);
        throw new Error('Your account has been blocked. Please contact support at support@kaari.com');
      }
      
      // User exists, update last login
      await setDoc(userDocRef, { updatedAt: serverTimestamp() }, { merge: true });
      
      return {
        id: firebaseUser.uid,
        ...userData
      } as User;
    } else {
      // Create new user document
      const newUser: Omit<User, 'id'> = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: role, // Use provided role instead of defaulting to 'client'
        createdAt: new Date(),
        updatedAt: new Date(),
        properties: [],
        listings: [],
        requests: []
      };
      
      await setDoc(userDocRef, {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: firebaseUser.uid,
        ...newUser
      };
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Get the current Firebase user
 */
export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Get the current user's full profile from Firestore
 */
export const getCurrentUserProfile = async (): Promise<User | null> => {
  try {
    const firebaseUser = await getCurrentUser();
    
    if (!firebaseUser) {
      return null;
    }
    
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      return {
        id: firebaseUser.uid,
        ...userDoc.data()
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user profile:', error);
    throw error;
  }
}; 