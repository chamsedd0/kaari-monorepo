'use server';

import { User } from '../entities';
import { 
  getDocumentById, 
  updateDocument,
  getDocuments
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { 
  secureUploadFile, 
  getUserProfileImagePath
} from '../firebase/storage';
import { User as FirebaseUser, updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword as fbUpdatePassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

// Collection name for users
const USERS_COLLECTION = 'users';

/**
 * Get all users, with optional filtering by role
 */
export async function getAllUsers(role?: 'admin' | 'advertiser' | 'client'): Promise<User[]> {
  try {
    let options = {};
    
    if (role) {
      options = {
        filters: [{ field: 'role', operator: '==', value: role }]
      };
    }
    
    return await getDocuments<User>(USERS_COLLECTION, options);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

/**
 * Fetch a user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    return await getDocumentById<User>(USERS_COLLECTION, userId);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    return await getCurrentUserProfile();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw new Error('Failed to get current user');
  }
}

/**
 * Get current Firebase user
 */
export async function getFirebaseUser(): Promise<FirebaseUser | null> {
  return auth.currentUser;
}

/**
 * Update an existing user
 */
export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  try {
    return await updateDocument<User>(USERS_COLLECTION, userId, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

/**
 * Update user profile with profile picture
 */
export async function updateUserProfile(
  userId: string, 
  profileData: {
    name?: string;
    surname?: string;
    phoneNumber?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    languages?: string[];
    aboutMe?: string;
    brokerExtraFeePercent?: number;
    contactAdditionalInfo?: string;
    profilePicture?: File | null;
  }
): Promise<User> {
  try {
    // Get current user
    const currentUser = await getCurrentUser();
    const firebaseUser = await getFirebaseUser();
    
    if (!currentUser || currentUser.id !== userId || !firebaseUser) {
      throw new Error('User not authenticated or unauthorized');
    }

    // Upload profile picture if provided
    let profilePictureUrl: string | undefined;
    if (profileData.profilePicture) {
      const fileName = `profile_${Date.now()}_${profileData.profilePicture.name}`;
      const storagePath = getUserProfileImagePath(userId, fileName);
      
      // Use secure upload instead of direct upload
      profilePictureUrl = await secureUploadFile(storagePath, profileData.profilePicture);
      
      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: profileData.name || firebaseUser.displayName,
        photoURL: profilePictureUrl
      });
    }

    // Create updated user data
    // Clamp broker fee if provided
    const safeBrokerFee = typeof profileData.brokerExtraFeePercent === 'number'
      ? Math.max(0, Math.min(75, profileData.brokerExtraFeePercent))
      : undefined;

    const updatedUserData: Partial<User> & { contactAdditionalInfo?: string; brokerExtraFeePercent?: number } = {
      ...(profileData.name && { name: profileData.name }),
      ...(profileData.surname && { surname: profileData.surname }),
      ...(profileData.phoneNumber && { phoneNumber: profileData.phoneNumber }),
      ...(profileData.email && { email: profileData.email }),
      ...(profileData.dateOfBirth && { dateOfBirth: profileData.dateOfBirth }),
      ...(profileData.gender && { gender: profileData.gender }),
      ...(profileData.nationality && { nationality: profileData.nationality }),
      ...(profileData.languages && { languages: profileData.languages }),
      ...(profileData.aboutMe && { aboutMe: profileData.aboutMe }),
      ...(typeof safeBrokerFee === 'number' && { brokerExtraFeePercent: safeBrokerFee }),
      ...(profileData.contactAdditionalInfo && { contactAdditionalInfo: profileData.contactAdditionalInfo }),
      ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      // Always update the 'updatedAt' field
      updatedAt: new Date()
    };

    // Update user in Firestore
    return await updateDocument<User>(USERS_COLLECTION, userId, updatedUserData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

/**
 * Upload government ID documents
 */
export async function uploadGovernmentID(
  userId: string,
  idFront: File,
  idBack?: File
): Promise<{ frontUrl: string; backUrl?: string }> {
  try {
    // Get current user for authorization
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.id !== userId) {
      throw new Error('User not authenticated or unauthorized');
    }

    // Upload front of ID using secure upload
    const frontFileName = `id_front_${Date.now()}_${idFront.name}`;
    const frontPath = `users/${userId}/documents/${frontFileName}`;
    const frontUrl = await secureUploadFile(frontPath, idFront);

    // Upload back of ID if provided using secure upload
    let backUrl: string | undefined;
    if (idBack) {
      const backFileName = `id_back_${Date.now()}_${idBack.name}`;
      const backPath = `users/${userId}/documents/${backFileName}`;
      backUrl = await secureUploadFile(backPath, idBack);
    }

    // Create the identification documents object, only including backId if it exists
    const identificationDocuments: {
      frontId: string;
      backId?: string;
      verified: boolean;
      uploadDate: Date;
    } = {
      frontId: frontUrl,
      verified: false, // Admin needs to verify these documents
      uploadDate: new Date()
    };
    
    // Only add backId to the document if backUrl is defined
    if (backUrl) {
      identificationDocuments.backId = backUrl;
    }

    // Update user document with ID information
    await updateDocument<User>(USERS_COLLECTION, userId, {
      identificationDocuments,
      updatedAt: new Date()
    });

    return { frontUrl, backUrl };
  } catch (error) {
    console.error('Error uploading government ID:', error);
    throw new Error('Failed to upload government ID');
  }
}

/**
 * Verify user's email (to be called after email verification flow)
 */
export async function verifyUserEmail(userId: string): Promise<User> {
  try {
    return await updateDocument<User>(USERS_COLLECTION, userId, {
      emailVerified: true,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error verifying user email:', error);
    throw new Error('Failed to verify user email');
  }
}

/**
 * Connect user account with Google
 */
export async function connectWithGoogle(userId: string, googleData: {
  googleId: string;
  googleEmail: string;
}): Promise<User> {
  try {
    return await updateDocument<User>(USERS_COLLECTION, userId, {
      googleConnected: true,
      googleId: googleData.googleId,
      googleEmail: googleData.googleEmail,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error connecting with Google:', error);
    throw new Error('Failed to connect with Google');
  }
}

/**
 * Get user statistics
 */
export async function getUserStatistics(): Promise<{
  reservationsCount: number;
  savedPropertiesCount: number;
  reviewsCount: number;
  messagesCount: number;
}> {
  try {
    // Get current user
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Count user's reservations, saved properties, reviews, and messages
    const reservationsCount = currentUser.requests?.length || 0;
    const savedPropertiesCount = currentUser.properties?.length || 0;
    const reviewsCount = 0; // No reviews property yet
    const messagesCount = 0; // No messages property yet
    
    return {
      reservationsCount,
      savedPropertiesCount,
      reviewsCount,
      messagesCount
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    throw new Error('Failed to get user statistics');
  }
}

/**
 * Block a user (disable their account)
 */
export async function blockUser(userId: string): Promise<User> {
  try {
    return await updateDocument<User>(USERS_COLLECTION, userId, {
      isBlocked: true,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error blocking user:', error);
    throw new Error('Failed to block user');
  }
}

/**
 * Unblock a user (re-enable their account)
 */
export async function unblockUser(userId: string): Promise<User> {
  try {
    return await updateDocument<User>(USERS_COLLECTION, userId, {
      isBlocked: false,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw new Error('Failed to unblock user');
  }
} 

/**
 * Update the user's payment method
 */
export async function updateUserPaymentMethod(paymentMethod: {
  bankName: string;
  accountNumber: string;
  type: 'RIB' | 'IBAN';
}): Promise<boolean> {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const userRef = doc(db, 'users', currentUser.uid);
    
    // Update the user document with the payment method
    await updateDoc(userRef, {
      paymentMethod: {
        bankName: paymentMethod.bankName,
        accountNumber: paymentMethod.accountNumber,
        type: paymentMethod.type,
        updatedAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw new Error('Failed to update payment method');
  }
}

/**
 * Check if the user has a payment method
 */
export async function hasPaymentMethod(): Promise<boolean> {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data();
    return !!(userData.paymentMethod && userData.paymentMethod.accountNumber);
  } catch (error) {
    console.error('Error checking payment method:', error);
    return false;
  }
}

/**
 * Get the user's payment method
 */
export async function getUserPaymentMethod(): Promise<{
  bankName: string;
  accountNumber: string;
  type: 'RIB' | 'IBAN';
} | null> {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    
    if (!userData.paymentMethod) {
      return null;
    }
    
    return {
      bankName: userData.paymentMethod.bankName || '',
      accountNumber: userData.paymentMethod.accountNumber || '',
      type: userData.paymentMethod.type || 'RIB'
    };
  } catch (error) {
    console.error('Error getting payment method:', error);
    return null;
  }
} 

/**
 * Securely update the current user's password
 */
export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Ensure the caller matches the authenticated user
    if (currentUser.uid !== userId) {
      throw new Error('Unauthorized password update');
    }

    // Reauthenticate using email/password credentials
    if (!currentUser.email) {
      throw new Error('User email not available for reauthentication');
    }
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);

    // Update password
    await fbUpdatePassword(currentUser, newPassword);

    // Touch user doc updatedAt (best-effort)
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { updatedAt: serverTimestamp() });
    } catch (e) {
      // non-critical
      console.warn('Failed to update user updatedAt after password change:', e);
    }
  } catch (error) {
    console.error('Error updating password:', error);
    throw error instanceof Error ? error : new Error('Failed to update password');
  }
}