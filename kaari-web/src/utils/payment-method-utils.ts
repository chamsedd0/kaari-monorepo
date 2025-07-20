import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { getAuth } from 'firebase/auth';

/**
 * Checks if the current user has a payment method
 * @returns Promise<boolean> True if the user has a payment method
 */
export async function checkUserHasPaymentMethod(): Promise<boolean> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('User not authenticated');
      return false;
    }
    
    // Check in payoutMethods collection
    const payoutMethodsRef = collection(db, 'payoutMethods');
    const q = query(
      payoutMethodsRef,
      where('userId', '==', user.uid),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking payment method:', error);
    return false;
  }
}

/**
 * Checks if a specific advertiser has a payment method
 * @param advertiserId The ID of the advertiser to check
 * @returns Promise<boolean> True if the advertiser has a payment method
 */
export async function checkAdvertiserHasPaymentMethod(advertiserId: string): Promise<boolean> {
  try {
    // Check in payoutMethods collection
    const payoutMethodsRef = collection(db, 'payoutMethods');
    const q = query(
      payoutMethodsRef,
      where('userId', '==', advertiserId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking advertiser payment method:', error);
    return false;
  }
}

/**
 * Gets the payment method for the current user
 * @returns Promise<PaymentMethod | null> The payment method or null if not found
 */
export async function getUserPaymentMethod(): Promise<{
  id: string;
  bankName: string;
  accountNumber: string;
  type: 'RIB' | 'IBAN';
  isVerified: boolean;
  createdAt: Date;
} | null> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('User not authenticated');
      return null;
    }
    
    // Check in payoutMethods collection
    const payoutMethodsRef = collection(db, 'payoutMethods');
    const q = query(
      payoutMethodsRef,
      where('userId', '==', user.uid),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      bankName: data.bankName || '',
      accountNumber: data.accountNumber || '',
      type: data.type || 'RIB',
      isVerified: data.isVerified || false,
      createdAt: data.createdAt?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error getting payment method:', error);
    return null;
  }
} 