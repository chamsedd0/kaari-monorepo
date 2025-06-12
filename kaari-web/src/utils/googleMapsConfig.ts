/**
 * Centralized Google Maps API configuration
 * This ensures we use consistent settings across the entire application
 */

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyCqhbPAiPspwgshgE9lzbtkpFZwVMfJoww';

// Loader ID - must be consistent across the application
export const GOOGLE_MAPS_LOADER_ID = 'google-maps-loader';

// Library configurations - using 'any' to avoid type conflicts with different versions of the Google Maps API
export const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry'] as any[];

// Default loader options
export const getGoogleMapsLoaderOptions = () => ({
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  libraries: GOOGLE_MAPS_LIBRARIES,
  id: GOOGLE_MAPS_LOADER_ID,
  version: 'weekly',
  language: 'en',
  region: 'US'
}); 