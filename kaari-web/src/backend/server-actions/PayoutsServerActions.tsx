'use server';

import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy,
  updateDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import NotificationService from '../../services/NotificationService';
import PayoutsService, { Payout, PayoutRequest } from '../../services/PayoutsService';
import { payoutNotifications } from '../../utils/notification-helpers';

// Collection references
const PAYOUTS_COLLECTION = 'payouts';
const PAYOUT_REQUESTS_COLLECTION = 'payoutRequests';
const USERS_COLLECTION = 'users';
const REFERRALS_COLLECTION = 'referrals';
const REFUND_REQUESTS_COLLECTION = 'refundRequests';
const REQUESTS_COLLECTION = 'requests'; // For bookings/reservations
const PROPERTIES_COLLECTION = 'properties';

/**
 * Helper function to process a payout document
 */
async function processPayoutDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Promise<Payout> {
    const data = docSnapshot.data();
    
    return {
      id: docSnapshot.id,
    payeeId: data.payeeId,
    payeeName: data.payeeName,
    payeePhone: data.payeePhone || 'No phone',
    payeeType: data.payeeType,
    paymentMethod: data.paymentMethod || {
      bankName: 'Unknown Bank',
        accountLast4: '****',
        type: 'IBAN'
      },
    reason: data.reason,
    amount: data.amount,
    status: data.status,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    paidAt: data.paidAt?.toDate(),
    sourceId: data.sourceId,
    sourceType: data.sourceType,
    currency: data.currency || 'MAD',
    paidBy: data.paidBy,
    notes: data.notes
  };
}

/**
 * Get all pending payouts
 */
export async function getAllPendingPayouts(): Promise<Payout[]> {
  try {
    return await PayoutsService.getAllPendingPayouts();
  } catch (error) {
    console.error('Error fetching pending payouts:', error);
    throw new Error('Failed to fetch pending payouts');
  }
}

/**
 * Get all pending payout requests
 */
export async function getAllPendingPayoutRequests(): Promise<PayoutRequest[]> {
  try {
    return await PayoutsService.getPendingPayoutRequests();
  } catch (error) {
    console.error('Error fetching pending payout requests:', error);
    throw new Error('Failed to fetch pending payout requests');
  }
}

/**
 * Approve a payout request
 */
export async function approvePayoutRequest(requestId: string): Promise<boolean> {
  try {
    const success = await PayoutsService.approvePayoutRequest(requestId);
    
    if (success) {
      // Get the request data to send notification
      const requestRef = doc(db, PAYOUT_REQUESTS_COLLECTION, requestId);
      const requestDoc = await getDoc(requestRef);
      
      if (requestDoc.exists()) {
        const requestData = requestDoc.data();
        
        // Send notification to the user
        try {
          await payoutNotifications.payoutRequestApproved(
            requestData.userId,
            requestData.userType,
            requestData.amount,
            requestData.currency || 'MAD',
            requestData.reason
          );
        } catch (notificationError) {
          console.error('Error sending payout request approved notification:', notificationError);
          // Don't fail the operation if notification fails
        }
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error approving payout request:', error);
    throw new Error('Failed to approve payout request');
  }
}

/**
 * Reject a payout request
 */
export async function rejectPayoutRequest(requestId: string, reason: string): Promise<boolean> {
  try {
    const success = await PayoutsService.rejectPayoutRequest(requestId, reason);
    
    if (success) {
      // Get the request data to send notification
      const requestRef = doc(db, PAYOUT_REQUESTS_COLLECTION, requestId);
      const requestDoc = await getDoc(requestRef);
      
      if (requestDoc.exists()) {
        const requestData = requestDoc.data();
        
        // Send notification to the user
        try {
          await payoutNotifications.payoutRequestRejected(
            requestData.userId,
            requestData.userType,
            requestData.amount,
            requestData.currency || 'MAD',
            requestData.reason,
            reason
          );
        } catch (notificationError) {
          console.error('Error sending payout request rejected notification:', notificationError);
          // Don't fail the operation if notification fails
        }
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error rejecting payout request:', error);
    throw new Error('Failed to reject payout request');
  }
}

/**
 * Mark a payout as paid
 */
export async function markPayoutAsPaid(payoutId: string): Promise<boolean> {
  try {
    const success = await PayoutsService.markPayoutAsPaid(payoutId);
    
    if (success) {
      // Get the payout data to send notification
      const payoutRef = doc(db, PAYOUTS_COLLECTION, payoutId);
      const payoutDoc = await getDoc(payoutRef);
      
      if (payoutDoc.exists()) {
        const payoutData = payoutDoc.data();
        
        // Send notification to the payee
        try {
          if (payoutData.reason === 'Tenant Refund') {
            // For refunds, use the refund notification
            let propertyName = 'your booking';
            
            // Try to get property name if propertyId is available
            if (payoutData.sourceId) {
              try {
                const propertyRef = doc(db, PROPERTIES_COLLECTION, payoutData.sourceId);
                const propertyDoc = await getDoc(propertyRef);
                if (propertyDoc.exists()) {
                  propertyName = propertyDoc.data().title || 'your booking';
                }
              } catch (err) {
                console.error('Error getting property name for refund notification:', err);
              }
            }
            
            await payoutNotifications.refundProcessed(
              payoutData.payeeId,
              payoutData.amount,
              payoutData.currency || 'MAD',
              propertyName
            );
          } else {
            // For other payouts, use the standard payout notification
            await payoutNotifications.payoutProcessed(
              payoutData.payeeId,
              payoutData.payeeType,
              payoutData.amount,
              payoutData.currency || 'MAD',
              payoutData.reason
            );
          }
        } catch (notificationError) {
          console.error('Error sending payout processed notification:', notificationError);
          // Don't fail the operation if notification fails
        }
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error marking payout as paid:', error);
    throw new Error('Failed to mark payout as paid');
  }
}

/**
 * Request a payout for rent money after move-in
 */
export async function requestRentPayout(reservationId: string): Promise<boolean> {
  try {
    return await PayoutsService.requestRentPayout(reservationId);
  } catch (error) {
    console.error('Error requesting rent payout:', error);
    throw new Error('Failed to request rent payout');
  }
}

/**
 * Request a payout for referral earnings
 */
export async function requestReferralPayout(referralId: string): Promise<boolean> {
  try {
    return await PayoutsService.requestReferralPayout(referralId);
  } catch (error) {
    console.error('Error requesting referral payout:', error);
    throw new Error('Failed to request referral payout');
  }
} 

/**
 * Get payout requests for the current user
 */
export async function getCurrentUserPayoutRequests(): Promise<PayoutRequest[]> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    return await PayoutsService.getUserPayoutRequests(user.uid);
  } catch (error) {
    console.error('Error getting user payout requests:', error);
    throw new Error('Failed to get user payout requests');
  }
}

/**
 * Create a payout entry for a refund request
 * This is used by the admin when approving a refund request
 */
export async function createRefundPayout(
  userId: string,
  refundAmount: number,
  refundRequestId: string
): Promise<boolean> {
  try {
    // Get user details
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    
    // Check if user has payment method
    if (!userData.paymentMethod) {
      throw new Error('User has no payment method');
    }
    
    // Create a new payout document
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    
    await addDoc(payoutsRef, {
      payeeId: userId,
      payeeName: userData.name + (userData.surname ? ` ${userData.surname}` : ''),
      payeePhone: userData.phoneNumber || 'No phone',
      payeeType: 'client', // Refunds are always to clients
      paymentMethod: {
        bankName: userData.paymentMethod.bankName || 'Unknown Bank',
        accountLast4: userData.paymentMethod.accountNumber ? 
          userData.paymentMethod.accountNumber.slice(-4) : '****',
        type: userData.paymentMethod.type || 'IBAN'
      },
      reason: 'Tenant Refund',
      amount: refundAmount,
      currency: 'MAD',
      status: 'pending',
      sourceId: refundRequestId,
      sourceType: 'refund',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error creating refund payout:', error);
    return false;
  }
}

/**
 * Create a payout entry for a cancellation request
 * This is used by the admin when approving a cancellation request
 */
export async function createCancellationPayout(
  userId: string,
  refundAmount: number,
  cancellationRequestId: string,
  reason: 'Cushion – Pre-move Cancel' | 'Cushion – Haani Max Cancel'
): Promise<boolean> {
  try {
    // Get user details
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    
    // Check if user has payment method
    if (!userData.paymentMethod) {
      throw new Error('User has no payment method');
    }
    
    // Create a new payout document
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    
    await addDoc(payoutsRef, {
      payeeId: userId,
      payeeName: userData.name + (userData.surname ? ` ${userData.surname}` : ''),
      payeePhone: userData.phoneNumber || 'No phone',
      payeeType: 'client', // Cancellations are always to clients
      paymentMethod: {
        bankName: userData.paymentMethod.bankName || 'Unknown Bank',
        accountLast4: userData.paymentMethod.accountNumber ? 
          userData.paymentMethod.accountNumber.slice(-4) : '****',
        type: userData.paymentMethod.type || 'IBAN'
      },
      reason,
      amount: refundAmount,
      currency: 'MAD',
      status: 'pending',
      sourceId: cancellationRequestId,
      sourceType: 'cancellation',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error creating cancellation payout:', error);
    return false;
  }
} 

/**
 * Process all pending payouts for a specific reason
 * This can be used for automated processing of certain types of payouts
 */
export async function processPendingPayoutsByReason(reason: string): Promise<{
  success: boolean;
  processedCount: number;
  error?: string;
}> {
  try {
    return await PayoutsService.processPendingPayoutsByReason(reason as any);
  } catch (error) {
    console.error(`Error processing pending payouts for reason ${reason}:`, error);
    return {
      success: false,
      processedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error processing payouts'
    };
  }
}

/**
 * Process all pending payouts for a specific user
 */
export async function processPendingPayoutsForUser(userId: string): Promise<{
  success: boolean;
  processedCount: number;
  error?: string;
}> {
  try {
    return await PayoutsService.processPendingPayoutsForUser(userId);
  } catch (error) {
    console.error(`Error processing pending payouts for user ${userId}:`, error);
    return {
      success: false,
      processedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error processing payouts'
    };
  }
}

/**
 * Get payout history for the current user
 */
export async function getCurrentUserPayoutHistory(): Promise<Payout[]> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    return await PayoutsService.getUserPayoutHistory(user.uid);
  } catch (error) {
    console.error('Error getting user payout history:', error);
    throw new Error('Failed to get user payout history');
  }
}

/**
 * Get payout history for a specific user
 * Admin only function
 */
export async function getUserPayoutHistory(userId: string): Promise<Payout[]> {
  try {
    // Verify admin access
    const auth = getAuth();
    const adminUser = auth.currentUser;
    
    if (!adminUser) {
      throw new Error('Admin not authenticated');
    }
    
    return await PayoutsService.getUserPayoutHistory(userId);
  } catch (error) {
    console.error(`Error getting payout history for user ${userId}:`, error);
    throw new Error('Failed to get user payout history');
  }
}

/**
 * Get all payouts with pagination
 * Admin only function
 */
export async function getAllPayouts(limitCount: number = 50, lastDocId?: string): Promise<{
  payouts: Payout[];
  lastDocId: string | null;
  hasMore: boolean;
}> {
  try {
    // Verify admin access
    const auth = getAuth();
    const adminUser = auth.currentUser;
    
    if (!adminUser) {
      throw new Error('Admin not authenticated');
    }
    
    let startAfterDoc = null;
    
    // If lastDocId is provided, get the document to start after
    if (lastDocId) {
      const docRef = doc(db, PAYOUTS_COLLECTION, lastDocId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        startAfterDoc = docSnap;
      }
    }
    
    const result = await PayoutsService.getAllPayouts(limitCount, startAfterDoc);
    
    return {
      payouts: result.payouts,
      lastDocId: result.lastDoc?.id || null,
      hasMore: result.hasMore
    };
  } catch (error) {
    console.error('Error getting all payouts:', error);
    throw new Error('Failed to get payouts');
  }
} 