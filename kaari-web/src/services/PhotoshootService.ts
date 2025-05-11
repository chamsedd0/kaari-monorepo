import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { advertiserNotifications } from '../utils/notification-helpers';

// Define booking status types
export type PhotoshootStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

// Define photoshoot booking interface
export interface PhotoshootBooking {
  id?: string;
  propertyId: string;
  propertyTitle: string;
  advertiserId: string;
  advertiserName: string;
  date: Timestamp;
  timeSlot: string;
  address: string;
  status: PhotoshootStatus;
  specialInstructions?: string;
  photographerAssigned?: boolean;
  photographerId?: string;
  photographerName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  cancelReason?: string;
}

class PhotoshootService {
  private collection = 'photoshoots';

  // Create a new photoshoot booking
  async createBooking(bookingData: Omit<PhotoshootBooking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const newBooking = {
        ...bookingData,
        status: 'pending' as PhotoshootStatus,
        createdAt: now,
        updatedAt: now,
      };

      // Add to database
      const docRef = await addDoc(collection(db, this.collection), newBooking);
      
      // Send notification to advertiser
      await advertiserNotifications.photoshootBooked(
        bookingData.advertiserId,
        {
          id: docRef.id,
          ...bookingData,
          date: bookingData.date.toDate(),
          status: 'pending'
        } as any // Converting Timestamp to Date
      );
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating photoshoot booking:', error);
      throw error;
    }
  }

  // Get a booking by ID
  async getBooking(bookingId: string): Promise<PhotoshootBooking | null> {
    try {
      const docRef = doc(db, this.collection, bookingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as PhotoshootBooking;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting photoshoot booking:', error);
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(
    bookingId: string, 
    status: PhotoshootStatus, 
    reason?: string
  ): Promise<void> {
    try {
      const bookingRef = doc(db, this.collection, bookingId);
      
      await updateDoc(bookingRef, {
        status,
        updatedAt: Timestamp.now(),
        ...(status === 'cancelled' ? { cancelReason: reason } : {})
      });
      
      // If status is confirmed, send reminder notification
      if (status === 'confirmed') {
        const booking = await this.getBooking(bookingId);
        if (booking) {
          // Send notification using date from the booking
          await advertiserNotifications.photoshootBooked(
            booking.advertiserId,
            {
              id: booking.id!,
              propertyId: booking.propertyId,
              propertyTitle: booking.propertyTitle,
              date: booking.date.toDate(),
              advertiserId: booking.advertiserId
            } as any // Converting Timestamp to Date
          );
        }
      }
    } catch (error) {
      console.error('Error updating photoshoot booking status:', error);
      throw error;
    }
  }
  
  // Assign photographer to booking
  async assignPhotographer(
    bookingId: string,
    photographerId: string,
    photographerName: string
  ): Promise<void> {
    try {
      const bookingRef = doc(db, this.collection, bookingId);
      
      await updateDoc(bookingRef, {
        photographerId,
        photographerName,
        photographerAssigned: true,
        updatedAt: Timestamp.now()
      });
      
      // Notification could be sent here if needed
    } catch (error) {
      console.error('Error assigning photographer:', error);
      throw error;
    }
  }
  
  // Get advertiser's photoshoot bookings
  async getAdvertiserBookings(advertiserId: string): Promise<PhotoshootBooking[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('advertiserId', '==', advertiserId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as PhotoshootBooking[];
    } catch (error) {
      console.error('Error getting advertiser bookings:', error);
      throw error;
    }
  }
  
  // Get property's photoshoot bookings
  async getPropertyBookings(propertyId: string): Promise<PhotoshootBooking[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('propertyId', '==', propertyId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as PhotoshootBooking[];
    } catch (error) {
      console.error('Error getting property bookings:', error);
      throw error;
    }
  }
  
  // Get bookings assigned to a photographer
  async getPhotographerBookings(photographerId: string): Promise<PhotoshootBooking[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('photographerId', '==', photographerId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as PhotoshootBooking[];
    } catch (error) {
      console.error('Error getting photographer bookings:', error);
      throw error;
    }
  }
  
  // Get upcoming photoshoot bookings
  async getUpcomingBookings(): Promise<PhotoshootBooking[]> {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, this.collection),
        where('date', '>=', now),
        where('status', '==', 'confirmed'),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as PhotoshootBooking[];
    } catch (error) {
      console.error('Error getting upcoming bookings:', error);
      throw error;
    }
  }
}

export default new PhotoshootService(); 