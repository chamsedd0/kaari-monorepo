'use server';

import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy,
  Timestamp,
  updateDoc,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  addDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Request, Property, User } from '../entities';

// Collection references
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';
const MOVE_IN_EVENTS_COLLECTION = 'move-in-events';

// Move-in status types
export type MoveInStatus = 
  | 'Move-in Upcoming'
  | 'Safety Window Open'
  | 'Safety Window Closed'
  | 'Cancelled – Tenant'
  | 'Cancelled – Advertiser';

export type MoveInReason = 
  | 'None'
  | 'Refund requested'
  | 'Tenant cancelled'
  | 'Advertiser cancelled';

// Move-in event type
export interface MoveInEvent {
  id?: string;
  bookingId: string;
  type: 'payment_captured' | 'move_in_scheduled' | 'move_in_confirmed' | 'cancel_tenant' | 'cancel_advertiser' | 'refund_requested';
  timestamp: Date | Timestamp;
  description: string;
  userId?: string;
  userName?: string;
}

// Move-in booking interface
export interface MoveInBooking {
  id: string;
  bookingId: string; // Short reference code (e.g., R-1274)
  property: {
    id: string;
    thumbnail: string;
    title: string;
    city: string;
    address: string;
    amenities: string[];
  };
  tenant: {
    id: string;
    name: string;
    phoneNumber: string;
    email?: string;
    bankLastFour?: string;
  };
  advertiser: {
    id: string;
    name: string;
    phoneNumber: string;
    email?: string;
  };
  moveInDate: Date;
  status: MoveInStatus;
  reason: MoveInReason;
  paymentCapturedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  gatewayReference?: string;
  internalNote?: string;
}

/**
 * Calculate move-in status based on dates and booking state
 */
function calculateMoveInStatus(
  moveInDate: Date, 
  paymentCapturedAt: Date, 
  dbStatus: string,
  cancelledBy?: 'tenant' | 'advertiser'
): { status: MoveInStatus; reason: MoveInReason } {
  const now = new Date();
  const moveInDateTime = new Date(moveInDate);
  const safetyWindowEnd = new Date(moveInDateTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours after move-in
  
  // Handle cancellations
  if (dbStatus === 'cancelled' || dbStatus === 'rejected') {
    if (cancelledBy === 'tenant') {
      return {
        status: 'Cancelled – Tenant',
        reason: 'Tenant cancelled'
      };
    } else if (cancelledBy === 'advertiser') {
      return {
        status: 'Cancelled – Advertiser',
        reason: 'Advertiser cancelled'
      };
    } else {
      // Default to tenant cancellation if not specified
      return {
        status: 'Cancelled – Tenant',
        reason: 'Tenant cancelled'
      };
    }
  }
  
  // Handle refund requests
  if (dbStatus === 'refundProcessing' || dbStatus === 'refundCompleted') {
    return {
      status: 'Cancelled – Tenant',
      reason: 'Refund requested'
    };
  }
  
  // Normal flow statuses
  if (now < moveInDateTime) {
    // Before move-in date
    return {
      status: 'Move-in Upcoming',
      reason: 'None'
    };
  } else if (now >= moveInDateTime && now < safetyWindowEnd) {
    // During 24-hour safety window
    return {
      status: 'Safety Window Open',
      reason: 'None'
    };
  } else {
    // After safety window
    return {
      status: 'Safety Window Closed',
      reason: 'None'
    };
  }
}

/**
 * Process a booking document and convert to MoveInBooking
 */
async function processMoveInBookingDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Promise<MoveInBooking | null> {
  try {
    const data = docSnapshot.data();
    
    // Skip if not a rental request or not paid
    if (data.requestType !== 'rent' || data.status !== 'paid') {
      return null;
    }
    
    // Skip if no move-in date
    if (!data.scheduledDate) {
      return null;
    }
    
    // Get property data
    let property = {
      id: data.propertyId || '',
      thumbnail: '',
      title: 'Unknown Property',
      city: 'Unknown City',
      address: 'Unknown Address',
      amenities: [] as string[]
    };
    
    if (data.propertyId) {
      try {
        const propertyDoc = await getDoc(doc(db, PROPERTIES_COLLECTION, data.propertyId));
        if (propertyDoc.exists()) {
          const propertyData = propertyDoc.data();
          property = {
            id: data.propertyId,
            thumbnail: propertyData.images?.[0] || '',
            title: propertyData.title || 'Unknown Property',
            city: propertyData.address?.city || 'Unknown City',
            address: propertyData.address ? 
              `${propertyData.address.street || ''}, ${propertyData.address.city || ''}, ${propertyData.address.state || ''}`.trim() :
              'Unknown Address',
            amenities: propertyData.amenities || []
          };
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    }
    
    // Get tenant data
    let tenant = {
      id: data.userId || '',
      name: 'Unknown Tenant',
      phoneNumber: 'Unknown',
      email: undefined as string | undefined,
      bankLastFour: undefined as string | undefined
    };
    
    if (data.userId) {
      try {
        const tenantDoc = await getDoc(doc(db, USERS_COLLECTION, data.userId));
        if (tenantDoc.exists()) {
          const tenantData = tenantDoc.data();
          tenant = {
            id: data.userId,
            name: tenantData.displayName || tenantData.name || data.fullName || 'Unknown Tenant',
            phoneNumber: tenantData.phoneNumber || data.phoneNumber || 'Unknown',
            email: tenantData.email || data.email,
            bankLastFour: tenantData.bankLastFour || data.cardLastFour
          };
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
      }
    }
    
    // Get advertiser data
    let advertiser = {
      id: '',
      name: 'Unknown Advertiser',
      phoneNumber: 'Unknown',
      email: undefined as string | undefined
    };
    
    // Try to get advertiser from property data
    if (property.id) {
      try {
        const propertyDoc = await getDoc(doc(db, PROPERTIES_COLLECTION, property.id));
        if (propertyDoc.exists()) {
          const propertyData = propertyDoc.data();
          if (propertyData.advertiserId) {
            const advertiserDoc = await getDoc(doc(db, USERS_COLLECTION, propertyData.advertiserId));
            if (advertiserDoc.exists()) {
              const advertiserData = advertiserDoc.data();
              advertiser = {
                id: propertyData.advertiserId,
                name: advertiserData.displayName || advertiserData.name || 'Unknown Advertiser',
                phoneNumber: advertiserData.phoneNumber || 'Unknown',
                email: advertiserData.email
              };
            }
          }
        }
      } catch (error) {
        console.error('Error fetching advertiser:', error);
      }
    }
    
    // Convert dates
    const moveInDate = data.scheduledDate.toDate ? data.scheduledDate.toDate() : new Date(data.scheduledDate);
    const paymentCapturedAt = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
    const createdAt = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
    const updatedAt = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
    
    // Calculate status and reason
    const { status, reason } = calculateMoveInStatus(
      moveInDate,
      paymentCapturedAt,
      data.status,
      data.cancelledBy
    );
    
    return {
      id: docSnapshot.id,
      bookingId: `R-${docSnapshot.id.slice(-4).toUpperCase()}`,
      property,
      tenant,
      advertiser,
      moveInDate,
      status,
      reason,
      paymentCapturedAt,
      createdAt,
      updatedAt,
      amount: data.totalPrice || data.price || 0,
      gatewayReference: data.gatewayReference,
      internalNote: data.internalNote || ''
    };
  } catch (error) {
    console.error('Error processing move-in booking:', error);
    return null;
  }
}

/**
 * Get all move-in bookings
 */
export async function getAllMoveInBookings(): Promise<MoveInBooking[]> {
  try {
    const bookingsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(
      bookingsRef,
      where('requestType', '==', 'rent'),
      where('status', 'in', ['paid', 'movedIn', 'cancelled', 'refundProcessing', 'refundCompleted']),
      orderBy('scheduledDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: MoveInBooking[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const booking = await processMoveInBookingDoc(docSnapshot);
      if (booking) {
        bookings.push(booking);
      }
    }
    
    return bookings;
  } catch (error) {
    console.error('Error fetching move-in bookings:', error);
    throw new Error('Failed to fetch move-in bookings');
  }
}

/**
 * Get move-in bookings by status
 */
export async function getMoveInBookingsByStatus(status: MoveInStatus): Promise<MoveInBooking[]> {
  try {
    const allBookings = await getAllMoveInBookings();
    return allBookings.filter(booking => booking.status === status);
  } catch (error) {
    console.error('Error fetching move-in bookings by status:', error);
    throw new Error('Failed to fetch move-in bookings');
  }
}

/**
 * Get move-in booking by ID
 */
export async function getMoveInBookingById(id: string): Promise<MoveInBooking | null> {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, id);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    return await processMoveInBookingDoc(docSnapshot);
  } catch (error) {
    console.error('Error fetching move-in booking by ID:', error);
    throw new Error('Failed to fetch move-in booking');
  }
}

/**
 * Update internal note for a move-in booking
 */
export async function updateMoveInBookingNote(bookingId: string, note: string): Promise<void> {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      internalNote: note,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating move-in booking note:', error);
    throw new Error('Failed to update note');
  }
}

/**
 * Get move-in events for a booking
 */
export async function getMoveInEvents(bookingId: string): Promise<MoveInEvent[]> {
  try {
    const eventsRef = collection(db, MOVE_IN_EVENTS_COLLECTION);
    const q = query(
      eventsRef,
      where('bookingId', '==', bookingId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const events: MoveInEvent[] = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      events.push({
        id: doc.id,
        bookingId: data.bookingId,
        type: data.type,
        timestamp: data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
        description: data.description,
        userId: data.userId,
        userName: data.userName
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching move-in events:', error);
    return [];
  }
}

/**
 * Add move-in event
 */
export async function addMoveInEvent(event: Omit<MoveInEvent, 'id'>): Promise<void> {
  try {
    const eventsRef = collection(db, MOVE_IN_EVENTS_COLLECTION);
    await addDoc(eventsRef, {
      ...event,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding move-in event:', error);
    throw new Error('Failed to add event');
  }
} 