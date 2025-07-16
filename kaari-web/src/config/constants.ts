// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://api.kaari.com';

// Photoshoot booking constants
export const MAX_BOOKINGS_PER_DAY = 6;
export const DEFAULT_TIME_SLOTS = [
  '10:00', '12:00', '14:00', '16:00'
];

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'kaari_auth_token',
  USER_DATA: 'kaari_user_data'
}; 