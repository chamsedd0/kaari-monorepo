import { db } from '../firebase/config';
import { doc, collection, query, where, getDocs, getDoc, updateDoc, setDoc, addDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, Timestamp } from 'firebase/firestore';
import { User, Property, Request, ChecklistItem, Review, PhotoshootBooking } from '../entities';
import { getAuth } from 'firebase/auth';
import { PhotoshootBookingServerActions } from './PhotoshootBookingServerActions';
import { TeamServerActions } from './TeamServerActions';
import { getDocumentById } from '../firebase/firestore';

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
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('User not authenticated, cannot fetch properties');
      return [];
    }
    
    // First get the user document to check if it has a properties array
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.warn('User document not found');
      return [];
    }
    
    const userData = userDoc.data();
    console.log(`User object:`, userData);
    
    const properties: Property[] = [];
    
    // If user has a properties array, fetch those properties
    if (userData.properties && Array.isArray(userData.properties) && userData.properties.length > 0) {
      console.log(`Found ${userData.properties.length} property IDs in user document`);
      
      // Fetch each property by ID
      for (const propertyId of userData.properties) {
        try {
          const propertyDoc = await getDocumentById<Property>('properties', propertyId);
          if (propertyDoc) {
            properties.push(propertyDoc);
          }
        } catch (err) {
          console.error(`Error fetching property ${propertyId}:`, err);
        }
      }
    }
    
    // Also check for properties where advertiserId matches user.uid
    // This handles both data models (properties array in user doc OR advertiserId in property doc)
    const propertiesRef = collection(db, 'properties');
    const q = query(propertiesRef, where('advertiserId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Check if we already have this property from the user's properties array
      if (!properties.some(p => p.id === doc.id)) {
        // Convert Firestore timestamps to JavaScript Date objects
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date(data.createdAt);
          
        const updatedAt = data.updatedAt instanceof Timestamp 
          ? data.updatedAt.toDate() 
          : new Date(data.updatedAt);
          
        const lastAvailabilityRefresh = data.lastAvailabilityRefresh instanceof Timestamp 
          ? data.lastAvailabilityRefresh.toDate() 
          : data.lastAvailabilityRefresh 
            ? new Date(data.lastAvailabilityRefresh) 
            : undefined;
        
        // Add the property to our array
        properties.push({
          id: doc.id,
          ...data,
          createdAt,
          updatedAt,
          lastAvailabilityRefresh
        } as Property);
      }
    });
    
    console.log(`Found ${properties.length} total properties for advertiser ${user.uid}`);
    return properties;
  } catch (error) {
    console.error('Error fetching advertiser properties:', error);
    return [];
  }
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
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('User not authenticated, cannot fetch reservation requests');
      return [];
    }
    
    // First, get all properties owned by this advertiser
    const properties = await getAdvertiserProperties();
    
    if (properties.length === 0) {
      console.log('No properties found for this advertiser');
      return [];
    }
    
    const propertyIds = properties.map(property => property.id);
    console.log(`Found ${propertyIds.length} properties for advertiser ${user.uid}:`, propertyIds);
    
    // Create a map of properties by ID for easy lookup
    const propertyMap = properties.reduce((map, property) => {
      map[property.id] = property;
      return map;
    }, {} as Record<string, Property>);
    
    // Query requests collection for reservations related to these properties
    const requestsRef = collection(db, 'requests');
    const reservationRequests: {
      reservation: Request;
      listing?: any;
      property?: any;
      client?: any;
    }[] = [];
    
    // We need to use Promise.all to handle multiple queries since Firestore doesn't support OR conditions
    // across different fields in a single query
    const queryPromises = propertyIds.map(async (propertyId) => {
      const q = query(requestsRef, where('propertyId', '==', propertyId));
      const querySnapshot = await getDocs(q);
      
      console.log(`Found ${querySnapshot.size} requests for property ${propertyId}`);
      
      // Process each reservation
      const reservationPromises = querySnapshot.docs.map(async (doc) => {
        const reservationData = doc.data() as Request;
        
        // Add the document ID to the reservation data
        reservationData.id = doc.id;
        
        // Convert Firestore timestamps to JavaScript Date objects
        if (reservationData.createdAt instanceof Timestamp) {
          reservationData.createdAt = reservationData.createdAt.toDate();
        } else if (reservationData.createdAt) {
          reservationData.createdAt = new Date(reservationData.createdAt);
        }
        
        if (reservationData.updatedAt instanceof Timestamp) {
          reservationData.updatedAt = reservationData.updatedAt.toDate();
        } else if (reservationData.updatedAt) {
          reservationData.updatedAt = new Date(reservationData.updatedAt);
        }
        
        // Get the property data
        const property = propertyMap[reservationData.propertyId];
        
        // Get the client data
        let client = null;
        if (reservationData.userId) {
          try {
            const userDocRef = doc(db, 'users', reservationData.userId);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              client = {
                id: userDoc.id,
                ...userDoc.data(),
              };
            }
          } catch (error) {
            console.error(`Error fetching client data for user ${reservationData.userId}:`, error);
          }
        }
        
        // Add to results
        reservationRequests.push({
          reservation: reservationData,
          property: property || null,
          client: client,
        });
      });
      
      await Promise.all(reservationPromises);
    });
    
    // Wait for all property queries to complete
    await Promise.all(queryPromises);
    
    console.log(`Found ${reservationRequests.length} reservation requests for advertiser ${user.uid}`);
    return reservationRequests;
  } catch (error) {
    console.error('Error fetching advertiser reservation requests:', error);
    return [];
  }
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
  try {
    // Query reservations collection for active reservations for this property
    const requestsRef = collection(db, 'requests');
    const q = query(requestsRef, where('propertyId', '==', propertyId));
    const querySnapshot = await getDocs(q);
    
    // Check each reservation status
    let hasActiveReservations = false;
    let reason: 'none' | 'completed' | 'pending' | 'accepted' | 'paid' | 'movedIn' = 'none';
    
    // Priority order for reasons (most restrictive first)
    const reasonPriority = ['movedIn', 'paid', 'completed', 'accepted', 'pending'] as const;
    
    querySnapshot.forEach((doc) => {
      const reservation = doc.data();
      
      // Check for various active statuses
      if (reservation.status === 'movedIn') {
        hasActiveReservations = true;
        reason = 'movedIn';
        return; // Exit the forEach early since we found the highest priority reason
      } else if (reservation.status === 'paid' && reason !== 'movedIn') {
        hasActiveReservations = true;
        reason = 'paid';
      } else if (reservation.status === 'completed' && !reasonPriority.slice(0, 2).includes(reason)) {
        hasActiveReservations = true;
        reason = 'completed';
      } else if (reservation.status === 'accepted' && !reasonPriority.slice(0, 3).includes(reason)) {
        hasActiveReservations = true;
        reason = 'accepted';
      } else if (reservation.status === 'pending' && !reasonPriority.slice(0, 4).includes(reason)) {
        hasActiveReservations = true;
        reason = 'pending';
      }
    });
    
    return { hasActiveReservations, reason };
  } catch (error) {
    console.error('Error checking property reservations:', error);
    return { hasActiveReservations: false, reason: 'none' };
  }
}

/**
 * Approve a reservation request
 */
export async function approveReservationRequest(requestId: string): Promise<boolean> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('User not authenticated, cannot approve reservation request');
      return false;
    }
    
    // Get the reservation document
    const reservationRef = doc(db, 'requests', requestId);
    const reservationDoc = await getDoc(reservationRef);
    
    if (!reservationDoc.exists()) {
      console.error(`Reservation ${requestId} not found`);
      return false;
    }
    
    const reservationData = reservationDoc.data();
    
    // Get the property document to check if the current user is the owner
    const propertyRef = doc(db, 'properties', reservationData.propertyId);
    const propertyDoc = await getDoc(propertyRef);
    
    if (!propertyDoc.exists()) {
      console.error(`Property ${reservationData.propertyId} not found`);
      return false;
    }
    
    const propertyData = propertyDoc.data();
    
    // Check if the current user is the property owner
    // This could be either by advertiserId field or by checking user's properties array
    let isOwner = false;
    
    // Check by advertiserId field
    if (propertyData.advertiserId === user.uid) {
      isOwner = true;
    }
    
    // If not found by advertiserId, check user's properties array
    if (!isOwner) {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && userDoc.data().properties) {
        isOwner = userDoc.data().properties.includes(reservationData.propertyId);
      }
    }
    
    if (!isOwner) {
      console.error(`User ${user.uid} is not the owner of property ${reservationData.propertyId}`);
      return false;
    }
    
    // Update the reservation status to 'accepted'
    await updateDoc(reservationRef, {
      status: 'accepted',
      updatedAt: new Date()
    });
    
    // Notify the user (this would be implemented in a separate service)
    // For now, just log the action
    console.log(`Reservation ${requestId} approved by advertiser ${user.uid}`);
    
    return true;
  } catch (error) {
    console.error('Error approving reservation request:', error);
    return false;
  }
}

/**
 * Reject a reservation request
 */
export async function rejectReservationRequest(requestId: string): Promise<boolean> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('User not authenticated, cannot reject reservation request');
      return false;
    }
    
    // Get the reservation document
    const reservationRef = doc(db, 'requests', requestId);
    const reservationDoc = await getDoc(reservationRef);
    
    if (!reservationDoc.exists()) {
      console.error(`Reservation ${requestId} not found`);
      return false;
    }
    
    const reservationData = reservationDoc.data();
    
    // Get the property document to check if the current user is the owner
    const propertyRef = doc(db, 'properties', reservationData.propertyId);
    const propertyDoc = await getDoc(propertyRef);
    
    if (!propertyDoc.exists()) {
      console.error(`Property ${reservationData.propertyId} not found`);
      return false;
    }
    
    const propertyData = propertyDoc.data();
    
    // Check if the current user is the property owner
    // This could be either by advertiserId field or by checking user's properties array
    let isOwner = false;
    
    // Check by advertiserId field
    if (propertyData.advertiserId === user.uid) {
      isOwner = true;
    }
    
    // If not found by advertiserId, check user's properties array
    if (!isOwner) {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && userDoc.data().properties) {
        isOwner = userDoc.data().properties.includes(reservationData.propertyId);
      }
    }
    
    if (!isOwner) {
      console.error(`User ${user.uid} is not the owner of property ${reservationData.propertyId}`);
      return false;
    }
    
    // Update the reservation status to 'rejected'
    await updateDoc(reservationRef, {
      status: 'rejected',
      updatedAt: new Date()
    });
    
    // Notify the user (this would be implemented in a separate service)
    // For now, just log the action
    console.log(`Reservation ${requestId} rejected by advertiser ${user.uid}`);
    
    return true;
  } catch (error) {
    console.error('Error rejecting reservation request:', error);
    return false;
  }
}

/**
 * Update property availability
 */
export async function updatePropertyAvailability(
  propertyId: string,
  isAvailable: boolean
): Promise<boolean> {
  try {
    const propertyRef = doc(db, 'properties', propertyId);
    const propertyDoc = await getDoc(propertyRef);
    
    if (!propertyDoc.exists()) {
      console.error(`Property ${propertyId} not found`);
      return false;
    }
    
    // Update the property status and record when availability was last refreshed
    await updateDoc(propertyRef, {
      status: isAvailable ? 'available' : 'occupied',
      lastAvailabilityRefresh: new Date(),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating property availability:', error);
    return false;
  }
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