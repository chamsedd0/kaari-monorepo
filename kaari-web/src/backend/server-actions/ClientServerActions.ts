import { User, Request, Property } from '../entities';
import { 
  getDocumentById, 
  getDocumentsByField,
  updateDocument,
  createDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { secureUploadMultipleFiles } from '../firebase/storage';
import { scheduleReviewPromptAfterMoveIn } from './ReviewManagementActions';

// Collection names
const USERS_COLLECTION = 'users';
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const REFUND_REQUESTS_COLLECTION = 'refundRequests';
const CANCELLATION_REQUESTS_COLLECTION = 'cancellationRequests';

// Function to get all client reservations
export async function getClientReservations(): Promise<any[]> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get all requests where userId matches the current user's ID
    const requests = await getDocumentsByField<Request>(
      REQUESTS_COLLECTION,
      'userId',
      currentUser.id
    );
    
    // For each request, fetch the associated property and advertiser data
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        let property = null;
        let advertiser = null;
        
        // Get property if propertyId exists
        if (request.propertyId) {
          property = await getDocumentById<Property>(
            PROPERTIES_COLLECTION,
            request.propertyId
          );
          
          // Get advertiser if property exists
          if (property && property.ownerId) {
            advertiser = await getDocumentById<User>(
              USERS_COLLECTION,
              property.ownerId
            );
          }
        }
        
        return {
          reservation: request,
          property,
          advertiser
        };
      })
    );
    
    return enrichedRequests;
  } catch (error) {
    console.error('Error fetching client reservations:', error);
    throw new Error('Failed to fetch client reservations');
  }
}

// Function to cancel a reservation
export async function cancelReservation(reservationId: string): Promise<void> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation belongs to the current user
    if (reservation.userId !== currentUser.id) {
      throw new Error('Not authorized to cancel this reservation');
    }
    
    // Update the reservation status to "cancelled"
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'cancelled',
      updatedAt: new Date()
    });
    
    return;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw error;
  }
}

// Add the function to mark a reservation as completed when the user moves in
export async function completeReservation(reservationId: string): Promise<void> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation belongs to the current user
    if (reservation.userId !== currentUser.id) {
      throw new Error('Not authorized to complete this reservation');
    }
    
    // Update the reservation status to "movedIn" with "moved_in" flag and timestamp
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'movedIn',
      movedIn: true,
      movedInAt: new Date(),
      updatedAt: new Date()
    });
    
    // Schedule a review prompt for 3 hours after moving in
    // This is done asynchronously to avoid blocking the main workflow
    scheduleReviewPromptAfterMoveIn(reservationId).catch(error => {
      console.error('Error scheduling review prompt:', error);
      // Non-blocking - doesn't affect the main workflow
    });
    
    return;
  } catch (error) {
    console.error('Error completing reservation:', error);
    throw error;
  }
}

/**
 * Securely upload proof files for refund requests
 */
export async function secureUploadProofFiles(
  userId: string,
  reservationId: string,
  files: File[]
): Promise<string[]> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Verify that the user is the one making the request
    if (currentUser.id !== userId) {
      throw new Error('Not authorized to upload files for another user');
    }
    
    // Upload all files using secure upload method
    const basePath = `users/${userId}/refund-proofs/${reservationId}`;
    const fileUrls = await secureUploadMultipleFiles(
      files,
      basePath,
      'proof_'
    );
    
    return fileUrls;
  } catch (error) {
    console.error('Error uploading proof files:', error);
    throw new Error('Failed to upload proof files');
  }
}

// Function to request a refund for a reservation
export async function requestRefund(
  reservationId: string,
  data?: {
    reasons: string[];
    details: string;
    proofUrls: string[];
    originalAmount: number;
    serviceFee: number;
    refundAmount: number;
    reasonsText: string;
    proofFiles?: File[]; // Add optional proofFiles parameter
  }
): Promise<void> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation belongs to the current user
    if (reservation.userId !== currentUser.id) {
      throw new Error('Not authorized to request refund for this reservation');
    }
    
    // Verify that the reservation is in "movedIn" status
    if (reservation.status !== 'movedIn') {
      throw new Error('Cannot request refund for a reservation that is not in moved-in status');
    }
    
    // Check if refund window is still open (24 hours after move-in)
    if (!reservation.movedInAt) {
      throw new Error('Move-in date not recorded, cannot determine refund eligibility');
    }
    
    const refundDeadline = new Date(reservation.movedInAt);
    refundDeadline.setHours(refundDeadline.getHours() + 24);
    
    if (new Date() > refundDeadline) {
      throw new Error('Refund window has closed. Cannot request refund after 24 hours of moving in.');
    }
    
    // Update the reservation status to "refundProcessing"
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'refundProcessing',
      updatedAt: new Date()
    });
    
    // If additional data is provided, create a refund request record
    if (data) {
      // Upload proof files if provided
      let proofUrls = data.proofUrls;
      if (data.proofFiles && data.proofFiles.length > 0) {
        // Use secure upload function to upload proof files
        proofUrls = await secureUploadProofFiles(currentUser.id, reservationId, data.proofFiles);
      }
      
      await createDocument(REFUND_REQUESTS_COLLECTION, {
        reservationId,
        userId: currentUser.id,
        reasons: data.reasons,
        reasonsText: data.reasonsText,
        details: data.details,
        proofUrls: proofUrls,
        requestedRefundAmount: data.refundAmount,
        originalAmount: data.originalAmount,
        serviceFee: data.serviceFee,
        propertyId: reservation.propertyId,
        status: 'pending',
        adminReviewed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Change property status to 'available'
    if (reservation.propertyId) {
      await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
        status: 'available',
        updatedAt: new Date()
      });
    }
    
    return;
  } catch (error) {
    console.error('Error requesting refund:', error);
    throw error;
  }
}

// Function to process standard cancellation (immediate approval)
export async function processStandardCancellation(data: {
  reservationId: string;
  reason: string;
  daysToMoveIn: number;
  refundAmount: number;
  originalAmount: number;
  serviceFee: number;
  cancellationFee: number;
}): Promise<void> {
  try {
    const { reservationId, reason, daysToMoveIn, refundAmount, originalAmount, serviceFee, cancellationFee } = data;
    
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation belongs to the current user
    if (reservation.userId !== currentUser.id) {
      throw new Error('Not authorized to cancel this reservation');
    }
    
    // 1. Update the reservation status to refundProcessing
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'refundProcessing',
      updatedAt: new Date()
    });
    
    // 2. Create a refund request record
    await createDocument(REFUND_REQUESTS_COLLECTION, {
      reservationId,
      userId: currentUser.id,
      reason,
      amount: refundAmount,
      originalAmount,
      serviceFee,
      cancellationFee,
      daysToMoveIn,
      propertyId: reservation.propertyId,
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // 3. If property exists, update its status to available
    if (reservation.propertyId) {
      await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
        status: 'available',
        updatedAt: new Date()
      });
    }
    
    return;
  } catch (error) {
    console.error('Error processing standard cancellation:', error);
    throw error;
  }
}

// Function to request exception cancellation (needs review)
export async function requestExceptionCancellation(data: {
  reservationId: string;
  reason: string;
  details: string;
  proofUrls: string[];
  daysToMoveIn: number;
  refundAmount: number;
  originalAmount: number;
  serviceFee: number;
  cancellationFee: number;
}): Promise<void> {
  try {
    const { 
      reservationId, 
      reason, 
      details, 
      proofUrls, 
      daysToMoveIn, 
      refundAmount,
      originalAmount,
      serviceFee,
      cancellationFee
    } = data;
    
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation belongs to the current user
    if (reservation.userId !== currentUser.id) {
      throw new Error('Not authorized to request exception for this reservation');
    }
    
    // 1. Update the reservation status to cancellationUnderReview
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'cancellationUnderReview',
      updatedAt: new Date()
    });
    
    // 2. Create a cancellation request record
    await createDocument(CANCELLATION_REQUESTS_COLLECTION, {
      reservationId,
      userId: currentUser.id,
      reason,
      details,
      proofUrls,
      daysToMoveIn,
      requestedRefundAmount: refundAmount,
      originalAmount,
      serviceFee,
      cancellationFee,
      propertyId: reservation.propertyId,
      status: 'pending',
      adminReviewed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // 3. If property exists, update its status to available
    if (reservation.propertyId) {
      await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
        status: 'available',
        updatedAt: new Date()
      });
    }
    
    return;
  } catch (error) {
    console.error('Error requesting exception cancellation:', error);
    throw error;
  }
}

// Function to process a refund (admin/advertiser only)
export async function processRefund(
  reservationId: string, 
  approved: boolean, 
  adminNotes?: string
): Promise<void> {
  try {
    // Check if user is authenticated as admin or advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'admin' && currentUser.role !== 'advertiser') {
      throw new Error('Only admins and advertisers can process refunds');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation is in "refundProcessing" status
    if (reservation.status !== 'refundProcessing') {
      throw new Error('Cannot process refund for a reservation that is not in refund processing');
    }
    
    // Update property status if refund is approved
    if (approved) {
      if (reservation.propertyId) {
        await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
          status: 'available',
          updatedAt: new Date()
        });
      }
      
      // Update the reservation status to "refundCompleted"
      await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
        status: 'refundCompleted',
        updatedAt: new Date(),
        message: reservation.message + (adminNotes ? `\n\nAdmin Notes: ${adminNotes}` : '')
      });
    } else {
      // Update the reservation status to "refundFailed"
      await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
        status: 'refundFailed',
        updatedAt: new Date(),
        message: reservation.message + (adminNotes ? `\n\nAdmin Notes: ${adminNotes}` : '')
      });
    }
    
    return;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
} 