import { auth, db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  runTransaction,
  limit,
  setDoc,
} from 'firebase/firestore';
import { userNotifications } from '../../utils/notification-helpers';

/**
 * Helper function to create a payout entry for an approved refund
 */
async function createRefundPayout(
  refundData: any, 
  refundAmount: number, 
  refundRequestId: string
): Promise<void> {
  try {
    // Get user details to determine payment method
    const userRef = doc(db, 'users', refundData.userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.error(`User ${refundData.userId} not found for refund payout`);
      return;
    }
    
    const userData = userDoc.data();
    
    // Check if user has payment method
    if (!userData.paymentMethod) {
      console.error(`User ${refundData.userId} has no payment method for refund payout`);
      return;
    }
    
    // Create a new payout document
    const payoutsRef = collection(db, 'payouts');
    const newPayoutRef = doc(payoutsRef);
    
    await setDoc(newPayoutRef, {
      payeeId: refundData.userId,
      payeeType: 'tenant', // Refunds are always to tenants
      paymentMethod: {
        bankName: userData.paymentMethod.bankName || 'Unknown Bank',
        accountLast4: userData.paymentMethod.accountLast4 || '****',
        type: userData.paymentMethod.type || 'IBAN'
      },
      reason: 'Tenant Refund',
      amount: refundAmount,
      status: 'pending',
      createdAt: serverTimestamp(),
      sourceId: refundRequestId,
      sourceType: 'refund',
      createdBy: auth.currentUser?.uid || 'system'
    });
    
    console.log(`Created payout entry ${newPayoutRef.id} for refund ${refundRequestId} with amount ${refundAmount}`);
    
    // Update the refund request with the payout ID
    const refundRequestRef = doc(db, 'refundRequests', refundRequestId);
    await updateDoc(refundRequestRef, {
      payoutId: newPayoutRef.id,
      payoutCreatedAt: serverTimestamp()
    });
    
  } catch (error) {
    console.error('Error creating refund payout:', error);
    // Don't throw the error, just log it to avoid breaking the refund approval flow
  }
}

// Interface for refund request
export interface RefundRequest {
  id: string;
  userId: string;
  userName?: string; // May not be populated immediately
  propertyId: string;
  propertyName?: string; // May not be populated immediately
  reservationId?: string;
  amount?: number; // Original field
  requestedRefundAmount?: number; // New field matching actual data structure
  originalAmount?: number; // New field matching actual data structure
  serviceFee?: number; // New field matching actual data structure
  requestDate?: any; // Timestamp
  createdAt?: any; // Timestamp
  updatedAt?: any; // Timestamp
  status: 'pending' | 'approved' | 'rejected';
  reason?: string; // Original field
  reasonsText?: string; // New field matching actual data structure
  reasons?: string[]; // New field matching actual data structure - array of reason codes
  moveInDate?: any; // Timestamp
  movedInDate?: any; // Timestamp
  requestDetails?: string;
  details?: string; // New field matching actual data structure
  proofUrls?: string[]; // New field for uploaded proof files
  cancellationRequestId?: string; // Optional reference to the original cancellation request
  createdBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  adminReviewed?: boolean; // New field to track if admin has reviewed this request
}

// Interface for cancellation request
export interface CancellationRequest {
  id: string;
  userId: string;
  userName: string;
  propertyId: string;
  propertyName: string;
  reservationId: string;
  originalAmount: number;
  serviceFee: number;
  cancellationFee: number;
  refundAmount: number;
  daysToMoveIn: number;
  createdAt: any; // Timestamp
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestDetails: string;
  approvedBy?: string;
  rejectedBy?: string;
}

// Interface for Advertiser
export interface Advertiser {
  id: string;
  name: string;
  city: string;
  activePropertiesCount: number;
  bookingsThisMonth: number;
  referralEarningsPending: number;
  photoshootsPending: number;
  status: 'active' | 'suspended';
}

// Interface for Advertiser Property
export interface AdvertiserProperty {
  id: string;
  title: string;
  city: string;
  status: 'live' | 'hidden';
  nextAvailability: string;
}

// Interface for Photoshoot Request
export interface PhotoshootRequest {
  id: string;
  propertyTitle: string;
  requestDate: string;
  scheduledDate: string;
  status: 'pending' | 'done';
}

// Interface for Booking
export interface AdvertiserBooking {
  id: string;
  tenantName: string;
  moveInDate: string;
  status: 'await-confirm' | 'confirmed' | 'safety-window-closed';
  payoutPending: number;
}

// Interface for Referral Data
export interface ReferralData {
  code: string;
  bookingsCount: number;
  earningsPending: number;
  earningsPaid: number;
}

/**
 * Get all refund requests
 */
export const getRefundRequests = async (): Promise<RefundRequest[]> => {
  try {
    console.log('Fetching refund requests');
    const refundRequestsRef = collection(db, 'refundRequests');
    const q = query(refundRequestsRef);
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.docs.length} refund requests`);
    
    if (querySnapshot.docs.length === 0) {
      console.log('No refund requests found. Collection may be empty.');
      return []; // Return empty array instead of continuing
    }
    
    const refundRequests: RefundRequest[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data() as Record<string, any>;
      console.log('Processing refund request:', docSnapshot.id, data);
      
      try {
        // Get user details - handle both document references and string IDs
        let userId = data.userId;
        let userName = 'Unknown User';
        
        if (userId && typeof userId === 'object' && 'id' in userId) {
          // It's a document reference
          const userDoc = await getDoc(userId);
          const userData = userDoc.exists() ? userDoc.data() as Record<string, any> : null;
          userName = userData ? userData.displayName || userData.name || 'Unknown User' : 'Unknown User';
          userId = userId.id;
        } else if (userId && typeof userId === 'string') {
          // It's already a string ID
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userData = userDoc.exists() ? userDoc.data() as Record<string, any> : null;
            userName = userData ? userData.displayName || userData.name || 'Unknown User' : 'Unknown User';
          } catch (userError) {
            console.error('Error fetching user:', userError);
          }
        }
        
        // Get property details - handle both document references and string IDs
        let propertyId = data.propertyId;
        let propertyName = 'Unknown Property';
        
        if (propertyId && typeof propertyId === 'object' && 'id' in propertyId) {
          // It's a document reference
          const propertyDoc = await getDoc(propertyId);
          const propertyData = propertyDoc.exists() ? propertyDoc.data() as Record<string, any> : null;
          propertyName = propertyData ? propertyData.title || 'Unknown Property' : 'Unknown Property';
          propertyId = propertyId.id;
        } else if (propertyId && typeof propertyId === 'string') {
          // It's already a string ID
          try {
            const propertyDoc = await getDoc(doc(db, 'properties', propertyId));
            const propertyData = propertyDoc.exists() ? propertyDoc.data() as Record<string, any> : null;
            propertyName = propertyData ? propertyData.title || 'Unknown Property' : 'Unknown Property';
          } catch (propertyError) {
            console.error('Error fetching property:', propertyError);
          }
        }
        
        // Map the request data to our interface, handling potential field name differences
        refundRequests.push({
          id: docSnapshot.id,
          userId: userId || 'unknown',
          userName,
          propertyId: propertyId || 'unknown',
          propertyName,
          reservationId: data.reservationId || '',
          amount: data.amount || data.refundAmount || 0,
          requestDate: data.requestDate || data.createdAt || null,
          status: data.status || 'pending',
          reason: data.reason || data.reasonsText || (Array.isArray(data.reasons) ? data.reasons.join(', ') : ''),
          moveInDate: data.moveInDate || null,
          movedInDate: data.movedInDate || null,
          requestDetails: data.requestDetails || data.details || '',
          cancellationRequestId: data.cancellationRequestId || undefined,
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null,
          createdBy: data.createdBy || undefined,
          approvedBy: data.approvedBy || undefined,
          rejectedBy: data.rejectedBy || undefined,
          adminReviewed: data.adminReviewed || false,
          requestedRefundAmount: data.requestedRefundAmount || undefined,
          originalAmount: data.originalAmount || undefined,
          serviceFee: data.serviceFee || undefined,
          reasonsText: data.reasonsText || undefined,
          reasons: data.reasons || undefined,
          details: data.details || undefined,
          proofUrls: data.proofUrls || undefined
        });
      } catch (itemError) {
        console.error('Error processing refund request item:', itemError);
        // Continue processing other requests instead of failing the entire operation
      }
    }
    
    console.log('Processed refund requests:', refundRequests);
    return refundRequests;
  } catch (error) {
    console.error('Error getting refund requests:', error);
    throw new Error('Failed to fetch refund requests');
  }
};

/**
 * Get all cancellation requests
 */
export const getCancellationRequests = async (): Promise<CancellationRequest[]> => {
  try {
    console.log('Fetching cancellation requests');
    const cancellationRequestsRef = collection(db, 'cancellationRequests');
    const q = query(cancellationRequestsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.docs.length} cancellation requests`);
    
    if (querySnapshot.docs.length === 0) {
      console.log('No cancellation requests found. Collection may be empty.');
      return [];
    }
    
    const cancellationRequests: CancellationRequest[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data() as Record<string, any>;
      
      try {
        // Get user details
        let userId = data.userId;
        let userName = 'Unknown User';
        
        if (userId && typeof userId === 'object' && 'id' in userId) {
          // It's a document reference
          const userDoc = await getDoc(userId);
          const userData = userDoc.exists() ? userDoc.data() as Record<string, any> : null;
          userName = userData ? userData.displayName || userData.name || 'Unknown User' : 'Unknown User';
          userId = userId.id;
        } else if (userId && typeof userId === 'string') {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userData = userDoc.exists() ? userDoc.data() as Record<string, any> : null;
            userName = userData ? userData.displayName || userData.name || 'Unknown User' : 'Unknown User';
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }
        
        // Get property details
        let propertyId = data.propertyId;
        let propertyName = 'Unknown Property';
        
        if (propertyId && typeof propertyId === 'object' && 'id' in propertyId) {
          // It's a document reference
          const propertyDoc = await getDoc(propertyId);
          const propertyData = propertyDoc.exists() ? propertyDoc.data() as Record<string, any> : null;
          propertyName = propertyData ? propertyData.title || 'Unknown Property' : 'Unknown Property';
          propertyId = propertyId.id;
        } else if (propertyId && typeof propertyId === 'string') {
          try {
            const propertyDoc = await getDoc(doc(db, 'properties', propertyId));
            const propertyData = propertyDoc.exists() ? propertyDoc.data() as Record<string, any> : null;
            propertyName = propertyData ? propertyData.title || 'Unknown Property' : 'Unknown Property';
          } catch (error) {
            console.error('Error fetching property:', error);
          }
        }
        
        cancellationRequests.push({
          id: docSnapshot.id,
          userId: userId || 'unknown',
          userName,
          propertyId: propertyId || 'unknown',
          propertyName,
          reservationId: data.reservationId || '',
          originalAmount: data.originalAmount || 0,
          serviceFee: data.serviceFee || 0,
          cancellationFee: data.cancellationFee || 0,
          refundAmount: data.refundAmount || 0,
          daysToMoveIn: data.daysToMoveIn || 0,
          createdAt: data.createdAt || null,
          status: data.status || 'pending',
          reason: data.reason || '',
          requestDetails: data.requestDetails || data.details || '',
          approvedBy: data.approvedBy || undefined,
          rejectedBy: data.rejectedBy || undefined
        });
      } catch (error) {
        console.error('Error processing cancellation request:', error);
      }
    }
    
    console.log('Processed cancellation requests:', cancellationRequests);
    return cancellationRequests;
  } catch (error) {
    console.error('Error getting cancellation requests:', error);
    throw new Error('Failed to get cancellation requests');
  }
};

/**
 * Approve a refund request
 */
export const approveRefundRequest = async (refundRequestId: string): Promise<void> => {
  try {
    const refundRequestRef = doc(db, 'refundRequests', refundRequestId);
    const refundRequestDoc = await getDoc(refundRequestRef);
    
    if (!refundRequestDoc.exists()) {
      throw new Error('Refund request not found');
    }
    
    const refundData = refundRequestDoc.data();
    
    // Create a timestamp for now that we can use in arrayUnion
    // serverTimestamp() cannot be used with arrayUnion
    const now = Timestamp.fromDate(new Date());
    
    // First, update the refund request status
    await updateDoc(refundRequestRef, {
      status: 'approved',
      updatedAt: serverTimestamp(),
      adminReviewed: true,
      approvedAt: serverTimestamp(),
      approvedBy: auth.currentUser?.uid
    });
    
    // Calculate refund amount safely with fallbacks
    const refundAmount = 
      (typeof refundData.amount === 'number' && !isNaN(refundData.amount))
        ? refundData.amount
        : (typeof refundData.requestedRefundAmount === 'number' && !isNaN(refundData.requestedRefundAmount))
          ? refundData.requestedRefundAmount
          : 0;
    
    // Create a payout entry for the refund
    try {
      // Import PayoutsServerActions dynamically to avoid circular dependencies
      const { createRefundPayout } = await import('./PayoutsServerActions');
      
      // Create the payout
      await createRefundPayout(
        refundData.userId,
        refundAmount,
        refundRequestId
      );
      
      console.log(`Created refund payout for user ${refundData.userId} with amount ${refundAmount}`);
    } catch (payoutError) {
      console.error('Error creating refund payout:', payoutError);
      // Don't throw error, just log it (non-critical)
    }
    
    // Now check if the reservation exists before attempting to update it
    if (refundData.reservationId) {
      // First check in 'requests' collection
      const reservationRef = doc(db, 'requests', refundData.reservationId);
      let reservationDoc = await getDoc(reservationRef);
      
      if (reservationDoc.exists()) {
        // Update reservation status to refundCompleted
        await updateDoc(reservationRef, {
          status: 'refundCompleted',
          updatedAt: serverTimestamp()
        });
        
        console.log(`Updated reservation ${refundData.reservationId} status to refundCompleted`);
      } else {
        // If not found in 'requests', try 'reservations' collection
        const alternativeReservationRef = doc(db, 'reservations', refundData.reservationId);
        reservationDoc = await getDoc(alternativeReservationRef);
        
        if (reservationDoc.exists()) {
          // Update reservation status to refundCompleted
          await updateDoc(alternativeReservationRef, {
            status: 'refundCompleted',
            updatedAt: serverTimestamp()
          });
          
          console.log(`Updated reservation ${refundData.reservationId} status to refundCompleted in 'reservations' collection`);
        } else {
          console.log(`Reservation ${refundData.reservationId} not found in either collection. Only the refund request status has been updated.`);
        }
      }
    }
    
    // Send notification to the user about the approved refund
    if (refundData.userId) {
      try {
        // Create a minimal reservation object for the notification
        const reservationForNotification = {
          id: refundData.reservationId,
          propertyId: refundData.propertyId,
          propertyTitle: refundData.propertyName || 'your reservation',
          status: 'refundCompleted'
        };
        
        await userNotifications.refundRequestHandled(
          refundData.userId,
          reservationForNotification as any,
          true, // approved
          `Your refund request for ${refundAmount} MAD has been approved and is being processed.`
        );
        
        console.log(`Sent refund approval notification to user ${refundData.userId}`);
      } catch (notifError) {
        console.error('Error sending refund approved notification:', notifError);
        // Don't throw error, just log it (non-critical)
      }
    }
    
    // Explicitly return undefined to satisfy the Promise<void> return type
    return;
    
  } catch (error) {
    console.error('Error approving refund request:', error);
    throw new Error('Failed to approve refund request');
  }
};

/**
 * Reject a refund request
 */
export const rejectRefundRequest = async (refundRequestId: string): Promise<void> => {
  try {
    const refundRequestRef = doc(db, 'refundRequests', refundRequestId);
    const refundRequestDoc = await getDoc(refundRequestRef);
    
    if (!refundRequestDoc.exists()) {
      throw new Error('Refund request not found');
    }
    
    const refundData = refundRequestDoc.data();
    
    // Create a timestamp for now that we can use in arrayUnion
    // serverTimestamp() cannot be used with arrayUnion
    const now = Timestamp.fromDate(new Date());
    
    // Update the refund request status
    await updateDoc(refundRequestRef, {
      status: 'rejected',
      updatedAt: serverTimestamp(),
      rejectedAt: serverTimestamp(),
      rejectedBy: auth.currentUser?.uid
    });
    
    // Update the reservation status if it exists
    if (refundData.reservationId) {
      // First check in 'requests' collection
      const reservationRef = doc(db, 'requests', refundData.reservationId);
      let reservationDoc = await getDoc(reservationRef);
      let reservationData = null;
      let reservationCollection = 'requests';
      
      // If not found in 'requests', try 'reservations' collection
      if (!reservationDoc.exists()) {
        const alternativeReservationRef = doc(db, 'reservations', refundData.reservationId);
        reservationDoc = await getDoc(alternativeReservationRef);
        reservationCollection = 'reservations';
        
        if (reservationDoc.exists()) {
          reservationData = reservationDoc.data();
          await updateDoc(alternativeReservationRef, {
            status: 'refundFailed',
            updatedAt: serverTimestamp(),
          });
          
          console.log(`Updated reservation ${refundData.reservationId} in 'reservations' collection status to refundFailed`);
        } else {
          console.log(`Reservation ${refundData.reservationId} not found in either collection. Only the refund request status has been updated.`);
        }
      } else {
        // Found in 'requests' collection
        reservationData = reservationDoc.data();
        await updateDoc(reservationRef, {
          status: 'refundFailed',
          updatedAt: serverTimestamp(),
        });
        
        console.log(`Updated reservation ${refundData.reservationId} in 'requests' collection status to refundFailed`);
      }
      
      // Send notification to the user about the rejected refund
      if (refundData.userId && reservationData) {
        try {
          // Get property details for the notification
          const propertyRef = doc(db, 'properties', refundData.propertyId);
          const propertyDoc = await getDoc(propertyRef);
          const propertyTitle = propertyDoc.exists() ? propertyDoc.data().title : 'your reservation';
          
          // Create a minimal reservation object for the notification
          const reservationForNotification = {
            id: refundData.reservationId,
            propertyId: refundData.propertyId,
            propertyTitle: propertyTitle,
            status: 'refundFailed'
          };
          
          await userNotifications.refundRequestHandled(
            refundData.userId,
            reservationForNotification as any,
            false, // rejected
            refundData.reason || refundData.reasonsText || 'Your refund request has been rejected.'
          );
          
          console.log(`Sent refund rejection notification to user ${refundData.userId}`);
        } catch (notifError) {
          console.error('Error sending refund rejected notification:', notifError);
          // Don't throw error, just log it (non-critical)
        }
      }
    }
    
    // If this refund was generated from a cancellation request, update the cancellation request too
    if (refundData.cancellationRequestId) {
      const cancellationRequestRef = doc(db, 'cancellationRequests', refundData.cancellationRequestId);
      const cancellationRequestDoc = await getDoc(cancellationRequestRef);
      
      if (cancellationRequestDoc.exists()) {
        await updateDoc(cancellationRequestRef, {
          refundStatus: 'failed',
          updatedAt: serverTimestamp()
        });
        
        console.log(`Updated related cancellation request ${refundData.cancellationRequestId} with refund status (failed)`);
      }
    }
    
    // Explicitly return undefined to satisfy the Promise<void> return type
    return;
    
  } catch (error) {
    console.error('Error rejecting refund request:', error);
    throw new Error('Failed to reject refund request');
  }
};

/**
 * Approve a cancellation request
 */
export const approveCancellationRequest = async (cancellationRequestId: string): Promise<void> => {
  try {
    const cancellationRequestRef = doc(db, 'cancellationRequests', cancellationRequestId);
    const cancellationRequestDoc = await getDoc(cancellationRequestRef);
    
    if (!cancellationRequestDoc.exists()) {
      throw new Error('Cancellation request not found');
    }
    
    const cancellationData = cancellationRequestDoc.data();
    
    // Create a timestamp for now that we can use in arrayUnion
    // serverTimestamp() cannot be used with arrayUnion
    const now = Timestamp.fromDate(new Date());
    
    // First, update the cancellation request status
    await updateDoc(cancellationRequestRef, {
      status: 'approved',
      updatedAt: serverTimestamp(),
      adminReviewed: true,
      approvedAt: serverTimestamp(),
      approvedBy: auth.currentUser?.uid
    });
    
    // Property title for notifications
    let propertyTitle = 'your reservation';
    try {
      if (cancellationData.propertyId) {
        const propertyRef = doc(db, 'properties', cancellationData.propertyId);
        const propertyDoc = await getDoc(propertyRef);
        if (propertyDoc.exists()) {
          propertyTitle = propertyDoc.data().title || 'your reservation';
        }
      }
    } catch (error) {
      console.error('Error fetching property details for notification:', error);
    }
    
    // Now check if the reservation exists before attempting to update it
    if (cancellationData.reservationId) {
      // First check in 'requests' collection
      const reservationRef = doc(db, 'requests', cancellationData.reservationId);
      let reservationDoc = await getDoc(reservationRef);
      let reservationData = null;
      
      // If not found in 'requests', try 'reservations' collection
      if (!reservationDoc.exists()) {
        const alternativeReservationRef = doc(db, 'reservations', cancellationData.reservationId);
        reservationDoc = await getDoc(alternativeReservationRef);
        
        if (reservationDoc.exists()) {
          reservationData = reservationDoc.data();
          // Update reservation status to refundProcessing instead of cancelled
          await updateDoc(alternativeReservationRef, {
            status: 'refundProcessing',
            updatedAt: serverTimestamp(),
          });
          
          // Calculate refund amount safely with fallbacks
          const originalAmount = typeof cancellationData.originalAmount === 'number' && !isNaN(cancellationData.originalAmount) 
            ? cancellationData.originalAmount 
            : 0;
            
          const cancellationFee = typeof cancellationData.cancellationFee === 'number' && !isNaN(cancellationData.cancellationFee)
            ? cancellationData.cancellationFee
            : 0;
            
          // Try to get the requestedRefundAmount first, otherwise calculate it
          const refundAmount = 
            (typeof cancellationData.requestedRefundAmount === 'number' && !isNaN(cancellationData.requestedRefundAmount))
              ? cancellationData.requestedRefundAmount
              : originalAmount - cancellationFee;
          
          // Create a refund request based on the cancellation request
          const refundRequestsRef = collection(db, 'refundRequests');
          const newRefundRequestRef = doc(refundRequestsRef);
          
          await setDoc(newRefundRequestRef, {
            userId: cancellationData.userId,
            propertyId: cancellationData.propertyId,
            reservationId: cancellationData.reservationId,
            amount: refundAmount, // Now safely calculated with fallbacks
            requestDate: serverTimestamp(),
            status: 'pending',
            reason: `Auto-generated from approved cancellation request: ${cancellationRequestId}`,
            moveInDate: null,
            movedInDate: null,
            requestDetails: cancellationData.details || cancellationData.requestDetails || 'Cancellation approved by admin',
            cancellationRequestId: cancellationRequestId, // Reference to the original cancellation request
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: auth.currentUser?.uid
          });
          
          // Create a cancellation payout for the advertiser (cushion payment)
          try {
            // Import PayoutsServerActions dynamically to avoid circular dependencies
            const { createCancellationPayout } = await import('./PayoutsServerActions');
            
            // Determine the type of cancellation based on days to move-in
            const daysToMoveIn = typeof cancellationData.daysToMoveIn === 'number' ? cancellationData.daysToMoveIn : 0;
            const payoutReason = 'Cushion – Pre-move Cancel';
            
            // Get property details to find advertiser ID
            const propertyRef = doc(db, 'properties', cancellationData.propertyId);
            const propertyDoc = await getDoc(propertyRef);
            const propertyData = propertyDoc.exists() ? propertyDoc.data() : null;
            
            // Create the payout - need to pass userId and refundAmount
            const advertiserId = propertyData?.ownerId || '';
            const cushionAmount = 500; // Single plan; keep pre-move cushion only
            
            await createCancellationPayout(
              advertiserId,
              cushionAmount,
              cancellationRequestId,
              payoutReason
            );
            
            console.log(`Created ${payoutReason} payout for booking ${cancellationData.reservationId}`);
          } catch (payoutError) {
            console.error('Error creating cancellation payout:', payoutError);
            // Don't throw error, just log it (non-critical)
          }
          
          console.log(`Updated reservation in 'reservations' collection and created refund request ${newRefundRequestRef.id} for amount: ${refundAmount}`);
        } else {
          console.log(`Reservation ${cancellationData.reservationId} not found in either collection. Only the cancellation request status has been updated.`);
        }
      } else {
        // Found in 'requests' collection
        reservationData = reservationDoc.data();
        // Update reservation status to refundProcessing instead of cancelled
        await updateDoc(reservationRef, {
          status: 'refundProcessing',
          updatedAt: serverTimestamp(),
        });
        
        // Calculate refund amount safely with fallbacks
        const originalAmount = typeof cancellationData.originalAmount === 'number' && !isNaN(cancellationData.originalAmount) 
          ? cancellationData.originalAmount 
          : 0;
          
        const cancellationFee = typeof cancellationData.cancellationFee === 'number' && !isNaN(cancellationData.cancellationFee)
          ? cancellationData.cancellationFee
          : 0;
          
        // Try to get the requestedRefundAmount first, otherwise calculate it
        const refundAmount = 
          (typeof cancellationData.requestedRefundAmount === 'number' && !isNaN(cancellationData.requestedRefundAmount))
            ? cancellationData.requestedRefundAmount
            : originalAmount - cancellationFee;
        
        // Create a refund request based on the cancellation request
        const refundRequestsRef = collection(db, 'refundRequests');
        const newRefundRequestRef = doc(refundRequestsRef);
        
        await setDoc(newRefundRequestRef, {
          userId: cancellationData.userId,
          propertyId: cancellationData.propertyId,
          reservationId: cancellationData.reservationId,
          amount: refundAmount, // Now safely calculated with fallbacks
          requestDate: serverTimestamp(),
          status: 'pending',
          reason: `Auto-generated from approved cancellation request: ${cancellationRequestId}`,
          moveInDate: null,
          movedInDate: null,
          requestDetails: cancellationData.details || cancellationData.requestDetails || 'Cancellation approved by admin',
          cancellationRequestId: cancellationRequestId, // Reference to the original cancellation request
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid
        });
        
        // Create a cancellation payout for the advertiser (cushion payment)
        try {
          // Import PayoutsServerActions dynamically to avoid circular dependencies
          const { createCancellationPayout } = await import('./PayoutsServerActions');
          
          // Determine the type of cancellation based on days to move-in
          const daysToMoveIn = typeof cancellationData.daysToMoveIn === 'number' ? cancellationData.daysToMoveIn : 0;
          const payoutReason = 'Cushion – Pre-move Cancel';
          
          // Get property details to find advertiser ID
          const propertyRef = doc(db, 'properties', cancellationData.propertyId);
          const propertyDoc = await getDoc(propertyRef);
          const propertyData = propertyDoc.exists() ? propertyDoc.data() : null;
          
          // Create the payout - need to pass userId and refundAmount
          const advertiserId = propertyData?.ownerId || '';
          const cushionAmount = 500; // Single plan; keep pre-move cushion only
          
          await createCancellationPayout(
            advertiserId,
            cushionAmount,
            cancellationRequestId,
            payoutReason
          );
          
          console.log(`Created ${payoutReason} payout for booking ${cancellationData.reservationId}`);
        } catch (payoutError) {
          console.error('Error creating cancellation payout:', payoutError);
          // Don't throw error, just log it (non-critical)
        }
        
        console.log(`Updated reservation in 'requests' collection and created refund request ${newRefundRequestRef.id} for amount: ${refundAmount}`);
      }
      
      // Send notification to the user about the approved cancellation
      if (cancellationData.userId) {
        try {
          // Create a minimal reservation object for the notification
          const reservationForNotification = {
            id: cancellationData.reservationId,
            propertyId: cancellationData.propertyId,
            propertyTitle: propertyTitle,
            status: 'refundProcessing'
          };
          
          await userNotifications.cancellationRequestHandled(
            cancellationData.userId,
            reservationForNotification as any,
            true, // approved
            'Your cancellation request has been approved and a refund is being processed.'
          );
          
          console.log(`Sent cancellation approval notification to user ${cancellationData.userId}`);
        } catch (notifError) {
          console.error('Error sending cancellation approved notification:', notifError);
          // Don't throw error, just log it (non-critical)
        }
      }
    }
    
    // Explicitly return undefined to satisfy the Promise<void> return type
    return;
    
  } catch (error) {
    console.error('Error approving cancellation request:', error);
    throw new Error('Failed to approve cancellation request');
  }
};

/**
 * Reject a cancellation request
 */
export const rejectCancellationRequest = async (cancellationRequestId: string): Promise<void> => {
  try {
    const cancellationRequestRef = doc(db, 'cancellationRequests', cancellationRequestId);
    const cancellationRequestDoc = await getDoc(cancellationRequestRef);
    
    if (!cancellationRequestDoc.exists()) {
      throw new Error('Cancellation request not found');
    }
    
    const cancellationData = cancellationRequestDoc.data();
    
    // Create a timestamp for now that we can use in arrayUnion
    // serverTimestamp() cannot be used with arrayUnion
    const now = Timestamp.fromDate(new Date());
    
    // Update the cancellation request status
    await updateDoc(cancellationRequestRef, {
      status: 'rejected',
      updatedAt: serverTimestamp(),
      adminReviewed: true,
      rejectedAt: serverTimestamp(),
      rejectedBy: auth.currentUser?.uid
    });
    
    // Property title for notifications
    let propertyTitle = 'your reservation';
    try {
      if (cancellationData.propertyId) {
        const propertyRef = doc(db, 'properties', cancellationData.propertyId);
        const propertyDoc = await getDoc(propertyRef);
        if (propertyDoc.exists()) {
          propertyTitle = propertyDoc.data().title || 'your reservation';
        }
      }
    } catch (error) {
      console.error('Error fetching property details for notification:', error);
    }
    
    // Optional: Update the reservation to indicate the cancellation was rejected
    // This keeps the reservation in its original state but adds a history entry
    if (cancellationData.reservationId) {
      // First check in 'requests' collection (as used in other functions)
      const reservationRef = doc(db, 'requests', cancellationData.reservationId);
      let reservationDoc = await getDoc(reservationRef);
      let reservationData = null;
      
      // If not found in 'requests', try 'reservations' collection
      if (!reservationDoc.exists()) {
        const alternativeReservationRef = doc(db, 'reservations', cancellationData.reservationId);
        reservationDoc = await getDoc(alternativeReservationRef);
        
        if (reservationDoc.exists()) {
          reservationData = reservationDoc.data();
          await updateDoc(alternativeReservationRef, {
            status: 'cancelled',
            updatedAt: serverTimestamp(),
          });
          console.log(`Updated reservation ${cancellationData.reservationId} in 'reservations' collection status to cancelled`);
        } else {
          console.log(`Reservation ${cancellationData.reservationId} not found in either collection. Only the cancellation request status has been updated.`);
        }
      } else {
        // Found in 'requests' collection
        reservationData = reservationDoc.data();
        await updateDoc(reservationRef, {
          status: 'cancelled',
          updatedAt: serverTimestamp(),
        });
        console.log(`Updated reservation ${cancellationData.reservationId} in 'requests' collection status to cancelled`);
      }
      
      // Send notification to the user about the rejected cancellation
      if (cancellationData.userId) {
        try {
          // Create a minimal reservation object for the notification
          const reservationForNotification = {
            id: cancellationData.reservationId,
            propertyId: cancellationData.propertyId,
            propertyTitle: propertyTitle,
            status: 'cancelled'
          };
          
          await userNotifications.cancellationRequestHandled(
            cancellationData.userId,
            reservationForNotification as any,
            false, // rejected
            'Your cancellation request has been rejected. Please contact support for more information.'
          );
          
          console.log(`Sent cancellation rejection notification to user ${cancellationData.userId}`);
        } catch (notifError) {
          console.error('Error sending cancellation rejected notification:', notifError);
          // Don't throw error, just log it (non-critical)
        }
      }
    }
    
    // Explicitly return undefined to satisfy the Promise<void> return type
    return;
    
  } catch (error) {
    console.error('Error rejecting cancellation request:', error);
    throw new Error('Failed to reject cancellation request');
  }
};

/**
 * Create a sample refund request for testing
 */
export const createSampleRefundRequest = async (): Promise<string> => {
  try {
    // Get a random user to assign
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(query(usersRef, limit(1)));
    
    let userId = 'unknown';
    if (!usersSnapshot.empty) {
      userId = usersSnapshot.docs[0].id;
    }
    
    // Get a random property
    const propertiesRef = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(query(propertiesRef, limit(1)));
    
    let propertyId = 'unknown';
    if (!propertiesSnapshot.empty) {
      propertyId = propertiesSnapshot.docs[0].id;
    }
    
    // Create a sample reservation first
    const reservationsRef = collection(db, 'reservations');
    const reservationRef = doc(reservationsRef);
    
    const reservationData = {
      userId: userId,
      propertyId: propertyId,
      status: 'refundProcessing', // Status indicating a refund is being processed
      amount: Math.floor(Math.random() * 500) + 100,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      moveInDate: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
      movedInDate: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
      statusHistory: [
        {
          status: 'booked',
          timestamp: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
          updatedBy: auth.currentUser?.uid || 'system'
        },
        {
          status: 'active',
          timestamp: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
          updatedBy: auth.currentUser?.uid || 'system'
        },
        {
          status: 'refundProcessing',
          timestamp: Timestamp.fromDate(new Date()),
          updatedBy: auth.currentUser?.uid || 'system'
        }
      ]
    };
    
    await setDoc(reservationRef, reservationData);
    console.log('Created sample reservation with ID:', reservationRef.id);
    
    // Create a new refund request
    const refundRequestRef = collection(db, 'refundRequests');
    const newRequestRef = doc(refundRequestRef);
    
    const newRequest = {
      userId: userId,
      propertyId: propertyId,
      reservationId: reservationRef.id,
      amount: Math.floor(Math.random() * 500) + 100, // Random amount between 100-600
      requestDate: serverTimestamp(),
      status: 'pending',
      reason: 'Property not as described',
      moveInDate: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)), // 15 days ago
      movedInDate: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)), // 10 days ago
      requestDetails: 'I would like a refund because the property conditions were not as described in the listing.',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: auth.currentUser?.uid || 'system'
    };
    
    await setDoc(newRequestRef, newRequest);
    
    console.log('Created sample refund request with ID:', newRequestRef.id);
    
    return newRequestRef.id;
  } catch (error) {
    console.error('Error creating sample refund request:', error);
    throw new Error('Failed to create sample refund request');
  }
};

/**
 * Create a sample cancellation request for testing
 */
export const createSampleCancellationRequest = async (): Promise<string> => {
  try {
    // Get a random user to assign
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(query(usersRef, limit(1)));
    
    let userId = 'unknown';
    if (!usersSnapshot.empty) {
      userId = usersSnapshot.docs[0].id;
    }
    
    // Get a random property
    const propertiesRef = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(query(propertiesRef, limit(1)));
    
    let propertyId = 'unknown';
    if (!propertiesSnapshot.empty) {
      propertyId = propertiesSnapshot.docs[0].id;
    }
    
    // Create a sample reservation first
    const reservationsRef = collection(db, 'reservations');
    const reservationRef = doc(reservationsRef);
    
    const originalAmount = Math.floor(Math.random() * 500) + 500;
    const reservationData = {
      userId: userId,
      propertyId: propertyId,
      status: 'cancellationUnderReview', // Initial status for a reservation with pending cancellation
      amount: originalAmount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      moveInDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      statusHistory: [
        {
          status: 'booked',
          timestamp: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
          updatedBy: auth.currentUser?.uid || 'system'
        },
        {
          status: 'cancellationUnderReview',
          timestamp: Timestamp.fromDate(new Date()),
          updatedBy: auth.currentUser?.uid || 'system'
        }
      ]
    };
    
    await setDoc(reservationRef, reservationData);
    console.log('Created sample reservation with ID:', reservationRef.id);
    
    // Calculate refund amount based on cancellation policy
    const cancellationFee = 50;
    const serviceFee = 99;
    const requestedRefundAmount = originalAmount - cancellationFee - serviceFee;
    
    // Create a new cancellation request
    const cancellationRequestRef = collection(db, 'cancellationRequests');
    const newRequestRef = doc(cancellationRequestRef);
    
    const newRequest = {
      adminReviewed: false,
      cancellationFee: cancellationFee,
      createdAt: serverTimestamp(),
      daysToMoveIn: 7,
      details: "Need to cancel due to change in circumstances",
      originalAmount: originalAmount,
      proofUrls: ["fake-url-for-Artwork.svg"],
      propertyId: propertyId,
      reason: "extenuating",
      requestedRefundAmount: requestedRefundAmount,
      reservationId: reservationRef.id,
      serviceFee: serviceFee,
      status: "pending",
      updatedAt: serverTimestamp(),
      userId: userId,
      refundStatus: undefined // Will be set when refund request is processed
    };
    
    await setDoc(newRequestRef, newRequest);
    
    console.log('Created sample cancellation request with ID:', newRequestRef.id);
    
    return newRequestRef.id;
  } catch (error) {
    console.error('Error creating sample cancellation request:', error);
    throw new Error('Failed to create sample cancellation request');
  }
};

/**
 * Get all advertisers
 */
export const getAdvertisers = async (): Promise<Advertiser[]> => {
  try {
    // Query users with role 'advertiser'
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', 'advertiser'));
    const querySnapshot = await getDocs(q);
    
    const advertisers: Advertiser[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const userData = docSnapshot.data();
      const userId = docSnapshot.id;
      
      // Count active properties - use ownerId, not advertiserId
      const propertiesRef = collection(db, 'properties');
      const propertiesQuery = query(propertiesRef, where('ownerId', '==', userId), where('status', '==', 'available'));
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const activePropertiesCount = propertiesSnapshot.size;
      
      // Count bookings this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const bookingsRef = collection(db, 'bookings');
      let bookingsThisMonth = 0;
      
      try {
        const bookingsQuery = query(
          bookingsRef, 
          where('advertiserId', '==', userId),
          where('status', '==', 'confirmed'),
          where('moveInDate', '>=', Timestamp.fromDate(firstDayOfMonth)),
          where('moveInDate', '<=', Timestamp.fromDate(lastDayOfMonth))
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        bookingsThisMonth = bookingsSnapshot.size;
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
      
      // Count pending photoshoots - check both advertiserId and userId fields
      const photoshootsRef = collection(db, 'photoshoot-bookings');
      let photoshootsPending = 0;
      
      try {
        // First try with advertiserId field
        const photoshootsQuery1 = query(
          photoshootsRef,
          where('advertiserId', '==', userId),
          where('status', '==', 'pending')
        );
        const photoshootsSnapshot1 = await getDocs(photoshootsQuery1);
        photoshootsPending = photoshootsSnapshot1.size;
        
        // Also check the userId field (older format)
        const photoshootsQuery2 = query(
          photoshootsRef,
          where('userId', '==', userId),
          where('status', '==', 'pending')
        );
        const photoshootsSnapshot2 = await getDocs(photoshootsQuery2);
        photoshootsPending += photoshootsSnapshot2.size;
      } catch (error) {
        console.error('Error fetching photoshoots:', error);
      }
      
      // Calculate referral earnings pending
      const referralsRef = collection(db, 'referrals');
      let referralEarningsPending = 0;
      
      try {
        // First check if user has a referral code
        const referralCode = userData.referralCode;
        
        if (referralCode) {
          // Look for referrals with this code
          const referralsQuery = query(
            referralsRef,
            where('referrerCode', '==', referralCode),
            where('status', '==', 'pending')
          );
          const referralsSnapshot = await getDocs(referralsQuery);
          
          referralsSnapshot.forEach(doc => {
            const referralData = doc.data();
            referralEarningsPending += referralData.amount || 0;
          });
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
      
      advertisers.push({
        id: userId,
        name: userData.displayName || userData.name || 'Unknown Advertiser',
        city: userData.city || 'Unknown',
        activePropertiesCount,
        bookingsThisMonth,
        referralEarningsPending,
        photoshootsPending,
        status: userData.isBlocked ? 'suspended' : 'active'
      });
    }
    
    return advertisers;
  } catch (error) {
    console.error('Error getting advertisers:', error);
    throw new Error('Failed to fetch advertisers');
  }
};

/**
 * Get advertiser by ID
 */
export const getAdvertiserById = async (advertiserId: string): Promise<Advertiser> => {
  try {
    const advertiserDoc = await getDoc(doc(db, 'users', advertiserId));
    
    if (!advertiserDoc.exists()) {
      throw new Error('Advertiser not found');
    }
    
    const userData = advertiserDoc.data();
    
    // Count active properties - use ownerId, not advertiserId
    const propertiesRef = collection(db, 'properties');
    const propertiesQuery = query(propertiesRef, where('ownerId', '==', advertiserId), where('status', '==', 'available'));
    const propertiesSnapshot = await getDocs(propertiesQuery);
    const activePropertiesCount = propertiesSnapshot.size;
    
    // Count bookings this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const bookingsRef = collection(db, 'bookings');
    let bookingsThisMonth = 0;
    
    try {
      const bookingsQuery = query(
        bookingsRef, 
        where('advertiserId', '==', advertiserId),
        where('status', '==', 'confirmed'),
        where('moveInDate', '>=', Timestamp.fromDate(firstDayOfMonth)),
        where('moveInDate', '<=', Timestamp.fromDate(lastDayOfMonth))
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      bookingsThisMonth = bookingsSnapshot.size;
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    
    // Count pending photoshoots - check both advertiserId and userId fields
    const photoshootsRef = collection(db, 'photoshoot-bookings');
    let photoshootsPending = 0;
    
    try {
      // First try with advertiserId field
      const photoshootsQuery1 = query(
        photoshootsRef,
        where('advertiserId', '==', advertiserId),
        where('status', '==', 'pending')
      );
      const photoshootsSnapshot1 = await getDocs(photoshootsQuery1);
      photoshootsPending = photoshootsSnapshot1.size;
      
      // Also check the userId field (older format)
      const photoshootsQuery2 = query(
        photoshootsRef,
        where('userId', '==', advertiserId),
        where('status', '==', 'pending')
      );
      const photoshootsSnapshot2 = await getDocs(photoshootsQuery2);
      photoshootsPending += photoshootsSnapshot2.size;
    } catch (error) {
      console.error('Error fetching photoshoots:', error);
    }
    
    // Calculate referral earnings pending
    const referralsRef = collection(db, 'referrals');
    let referralEarningsPending = 0;
    
    try {
      // First check if user has a referral code
      const referralCode = userData.referralCode;
      
      if (referralCode) {
        // Look for referrals with this code
        const referralsQuery = query(
          referralsRef,
          where('referrerCode', '==', referralCode),
          where('status', '==', 'pending')
        );
        const referralsSnapshot = await getDocs(referralsQuery);
        
        referralsSnapshot.forEach(doc => {
          const referralData = doc.data();
          referralEarningsPending += referralData.amount || 0;
        });
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
    
    return {
      id: advertiserId,
      name: userData.displayName || userData.name || 'Unknown Advertiser',
      city: userData.city || 'Unknown',
      activePropertiesCount,
      bookingsThisMonth,
      referralEarningsPending,
      photoshootsPending,
      status: userData.isBlocked ? 'suspended' : 'active'
    };
  } catch (error) {
    console.error('Error getting advertiser:', error);
    throw new Error('Failed to fetch advertiser');
  }
};

/**
 * Get bookings by advertiser ID
 */
export const getBookingsByAdvertiserId = async (advertiserId: string): Promise<AdvertiserBooking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('advertiserId', '==', advertiserId));
    const querySnapshot = await getDocs(q);
    
    const bookings: AdvertiserBooking[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const bookingData = docSnapshot.data();
      
      // Get tenant name
      let tenantName = 'Unknown Tenant';
      if (bookingData.userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', bookingData.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            tenantName = userData.displayName || userData.name || 'Unknown Tenant';
          }
        } catch (error) {
          console.error('Error fetching tenant:', error);
        }
      }
      
      // Format move-in date
      let moveInDateStr = 'Unknown';
      if (bookingData.moveInDate && bookingData.moveInDate.toDate) {
        const moveInDate = bookingData.moveInDate.toDate();
        moveInDateStr = moveInDate.toLocaleDateString();
      }
      
      // Map status
      let status: 'await-confirm' | 'confirmed' | 'safety-window-closed' = 'await-confirm';
      
      // Check the actual status in the database
      if (bookingData.status === 'confirmed' || bookingData.status === 'paid') {
        status = 'confirmed';
        
        // Check if safety window is closed
        const now = new Date();
        const moveInDate = bookingData.moveInDate?.toDate();
        if (moveInDate && now.getTime() - moveInDate.getTime() > 7 * 24 * 60 * 60 * 1000) { // 7 days
          status = 'safety-window-closed';
        }
      } else if (bookingData.status === 'pending' || bookingData.status === 'awaiting_payment') {
        status = 'await-confirm';
      }
      
      bookings.push({
        id: docSnapshot.id,
        tenantName,
        moveInDate: moveInDateStr,
        status,
        payoutPending: bookingData.payoutPending || bookingData.amount || 0
      });
    }
    
    return bookings;
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

/**
 * Get advertiser note
 */
export const getAdvertiserNote = async (advertiserId: string): Promise<string> => {
  try {
    const noteDoc = await getDoc(doc(db, 'advertiserNotes', advertiserId));
    
    if (noteDoc.exists()) {
      return noteDoc.data().note || '';
    }
    
    return '';
  } catch (error) {
    console.error('Error getting advertiser note:', error);
    throw new Error('Failed to fetch advertiser note');
  }
};

/**
 * Save advertiser note
 */
export const saveAdvertiserNote = async (advertiserId: string, note: string): Promise<void> => {
  try {
    await setDoc(doc(db, 'advertiserNotes', advertiserId), {
      note,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving advertiser note:', error);
    throw new Error('Failed to save advertiser note');
  }
};