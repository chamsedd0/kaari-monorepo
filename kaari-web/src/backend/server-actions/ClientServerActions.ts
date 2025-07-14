import { User, Request, Property } from '../entities';
import { 
  getDocumentById, 
  getDocumentsByField,
  updateDocument,
  createDocument,
  deleteDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { secureUploadMultipleFiles } from '../firebase/storage';
import { scheduleReviewPromptAfterMoveIn } from './ReviewManagementActions';
import { advertiserNotifications, userNotifications } from '../../utils/notification-helpers';

// Collection names
const USERS_COLLECTION = 'users';
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const REFUND_REQUESTS_COLLECTION = 'refundRequests';
const CANCELLATION_REQUESTS_COLLECTION = 'cancellationRequests';
const SAVED_PROPERTIES_COLLECTION = 'savedProperties';

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
    
    // Send notification to the advertiser about the cancellation
    try {
      if (reservation.propertyId) {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property && property.ownerId) {
          // Create client name for the notification
          const clientName = currentUser.name && currentUser.surname 
            ? `${currentUser.name} ${currentUser.surname}` 
            : currentUser.email || 'A client';
            
          // Create a reservation object for notification
          const reservationForNotification = {
            id: reservationId,
            propertyId: reservation.propertyId,
            propertyTitle: property.title || 'Property',
            clientId: currentUser.id,
            clientName,
            advertiserId: property.ownerId,
            status: 'cancelled'
          };
          
          // Send notification to the advertiser
          await advertiserNotifications.reservationCancelled(
            property.ownerId,
            reservationForNotification as any
          );
          
          console.log(`Cancellation notification sent to advertiser: ${property.ownerId}`);
        }
      }
    } catch (notifError) {
      console.error('Error sending cancellation notification:', notifError);
      // Don't throw error, just log it (non-critical)
    }
    
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
    const moveInDate = new Date();
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'movedIn',
      movedIn: true,
      movedInAt: moveInDate,
      updatedAt: new Date()
    });
    
    // Schedule discount finalization after refund window passes
    try {
      // Import discount finalization service dynamically to avoid circular dependencies
      const discountFinalizationService = (await import('../../services/DiscountFinalizationService')).default;
      discountFinalizationService.scheduleDiscountFinalization(reservationId, moveInDate);
    } catch (discountErr) {
      console.error('Error scheduling discount finalization:', discountErr);
      // Non-blocking - doesn't affect the main workflow
    }
    
    // Schedule a review prompt for 3 hours after moving in
    // This is done asynchronously to avoid blocking the main workflow
    scheduleReviewPromptAfterMoveIn(reservationId).catch(error => {
      console.error('Error scheduling review prompt:', error);
      // Non-blocking - doesn't affect the main workflow
    });
    
    // Send notification to the advertiser about the move-in
    try {
      if (reservation.propertyId) {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property && property.ownerId) {
          // Create client name for the notification
          const clientName = currentUser.name && currentUser.surname 
            ? `${currentUser.name} ${currentUser.surname}` 
            : currentUser.email || 'A client';
            
          // Create a reservation object for notification
          const reservationForNotification = {
            id: reservationId,
            propertyId: reservation.propertyId,
            propertyTitle: property.title || 'Property',
            clientId: currentUser.id,
            clientName,
            advertiserId: property.ownerId,
            status: 'movedIn'
          };
          
          // Send notification to the advertiser
          await advertiserNotifications.clientMovedIn(
            property.ownerId,
            reservationForNotification as any
          );
          
          // Send confirmation to the client
          await userNotifications.moveInConfirmation(
            currentUser.id,
            reservationForNotification as any
          );
          
          console.log(`Move-in notification sent to advertiser: ${property.ownerId}`);
        }
      }
    } catch (notifError) {
      console.error('Error sending move-in notification:', notifError);
      // Don't throw error, just log it (non-critical)
    }
    
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
      
      // Send notification to the property owner about refund request
      try {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property && property.ownerId) {
          // Create client name for the notification
          const clientName = currentUser.name && currentUser.surname 
            ? `${currentUser.name} ${currentUser.surname}` 
            : currentUser.email || 'A client';
          
          // Send notification to advertiser using the helper function
          await advertiserNotifications.refundRequested(
            property.ownerId,
            clientName,
            property.title || 'Property',
            reservation.propertyId,
            reservationId,
            data?.refundAmount
          );
          
          console.log(`Refund request notification sent to advertiser: ${property.ownerId}`);
        }
      } catch (notifError) {
        console.error('Error sending refund request notification:', notifError);
        // Don't throw error, just log it (non-critical)
      }
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
      
      // 4. Send notification to the property owner about standard cancellation
      try {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property && property.ownerId) {
          // Create client name for the notification
          const clientName = currentUser.name && currentUser.surname 
            ? `${currentUser.name} ${currentUser.surname}` 
            : currentUser.email || 'A client';
            
          // Create a reservation object for notification
          const reservationForNotification = {
            id: reservationId,
            propertyId: reservation.propertyId,
            propertyTitle: property.title || 'Property',
            clientId: currentUser.id,
            clientName,
            advertiserId: property.ownerId,
            status: 'refundProcessing'
          };
          
          // Send notification to the advertiser
          await advertiserNotifications.reservationCancelled(
            property.ownerId,
            reservationForNotification as any
          );
          
          console.log(`Standard cancellation notification sent to advertiser: ${property.ownerId}`);
        }
      } catch (notifError) {
        console.error('Error sending standard cancellation notification:', notifError);
        // Don't throw error, just log it (non-critical)
      }
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
      
      // 4. Send notification to the property owner about cancellation under review
      try {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property && property.ownerId) {
          // Create client name for the notification
          const clientName = currentUser.name && currentUser.surname 
            ? `${currentUser.name} ${currentUser.surname}` 
            : currentUser.email || 'A client';
            
          // Create a reservation object for notification
          const reservationForNotification = {
            id: reservationId,
            propertyId: reservation.propertyId,
            propertyTitle: property.title || 'Property',
            clientId: currentUser.id,
            clientName,
            advertiserId: property.ownerId,
            status: 'cancellationUnderReview'
          };
          
          // Send notification to the advertiser
          await advertiserNotifications.cancellationUnderReview(
            property.ownerId,
            reservationForNotification as any
          );
          
          console.log(`Exception cancellation notification sent to advertiser: ${property.ownerId}`);
        }
      } catch (notifError) {
        console.error('Error sending exception cancellation notification:', notifError);
        // Don't throw error, just log it (non-critical)
      }
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
    
    // Send notification to the client about refund request result
    try {
      if (reservation.propertyId) {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property) {
          // Create reservation object for notification
          const reservationForNotification = {
            id: reservationId,
            propertyId: reservation.propertyId,
            propertyTitle: property.title || 'Property',
            status: approved ? 'refundCompleted' : 'refundFailed'
          };
          
          // Send notification to the client
          await userNotifications.refundRequestHandled(
            reservation.userId,
            reservationForNotification as any,
            approved,
            adminNotes || ''
          );
          
          console.log(`Refund processing notification sent to client: ${reservation.userId}`);
        }
      }
    } catch (notifError) {
      console.error('Error sending refund processing notification:', notifError);
      // Don't throw error, just log it (non-critical)
    }
    
    return;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}

// Function to process a cancellation request (admin/advertiser only)
export async function processCancellation(
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
      throw new Error('Only admins and advertisers can process cancellation requests');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation is in "cancellationUnderReview" status
    if (reservation.status !== 'cancellationUnderReview') {
      throw new Error('Cannot process cancellation for a reservation that is not under review');
    }
    
    // If approved, cancel the reservation and set status to cancelled
    if (approved) {
      // Update the reservation status
      await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
        status: 'cancelled',
        updatedAt: new Date(),
        message: reservation.message + (adminNotes ? `\n\nAdmin Notes: ${adminNotes}` : '')
      });
      
      // Change property status back to 'available'
      if (reservation.propertyId) {
        await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
          status: 'available',
          updatedAt: new Date()
        });
      }
    } else {
      // If rejected, revert to previous status
      const previousStatus = reservation.paymentMethodId ? 'paid' : 'accepted'; // Determine previous status
      
      // Update the reservation status
      await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
        status: previousStatus,
        updatedAt: new Date(),
        message: reservation.message + (adminNotes ? `\n\nAdmin Notes: ${adminNotes}` : '')
      });
    }
    
    // Send notification to the client about cancellation request decision
    try {
      if (reservation.propertyId) {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property) {
          // Determine status to include in notification
          const finalStatus = approved ? 'cancelled' : (reservation.paymentMethodId ? 'paid' : 'accepted');
          
          // Create reservation object for notification
          const reservationData = {
            id: reservationId,
            propertyId: reservation.propertyId,
            propertyTitle: property.title || 'Property',
            status: finalStatus
          };
          
          // Send notification to the client
          await userNotifications.cancellationRequestHandled(
            reservation.userId,
            reservationData as any,
            approved,
            adminNotes || (approved ? 'Your cancellation was approved' : 'Your cancellation was not approved')
          );
          
          console.log(`Cancellation handling notification sent to client: ${reservation.userId}`);
        }
      }
    } catch (notifError) {
      console.error('Error sending cancellation handling notification:', notifError);
      // Don't throw error, just log it (non-critical)
    }
    
    return;
  } catch (error) {
    console.error('Error processing cancellation:', error);
    throw error;
  }
}

// Function to process payment for an accepted reservation
export async function processPayment(reservationId: string): Promise<void> {
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
      throw new Error('Not authorized to process payment for this reservation');
    }
    
    // Verify that the reservation is in 'accepted' status
    if (reservation.status !== 'accepted') {
      throw new Error('Cannot process payment for a reservation that is not accepted');
    }
    
    // Check if payment deadline has passed (24 hours after acceptance)
    const paymentDeadline = new Date(reservation.updatedAt);
    paymentDeadline.setHours(paymentDeadline.getHours() + 24);
    
    if (new Date() > paymentDeadline) {
      throw new Error('Payment deadline has passed. Please contact the advertiser to extend the reservation.');
    }
    
    // In a real application, you would:
    // 1. Retrieve the payment method details from the reservation
    // 2. Make a call to your payment processor to charge the card
    // 3. Update the reservation status based on payment success/failure
    
    // For this implementation, we'll simulate a successful payment
    
    // Update the reservation status to "paid"
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'paid',
      updatedAt: new Date()
    });
    
    // Send notifications about the payment
    try {
      if (reservation.propertyId) {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property && property.ownerId) {
          // Create client name for the notification
          const clientName = currentUser.name && currentUser.surname 
            ? `${currentUser.name} ${currentUser.surname}` 
            : currentUser.email || 'A client';
            
          // Create a reservation object for notification
          const reservationForNotification = {
            id: reservationId,
            propertyId: reservation.propertyId,
            propertyTitle: property.title || 'Property',
            clientId: currentUser.id,
            clientName,
            advertiserId: property.ownerId,
            status: 'paid',
            // Add payment details if available
            totalPrice: reservation.totalPrice
          };
          
          // Send notification to the advertiser
          await advertiserNotifications.paymentConfirmed(
            property.ownerId,
            reservationForNotification as any
          );
          
          // Send confirmation to the client
          await userNotifications.paymentConfirmation(
            currentUser.id,
            reservationForNotification as any
          );
          
          console.log(`Payment notifications sent to advertiser and client`);
        }
      }
    } catch (notifError) {
      console.error('Error sending payment notifications:', notifError);
      // Don't throw error, just log it (non-critical)
    }
    
    return;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}

// Function to get all saved properties for the current client
export async function getSavedProperties(): Promise<{ propertyId: string }[]> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Query saved properties collection for documents with the current user's ID
    const savedProperties = await getDocumentsByField<{ propertyId: string }>(
      SAVED_PROPERTIES_COLLECTION,
      'userId',
      currentUser.id
    );
    
    return savedProperties;
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    throw new Error('Failed to fetch saved properties');
  }
}

// Function to toggle a property as saved/favorite
export async function toggleSavedProperty(propertyId: string): Promise<boolean> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Check if property is already saved
    const savedProperties = await getDocumentsByField<{ id: string, propertyId: string }>(
      SAVED_PROPERTIES_COLLECTION,
      'userId',
      currentUser.id
    );
    
    const existingSaved = savedProperties.find(sp => sp.propertyId === propertyId);
    
    if (existingSaved) {
      // If already saved, remove it (un-favorite)
      await deleteDocument(SAVED_PROPERTIES_COLLECTION, existingSaved.id);
      return false; // Indicates property was removed from favorites
    } else {
      // If not saved, add it to saved properties
      await createDocument(SAVED_PROPERTIES_COLLECTION, {
        userId: currentUser.id,
        propertyId,
        createdAt: new Date()
      });
      
      // Send notification to property owner about property being favorited
      try {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
        if (property && property.ownerId) {
          // Create client name for the notification
          const clientName = currentUser.name && currentUser.surname 
            ? `${currentUser.name} ${currentUser.surname}` 
            : currentUser.email || 'A client';
            
          // Send notification to advertiser
          await advertiserNotifications.propertyLiked(
            property.ownerId,
            clientName,
            property.title || 'Property',
            propertyId
          );
          
          console.log(`Property liked notification sent to advertiser: ${property.ownerId}`);
        }
      } catch (notifError) {
        console.error('Error sending property liked notification:', notifError);
        // Don't throw error, just log it (non-critical)
      }
      
      return true; // Indicates property was added to favorites
    }
  } catch (error) {
    console.error('Error toggling saved property:', error);
    throw new Error('Failed to toggle saved property');
  }
}

// Function to check if a property is already saved by the current user
export async function isPropertySaved(propertyId: string): Promise<boolean> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      return false; // Not authenticated, so not saved
    }
    
    // Query saved properties collection for the specific property
    const savedProperties = await getDocumentsByField<{ propertyId: string }>(
      SAVED_PROPERTIES_COLLECTION,
      'userId',
      currentUser.id
    );
    
    // Check if the propertyId exists in the saved properties
    return savedProperties.some(sp => sp.propertyId === propertyId);
  } catch (error) {
    console.error('Error checking if property is saved:', error);
    return false; // Default to false in case of error
  }
} 