// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://api.kaari.com';

// Photoshoot booking constants
export const MAX_BOOKINGS_PER_DAY = 6;
export const DEFAULT_TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '1:00 PM', '2:00 PM'
];

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'kaari_auth_token',
  USER_DATA: 'kaari_user_data'
}; 