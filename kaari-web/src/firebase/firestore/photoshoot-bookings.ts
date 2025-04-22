import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  DocumentData,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';
import { PhotoshootBookingData } from '../../services/photoshoot-service';

// Collection reference
const COLLECTION_NAME = 'photoshoot-bookings';
const bookingsCollection = collection(db, COLLECTION_NAME);

// Interfaces
interface FirestoreBooking extends Omit<PhotoshootBookingData, 'date'> {
  date: Timestamp;
  createdAt: Timestamp;
  userId?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingId: string;
}

// Convert dates to Firestore Timestamp
const convertToFirestoreBooking = (booking: PhotoshootBookingData, userId?: string): Omit<FirestoreBooking, 'bookingId'> => {
  return {
    ...booking,
    date: Timestamp.fromDate(new Date(booking.date)),
    createdAt: serverTimestamp() as Timestamp,
    userId: userId || undefined,
    status: 'pending'
  };
};

// Add a booking to Firestore
export const addBooking = async (bookingData: PhotoshootBookingData, userId?: string): Promise<string> => {
  try {
    const firestoreData = convertToFirestoreBooking(bookingData, userId);
    const docRef = await addDoc(bookingsCollection, firestoreData);
    
    // Update the document with its own ID as the bookingId
    const bookingId = docRef.id;
    
    return bookingId;
  } catch (error) {
    console.error('Error adding booking to Firestore:', error);
    throw error;
  }
};

// Check if a time slot is available
export const checkTimeSlotAvailability = async (date: Date, timeSlot?: string): Promise<boolean> => {
  try {
    // Convert the date to start of day and end of day for query
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);
    
    // Create a query to check for bookings on this date
    let q = query(
      bookingsCollection,
      where('date', '>=', startTimestamp),
      where('date', '<=', endTimestamp),
      where('status', '!=', 'cancelled')
    );
    
    const querySnapshot = await getDocs(q);
    
    // If no specific time slot provided, just check if the date is fully booked
    if (!timeSlot) {
      // Consider a day fully booked if it has 6 or more bookings
      return querySnapshot.size < 6;
    }
    
    // If time slot provided, check if it's already booked
    const isTimeSlotBooked = querySnapshot.docs.some(doc => {
      const data = doc.data();
      return data.timeSlot === timeSlot;
    });
    
    return !isTimeSlotBooked;
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    throw error;
  }
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (date: Date, allTimeSlots: string[]): Promise<string[]> => {
  try {
    // Convert the date to start of day and end of day for query
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);
    
    // Create a query to check for bookings on this date
    let q = query(
      bookingsCollection,
      where('date', '>=', startTimestamp),
      where('date', '<=', endTimestamp),
      where('status', '!=', 'cancelled')
    );
    
    const querySnapshot = await getDocs(q);
    
    // Extract booked time slots
    const bookedTimeSlots = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return data.timeSlot;
    });
    
    // Return only time slots that are not already booked
    return allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));
  } catch (error) {
    console.error('Error getting available time slots:', error);
    throw error;
  }
};

// Get all bookings for a user
export const getUserBookings = async (userId: string): Promise<DocumentData[]> => {
  try {
    const q = query(
      bookingsCollection,
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

export default {
  addBooking,
  checkTimeSlotAvailability,
  getAvailableTimeSlots,
  getUserBookings
}; 