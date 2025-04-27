'use server';

import { 
  collection, 
  addDoc, 
  updateDoc,
  getDoc,
  getDocs, 
  doc,
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp,
  deleteDoc,
  QuerySnapshot,
  DocumentData,
  DocumentReference,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { PhotoshootBooking } from '../entities';

// Collection reference
const COLLECTION_NAME = 'photoshoot-bookings';
const bookingsCollection = collection(db, COLLECTION_NAME);

// Firestore interface for PhotoshootBooking
interface FirestorePhotoShootBooking extends Omit<PhotoshootBooking, 'date' | 'createdAt' | 'updatedAt' | 'completedAt'> {
  date: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
}

// Convert to Firestore format
const toFirestoreBooking = (booking: PhotoshootBooking): Omit<FirestorePhotoShootBooking, 'id'> => {
  const { id, ...rest } = booking;
  
  // Create the base object without completedAt
  const firestoreData: any = {
    ...rest,
    date: Timestamp.fromDate(new Date(booking.date)),
    createdAt: Timestamp.fromDate(new Date(booking.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(booking.updatedAt)),
  };
  
  // Only add completedAt if it exists
  if (booking.completedAt) {
    firestoreData.completedAt = Timestamp.fromDate(new Date(booking.completedAt));
  }
  
  return firestoreData;
};

// Convert from Firestore format
const fromFirestoreBooking = (id: string, data: DocumentData): PhotoshootBooking => {
  // Ensure all required date fields exist before converting
  if (!data.date || !data.createdAt || !data.updatedAt) {
    console.warn(`Document ${id} is missing required date fields:`, data);
    
    // Create default dates for missing fields to prevent errors
    const now = new Date();
    
    // Create base object without completedAt
    const result: any = {
      id,
      ...data,
      date: data.date ? data.date.toDate() : now,
      createdAt: data.createdAt ? data.createdAt.toDate() : now,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : now
    };
    
    // Only add completedAt if it exists in the data
    if (data.completedAt) {
      result.completedAt = data.completedAt.toDate();
    }
    
    return result as PhotoshootBooking;
  }
  
  // Create base object without completedAt
  const result: any = {
    id,
    ...data,
    date: data.date.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate()
  };
  
  // Only add completedAt if it exists in the data
  if (data.completedAt) {
    result.completedAt = data.completedAt.toDate();
  }
  
  return result as PhotoshootBooking;
};

// Helper function to initialize some sample data for development
const sampleBookings: (Omit<PhotoshootBooking, 'id' | 'completedAt'> & { completedAt?: Date })[] = [
  {
    advertiserId: 'adv123',
    propertyAddress: {
      street: 'Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      streetNumber: '123',
    },
    propertyType: 'apartment',
    date: new Date(Date.now() + 86400000), // Tomorrow
    timeSlot: '10:00 AM - 12:00 PM',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: 'Please arrive on time',
    // No completedAt for pending booking
  },
  {
    advertiserId: 'adv456',
    propertyAddress: {
      street: 'Broadway',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA',
      streetNumber: '456',
      floor: '3',
    },
    propertyType: 'condo',
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    timeSlot: '2:00 PM - 4:00 PM',
    status: 'assigned',
    teamId: 'team1',
    teamMembers: ['user1', 'user2'],
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date(),
    // No completedAt for assigned booking
  },
  {
    advertiserId: 'adv789',
    propertyAddress: {
      street: 'Park Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
      country: 'USA',
      streetNumber: '789',
    },
    propertyType: 'house',
    date: new Date(Date.now() - 86400000), // Yesterday
    timeSlot: '9:00 AM - 11:00 AM',
    status: 'completed',
    teamId: 'team2',
    teamMembers: ['user3', 'user4'],
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000), // Yesterday
    completedAt: new Date(), // Only include completedAt for completed bookings
    propertyId: 'prop123',
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf'
    ],
  },
];

// Class for PhotoshootBooking server actions
export class PhotoshootBookingServerActions {
  /**
   * Create a new photoshoot booking
   */
  static async createBooking(bookingData: Omit<PhotoshootBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const booking: Omit<PhotoshootBooking, 'id'> = {
        ...bookingData,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      
      const firestoreData = toFirestoreBooking(booking as PhotoshootBooking);
      const docRef = await addDoc(bookingsCollection, firestoreData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating photoshoot booking:', error);
      throw error;
    }
  }

  /**
   * Get all photoshoot bookings
   */
  static async getAllBookings(): Promise<PhotoshootBooking[]> {
    try {
      const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      // No longer auto-initialize sample data
      if (querySnapshot.empty) {
        console.log('No bookings found');
        return [];
      }
      
      return querySnapshot.docs.map(doc => 
        fromFirestoreBooking(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting all photoshoot bookings:', error);
      throw error;
    }
  }

  /**
   * Initialize sample data for development
   */
  static async initializeSampleData(): Promise<string[]> {
    try {
      const bookingIds: string[] = [];
      
      for (const booking of sampleBookings) {
        // Cast to PhotoshootBooking for type safety but toFirestoreBooking will handle missing completedAt
        const firestoreData = toFirestoreBooking(booking as PhotoshootBooking);
        console.log('Adding sample booking to Firestore:', firestoreData);
        const docRef = await addDoc(bookingsCollection, firestoreData);
        bookingIds.push(docRef.id);
      }
      
      return bookingIds;
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  }

  /**
   * Get pending photoshoot bookings
   */
  static async getPendingBookings(): Promise<PhotoshootBooking[]> {
    try {
      const q = query(
        bookingsCollection, 
        where('status', '==', 'pending'),
        orderBy('date')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        fromFirestoreBooking(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting pending photoshoot bookings:', error);
      throw error;
    }
  }

  /**
   * Get photoshoot bookings by advertiser ID
   */
  static async getBookingsByAdvertiserId(advertiserId: string): Promise<PhotoshootBooking[]> {
    try {
      // First, look for bookings with the advertiserId field
      const q1 = query(
        bookingsCollection, 
        where('advertiserId', '==', advertiserId)
      );
      
      const querySnapshot1 = await getDocs(q1);
      
      // Then look for bookings with the userId field (for backward compatibility)
      const q2 = query(
        bookingsCollection, 
        where('userId', '==', advertiserId)
      );
      
      const querySnapshot2 = await getDocs(q2);
      
      // Combine the results, avoiding duplicates
      const bookings: PhotoshootBooking[] = [];
      const bookingIds = new Set<string>();
      
      // Process advertiserId results
      querySnapshot1.forEach(doc => {
        if (!bookingIds.has(doc.id)) {
          bookingIds.add(doc.id);
          bookings.push(fromFirestoreBooking(doc.id, doc.data()));
        }
      });
      
      // Process userId results
      querySnapshot2.forEach(doc => {
        if (!bookingIds.has(doc.id)) {
          bookingIds.add(doc.id);
          bookings.push(fromFirestoreBooking(doc.id, doc.data()));
        }
      });
      
      // Sort by date (newest first)
      bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return bookings;
    } catch (error) {
      console.error(`Error getting bookings for advertiser ${advertiserId}:`, error);
      throw error;
    }
  }

  /**
   * Get a photoshoot booking by ID
   */
  static async getBookingById(id: string): Promise<PhotoshootBooking | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return fromFirestoreBooking(docSnap.id, docSnap.data());
    } catch (error) {
      console.error(`Error getting booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Assign a team to a photoshoot booking
   */
  static async assignTeamToBooking(
    bookingId: string,
    teamId: string,
    teamMembers: string[]
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, bookingId);
      
      await updateDoc(docRef, {
        teamId,
        teamMembers,
        status: 'assigned',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error assigning team to booking ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Complete a photoshoot booking and link it to a property
   */
  static async completeBooking(
    bookingId: string, 
    propertyId: string, 
    images: string[]
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, bookingId);
      
      await updateDoc(docRef, {
        status: 'completed',
        propertyId,
        images,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error completing booking ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel a photoshoot booking
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, bookingId);
      
      await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
        cancellationReason: reason || 'No reason provided',
        cancelledAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error cancelling booking ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a photoshoot booking
   */
  static async deleteBooking(bookingId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, bookingId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting booking ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Remove all sample/fake data
   * This removes any bookings created with the sample data advertiser IDs
   */
  static async removeSampleData(): Promise<{ count: number }> {
    try {
      // The advertiser IDs used in the sample data
      const sampleAdvertiserIds = ['adv123', 'adv456', 'adv789'];
      let deletedCount = 0;
      
      // Create queries for each sample advertiser ID
      for (const advertiserId of sampleAdvertiserIds) {
        const q = query(
          bookingsCollection, 
          where('advertiserId', '==', advertiserId)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log(`No sample bookings found for advertiser ${advertiserId}`);
          continue;
        }
        
        console.log(`Deleting ${querySnapshot.size} sample bookings for advertiser ${advertiserId}`);
        
        // Delete all bookings for this advertiser
        for (const docSnapshot of querySnapshot.docs) {
          await deleteDoc(docSnapshot.ref);
          deletedCount++;
        }
      }
      
      return { count: deletedCount };
    } catch (error) {
      console.error('Error removing sample data:', error);
      throw error;
    }
  }

  /**
   * Reschedule a photoshoot booking
   */
  static async rescheduleBooking(
    bookingId: string, 
    newDate: Date, 
    newTimeSlot: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, bookingId);
      
      await updateDoc(docRef, {
        date: Timestamp.fromDate(new Date(newDate)),
        timeSlot: newTimeSlot,
        updatedAt: serverTimestamp(),
        rescheduledAt: serverTimestamp(),
        previousRescheduleTimes: increment(1), // Keep count of how many times it was rescheduled
      });
    } catch (error) {
      console.error(`Error rescheduling booking ${bookingId}:`, error);
      throw error;
    }
  }
} 