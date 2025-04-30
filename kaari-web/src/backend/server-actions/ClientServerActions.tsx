'use server';

import { User, Request, Property } from '../entities';
import { 
  getDocumentById, 
  createDocument, 
  updateDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { getRequestsByUser } from './RequestServerActions';

// Collection names
const REQUESTS_COLLECTION = 'requests';
const USERS_COLLECTION = 'users';
const PROPERTIES_COLLECTION = 'properties';

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
    
    // Get all requests by this user that are of type 'viewing'
    const requests = await getRequestsByUser(currentUser.id);
    const viewingRequests = requests.filter(req => req.requestType === 'viewing');
    
    // For each request, get associated property and advertiser info
    const reservationsWithDetails = await Promise.all(
      viewingRequests.map(async (request) => {
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
 * Create a new viewing request (reservation)
 */
export async function createReservation(
  propertyId: string | undefined,
  scheduledDate: Date | undefined,
  message: string
): Promise<Request> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Verify that propertyId is provided
    if (!propertyId) {
      throw new Error('Property ID must be provided');
    }
    
    // Create the request data
    const requestData = {
      userId: currentUser.id,
      propertyId,
      requestType: 'viewing' as const,
      message,
      status: 'pending' as const,
      scheduledDate: scheduledDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the request
    const request = await createDocument<Request>(
      REQUESTS_COLLECTION,
      requestData as Omit<Request, 'id'>
    );
    
    // Add request to user's requests array
    const userRequests = currentUser.requests || [];
    await updateDocument<User>(USERS_COLLECTION, currentUser.id, {
      requests: [...userRequests, request.id]
    });
    
    // Update property status to 'occupied' immediately when reservation is created
    await updateDocument<Property>(PROPERTIES_COLLECTION, propertyId, {
      status: 'occupied',
      updatedAt: new Date()
    });
    
    return request;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('Failed to create reservation');
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
    
    // Update the reservation status to 'rejected'
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'rejected',
      updatedAt: new Date()
    });
    
    // Change property status back to 'available' when reservation is cancelled
    if (reservation.propertyId) {
      await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
        status: 'available',
        updatedAt: new Date()
      });
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
    
    // Get all viewing requests by this user
    const requests = await getRequestsByUser(currentUser.id);
    const viewingRequests = requests.filter(req => req.requestType === 'viewing');
    
    // Calculate statistics
    const pendingReservations = viewingRequests.filter(req => req.status === 'pending').length;
    const approvedReservations = viewingRequests.filter(req => req.status === 'accepted').length;
    const rejectedReservations = viewingRequests.filter(req => req.status === 'rejected').length;
    
    // Get saved properties count (stored in user document)
    const savedPropertiesCount = currentUser.properties?.length || 0;
    
    return {
      reservationsCount: viewingRequests.length,
      pendingReservations,
      approvedReservations,
      rejectedReservations,
      savedPropertiesCount
    };
  } catch (error) {
    console.error('Error getting client statistics:', error);
    throw new Error('Failed to get client statistics');
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
    
    // Update the reservation status to 'completed'
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'completed',
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment');
  }
} 