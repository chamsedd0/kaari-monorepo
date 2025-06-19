import { db } from '../firebase/config';
import { doc, collection, query, where, getDocs, getDoc, updateDoc, setDoc, addDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, Timestamp } from 'firebase/firestore';
import { User, Property, Request, ChecklistItem, Review, PhotoshootBooking } from '../entities';
import { getAuth } from 'firebase/auth';
import { PhotoshootBookingServerActions } from './PhotoshootBookingServerActions';
import { TeamServerActions } from './TeamServerActions';

// Define Photoshoot interface
export interface Photoshoot {
  id: string;
  propertyId: string;
  date: Date;
  time: string;
  timeSlot: string;
  photographerId: string;
  photographerName: string;
  photographerInfo: string;
  photographerImage: string;
  phoneNumber: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'assigned';
  createdAt: Date;
  updatedAt: Date;
  streetName: string;
  streetNumber: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  country: string;
  floor: string;
  flat: string;
}

// Define Inquiry interface
interface Inquiry {
  id: string;
  userId: string;
  propertyId: string;
  message: string;
  status: 'pending' | 'answered' | 'rejected';
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new property
 */
export async function createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
  console.warn('Using placeholder createProperty - implement this properly');
  return { id: 'placeholder-id', ...propertyData, createdAt: new Date(), updatedAt: new Date() } as Property;
}

/**
 * Placeholder functions for the existing API
 * These will be properly implemented later but are needed for imports to work
 */
export async function getAdvertiserStatistics(): Promise<{
  totalProperties: number;
  activeListings: number;
  pendingReservations: number;
  viewsCount: number;
  photoshootsScheduled: number;
  inquiriesCount: number;
}> {
  console.warn('Using placeholder getAdvertiserStatistics - implement this properly');
  return {
    totalProperties: 0,
    activeListings: 0,
    pendingReservations: 0,
    viewsCount: 0,
    photoshootsScheduled: 0,
    inquiriesCount: 0
  };
}

export async function getAdvertiserProperties(): Promise<Property[]> {
  console.warn('Using placeholder getAdvertiserProperties - implement this properly');
  return [];
}

export async function getAdvertiserRequests(): Promise<Request[]> {
  console.warn('Using placeholder getAdvertiserRequests - implement this properly');
  return [];
}

export async function getAdvertiserReservationRequests(): Promise<{
  reservation: Request;
  listing?: any;
  property?: any;
  client?: any;
}[]> {
  console.warn('Using placeholder getAdvertiserReservationRequests - implement this properly');
  return [];
}

export async function getAdvertiserPhotoshoots(): Promise<Photoshoot[]> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('User not authenticated, cannot fetch photoshoots');
      return [];
    }
    
    // Get photoshoot bookings using the PhotoshootBookingServerActions
    const bookings = await PhotoshootBookingServerActions.getBookingsByAdvertiserId(user.uid);
    
    // Fetch team data for each booking that has a teamId
    const bookingsWithTeam = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.teamId) {
          try {
            const team = await TeamServerActions.getTeamById(booking.teamId);
            return { ...booking, team };
          } catch (error) {
            console.error(`Error fetching team for booking ${booking.id}:`, error);
            return booking;
          }
        }
        return booking;
      })
    );
    
    // Convert PhotoshootBooking objects to Photoshoot objects
    const photoshoots: Photoshoot[] = bookingsWithTeam.map(booking => ({
      id: booking.id,
      propertyId: booking.propertyId || '',
      date: new Date(booking.date),
      time: booking.timeSlot || '',
      timeSlot: booking.timeSlot || '',
      photographerId: booking.teamId || '',
      photographerName: booking.teamId ? 'Kaari Photography Team' : '',
      photographerInfo: 'Professional Photographer',
      photographerImage: '',
      phoneNumber: (booking as any).team?.phoneNumber || '',
      status: mapBookingStatusToPhotoshootStatus(booking.status),
      createdAt: new Date(booking.createdAt),
      updatedAt: new Date(booking.updatedAt),
      // Include address fields from booking
      streetName: booking.streetName || '',
      streetNumber: booking.streetNumber || '',
      city: booking.city || '',
      stateRegion: booking.stateRegion || '',
      postalCode: booking.postalCode || '',
      country: booking.country || '',
      floor: booking.floor || '',
      flat: booking.flat || ''
    }));
    
    return photoshoots;
  } catch (error) {
    console.error('Error fetching advertiser photoshoots:', error);
    return [];
  }
}

/**
 * Helper function to map PhotoshootBooking status to Photoshoot status
 */
function mapBookingStatusToPhotoshootStatus(status: 'pending' | 'assigned' | 'completed' | 'cancelled'): 'pending' | 'assigned' | 'scheduled' | 'completed' | 'cancelled' {
  // Now we can pass through the status directly since we updated the interface
  return status;
}

/**
 * Check if a property has active reservations
 * @returns An object with hasActiveReservations flag and reason
 */
export async function checkPropertyHasActiveReservations(propertyId: string): Promise<{
  hasActiveReservations: boolean;
  reason: 'none' | 'completed' | 'pending' | 'accepted' | 'paid' | 'movedIn';
}> {
  console.warn('Using placeholder checkPropertyHasActiveReservations - implement this properly');
  return { hasActiveReservations: false, reason: 'none' };
}

/**
 * Approve a reservation request
 */
export async function approveReservationRequest(requestId: string): Promise<boolean> {
  console.warn('Using placeholder approveReservationRequest - implement this properly');
  return true;
}

/**
 * Reject a reservation request
 */
export async function rejectReservationRequest(requestId: string): Promise<boolean> {
  console.warn('Using placeholder rejectReservationRequest - implement this properly');
  return true;
}

/**
 * Update property availability
 */
export async function updatePropertyAvailability(
  propertyId: string,
  isAvailable: boolean
): Promise<boolean> {
  console.warn('Using placeholder updatePropertyAvailability - implement this properly');
  return true;
}

/**
 * Get all reviews for properties owned by the current advertiser
 */
export async function getAdvertiserPropertyReviews(): Promise<{
  review: Review;
  property: Property;
  reviewer: User | null;
}[]> {
  console.warn('Using placeholder getAdvertiserPropertyReviews - implement this properly');
  return [];
}

/**
 * Get reviews for a specific advertiser
 */
export async function getAdvertiserReviews(advertiserId: string): Promise<Review[]> {
  console.warn('Using placeholder getAdvertiserReviews - implement this properly');
  return [];
}

/**
 * Responds to a property inquiry from a client
 */
export async function respondToPropertyInquiry(
  inquiryId: string, 
  response: string, 
  status: 'answered' | 'rejected' = 'answered'
): Promise<boolean> {
  console.warn('Using placeholder respondToPropertyInquiry - implement this properly');
  return true;
}

/**
 * Update the advertiser's checklist item status
 * @param itemId The ID of the checklist item to update
 * @param completed Whether the item is completed or not
 * @returns Promise that resolves when the update is complete
 */
export const updateAdvertiserChecklistItem = async (
  itemId: string,
  completed: boolean
): Promise<void> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }
    
    const userData = userDoc.data() as User;
    const checklist = userData.checklist || [];
    
    // Find if the item already exists in the checklist
    const existingItemIndex = checklist.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      if (checklist[existingItemIndex].completed !== completed) {
        checklist[existingItemIndex].completed = completed;
        checklist[existingItemIndex].completedAt = completed ? new Date() : undefined;
        
        await updateDoc(userDocRef, {
          checklist: checklist,
          checklistLastUpdated: new Date()
        });
      }
    } else {
      // Add new item
      const newItem: ChecklistItem = {
        id: itemId,
        title: '', // Title will be set by the UI based on translations
        completed: completed,
        completedAt: completed ? new Date() : undefined,
        order: getDefaultItemOrder(itemId)
      };
      
      await updateDoc(userDocRef, {
        checklist: arrayUnion(newItem),
        checklistLastUpdated: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating checklist item:', error);
    throw error;
  }
};

/**
 * Get the advertiser's checklist from Firestore
 * @returns Promise that resolves with the checklist items
 */
export const getAdvertiserChecklist = async (): Promise<ChecklistItem[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }
    
    const userData = userDoc.data() as User;
    return userData.checklist || [];
  } catch (error) {
    console.error('Error getting checklist:', error);
    throw error;
  }
};

/**
 * Get the default order for a checklist item
 */
const getDefaultItemOrder = (itemId: string): number => {
  const orderMap: Record<string, number> = {
    'book_photoshoot': 1,
    'complete_profile': 2,
    'add_payout_method': 3,
    'accept_booking': 4,
    'message_tenant': 5,
    'refresh_availability': 6
  };
  
  return orderMap[itemId] || 99; // Default to end of list if unknown
};

/**
 * Get advertiser signup data for a specific user
 * @param userId The ID of the user to get signup data for
 * @returns Promise that resolves with the advertiser signup data
 */
export const getAdvertiserSignupData = async (userId: string): Promise<any> => {
  try {
    // For now, return a mock data object
    console.log(`Fetching advertiser signup data for user ${userId}`);
    
    return {
      companyName: "Example Company",
      businessRegistrationNumber: "BRN123456789",
      taxIdentificationNumber: "TIN987654321",
      licenseNumber: "LIC-ABC-123",
      yearsInBusiness: "5",
      numberOfProperties: "10",
      referralSource: "Website",
      idVerified: true,
      additionalInfo: "This is mock data for testing purposes.",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error fetching advertiser signup data:', error);
    return null;
  }
}; 