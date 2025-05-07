import { useToast, ToastType } from '../contexts/ToastContext';
import { useStore } from '../backend/store';
import eventBus, { EventType } from '../utils/event-bus';

/**
 * ToastService - Utility service to provide standardized toast notifications
 * for different actions across the application.
 */
export const useToastService = () => {
  const { addToast } = useToast();

  /**
   * Show a toast notification
   */
  const showToast = (
    type: ToastType,
    title: string,
    description: string,
    autoClose = true,
    duration = 5000
  ) => {
    addToast(type, title, description, autoClose, duration);
  };

  // ===== Authentication Toasts =====
  const authToasts = {
    loginSuccess: () => {
      showToast('success', 'Login Successful', 'You have been logged in successfully.');
    },
    loginError: (error?: string) => {
      showToast('error', 'Login Failed', error || 'There was a problem logging you in. Please try again.');
    },
    logoutSuccess: () => {
      showToast('success', 'Logout Successful', 'You have been logged out successfully.');
    },
    registrationSuccess: () => {
      showToast('success', 'Registration Successful', 'Your account has been created successfully. Welcome to Kaari!');
    },
    registrationError: (error?: string) => {
      showToast('error', 'Registration Failed', error || 'There was a problem creating your account. Please try again.');
    },
    resetPasswordSuccess: () => {
      showToast('success', 'Password Reset Email Sent', 'Check your email for instructions to reset your password.');
    },
    resetPasswordError: (error?: string) => {
      showToast('error', 'Password Reset Failed', error || 'There was a problem sending the password reset email. Please try again.');
    },
    passwordChangeSuccess: () => {
      showToast('success', 'Password Changed', 'Your password has been updated successfully.');
    },
    verificationEmailSent: () => {
      showToast('info', 'Verification Email Sent', 'Check your email for a verification link.');
    }
  };

  // ===== Profile Toasts =====
  const profileToasts = {
    updateSuccess: () => {
      showToast('success', 'Profile Updated', 'Your profile has been updated successfully.');
    },
    updateError: (error?: string) => {
      showToast('error', 'Profile Update Failed', error || 'There was a problem updating your profile. Please try again.');
    },
    uploadPhotoSuccess: () => {
      showToast('success', 'Photo Uploaded', 'Your profile photo has been uploaded successfully.');
    },
    uploadPhotoError: (error?: string) => {
      showToast('error', 'Photo Upload Failed', error || 'There was a problem uploading your photo. Please try again.');
    },
    uploadDocumentSuccess: () => {
      showToast('success', 'Document Uploaded', 'Your document has been uploaded successfully.');
    },
    uploadDocumentError: (error?: string) => {
      showToast('error', 'Document Upload Failed', error || 'There was a problem uploading your document. Please try again.');
    },
    verificationSuccess: () => {
      showToast('success', 'Verification Successful', 'Your identity has been verified successfully.');
    },
    verificationPending: () => {
      showToast('info', 'Verification Pending', 'Your identity verification is pending review.');
    },
    verificationRejected: (reason?: string) => {
      showToast('error', 'Verification Rejected', reason || 'Your identity verification has been rejected. Please try again with valid documents.');
    },
    profileIncomplete: (message?: string, userRole?: string) => {
      const baseMessage = message || 'Please complete your profile information for a better experience.';
      const profilePath = userRole === 'advertiser' 
        ? '/dashboard/advertiser/profile' 
        : '/dashboard/user/profile';
      
      // Always use same title to help prevent duplicates
      const title = 'Complete Your Profile';
      
      showToast(
        'info',
        title,
        `${baseMessage} Visit your profile page to complete your information.`,
        true,
        8000
      );
      
      // Also emit an event that profile navigation is suggested
      eventBus.emit(EventType.PROFILE_NAVIGATION_SUGGESTED, {
        path: profilePath,
        reason: 'incomplete_profile',
        timestamp: Date.now()
      });
    }
  };

  // ===== Property Toasts =====
  const propertyToasts = {
    createSuccess: () => {
      showToast('success', 'Property Created', 'Your property has been created successfully.');
    },
    createError: (error?: string) => {
      showToast('error', 'Creation Failed', error || 'There was a problem creating your property. Please try again.');
    },
    updateSuccess: () => {
      showToast('success', 'Property Updated', 'Your property information has been updated successfully.');
    },
    updateError: (error?: string) => {
      showToast('error', 'Update Failed', error || 'There was a problem updating your property. Please try again.');
    },
    deleteSuccess: () => {
      showToast('success', 'Property Deleted', 'Your property has been deleted successfully.');
    },
    deleteError: (error?: string) => {
      showToast('error', 'Deletion Failed', error || 'There was a problem deleting your property. Please try again.');
    },
    listingCreateSuccess: () => {
      showToast('success', 'Listing Created', 'Your property listing has been created successfully.');
    },
    listingUpdateSuccess: () => {
      showToast('success', 'Listing Updated', 'Your property listing has been updated successfully.');
    },
    editRequestSuccess: () => {
      showToast('success', 'Edit Request Submitted', 'Your property edit request has been submitted successfully.');
    },
    editRequestApproved: () => {
      showToast('success', 'Edit Request Approved', 'Your property edit request has been approved.');
    },
    editRequestRejected: (reason?: string) => {
      showToast('warning', 'Edit Request Rejected', reason || 'Your property edit request has been rejected.');
    }
  };

  // ===== Support Toasts =====
  const supportToasts = {
    messageSuccess: () => {
      showToast('success', 'Message Sent', 'Your message has been sent to our support team. We will get back to you soon.');
    },
    messageError: (error?: string) => {
      showToast('error', 'Message Failed', error || 'There was a problem sending your message. Please try again.');
    }
  };

  // ===== Booking Toasts =====
  const bookingToasts = {
    createSuccess: () => {
      showToast('success', 'Booking Created', 'Your booking has been created successfully.');
    },
    createError: (error?: string) => {
      showToast('error', 'Booking Failed', error || 'There was a problem creating your booking. Please try again.');
    },
    updateSuccess: () => {
      showToast('success', 'Booking Updated', 'Your booking has been updated successfully.');
    },
    cancelSuccess: () => {
      showToast('success', 'Booking Cancelled', 'Your booking has been cancelled successfully.');
    },
    photoshootScheduleSuccess: () => {
      showToast('success', 'Photoshoot Scheduled', 'Your photoshoot has been scheduled successfully.');
    }
  };

  // ===== Team Management Toasts =====
  const teamToasts = {
    createSuccess: () => {
      showToast('success', 'Team Created', 'Your team has been created successfully.');
    },
    updateSuccess: () => {
      showToast('success', 'Team Updated', 'Your team has been updated successfully.');
    },
    memberAddedSuccess: (memberName?: string) => {
      showToast('success', 'Member Added', `${memberName || 'The member'} has been added to your team.`);
    },
    memberRemovedSuccess: (memberName?: string) => {
      showToast('success', 'Member Removed', `${memberName || 'The member'} has been removed from your team.`);
    }
  };

  // ===== General Application Toasts =====
  const appToasts = {
    actionSuccess: (action: string) => {
      showToast('success', 'Success', `${action} completed successfully.`);
    },
    actionError: (action: string, error?: string) => {
      showToast('error', 'Error', error || `There was a problem with ${action}. Please try again.`);
    },
    connectionError: () => {
      showToast('error', 'Connection Error', 'There was a problem connecting to the server. Please check your internet connection and try again.', false);
    },
    sessionExpired: () => {
      showToast('warning', 'Session Expired', 'Your session has expired. Please log in again.', false);
    },
    permissionDenied: () => {
      showToast('error', 'Permission Denied', 'You do not have permission to perform this action.');
    },
    featureNotAvailable: () => {
      showToast('info', 'Coming Soon', 'This feature is not available yet. Stay tuned!');
    },
    dataSaved: () => {
      showToast('success', 'Data Saved', 'Your changes have been saved successfully.');
    },
    dataLoaded: () => {
      showToast('success', 'Data Loaded', 'The requested data has been loaded successfully.');
    }
  };

  return {
    showToast,
    auth: authToasts,
    profile: profileToasts,
    property: propertyToasts,
    support: supportToasts,
    booking: bookingToasts,
    team: teamToasts,
    app: appToasts
  };
}; 