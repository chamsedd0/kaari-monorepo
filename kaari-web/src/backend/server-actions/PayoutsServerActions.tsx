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
        // For refunds, resolve property via refund request context
        let propertyName = 'your booking';
        try {
          if (payoutData.sourceId) {
            const refundReqRef = doc(db, REFUND_REQUESTS_COLLECTION, payoutData.sourceId);
            const refundReqDoc = await getDoc(refundReqRef);
            if (refundReqDoc.exists()) {
              const refundReq = refundReqDoc.data();
              const propId = refundReq.propertyId;
              if (propId) {
                const propertyRef = doc(db, PROPERTIES_COLLECTION, propId);
                const propertyDoc = await getDoc(propertyRef);
                if (propertyDoc.exists()) {
                  propertyName = propertyDoc.data().title || 'your booking';
                }
              }
            }
          }
        } catch (err) {
          console.error('Error resolving refund property name:', err);
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
 * Create a payout request entry for a refund request
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
    
    // Get refund request details
    const refundRequestRef = doc(db, REFUND_REQUESTS_COLLECTION, refundRequestId);
    const refundRequestDoc = await getDoc(refundRequestRef);
    
    if (!refundRequestDoc.exists()) {
      throw new Error('Refund request not found');
    }
    
    const refundRequestData = refundRequestDoc.data();
    
    // Create a new payout request document
    const payoutRequestsRef = collection(db, PAYOUT_REQUESTS_COLLECTION);
    
    await addDoc(payoutRequestsRef, {
      userId: userId,
      userType: 'client', // Refunds are always to clients
      amount: refundAmount,
      currency: 'MAD',
      sourceType: 'refund',
      sourceId: refundRequestId,
      status: 'pending',
      reason: 'Tenant Refund',
      paymentMethod: {
        type: userData.paymentMethod.type || 'IBAN',
        bankName: userData.paymentMethod.bankName || '',
        accountNumber: userData.paymentMethod.accountNumber || '',
        accountLast4: userData.paymentMethod.accountNumber ? 
          userData.paymentMethod.accountNumber.slice(-4) : '****'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Add additional info for admin reference
      propertyId: refundRequestData.propertyId,
      propertyTitle: refundRequestData.propertyName || 'Unknown Property',
      clientName: userData.name + (userData.surname ? ` ${userData.surname}` : ''),
      reservationId: refundRequestData.reservationId,
      adminCreated: true
    });
    
    // Send notification to client
    try {
      await payoutNotifications.refundRequestCreated(
        userId,
        refundAmount,
        'MAD',
        refundRequestData.propertyName || 'your booking'
      );
    } catch (notifError) {
      console.error('Error sending refund request created notification:', notifError);
      // Don't fail the operation if notification fails
    }
    
    return true;
  } catch (error) {
    console.error('Error creating refund payout request:', error);
    return false;
  }
}

/**
 * Create a payout request entry for a cancellation request
 * This is used by the admin when approving a cancellation request
 */
export async function createCancellationPayout(
  userId: string,
  refundAmount: number,
  cancellationRequestId: string,
  reason: 'Cushion – Pre-move Cancel'
): Promise<boolean> {
  try {
    // Treat userId as advertiserId for cushion payouts
    const advertiserRef = doc(db, USERS_COLLECTION, userId);
    const advertiserDoc = await getDoc(advertiserRef);
    
    if (!advertiserDoc.exists()) {
      throw new Error('User not found');
    }
    
    const advertiserData = advertiserDoc.data();
    
    // Check if advertiser has payment method
    if (!advertiserData.paymentMethod) {
      throw new Error('User has no payment method');
    }
    
    // Try to fetch cancellation request to include property context in notifications
    let propertyTitle: string | undefined;
    try {
      const cancellationRef = doc(db, 'cancellationRequests', cancellationRequestId);
      const cancellationDoc = await getDoc(cancellationRef);
      const cancellationData = cancellationDoc.exists() ? cancellationDoc.data() : null;
      const propertyId = cancellationData?.propertyId;
      if (propertyId) {
        const propertyRef = doc(db, PROPERTIES_COLLECTION, propertyId);
        const propertyDoc = await getDoc(propertyRef);
        if (propertyDoc.exists()) {
          propertyTitle = propertyDoc.data().title;
        }
      }
    } catch (ctxErr) {
      console.warn('createCancellationPayout: unable to enrich with property context', ctxErr);
    }

    // Create a new payout request document
    const payoutRequestsRef = collection(db, PAYOUT_REQUESTS_COLLECTION);
    
    await addDoc(payoutRequestsRef, {
      userId: userId,
      userType: 'advertiser',
      amount: refundAmount,
      currency: 'MAD',
      sourceType: 'cancellation',
      sourceId: cancellationRequestId,
      status: 'pending',
      reason,
      paymentMethod: {
        type: advertiserData.paymentMethod.type || 'IBAN',
        bankName: advertiserData.paymentMethod.bankName || '',
        accountNumber: advertiserData.paymentMethod.accountNumber || '',
        accountLast4: advertiserData.paymentMethod.accountNumber ? 
          advertiserData.paymentMethod.accountNumber.slice(-4) : '****'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Add additional info for admin reference
      clientName: undefined,
      adminCreated: true
    });
    
    // Send notification to client
    try {
      await payoutNotifications.payoutRequestCreated(
        userId,
        'advertiser',
        refundAmount,
        'MAD',
        reason,
        propertyTitle || 'your property'
      );
    } catch (notifError) {
      console.error('Error sending cancellation request created notification:', notifError);
      // Don't fail the operation if notification fails
    }
    
    return true;
  } catch (error) {
    console.error('Error creating cancellation payout request:', error);
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
export async function getAllPayouts(limit: number = 50, lastDocId?: string): Promise<{
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
    
    let startAfterDoc: string | undefined = undefined;
    
    // If lastDocId is provided, get the document to start after
    if (lastDocId) {
      startAfterDoc = lastDocId;
    }
    
    const result = await PayoutsService.getAllPayouts(limit, startAfterDoc);
    
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

/**
 * Create a payout request entry for a rent payment after the safety window expires
 * This is used by the system to automatically create a payout request for the advertiser
 */
export async function createRentPayout(reservationId: string): Promise<boolean> {
  try {
    // Get the reservation
    const reservationRef = doc(db, REQUESTS_COLLECTION, reservationId);
    const reservationDoc = await getDoc(reservationRef);
    
    if (!reservationDoc.exists()) {
      throw new Error('Reservation not found');
    }
    
    const reservation = reservationDoc.data();
    
    // Verify that the reservation is in 'movedIn' status
    if (reservation.status !== 'movedIn') {
      throw new Error('Cannot create payout for a reservation that is not in moved-in status');
    }
    
    // Check if the safety window has expired
    const now = new Date();
    const safetyWindowEndsAt = reservation.safetyWindowEndsAt?.toDate();
    
    if (!safetyWindowEndsAt || now < safetyWindowEndsAt) {
      throw new Error('Safety window has not expired yet');
    }
    
    // Get property details
    const propertyRef = doc(db, PROPERTIES_COLLECTION, reservation.propertyId);
    const propertyDoc = await getDoc(propertyRef);
    
    if (!propertyDoc.exists()) {
      throw new Error('Property not found');
    }
    
    const property = propertyDoc.data();
    const advertiserId = property.ownerId;
    
    if (!advertiserId) {
      throw new Error('Advertiser ID not found for this property');
    }
    
    // Get advertiser details
    const advertiserRef = doc(db, USERS_COLLECTION, advertiserId);
    const advertiserDoc = await getDoc(advertiserRef);
    
    if (!advertiserDoc.exists()) {
      throw new Error('Advertiser not found');
    }
    
    const advertiser = advertiserDoc.data();
    
    // Check if advertiser has payment method
    if (!advertiser.paymentMethod) {
      throw new Error('Advertiser has no payment method');
    }
    
    // Create a new payout request document
    const payoutRequestsRef = collection(db, PAYOUT_REQUESTS_COLLECTION);
    
    await addDoc(payoutRequestsRef, {
      userId: advertiserId,
      userType: 'advertiser',
      amount: reservation.totalPrice || 0,
      currency: 'MAD',
      sourceType: 'rent',
      sourceId: reservationId,
      status: 'pending',
      reason: 'Rent – Move-in',
      paymentMethod: {
        type: advertiser.paymentMethod.type || 'IBAN',
        bankName: advertiser.paymentMethod.bankName || '',
        accountNumber: advertiser.paymentMethod.accountNumber || '',
        accountLast4: advertiser.paymentMethod.accountNumber ? 
          advertiser.paymentMethod.accountNumber.slice(-4) : '****'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Add additional info for admin reference
      propertyTitle: property.title || 'Unknown Property',
      clientName: reservation.clientName || 'Unknown Client',
      moveInDate: reservation.moveInDate || null,
      automaticallyCreated: true
    });
    
    // Send notification to advertiser
    try {
      await payoutNotifications.payoutRequestCreated(
        advertiserId,
        'advertiser',
        reservation.totalPrice || 0,
        'MAD',
        'Rent – Move-in',
        property.title || 'your property'
      );
    } catch (notifError) {
      console.error('Error sending payout request created notification:', notifError);
      // Don't fail the operation if notification fails
    }
    
    return true;
  } catch (error) {
    console.error('Error creating rent payout request:', error);
    return false;
  }
} 

/**
 * Process safety window closures and create payouts for eligible bookings
 */
export async function processSafetyWindowClosures(): Promise<{
  processed: number;
  errors: number;
  payoutsCreated: number;
}> {
  try {
    const ExpirationService = (await import('../../services/ExpirationService')).default;
    return await ExpirationService.processSafetyWindowClosures();
  } catch (error) {
    console.error('Error processing safety window closures:', error);
    throw new Error('Failed to process safety window closures');
  }
}

/**
 * Check and process safety window for a specific booking
 */
export async function checkAndProcessSafetyWindow(bookingId: string): Promise<{
  processed: boolean;
  payoutCreated: boolean;
  error?: string;
}> {
  try {
    const ExpirationService = (await import('../../services/ExpirationService')).default;
    return await ExpirationService.checkAndProcessSafetyWindow(bookingId);
  } catch (error) {
    console.error(`Error checking safety window for booking ${bookingId}:`, error);
    return {
      processed: false,
      payoutCreated: false,
      error: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 