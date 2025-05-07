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

// Interface for refund request
export interface RefundRequest {
  id: string;
  userId: string;
  userName: string;
  propertyId: string;
  propertyName: string;
  reservationId: string;
  amount: number;
  requestDate: any; // Timestamp
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  moveInDate: any; // Timestamp
  movedInDate: any; // Timestamp
  requestDetails: string;
  cancellationRequestId?: string; // Optional reference to the original cancellation request
  createdAt?: any; // Timestamp
  updatedAt?: any; // Timestamp
  createdBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
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
    console.log('Fetching refund requests');
    const refundRequestsRef = collection(db, 'refundRequests');
    const q = query(refundRequestsRef, orderBy('requestDate', 'desc'));
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
          rejectedBy: data.rejectedBy || undefined
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
    
    // Update the refund request status
    await updateDoc(refundRequestRef, {
      status: 'approved',
      updatedAt: serverTimestamp(),
      approvedAt: serverTimestamp(),
      approvedBy: auth.currentUser?.uid
    });
    
    // Update the reservation status if it exists
    if (refundData.reservationId) {
      const reservationRef = doc(db, 'reservations', refundData.reservationId);
      const reservationDoc = await getDoc(reservationRef);
      
      if (reservationDoc.exists()) {
        await updateDoc(reservationRef, {
          status: 'refundComplete',
          updatedAt: serverTimestamp(),
          statusHistory: arrayUnion({
            status: 'refundComplete',
            timestamp: now,
            updatedBy: auth.currentUser?.uid
          })
        });
        
        // Create a refund payment record (for tracking purposes)
        const refundsRef = collection(db, 'refunds');
        const newRefundRef = doc(refundsRef);
        await setDoc(newRefundRef, {
          userId: refundData.userId,
          reservationId: refundData.reservationId,
          propertyId: refundData.propertyId,
          refundRequestId: refundRequestId,
          amount: refundData.amount,
          reason: refundData.reason || 'Refund approved by admin',
          status: 'completed',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          processedBy: auth.currentUser?.uid
        });
        
        console.log(`Refund record created with ID: ${newRefundRef.id}`);
      } else {
        console.log(`Reservation ${refundData.reservationId} not found. Only the refund request status has been updated.`);
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
        
        console.log(`Updated related cancellation request ${refundData.cancellationRequestId} with refund status`);
      }
    }
    
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
      const reservationRef = doc(db, 'reservations', refundData.reservationId);
      const reservationDoc = await getDoc(reservationRef);
      
      if (reservationDoc.exists()) {
        await updateDoc(reservationRef, {
          status: 'refundFailed',
          updatedAt: serverTimestamp(),
          statusHistory: arrayUnion({
            status: 'refundFailed',
            timestamp: now,
            updatedBy: auth.currentUser?.uid
          })
        });
        
        console.log(`Updated reservation ${refundData.reservationId} status to refundFailed`);
      } else {
        console.log(`Reservation ${refundData.reservationId} not found. Only the refund request status has been updated.`);
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
    
    // Now check if the reservation exists before attempting to update it
    if (cancellationData.reservationId) {
      const reservationRef = doc(db, 'reservations', cancellationData.reservationId);
      const reservationDoc = await getDoc(reservationRef);
      
      if (reservationDoc.exists()) {
        // Update reservation status to refundProcessing instead of cancelled
        await updateDoc(reservationRef, {
          status: 'refundProcessing',
          updatedAt: serverTimestamp(),
          statusHistory: arrayUnion({
            status: 'refundProcessing',
            timestamp: now,
            updatedBy: auth.currentUser?.uid
          })
        });
        
        // Create a refund request based on the cancellation request
        const refundRequestsRef = collection(db, 'refundRequests');
        const newRefundRequestRef = doc(refundRequestsRef);
        
        await setDoc(newRefundRequestRef, {
          userId: cancellationData.userId,
          propertyId: cancellationData.propertyId,
          reservationId: cancellationData.reservationId,
          amount: cancellationData.requestedRefundAmount || cancellationData.originalAmount - cancellationData.cancellationFee,
          requestDate: serverTimestamp(),
          status: 'pending',
          reason: `Auto-generated from approved cancellation request: ${cancellationRequestId}`,
          moveInDate: null,
          movedInDate: null,
          requestDetails: cancellationData.details || 'Cancellation approved by admin',
          cancellationRequestId: cancellationRequestId, // Reference to the original cancellation request
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid
        });
        
        console.log(`Created refund request ${newRefundRequestRef.id} from cancellation request ${cancellationRequestId}`);
      } else {
        console.log(`Reservation ${cancellationData.reservationId} not found. Only the cancellation request status has been updated.`);
      }
    }
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
    
    // Optional: Update the reservation to indicate the cancellation was rejected
    // This keeps the reservation in its original state but adds a history entry
    if (cancellationData.reservationId) {
      const reservationRef = doc(db, 'reservations', cancellationData.reservationId);
      const reservationDoc = await getDoc(reservationRef);
      
      if (reservationDoc.exists()) {
        await updateDoc(reservationRef, {
          updatedAt: serverTimestamp(),
          statusHistory: arrayUnion({
            status: 'cancellationRejected',
            timestamp: now,
            updatedBy: auth.currentUser?.uid
          })
        });
      } else {
        console.log(`Reservation ${cancellationData.reservationId} not found. Only the cancellation request status has been updated.`);
      }
    }
    
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