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
const BOOKING_EVENTS_COLLECTION = 'booking-events';

// Booking status types
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'paid' | 'movedIn' | 'cancelled' | 'refundProcessing' | 'refundCompleted' | 'refundFailed' | 'cancellationUnderReview';
export type AdminBookingStatus = 'Await-Advertiser' | 'Await-Tenant-Confirm' | 'Confirmed' | 'Cancelled';
export type PaymentState = 'Hold' | 'Captured' | 'Voided';

// Booking event type
export interface BookingEvent {
  id?: string;
  bookingId: string;
  type: 'request' | 'accept' | 'decline' | 'confirm' | 'cancel' | 'payment_capture' | 'payment_void';
  timestamp: Date | Timestamp;
  description: string;
  userId?: string;
  userName?: string;
}

// Admin booking interface
export interface AdminBooking {
  id: string;
  bookingId: string; // Short reference code (e.g., R-1274)
  property: {
    id: string;
    thumbnail: string;
    title: string;
    city: string;
  };
  tenant: {
    id: string;
    name: string;
    phoneNumber: string;
    email?: string;
  };
  advertiser: {
    id: string;
    name: string;
    phoneNumber: string;
    email?: string;
  };
  status: AdminBookingStatus;
  updatedAt: Date;
  createdAt: Date;
  paymentState: PaymentState;
  amount: number;
  cardLastFour?: string;
  gatewayReference?: string;
}

/**
 * Map database booking status to admin booking status
 */
function mapBookingStatus(dbStatus: BookingStatus): AdminBookingStatus {
  switch(dbStatus) {
    case 'pending':
      return 'Await-Advertiser';
    case 'accepted':
      return 'Await-Tenant-Confirm';
    case 'paid':
    case 'movedIn':
      return 'Confirmed';
    case 'rejected':
    case 'cancelled':
    case 'refundCompleted':
      return 'Cancelled';
    default:
      return 'Await-Advertiser';
  }
}

/**
 * Map database booking status to payment state
 */
function mapPaymentState(dbStatus: BookingStatus): PaymentState {
  switch(dbStatus) {
    case 'pending':
    case 'accepted':
      return 'Hold';
    case 'paid':
    case 'movedIn':
      return 'Captured';
    case 'rejected':
    case 'cancelled':
    case 'refundCompleted':
      return 'Voided';
    default:
      return 'Hold';
  }
}

/**
 * Format booking ID (e.g., R-1274)
 */
function formatBookingId(id: string): string {
  // Extract the last 4 characters or use the whole ID if shorter
  const shortId = id.length > 4 ? id.slice(-4) : id;
  return `R-${shortId}`;
}

/**
 * Get all bookings for admin dashboard
 */
export async function getAllBookings(): Promise<AdminBooking[]> {
  try {
    const bookingsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(
      bookingsRef, 
      where('requestType', '==', 'rent'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: AdminBooking[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const booking = await processBookingDoc(docSnapshot);
      if (booking) {
        bookings.push(booking);
      }
    }
    
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
}

/**
 * Get bookings by status
 */
export async function getBookingsByStatus(status: AdminBookingStatus): Promise<AdminBooking[]> {
  try {
    const bookingsRef = collection(db, REQUESTS_COLLECTION);
    
    // Map admin status to database statuses
    let dbStatuses: BookingStatus[] = [];
    switch(status) {
      case 'Await-Advertiser':
        dbStatuses = ['pending'];
        break;
      case 'Await-Tenant-Confirm':
        dbStatuses = ['accepted'];
        break;
      case 'Confirmed':
        dbStatuses = ['paid', 'movedIn'];
        break;
      case 'Cancelled':
        dbStatuses = ['rejected', 'cancelled', 'refundCompleted'];
        break;
      default:
        dbStatuses = ['pending'];
    }
    
    const bookings: AdminBooking[] = [];
    
    // Query for each status (Firestore doesn't support OR queries directly)
    for (const dbStatus of dbStatuses) {
      const q = query(
        bookingsRef,
        where('requestType', '==', 'rent'),
        where('status', '==', dbStatus),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        const booking = await processBookingDoc(docSnapshot);
        if (booking) {
          bookings.push(booking);
        }
      }
    }
    
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    throw new Error('Failed to fetch bookings');
  }
}

/**
 * Get bookings by city
 */
export async function getBookingsByCity(city: string): Promise<AdminBooking[]> {
  try {
    // First get properties in the city
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const propertiesQuery = query(
      propertiesRef,
      where('address.city', '==', city)
    );
    
    const propertiesSnapshot = await getDocs(propertiesQuery);
    const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
    
    if (propertyIds.length === 0) {
      return [];
    }
    
    // Then get bookings for these properties
    const bookings: AdminBooking[] = [];
    
    // Due to Firestore limitations, we need to query in batches if there are many properties
    const batchSize = 10;
    for (let i = 0; i < propertyIds.length; i += batchSize) {
      const batch = propertyIds.slice(i, i + batchSize);
      
      const bookingsRef = collection(db, REQUESTS_COLLECTION);
      const q = query(
        bookingsRef,
        where('requestType', '==', 'rent'),
        where('propertyId', 'in', batch),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        const booking = await processBookingDoc(docSnapshot);
        if (booking) {
          bookings.push(booking);
        }
      }
    }
    
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings by city:', error);
    throw new Error('Failed to fetch bookings');
  }
}

/**
 * Search bookings by tenant name or property title
 */
export async function searchBookings(searchTerm: string): Promise<AdminBooking[]> {
  try {
    // This is a simplified search that doesn't use full-text search
    // For a production app, consider using Algolia, Elasticsearch, or similar
    
    const bookingsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(
      bookingsRef,
      where('requestType', '==', 'rent'),
      orderBy('createdAt', 'desc'),
      limit(100) // Limit to avoid processing too many documents
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: AdminBooking[] = [];
    
    // Process each booking and filter client-side
    const searchTermLower = searchTerm.toLowerCase();
    
    for (const docSnapshot of querySnapshot.docs) {
      const booking = await processBookingDoc(docSnapshot);
      
      if (booking) {
        // Check if tenant name or property title matches search term
        const tenantNameMatches = booking.tenant.name.toLowerCase().includes(searchTermLower);
        const propertyTitleMatches = booking.property.title.toLowerCase().includes(searchTermLower);
        
        if (tenantNameMatches || propertyTitleMatches) {
          bookings.push(booking);
        }
      }
    }
    
    return bookings;
  } catch (error) {
    console.error('Error searching bookings:', error);
    throw new Error('Failed to search bookings');
  }
}

/**
 * Get booking by ID
 */
export async function getBookingById(id: string): Promise<AdminBooking | null> {
  try {
    const bookingRef = doc(db, REQUESTS_COLLECTION, id);
    const bookingDoc = await getDoc(bookingRef);
    
    if (!bookingDoc.exists()) {
      return null;
    }
    
    return processBookingDoc(bookingDoc);
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw new Error('Failed to fetch booking');
  }
}

/**
 * Get booking events
 */
export async function getBookingEvents(bookingId: string): Promise<BookingEvent[]> {
  try {
    const eventsRef = collection(db, BOOKING_EVENTS_COLLECTION);
    const q = query(
      eventsRef,
      where('bookingId', '==', bookingId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        bookingId: data.bookingId,
        type: data.type,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toDate() 
          : new Date(data.timestamp),
        description: data.description,
        userId: data.userId,
        userName: data.userName
      };
    });
  } catch (error) {
    console.error('Error fetching booking events:', error);
    throw new Error('Failed to fetch booking events');
  }
}

/**
 * Add booking event
 */
export async function addBookingEvent(event: Omit<BookingEvent, 'id'>): Promise<string> {
  try {
    const eventsRef = collection(db, BOOKING_EVENTS_COLLECTION);
    
    // Convert Date to Timestamp if needed
    const eventData = {
      ...event,
      timestamp: event.timestamp instanceof Date 
        ? Timestamp.fromDate(event.timestamp) 
        : event.timestamp,
    };
    
    const docRef = await addDoc(eventsRef, eventData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding booking event:', error);
    throw new Error('Failed to add booking event');
  }
}

/**
 * Add internal note to booking
 */
export async function addBookingNote(bookingId: string, note: string, userId: string): Promise<string> {
  try {
    // Get user info
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : null;
    const userName = userData?.name || userData?.displayName || 'Admin';
    
    // Create note as a booking event
    const eventData: Omit<BookingEvent, 'id'> = {
      bookingId,
      type: 'note',
      timestamp: new Date(),
      description: note,
      userId,
      userName
    };
    
    return addBookingEvent(eventData);
  } catch (error) {
    console.error('Error adding booking note:', error);
    throw new Error('Failed to add booking note');
  }
}

/**
 * Get recent bookings with property and client details
 * @param limitCount Maximum number of bookings to return
 */
export async function getRecentBookings(limitCount: number = 5): Promise<any[]> {
  try {
    const bookingsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(
      bookingsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: any[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const bookingData = docSnapshot.data();
      const bookingId = docSnapshot.id;
      
      // Get property details
      let property = null;
      if (bookingData.propertyId) {
        const propertyDoc = await getDoc(doc(db, PROPERTIES_COLLECTION, bookingData.propertyId));
        if (propertyDoc.exists()) {
          property = {
            id: propertyDoc.id,
            ...propertyDoc.data()
          };
        }
      }
      
      // Get client details
      let client = null;
      if (bookingData.userId) {
        const clientDoc = await getDoc(doc(db, USERS_COLLECTION, bookingData.userId));
        if (clientDoc.exists()) {
          client = {
            id: clientDoc.id,
            ...clientDoc.data()
          };
        }
      }
      
      bookings.push({
        id: bookingId,
        ...bookingData,
        property,
        client,
        createdAt: bookingData.createdAt?.toDate() || new Date(),
        updatedAt: bookingData.updatedAt?.toDate() || new Date(),
        moveInDate: bookingData.moveInDate?.toDate(),
        paymentDate: bookingData.paymentDate?.toDate()
      });
    }
    
    return bookings;
  } catch (error) {
    console.error('Error getting recent bookings:', error);
    return [];
  }
}

/**
 * Helper function to process a booking document
 */
async function processBookingDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Promise<AdminBooking | null> {
  try {
    const data = docSnapshot.data();
    
    // Skip if not a rental request
    if (data.requestType !== 'rent') {
      return null;
    }
    
    // Get property details
    let property = {
      id: data.propertyId || '',
      thumbnail: '',
      title: 'Unknown Property',
      city: 'Unknown'
    };
    
    if (data.propertyId) {
      try {
        const propertyDoc = await getDoc(doc(db, PROPERTIES_COLLECTION, data.propertyId));
        if (propertyDoc.exists()) {
          const propertyData = propertyDoc.data();
          property = {
            id: data.propertyId,
            thumbnail: propertyData.images && propertyData.images.length > 0 ? propertyData.images[0] : '',
            title: propertyData.title || 'Unknown Property',
            city: propertyData.address?.city || 'Unknown'
          };
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    }
    
    // Get tenant details
    let tenant = {
      id: data.userId || '',
      name: data.fullName || 'Unknown Tenant',
      phoneNumber: data.phoneNumber || 'Unknown',
      email: data.email || ''
    };
    
    // Get advertiser details from property owner
    let advertiser = {
      id: '',
      name: 'Unknown Advertiser',
      phoneNumber: 'Unknown',
      email: ''
    };
    
    if (property.id) {
      try {
        const propertyDoc = await getDoc(doc(db, PROPERTIES_COLLECTION, property.id));
        if (propertyDoc.exists()) {
          const propertyData = propertyDoc.data();
          // Try both ownerId and advertiserId fields
          const ownerId = propertyData.ownerId || propertyData.advertiserId;
          
          if (ownerId) {
            const advertiserDoc = await getDoc(doc(db, USERS_COLLECTION, ownerId));
            if (advertiserDoc.exists()) {
              const advertiserData = advertiserDoc.data();
              advertiser = {
                id: ownerId,
                name: advertiserData.name || advertiserData.displayName || 'Unknown Advertiser',
                phoneNumber: advertiserData.phoneNumber || 'Unknown',
                email: advertiserData.email || ''
              };
            }
          }
        }
      } catch (error) {
        console.error('Error fetching advertiser:', error);
      }
    }
    
    // Format dates
    const createdAt = data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate() 
      : new Date(data.createdAt || Date.now());
      
    const updatedAt = data.updatedAt instanceof Timestamp 
      ? data.updatedAt.toDate() 
      : new Date(data.updatedAt || data.createdAt || Date.now());
    
    // Map status
    const status = mapBookingStatus(data.status as BookingStatus);
    const paymentState = mapPaymentState(data.status as BookingStatus);
    
    // Format booking ID
    const bookingId = formatBookingId(docSnapshot.id);
    
    // Extract payment details if available
    const paymentDetails = data.paymentDetails || {};
    
    return {
      id: docSnapshot.id,
      bookingId,
      property,
      tenant,
      advertiser,
      status,
      updatedAt,
      createdAt,
      paymentState,
      amount: data.totalPrice || data.price || 0,
      cardLastFour: paymentDetails.cardLastFour,
      gatewayReference: paymentDetails.gatewayReference
    };
  } catch (error) {
    console.error('Error processing booking document:', error);
    return null;
  }
} 