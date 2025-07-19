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
import NotificationService from '../../services/NotificationService';
import { createPhotoshootTeamAssignedNotification, adminNotifications } from '../../utils/notification-helpers';

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
  try {
    // Create a deep copy of the data to avoid mutating the original
    const dataCopy = { ...data };
    const now = new Date();
    
    // Safely convert Timestamp fields to Date objects or use defaults
    // For required date fields
    if (!dataCopy.date || !(dataCopy.date instanceof Timestamp)) {
      console.warn(`Document ${id}: Missing or invalid 'date' field, using current date as fallback`);
      dataCopy.date = Timestamp.fromDate(now);
    }
    
    if (!dataCopy.createdAt || !(dataCopy.createdAt instanceof Timestamp)) {
      console.warn(`Document ${id}: Missing or invalid 'createdAt' field, using current date as fallback`);
      dataCopy.createdAt = Timestamp.fromDate(now);
    }
    
    if (!dataCopy.updatedAt || !(dataCopy.updatedAt instanceof Timestamp)) {
      console.warn(`Document ${id}: Missing or invalid 'updatedAt' field, using current date as fallback`);
      dataCopy.updatedAt = Timestamp.fromDate(now);
    }
    
    // Create base object with all required fields
    const result: any = {
      id,
      ...dataCopy,
      date: dataCopy.date.toDate(),
      createdAt: dataCopy.createdAt.toDate(),
      updatedAt: dataCopy.updatedAt.toDate()
    };
    
    // Only add completedAt if it exists and is valid
    if (dataCopy.completedAt && dataCopy.completedAt instanceof Timestamp) {
      result.completedAt = dataCopy.completedAt.toDate();
    }
    
    // Ensure status has a valid value
    if (!result.status) {
      result.status = 'pending';
    }
    
    return result as PhotoshootBooking;
  } catch (error) {
    console.error(`Error converting document ${id} from Firestore:`, error);
    
    // Return a minimal valid booking object to prevent UI crashes
    return {
      id,
      ...data,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending'
    } as PhotoshootBooking;
  }
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
      
      // Send notification to the advertiser
      const advertiserId = bookingData.advertiserId || bookingData.userId;
      if (advertiserId) {
        // Import NotificationService dynamically to avoid circular dependencies
        const NotificationService = (await import('../../services/NotificationService')).default;
        
        await NotificationService.createNotification(
          advertiserId,
          'advertiser',
          'team_assigned_photoshoot',
          'Photoshoot Scheduled',
          `Your photoshoot for ${bookingData.propertyAddress?.city || 'your property'} has been scheduled for ${bookingData.date} at ${bookingData.timeSlot || 'the scheduled time'}.`,
          `/dashboard/advertiser/photoshoots`,
          { bookingId: docRef.id }
        );
      }
      
      // Also send a notification to admins
      try {
        // This is a simplified approach - in production, you'd have a separate system to identify admin users
        // For now, we'll use a fixed admin ID if you have one, or you can create a more sophisticated system
        const adminUserId = 'admin123'; // Replace with your actual admin user ID or a system to fetch admin IDs
        
        const propertyLocation = bookingData.propertyAddress?.city || 
                                bookingData.city || 
                                `${bookingData.streetName || ''} ${bookingData.city || ''}`.trim() || 
                                'Unknown location';
        const bookingDate = new Date(bookingData.date).toLocaleDateString();
        
        await adminNotifications.newPhotoshootBooking(
          adminUserId,
          docRef.id,
          propertyLocation,
          bookingDate,
          bookingData.timeSlot
        );
      } catch (adminNotifError) {
        // Don't fail the whole operation if admin notification fails
        console.error('Error sending admin notification:', adminNotifError);
      }
      
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
      if (!advertiserId) {
        console.error('No advertiserId provided to getBookingsByAdvertiserId');
        return [];
      }
      
      // First, look for bookings with the advertiserId field
      const q1 = query(
        bookingsCollection, 
        where('advertiserId', '==', advertiserId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot1 = await getDocs(q1);
      
      // Then look for bookings with the userId field (for backward compatibility)
      const q2 = query(
        bookingsCollection, 
        where('userId', '==', advertiserId),
        orderBy('date', 'desc')
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
      
      console.log(`Found ${bookings.length} bookings for advertiser ID ${advertiserId}`);
      
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
      console.log(`Getting booking with ID: ${id}`);
      
      if (!id) {
        console.error('Invalid booking ID provided');
        return null;
      }
      
      const docRef = doc(db, COLLECTION_NAME, id);
      console.log(`Created document reference for ${COLLECTION_NAME}/${id}`);
      
      const docSnap = await getDoc(docRef);
      console.log(`Document snapshot fetched, exists: ${docSnap.exists()}`);
      
      if (!docSnap.exists()) {
        console.log(`No booking found with ID: ${id}`);
        return null;
      }
      
      const data = docSnap.data();
      console.log(`Raw booking data:`, data);
      
      const booking = fromFirestoreBooking(docSnap.id, data);
      console.log(`Converted booking:`, booking);
      
      return booking;
    } catch (error) {
      console.error(`Error getting booking ${id}:`, error);
      // Instead of throwing, return null so the UI can handle the error
      return null;
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
      const bookingRef = doc(db, COLLECTION_NAME, bookingId);
      
      // Update booking status, team info
      await updateDoc(bookingRef, {
        status: 'assigned',
        teamId,
        teamMembers,
        updatedAt: serverTimestamp()
      });
      
      // Get booking data for notification
      const bookingDoc = await getDoc(bookingRef);
      if (!bookingDoc.exists()) {
        throw new Error(`Booking with ID ${bookingId} not found`);
      }
      
      const bookingData = bookingDoc.data();
      const advertiserId = bookingData.advertiserId || bookingData.userId;
      
      // Create notification for the advertiser if available
      if (advertiserId) {
        try {
          // Get booking details for the notification
          const bookingDate = bookingData.date ? new Date(bookingData.date.toDate()).toLocaleDateString() : 'Unknown date';
          const timeSlot = bookingData.timeSlot || 'scheduled time';
          const propertyAddress = bookingData.propertyAddress?.city || '';
          
          await createPhotoshootTeamAssignedNotification(
            advertiserId,
            teamMembers.join(', '),
            bookingId,
            propertyAddress,
            bookingDate,
            timeSlot
          );
          
          console.log(`Notification sent to advertiser ${advertiserId} about team assignment`);
        } catch (error) {
          console.error('Error sending notification about team assignment:', error);
          // Don't fail the whole operation if notification fails
        }
      }
    } catch (error) {
      console.error('Error assigning team to booking:', error);
      throw error;
    }
  }

  /**
   * Mark a booking as completed and link it to a property
   */
  static async completeBooking(
    bookingId: string, 
    propertyId: string, 
    images: string[]
  ): Promise<void> {
    try {
      // Get the booking document reference
      const bookingRef = doc(db, COLLECTION_NAME, bookingId);
      
      // Check if booking exists
      const bookingDoc = await getDoc(bookingRef);
      if (!bookingDoc.exists()) {
        throw new Error(`Booking with ID ${bookingId} not found`);
      }
      
      // Get booking data for notification
      const bookingData = bookingDoc.data();
      const advertiserId = bookingData.advertiserId || bookingData.userId;
      
      // Ensure we have unique images by using a Set
      const uniqueImages = Array.from(new Set(images.filter(img => 
        img && typeof img === 'string' && img.startsWith('http')
      )));
      
      console.log(`Saving ${uniqueImages.length} unique images to booking ${bookingId}`);
      
      // Update the booking
      await updateDoc(bookingRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        propertyId,
        images: uniqueImages,
        updatedAt: serverTimestamp()
      });
      
      // Create a notification if advertiser exists
      if (advertiserId) {
        await NotificationService.createNotification(
          advertiserId,
          'advertiser',
          'property_created',
          'Photoshoot Completed and Property Created',
          `Your photoshoot has been completed and a property listing has been created.`,
          `/dashboard/advertiser/properties`,
          { bookingId, propertyId, imageCount: uniqueImages.length }
        );
        console.log(`Notification sent to advertiser ${advertiserId} about photoshoot completion and property creation`);
      }
      
      // Also notify admin about completion
      try {
        const adminUserId = 'admin123'; // Replace with your actual admin user ID or a system to fetch admin IDs
        
        const propertyLocation = bookingData.propertyAddress?.city || 
                                bookingData.city || 
                                `${bookingData.streetName || ''} ${bookingData.city || ''}`.trim() || 
                                'Unknown location';
        
        await adminNotifications.photoshootCompleted(
          adminUserId,
          bookingId,
          propertyId,
          propertyLocation,
          uniqueImages.length
        );
      } catch (adminNotifError) {
        // Don't fail the whole operation if admin notification fails
        console.error('Error sending admin notification for completion:', adminNotifError);
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    try {
      // Get booking reference
      const bookingRef = doc(db, COLLECTION_NAME, bookingId);
      
      // Get booking data for notification
      const bookingDoc = await getDoc(bookingRef);
      if (!bookingDoc.exists()) {
        throw new Error(`Booking with ID ${bookingId} not found`);
      }
      
      const bookingData = bookingDoc.data();
      const advertiserId = bookingData.advertiserId || bookingData.userId;
      const bookingDate = bookingData.date ? new Date(bookingData.date.toDate()).toLocaleDateString() : 'Unknown date';
      
      // Update booking status
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
        cancellationReason: reason || 'No reason provided'
      });
      
      // Create a notification
      if (advertiserId) {
        await NotificationService.createNotification(
          advertiserId,
          'advertiser',
          'photoshoot_cancelled',
          'Photoshoot Booking Cancelled',
          `Your photoshoot booking for ${bookingDate} has been cancelled${reason ? `: ${reason}` : '.'}`,
          `/dashboard/advertiser/photoshoot`,
          { bookingId, reason }
        );
        console.log(`Notification sent to advertiser ${advertiserId} about booking cancellation`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
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
      // Get the booking reference
      const bookingRef = doc(db, COLLECTION_NAME, bookingId);
      
      // Check if booking exists and get data for notification
      const bookingDoc = await getDoc(bookingRef);
      if (!bookingDoc.exists()) {
        throw new Error(`Booking with ID ${bookingId} not found`);
      }
      
      // Get booking data
      const bookingData = bookingDoc.data();
      const advertiserId = bookingData.advertiserId || bookingData.userId;
      const oldDate = bookingData.date ? new Date(bookingData.date.toDate()).toLocaleDateString() : 'Unknown date';
      const oldTimeSlot = bookingData.timeSlot || 'Unknown time';
      
      // Update the booking
      await updateDoc(bookingRef, {
        date: Timestamp.fromDate(newDate),
        timeSlot: newTimeSlot,
        updatedAt: serverTimestamp()
      });
      
      // Create a notification
      if (advertiserId) {
        await NotificationService.createNotification(
          advertiserId,
          'advertiser',
          'photoshoot_reminder',
          'Photoshoot Rescheduled',
          `Your photoshoot has been rescheduled from ${oldDate} at ${oldTimeSlot} to ${newDate.toLocaleDateString()} at ${newTimeSlot}.`,
          `/dashboard/advertiser/photoshoot`,
          { bookingId, oldDate, oldTimeSlot, newDate, newTimeSlot }
        );
        console.log(`Notification sent to advertiser ${advertiserId} about booking reschedule`);
      }
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      throw error;
    }
  }

  /**
   * Get photoshoots by advertiser ID for the Advertiser Moderation page
   */
  static async getPhotoshootsByAdvertiserId(advertiserId: string): Promise<any[]> {
    try {
      // First try with advertiserId field
      const q1 = query(
        bookingsCollection,
        where('advertiserId', '==', advertiserId)
      );
      
      let querySnapshot = await getDocs(q1);
      
      // If no results, try with userId field (older format)
      if (querySnapshot.empty) {
        const q2 = query(
          bookingsCollection,
          where('userId', '==', advertiserId)
        );
        querySnapshot = await getDocs(q2);
      }
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Format dates
        const requestDate = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toLocaleDateString() 
          : 'Unknown';
        
        const scheduledDate = data.date instanceof Timestamp 
          ? data.date.toDate().toLocaleDateString() 
          : 'Unknown';
        
        // Get property title or address
        let propertyTitle = data.propertyTitle || '';
        
        // If no propertyTitle, try to construct from address fields
        if (!propertyTitle) {
          if (data.propertyAddress) {
            propertyTitle = `${data.propertyAddress.street || ''} ${data.propertyAddress.city || ''}`.trim();
          } else {
            propertyTitle = `${data.streetName || ''} ${data.streetNumber || ''} ${data.city || ''}`.trim();
          }
          
          if (!propertyTitle) {
            propertyTitle = 'Unknown Property';
          }
        }
        
        return {
          id: doc.id,
          propertyTitle,
          requestDate,
          scheduledDate,
          status: data.status === 'completed' ? 'done' : 'pending'
        };
      });
    } catch (error) {
      console.error('Error fetching photoshoots by advertiser ID:', error);
      throw new Error('Failed to fetch photoshoots by advertiser ID');
    }
  }
} 

/**
 * Get photoshoots by advertiser ID for the Advertiser Moderation page
 */
export const getPhotoshootsByAdvertiserId = async (advertiserId: string): Promise<any[]> => {
  return PhotoshootBookingServerActions.getPhotoshootsByAdvertiserId(advertiserId);
}; 