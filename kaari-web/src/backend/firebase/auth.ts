import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  getAuth
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '../entities';

/**
 * Interface for advertiser additional information
 */
export interface AdvertiserInfo {
  userId: string;
  advertiserType: 'broker' | 'landlord' | 'agency';
  isBusiness: boolean;
  businessName?: string;
  businessSize?: string;
  city: string;
  phoneNumber: string;
  propertyQuantity: string;
  propertyTypes: string[];
  additionalInfo?: string;
}

/**
 * Save additional information for an advertiser
 */
export const saveAdvertiserInfo = async (advertiserInfo: AdvertiserInfo): Promise<void> => {
  try {
    const { userId, ...infoWithoutId } = advertiserInfo;
    const userDocRef = doc(db, 'users', userId);
    
    // Check if user document exists in Firestore
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // User exists, update with advertiser details
      await updateDoc(userDocRef, {
        // Ensure role is set to advertiser
        role: 'advertiser',
        // Add advertiser type
        advertiserType: advertiserInfo.advertiserType,
        // Add business flag to the main user document (for backward compatibility)
        isBusiness: advertiserInfo.isBusiness,
        // Only include business details if it's a business
        ...(advertiserInfo.isBusiness && {
          businessName: advertiserInfo.businessName,
          businessSize: advertiserInfo.businessSize
        }),
        // Add other advertiser details
        city: advertiserInfo.city,
        phoneNumber: advertiserInfo.phoneNumber,
        propertyQuantity: advertiserInfo.propertyQuantity,
        propertyTypes: advertiserInfo.propertyTypes,
        additionalInfo: advertiserInfo.additionalInfo,
        // Update timestamp
        updatedAt: serverTimestamp()
      });
    } else {
      // User document doesn't exist, create it
      // This can happen if auth was created but Firestore document wasn't
      const auth = getAuth();
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error('No authenticated user found');
      }
      
      // Create basic user info
      const newUser: Omit<User, 'id'> = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'advertiser',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Add advertiser-specific fields
        advertiserType: advertiserInfo.advertiserType,
        isBusiness: advertiserInfo.isBusiness,
        ...(advertiserInfo.isBusiness && {
          businessName: advertiserInfo.businessName,
          businessSize: advertiserInfo.businessSize
        }),
        city: advertiserInfo.city,
        phoneNumber: advertiserInfo.phoneNumber,
        propertyQuantity: advertiserInfo.propertyQuantity,
        propertyTypes: advertiserInfo.propertyTypes,
        additionalInfo: advertiserInfo.additionalInfo,
        // Initialize empty arrays for collections
        properties: [],
        requests: []
      };
      
      // Create the user document
      await setDoc(userDocRef, {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving advertiser info:', error);
    throw error;
  }
};

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string,
  role: 'client' | 'advertiser' = 'client',
  referralCode?: string | null
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
    
    // Add referral code if provided
    if (referralCode) {
      // @ts-ignore - Add referralCode to user document
      newUser.referralCode = referralCode;
    }
    
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Apply referral code if provided
    if (referralCode) {
      try {
        // Import referral service here to avoid circular dependencies
        const { default: referralService } = await import('../../services/ReferralService');
        await referralService.applyReferralCode(firebaseUser.uid, referralCode);
      } catch (referralError) {
        console.error('Error applying referral code:', referralError);
        // Don't fail the signup if referral application fails
      }
    }
    
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

/**
 * Get or create Firestore document for the current authenticated user
 * This is useful when a user has been authenticated but doesn't have a Firestore document yet
 */
export const getOrCreateUserDocument = async (): Promise<User | null> => {
  try {
    const firebaseUser = await getCurrentUser();
    
    if (!firebaseUser) {
      return null;
    }
    
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // User document exists, return it
      return {
        id: firebaseUser.uid,
        ...userDoc.data()
      } as User;
    } else {
      // User document doesn't exist, create it
      const newUser: Omit<User, 'id'> = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'client', // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
        properties: [],
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
    console.error('Error getting or creating user document:', error);
    throw error;
  }
}; 