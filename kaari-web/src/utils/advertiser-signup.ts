import eventBus, { EventType } from './event-bus';
import { getAuth, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../backend/firebase/config';

// Constants for localStorage keys
const ADVERTISER_SIGNUP_KEY = 'kaari-advertiser-signup';
const ADVERTISER_SIGNUP_EXPIRY_KEY = 'kaari-advertiser-signup-expiry';

// Expiry time for the signup data (24 hours in milliseconds)
const SIGNUP_EXPIRY_TIME = 24 * 60 * 60 * 1000;

// Interface for the signup data
export interface AdvertiserSignupData {
  step: number;
  formData: any;
  timestamp: number;
  userId?: string; // Store the user ID if they were logged in
}

/**
 * Save the advertiser signup progress to localStorage
 * @param data The signup data to save
 */
export const saveSignupProgress = (data: AdvertiserSignupData): void => {
  try {
    // Set expiry time to 24 hours from now
    const expiryTime = Date.now() + SIGNUP_EXPIRY_TIME;
    
    // Check if user is logged in and add userId to data
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      data.userId = currentUser.uid;
    } else {
      // If no user is logged in, don't save progress
      console.warn('Attempted to save signup progress without authentication');
      return;
    }
    
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
      // Data has expired, clear it and delete the user if they didn't complete signup
      abandonSignup();
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
 * Handle an abandoned signup by deleting the user if they didn't complete the process
 */
export const abandonSignup = async (): Promise<void> => {
  try {
    // Get the saved data
    const savedData = localStorage.getItem(ADVERTISER_SIGNUP_KEY);
    if (!savedData) return;
    
    const data = JSON.parse(savedData) as AdvertiserSignupData;
    const userId = data.userId;
    
    // Clear the saved progress
    clearSignupProgress();
    
    // If there's no userId, we can't do anything
    if (!userId) return;
    
    // Get current auth state
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    // If the current user matches the saved user, check their status in Firestore
    if (currentUser && currentUser.uid === userId) {
      try {
        // Get the user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        // Only delete if the user hasn't completed signup
        if (!userDoc.exists() || 
            (userDoc.data().signupStatus !== 'completed' && 
             userDoc.data().signupStatus !== 'email_verified')) {
          console.log('Deleting incomplete signup user:', userId);
          
          try {
            // Delete the user document from Firestore first
            await deleteDoc(doc(db, 'users', userId));
            
            // Then delete the user from Firebase Auth
            await deleteUser(currentUser);
            
            // Emit event for tracking
            eventBus.emit(EventType.ADVERTISER_SIGNUP_ABANDONED, {
              lastStep: data.step,
              timestamp: Date.now()
            });
            
            console.log('User deleted successfully');
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    }
  } catch (error) {
    console.error('Failed to handle abandoned signup:', error);
  }
};

/**
 * Check if there's an incomplete signup and redirect if needed
 * @returns True if there's an incomplete signup, false otherwise
 */
export const checkIncompleteSignup = async (): Promise<boolean> => {
  const signupData = getSignupProgress();
  
  // If we're already on the signup pages, don't redirect
  const currentPath = window.location.pathname;
  if (
    currentPath === '/advertiser-signup' || 
    currentPath === '/advertiser-signup/form' ||
    currentPath === '/become-advertiser' || 
    currentPath === '/become-advertiser/thank-you' ||
    currentPath === '/email-verification/waiting' ||
    currentPath === '/email-verification/success' ||
    currentPath === '/email-verification/error'
  ) {
    return false;
  }
  
  // Get current auth state
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  // Check if the user is authenticated and has an incomplete signup in Firestore
  if (currentUser) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // If user has a signupStatus in Firestore
        if (userData.signupStatus) {
          // If signup is not completed, redirect to the appropriate page
          if (userData.signupStatus === 'awaiting_verification') {
            // Check if verification has expired
            const verificationExpiry = userData.verificationExpiry?.toDate();
            if (verificationExpiry && verificationExpiry > new Date()) {
              // Verification still valid, redirect to waiting page
              window.location.href = '/email-verification/waiting';
              return true;
            } else {
              // Verification expired, delete user and redirect to signup
              await abandonSignup();
              window.location.href = '/advertiser-signup/form';
              return true;
            }
          } else if (userData.signupStatus === 'email_verified') {
            // Email verified but signup not completed, redirect to onboarding
            window.location.href = '/become-advertiser';
            return true;
          }
          // If completed, do nothing
        }
      }
    } catch (error) {
      console.error('Error checking user signup status in Firestore:', error);
    }
  }
  
  // If there's no saved progress, redirect to the initial signup page
  if (!signupData) {
    // Only redirect if this is a marketing link
    if (currentPath === '/for-advertisers') {
      window.location.href = '/advertiser-signup';
      return true;
    }
    return false;
  }
  
  // Only proceed if user is authenticated
  if (!currentUser) {
    // User is not authenticated, clear the progress and handle abandoned signup
    abandonSignup();
    return false;
  }
  
  // If the signup data has a userId, make sure the same user is still logged in
  if (signupData.userId && signupData.userId !== currentUser.uid) {
    // Different user, clear the progress and handle abandoned signup
    abandonSignup();
    return false;
  }
  
  // If we're on the thank you page, clear the progress
  if (currentPath === '/become-advertiser/thank-you') {
    clearSignupProgress();
    return false;
  }
  
  // Otherwise, redirect to the signup page
  window.location.href = '/become-advertiser';
  return true;
};

/**
 * Register a listener to check for incomplete signup on route changes
 */
export const registerSignupListener = (): () => void => {
  return eventBus.on(EventType.NAV_ROUTE_CHANGED, () => {
    // Skip checking if we're on the signup or verification pages
    if (
      window.location.pathname === '/advertiser-signup' ||
      window.location.pathname === '/advertiser-signup/form' ||
      window.location.pathname === '/become-advertiser' || 
      window.location.pathname === '/become-advertiser/thank-you' ||
      window.location.pathname === '/email-verification/waiting' ||
      window.location.pathname === '/email-verification/success' ||
      window.location.pathname === '/email-verification/error'
    ) {
      return;
    }
    
    // Check for incomplete signup (async)
    checkIncompleteSignup().catch(error => {
      console.error('Error checking incomplete signup:', error);
    });
  });
};

/**
 * Register a listener to clear signup progress on sign out
 */
export const registerAuthListener = (): () => void => {
  return eventBus.on(EventType.AUTH_SIGNED_OUT, () => {
    // Handle abandoned signup when user signs out
    abandonSignup();
  });
};

/**
 * Hides all headers and footers on the page
 * This is used in the signup flow to ensure a clean, immersive experience
 * @returns A cleanup function to be used in useEffect
 */
export const hideHeadersAndFooters = (): (() => void) => {
  // Function to find and hide headers and footers
  const hideElements = () => {
    // Find any global headers or footers and hide them
    const headers = document.querySelectorAll('header, [class*="header"], [id*="header"], [class*="Header"], [id*="Header"]');
    const footers = document.querySelectorAll('footer, [class*="footer"], [id*="footer"], [class*="Footer"], [id*="Footer"]');
    const navs = document.querySelectorAll('nav, [class*="nav"], [id*="nav"], [class*="Nav"], [id*="Nav"]');
    
    const elementsToHide = [...headers, ...footers, ...navs];
    
    elementsToHide.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.setAttribute('data-hidden-by-signup', 'true');
      }
    });
  };
  
  // Call immediately
  hideElements();
  
  // Call again after a short delay to catch any elements that might be rendered later
  const timeoutId = setTimeout(hideElements, 100);
  
  // Set up an interval to keep hiding elements (some frameworks might re-render)
  const intervalId = setInterval(hideElements, 500);
  
  // Set up a MutationObserver to detect and hide dynamically added headers
  const observer = new MutationObserver((mutations) => {
    let shouldHide = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldHide = true;
      }
    });
    
    if (shouldHide) {
      hideElements();
    }
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    observer.disconnect();
    
    // Restore elements that were hidden
    const hiddenElements = document.querySelectorAll('[data-hidden-by-signup="true"]');
    hiddenElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.display = '';
        element.style.visibility = '';
        element.removeAttribute('data-hidden-by-signup');
      }
    });
  };
};

/**
 * Check if the current page is part of the advertiser signup flow
 * @returns True if the current page is part of the signup flow
 */
export const isInSignupFlow = (): boolean => {
  const currentPath = window.location.pathname;
  return (
    currentPath === '/advertiser-signup' ||
    currentPath === '/advertiser-signup/form' ||
    currentPath === '/become-advertiser' ||
    currentPath === '/become-advertiser/thank-you' ||
    currentPath === '/email-verification' ||
    currentPath === '/email-verification/waiting' ||
    currentPath === '/email-verification/success' ||
    currentPath === '/email-verification/error'
  );
}; 