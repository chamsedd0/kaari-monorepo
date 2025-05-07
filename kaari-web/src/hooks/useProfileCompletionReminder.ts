import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { useToastService } from '../services/ToastService';
import { isProfileComplete, getProfileCompletionMessage } from '../utils/profile-utils';
import eventBus, { EventType } from '../utils/event-bus';

/**
 * Custom hook that shows a profile completion reminder when the user logs in
 * if their profile information is incomplete
 */
export const useProfileCompletionReminder = () => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToastService();
  
  // Single effect to handle auth state changes
  useEffect(() => {
    // Only proceed if user is authenticated
    if (isAuthenticated && user) {
      // Wait a bit to ensure all user data is loaded
      const timer = setTimeout(() => {
        checkProfileCompleteness();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.id]); // Only run when auth state or user ID changes
  
  // Also listen for explicit sign-in events
  useEffect(() => {
    const handleSignIn = () => {
      // Short delay to ensure user data is loaded
      setTimeout(() => {
        if (user) {
          checkProfileCompleteness();
        }
      }, 1500); // Slightly longer delay for sign-in events
    };
    
    const unsubscribe = eventBus.on(EventType.AUTH_SIGNED_IN, handleSignIn);
    return () => unsubscribe();
  }, []);
  
  const checkProfileCompleteness = () => {
    if (!user) return;
    
    // Check if profile is complete
    const isComplete = isProfileComplete(user);
    
    // Only show notification for incomplete profiles
    if (!isComplete) {
      // Get a message about what's missing
      const message = getProfileCompletionMessage(user);
      
      // The toast service will now prevent duplicates
      toast.profile.profileIncomplete(message, user.role);
      
      // Emit profile completion reminder event
      eventBus.emit(EventType.PROFILE_COMPLETION_REMINDER, {
        message,
        role: user.role,
        timestamp: Date.now()
      });
    }
  };
}; 