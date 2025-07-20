'use server';

import { 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/config';

/**
 * Update the user's payment method
 */
export async function updateUserPaymentMethod(paymentMethod: {
  bankName: string;
  accountNumber: string;
  type: 'RIB' | 'IBAN';
}): Promise<boolean> {
  try {
    const auth = getAuth();
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
    const auth = getAuth();
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
    const auth = getAuth();
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