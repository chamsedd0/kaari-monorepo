import { User, Request, Property } from '../entities';
import { 
  getDocumentById, 
  getDocumentsByField,
  updateDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';

// Collection names
const USERS_COLLECTION = 'users';
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';

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
    
    // Update the reservation status to "completed" with "moved_in" flag and timestamp
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'completed',
      movedIn: true,
      movedInAt: new Date(),
      updatedAt: new Date()
    });
    
    return;
  } catch (error) {
    console.error('Error completing reservation:', error);
    throw error;
  }
} 