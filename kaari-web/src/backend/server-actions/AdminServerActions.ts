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

/**
 * Get all refund requests
 */
export const getRefundRequests = async (): Promise<RefundRequest[]> => {
  try {
    const refundRequestsRef = collection(db, 'refundRequests');
    const q = query(refundRequestsRef);
    const querySnapshot = await getDocs(q);
    
    
    if (querySnapshot.docs.length === 0) {
      return []; // Return empty array instead of continuing
    }
    
    const refundRequests: RefundRequest[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data() as Record<string, any>;
      
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
    const cancellationRequestsRef = collection(db, 'cancellationRequests');
    const q = query(cancellationRequestsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    
    if (querySnapshot.docs.length === 0) {
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
    
    // Update the refund request status
    await updateDoc(refundRequestRef, {
      status: 'approved',
      updatedAt: serverTimestamp(),
      approvedAt: serverTimestamp(),
      approvedBy: auth.currentUser?.uid
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
            status: 'refundComplete',
            updatedAt: serverTimestamp(),
          });
          
          // Determine the refund amount - try multiple fields with fallback
          // This ensures we always have a valid numeric value
          const refundAmount = 
            (typeof refundData.amount === 'number' && !isNaN(refundData.amount)) ? refundData.amount : 
            (typeof refundData.requestedRefundAmount === 'number' && !isNaN(refundData.requestedRefundAmount)) ? refundData.requestedRefundAmount : 
            (typeof refundData.originalAmount === 'number' && !isNaN(refundData.originalAmount)) ? refundData.originalAmount * 0.5 : 
            0; // Default to 0 if no valid amount found
          
          // Create a refund payment record (for tracking purposes)
          const refundsRef = collection(db, 'refunds');
          const newRefundRef = doc(refundsRef);
          await setDoc(newRefundRef, {
            userId: refundData.userId,
            reservationId: refundData.reservationId,
            propertyId: refundData.propertyId,
            refundRequestId: refundRequestId,
            amount: refundAmount, // Use the determined amount that will never be undefined
            reason: refundData.reason || refundData.reasonsText || 'Refund approved by admin',
            status: 'completed',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            processedBy: auth.currentUser?.uid
          });
          
        } else {
        }
      } else {
        // Found in 'requests' collection
        reservationData = reservationDoc.data();
        await updateDoc(reservationRef, {
          status: 'refundComplete',
          updatedAt: serverTimestamp(),
        });
        
        // Determine the refund amount - try multiple fields with fallback
        // This ensures we always have a valid numeric value
        const refundAmount = 
          (typeof refundData.amount === 'number' && !isNaN(refundData.amount)) ? refundData.amount : 
          (typeof refundData.requestedRefundAmount === 'number' && !isNaN(refundData.requestedRefundAmount)) ? refundData.requestedRefundAmount : 
          (typeof refundData.originalAmount === 'number' && !isNaN(refundData.originalAmount)) ? refundData.originalAmount * 0.5 : 
          0; // Default to 0 if no valid amount found
        
        // Create a refund payment record (for tracking purposes)
        const refundsRef = collection(db, 'refunds');
        const newRefundRef = doc(refundsRef);
        await setDoc(newRefundRef, {
          userId: refundData.userId,
          reservationId: refundData.reservationId,
          propertyId: refundData.propertyId,
          refundRequestId: refundRequestId,
          amount: refundAmount, // Use the determined amount that will never be undefined
          reason: refundData.reason || refundData.reasonsText || 'Refund approved by admin',
          status: 'completed',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          processedBy: auth.currentUser?.uid
        });
        
      }
      
      // Send notification to the user about the approved refund
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
            status: 'refundComplete'
          };
          
          await userNotifications.refundRequestHandled(
            refundData.userId,
            reservationForNotification as any,
            true, // approved
            refundData.reason || refundData.reasonsText || 'Your refund request has been approved.'
          );
          
        } catch (notifError) {
          console.error('Error sending refund approved notification:', notifError);
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
          refundStatus: 'completed',
          updatedAt: serverTimestamp()
        });
        
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
          
        } else {
        }
      } else {
        // Found in 'requests' collection
        reservationData = reservationDoc.data();
        await updateDoc(reservationRef, {
          status: 'refundFailed',
          updatedAt: serverTimestamp(),
        });
        
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
          
        } else {
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
        } else {
        }
      } else {
        // Found in 'requests' collection
        reservationData = reservationDoc.data();
        await updateDoc(reservationRef, {
          status: 'cancelled',
          updatedAt: serverTimestamp(),
        });
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
    
    
    return newRequestRef.id;
  } catch (error) {
    console.error('Error creating sample cancellation request:', error);
    throw new Error('Failed to create sample cancellation request');
  }
};