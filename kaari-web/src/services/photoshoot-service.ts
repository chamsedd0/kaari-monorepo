import { DEFAULT_TIME_SLOTS } from '../config/constants';
import firebaseBookings from '../firebase/firestore/photoshoot-bookings';
import { getAuth } from 'firebase/auth';

// Fallback API URL in case the import from constants fails
const API_URL = (() => {
  try {
    const { API_URL } = require('../config/constants');
    return API_URL;
  } catch (error) {
    console.warn('Failed to import API_URL from constants, using fallback');
    return 'https://api.kaari.com';
  }
})();

export interface PhotoshootBookingData {
  streetName: string;
  streetNumber: string;
  floor: string;
  flat: string;
  postalCode: string;
  city: string;
  stateRegion: string;
  country: string;
  propertyType: string;
  date: string;
  timeSlot: string;
  comments: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
}

export interface AvailabilityResponse {
  available: boolean;
  conflicts?: {
    date: string;
    timeSlot: string;
  }[];
}

class PhotoshootService {
  /**
   * Check if a specific date and time slot is available
   */
  async checkAvailability(date: Date, timeSlot?: string): Promise<AvailabilityResponse> {
    try {
      const isAvailable = await firebaseBookings.checkTimeSlotAvailability(date, timeSlot);
      
      if (isAvailable) {
        return { available: true };
      }
      
      // If not available, get all available slots to show conflicts
      const availableSlots = await firebaseBookings.getAvailableTimeSlots(date, DEFAULT_TIME_SLOTS);
      const bookedSlots = DEFAULT_TIME_SLOTS.filter(slot => !availableSlots.includes(slot));
      
      const formattedDate = this.formatDateForAPI(date);
      return { 
        available: false,
        conflicts: bookedSlots.map(slot => ({ date: formattedDate, timeSlot: slot }))
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
  
  /**
   * Submit a photoshoot booking
   */
  async bookPhotoshoot(bookingData: PhotoshootBookingData): Promise<BookingResponse> {
    try {
      // First check if the time slot is available
      const date = new Date(bookingData.date);
      const availabilityResponse = await this.checkAvailability(date, bookingData.timeSlot);
      
      if (!availabilityResponse.available) {
        return { 
          success: false, 
          message: 'This time slot is no longer available. Please select another time.'
        };
      }
      
      // Get current user if logged in
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      
      // Store in Firestore
      const bookingId = await firebaseBookings.addBooking(bookingData, userId);
      
      return {
        success: true,
        message: 'Photoshoot booked successfully!',
        bookingId
      };
    } catch (error) {
      console.error('Error booking photoshoot:', error);
      throw error;
    }
  }
  
  /**
   * Get available time slots for a specific date
   */
  async getAvailableTimeSlots(date: Date): Promise<string[]> {
    try {
      return await firebaseBookings.getAvailableTimeSlots(date, DEFAULT_TIME_SLOTS);
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw error;
    }
  }
  
  /**
   * Format a date object to YYYY-MM-DD string for API usage
   */
  private formatDateForAPI(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}

export default new PhotoshootService(); 