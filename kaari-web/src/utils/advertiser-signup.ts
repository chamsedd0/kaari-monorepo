import eventBus, { EventType } from './event-bus';

// Constants for localStorage keys
const ADVERTISER_SIGNUP_KEY = 'kaari-advertiser-signup';
const ADVERTISER_SIGNUP_EXPIRY_KEY = 'kaari-advertiser-signup-expiry';

// Expiry time for the signup data (24 hours in milliseconds)
const SIGNUP_EXPIRY_TIME = 24 * 60 * 60 * 1000;

// Interface for the signup data
export interface AdvertiserSignupData {
  step: number;
  showOnboarding: boolean;
  formData: any;
  timestamp: number;
}

/**
 * Save the advertiser signup progress to localStorage
 * @param data The signup data to save
 */
export const saveSignupProgress = (data: AdvertiserSignupData): void => {
  try {
    // Set expiry time to 24 hours from now
    const expiryTime = Date.now() + SIGNUP_EXPIRY_TIME;
    
    // Save the data and expiry time to localStorage
    localStorage.setItem(ADVERTISER_SIGNUP_KEY, JSON.stringify(data));
    localStorage.setItem(ADVERTISER_SIGNUP_EXPIRY_KEY, expiryTime.toString());
    
    // Emit event for tracking
    eventBus.emit(EventType.ADVERTISER_SIGNUP_PROGRESS, {
      step: data.step,
      formData: data.formData,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Failed to save signup progress:', error);
  }
};

/**
 * Get the saved advertiser signup progress from localStorage
 * @returns The signup data or null if not found or expired
 */
export const getSignupProgress = (): AdvertiserSignupData | null => {
  try {
    // Check if the data exists
    const savedData = localStorage.getItem(ADVERTISER_SIGNUP_KEY);
    const expiryTimeStr = localStorage.getItem(ADVERTISER_SIGNUP_EXPIRY_KEY);
    
    if (!savedData || !expiryTimeStr) {
      return null;
    }
    
    // Check if the data has expired
    const expiryTime = parseInt(expiryTimeStr, 10);
    if (Date.now() > expiryTime) {
      // Data has expired, clear it
      clearSignupProgress();
      return null;
    }
    
    // Parse and return the data
    return JSON.parse(savedData);
  } catch (error) {
    console.error('Failed to get signup progress:', error);
    return null;
  }
};

/**
 * Clear the advertiser signup progress from localStorage
 */
export const clearSignupProgress = (): void => {
  try {
    localStorage.removeItem(ADVERTISER_SIGNUP_KEY);
    localStorage.removeItem(ADVERTISER_SIGNUP_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear signup progress:', error);
  }
};

/**
 * Mark the advertiser signup as started
 */
export const startSignup = (): void => {
  eventBus.emit(EventType.ADVERTISER_SIGNUP_STARTED, {
    timestamp: Date.now()
  });
};

/**
 * Mark the advertiser signup as completed
 */
export const completeSignup = (): void => {
  // Clear the saved progress
  clearSignupProgress();
  
  // Emit completion event
  eventBus.emit(EventType.ADVERTISER_SIGNUP_COMPLETED, {
    timestamp: Date.now()
  });
};

/**
 * Check if there's an incomplete signup and redirect if needed
 * @returns True if there's an incomplete signup, false otherwise
 */
export const checkIncompleteSignup = (): boolean => {
  const signupData = getSignupProgress();
  
  if (signupData) {
    // If we're already on the signup page, don't redirect
    if (window.location.pathname === '/become-advertiser') {
      return true;
    }
    
    // If we're on the thank you page, clear the progress
    if (window.location.pathname === '/become-advertiser/thank-you') {
      clearSignupProgress();
      return false;
    }
    
    // Otherwise, redirect to the signup page
    window.location.href = '/become-advertiser';
    return true;
  }
  
  return false;
};

/**
 * Register a listener to check for incomplete signup on route changes
 */
export const registerSignupListener = (): () => void => {
  return eventBus.on(EventType.NAV_ROUTE_CHANGED, () => {
    // Skip checking if we're on the signup or thank you page
    if (
      window.location.pathname === '/become-advertiser' || 
      window.location.pathname === '/become-advertiser/thank-you'
    ) {
      return;
    }
    
    // Check for incomplete signup
    checkIncompleteSignup();
  });
}; 