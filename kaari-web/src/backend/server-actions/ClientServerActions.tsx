'use server';

import { User, Request, Property } from '../entities';
import { 
  getDocumentById, 
  getDocumentsByField,
  queryDocuments,
  updateDocument,
  deleteDocument,
  createDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { getRequestsByUser } from './RequestServerActions';
import { advertiserNotifications, userNotifications } from '../../utils/notification-helpers';

// Collection names
const REQUESTS_COLLECTION = 'requests';
const USERS_COLLECTION = 'users';
const PROPERTIES_COLLECTION = 'properties';
const SAVED_PROPERTIES_COLLECTION = 'savedProperties';

/**
 * Get all reservations (viewing requests) for the current client user
 */
export async function getClientReservations(): Promise<{
  reservation: Request;
  property?: Property | null;
  advertiser?: User | null;
}[]> {
  try {
    // Check if user is authenticated and a client
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'client') {
      throw new Error('Only clients can access their reservations');
    }
    
    // Get all requests by this user that are of type 'rent'
    const requests = await getRequestsByUser(currentUser.id);
    const rentRequests = requests.filter(req => req.requestType === 'rent');
    
    // For each request, get associated property and advertiser info
    const reservationsWithDetails = await Promise.all(
      rentRequests.map(async (request) => {
        let property = null;
        let advertiser = null;
        
        // If request has a property ID, get the property directly
        if (request.propertyId) {
          property = await getDocumentById<Property>(PROPERTIES_COLLECTION, request.propertyId);
          
          // If property found, get the owner
          if (property) {
            advertiser = await getDocumentById<User>(USERS_COLLECTION, property.ownerId);
          }
        }
        
        return {
          reservation: request,
          property,
          advertiser
        };
      })
    );
    
    return reservationsWithDetails;
  } catch (error) {
    console.error('Error fetching client reservations:', error);
    throw new Error('Failed to fetch client reservations');
  }
}

/**
 * Cancel a reservation
 */
export async function cancelReservation(reservationId: string): Promise<boolean> {
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
    
    // Update the reservation status to 'cancelled' for pending reservations
    // For accepted reservations, set to 'cancellationUnderReview'
    if (reservation.status === 'pending') {
      await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
        status: 'cancelled',
        updatedAt: new Date()
      });
    } else {
      await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
        status: 'cancellationUnderReview',
        updatedAt: new Date()
      });
    }
    
    // Change property status back to 'available' when reservation is cancelled
    // Only do this for 'pending' reservations - for others, admin needs to approve the cancellation
    if (reservation.status === 'pending' && reservation.propertyId) {
      await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
        status: 'available',
        updatedAt: new Date()
      });
    }
    
    // Get property details for notification
    if (reservation.propertyId) {
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
      if (property) {
        // Create a reservation object for notification
        const clientName = currentUser.name && currentUser.surname 
          ? `${currentUser.name} ${currentUser.surname}` 
          : currentUser.email || 'A client';
          
        const reservationForNotification = {
          id: reservationId,
          propertyId: reservation.propertyId,
          propertyTitle: property.title || 'Property',
          advertiserId: property.ownerId,
          clientId: currentUser.id,
          clientName,
          status: reservation.status
        };
        
        // Send notification to the advertiser about the cancellation
        try {
          await advertiserNotifications.reservationCancelled(
            property.ownerId,
            reservationForNotification as any
          );
        } catch (notifError) {
          console.error('Error sending cancellation notification:', notifError);
          // Don't throw error, just log it (non-critical)
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw new Error('Failed to cancel reservation');
  }
}

/**
 * Get client dashboard statistics
 */
export async function getClientStatistics(): Promise<{
  reservationsCount: number;
  pendingReservations: number;
  approvedReservations: number;
  rejectedReservations: number;
  paidReservations: number;
  movedInReservations: number;
  refundedReservations: number;
  cancelledReservations: number;
  underReviewReservations: number;
  savedPropertiesCount: number;
}> {
  try {
    // Check if user is authenticated and a client
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'client') {
      throw new Error('Only clients can access their dashboard statistics');
    }
    
    // Get all rent requests by this user
    const requests = await getRequestsByUser(currentUser.id);
    const rentRequests = requests.filter(req => req.requestType === 'rent');
    
    // Calculate statistics
    const pendingReservations = rentRequests.filter(req => req.status === 'pending').length;
    const approvedReservations = rentRequests.filter(req => req.status === 'accepted').length;
    const rejectedReservations = rentRequests.filter(req => req.status === 'rejected').length;
    const paidReservations = rentRequests.filter(req => req.status === 'paid').length;
    const movedInReservations = rentRequests.filter(req => req.status === 'movedIn').length;
    const refundedReservations = rentRequests.filter(req => 
      req.status === 'refundCompleted' || 
      req.status === 'refundProcessing' || 
      req.status === 'refundFailed'
    ).length;
    const cancelledReservations = rentRequests.filter(req => req.status === 'cancelled').length;
    const underReviewReservations = rentRequests.filter(req => req.status === 'cancellationUnderReview').length;
    
    // Get saved properties count
    const savedProperties = await getSavedProperties();
    
    return {
      reservationsCount: rentRequests.length,
      pendingReservations,
      approvedReservations,
      rejectedReservations,
      paidReservations,
      movedInReservations,
      refundedReservations,
      cancelledReservations,
      underReviewReservations,
      savedPropertiesCount: savedProperties.length
    };
  } catch (error) {
    console.error('Error fetching client statistics:', error);
    throw new Error('Failed to fetch client statistics');
  }
}

/**
 * Process payment for an accepted reservation
 * This is called when the tenant confirms payment after advertiser acceptance
 */
export async function processPayment(reservationId: string): Promise<boolean> {
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
    
    // Send notification to the advertiser about the payment
    try {
      if (reservation.propertyId) {
        const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
        if (property) {
          const clientName = currentUser.name && currentUser.surname 
            ? `${currentUser.name} ${currentUser.surname}` 
            : currentUser.email || 'A client';
            
          // Import NotificationService dynamically to avoid circular dependencies
          const NotificationService = (await import('../../services/NotificationService')).default;
          
          // Send notification to the advertiser
          await NotificationService.createNotification(
            property.ownerId,
            'advertiser',
            'payment_confirmed',
            'Payment Received',
            `${clientName} has completed payment for their reservation.`,
            `/dashboard/advertiser/reservations`,
            { 
              reservationId: reservationId, 
              propertyId: reservation.propertyId,
              status: 'paid'
            }
          );
          
          // Also send a confirmation to the client
          await NotificationService.createNotification(
            currentUser.id,
            'user',
            'payment_confirmation',
            'Payment Confirmed',
            `Your payment for ${property.title || 'Property'} has been successfully processed.`,
            `/dashboard/user/reservations`,
            { 
              reservationId: reservationId, 
              propertyId: reservation.propertyId,
              status: 'paid'
            }
          );
          
          console.log(`Payment notifications sent to advertiser and client`);
        }
      }
    } catch (notifError) {
      console.error('Error sending payment notification:', notifError);
      // Don't throw error here so the main action can still succeed
    }
    
    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment');
  }
}

/**
 * Process a cancellation request (admin/advertiser only)
 */
export async function processCancellation(
  reservationId: string, 
  approved: boolean, 
  adminNotes?: string
): Promise<boolean> {
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
        }
      }
    } catch (notifError) {
      console.error('Error sending cancellation handling notification:', notifError);
      // Don't throw error, just log it (non-critical)
    }
    
    return true;
  } catch (error) {
    console.error('Error processing cancellation:', error);
    throw new Error('Failed to process cancellation');
  }
}

/**
 * Get all favorite properties for the current client user
 */
export async function getFavoriteProperties(): Promise<Property[]> {
  try {
    const savedPropertiesData = await getSavedProperties();
    
    if (!savedPropertiesData.length) {
      return [];
    }
    
    // Extract property IDs from saved properties data
    const propertyIds = savedPropertiesData.map(savedProperty => savedProperty.propertyId);
    
    // Fetch the actual property data for all saved property IDs
    const favoriteProperties = await Promise.all(
      propertyIds.map(async (propertyId) => {
        return await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
      })
    );
    
    // Filter out any null results (in case a property was deleted but still in favorites)
    return favoriteProperties.filter(property => property !== null) as Property[];
  } catch (error) {
    console.error('Error fetching favorite properties:', error);
    throw new Error('Failed to fetch favorite properties');
  }
}

/**
 * Toggle a property as a favorite (add if not favorited, remove if already favorited)
 */
export async function toggleFavoriteProperty(propertyId: string): Promise<{ added: boolean }> {
  try {
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Check if this property is already saved by this user
    const savedProperties = await queryDocuments<any>(SAVED_PROPERTIES_COLLECTION, [
      { field: 'userId', operator: '==', value: currentUser.id },
      { field: 'propertyId', operator: '==', value: propertyId }
    ]);
    
    // If property is already saved, remove it from favorites
    if (savedProperties.length > 0) {
      await deleteDocument(SAVED_PROPERTIES_COLLECTION, savedProperties[0].id);
      return { added: false };
    }
    
    // Otherwise, add the property to favorites
    await createDocument(SAVED_PROPERTIES_COLLECTION, {
      userId: currentUser.id,
      propertyId: propertyId,
      createdAt: new Date()
    });
    
    // Send notification to the property owner when a property is added to favorites
    try {
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
      if (property && property.ownerId) {
        // Create user info for the notification
        const clientName = currentUser.name && currentUser.surname 
          ? `${currentUser.name} ${currentUser.surname}` 
          : currentUser.email || 'A user';
        
        // Only send notification when property is added to favorites, not when removed
        await advertiserNotifications.propertyLiked(
          property.ownerId,
          clientName,
          property.title || 'Property',
          propertyId
        );
        
        console.log(`Favorite notification sent to advertiser: ${property.ownerId}`);
      }
    } catch (notifError) {
      console.error('Error sending favorite notification:', notifError);
      // Don't throw error here so the main action can still succeed
    }
    
    return { added: true };
  } catch (error) {
    console.error('Error toggling favorite property:', error);
    throw new Error('Failed to toggle favorite property');
  }
}

/**
 * Check if a property is favorited by the current user
 */
export async function isPropertyFavorited(propertyId: string): Promise<boolean> {
  try {
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      return false; // Not authenticated, so not favorited
    }
    
    // Check if this property is saved by this user
    const savedProperties = await queryDocuments<any>(SAVED_PROPERTIES_COLLECTION, [
      { field: 'userId', operator: '==', value: currentUser.id },
      { field: 'propertyId', operator: '==', value: propertyId }
    ]);
    
    return savedProperties.length > 0;
  } catch (error) {
    console.error('Error checking if property is favorited:', error);
    return false;
  }
}

// Helper function to get saved properties
async function getSavedProperties(): Promise<any[]> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  // Query saved properties where userId matches the current user's ID
  const savedProperties = await queryDocuments<any>(SAVED_PROPERTIES_COLLECTION, [
    { field: 'userId', operator: '==', value: currentUser.id }
  ]);
  
  return savedProperties;
}

/**
 * Complete a reservation (move in)
 */
export async function completeReservation(reservationId: string): Promise<boolean> {
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
    
    // Get property details for notification
    if (reservation.propertyId) {
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
      if (property) {
        // Create a reservation object for notification
        const clientName = currentUser.name && currentUser.surname 
          ? `${currentUser.name} ${currentUser.surname}` 
          : currentUser.email || 'A client';
          
        // Skip helpers and use direct notification
        try {
          // Import NotificationService dynamically to avoid circular dependencies
          const NotificationService = (await import('../../services/NotificationService')).default;
          
          // Send a direct notification to the advertiser
          await NotificationService.createNotification(
            property.ownerId,
            'advertiser',
            'client_moved_in',
            'Tenant Has Moved In',
            `${clientName} has confirmed they have moved into ${property.title || 'Property'}.`,
            `/dashboard/advertiser/reservations`,
            { 
              reservationId: reservationId, 
              propertyId: reservation.propertyId
            }
          );
          
          console.log(`Direct move-in notification sent to advertiser: ${property.ownerId}`);
        } catch (notifError) {
          console.error('Error sending move-in notification:', notifError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error completing reservation:', error);
    throw new Error('Failed to complete reservation');
  }
} 