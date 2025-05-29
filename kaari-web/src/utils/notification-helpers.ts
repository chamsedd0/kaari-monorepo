import {
  AdvertiserNotificationType,
  ClientNotificationType,
  NotificationType
} from '../types/Notification';
import NotificationService from '../services/NotificationService';
import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

/**
 * Creates a notification for a new message
 */
export const createNewMessageNotification = async (
  recipientId: string,
  recipientType: 'user' | 'advertiser',
  senderName: string,
  conversationId: string
): Promise<string | undefined> => {
  console.log(`createNewMessageNotification called for ${recipientType} ${recipientId} from ${senderName}`);
  try {
    return await NotificationService.createNotification(
      recipientId,
      recipientType,
      'new_message',
      'New Message',
      `You've received a new message from ${senderName}`,
      `/dashboard/${recipientType}/messages`,
      { conversationId }
    );
  } catch (error) {
    console.error('Failed to create new message notification:', error);
  }
};

/**
 * Creates a notification for a photoshoot team assignment
 */
export const createTeamAssignedNotification = async (
  advertiserId: string,
  teamName: string,
  date: string,
  propertyId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'team_assigned_photoshoot',
      'Team Assigned to Photoshoot',
      `Team "${teamName}" has been assigned to your photoshoot on ${date}`,
      `/dashboard/advertiser/photoshoot`,
      { propertyId }
    );
  } catch (error) {
    console.error('Failed to create team assigned notification:', error);
  }
};

/**
 * Creates a notification for a photoshoot reminder
 */
export const createPhotoshootReminderNotification = async (
  advertiserId: string,
  date: string,
  time: string,
  propertyId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'photoshoot_reminder',
      'Upcoming Photoshoot Reminder',
      `You have a photoshoot scheduled for ${date} at ${time}`,
      `/dashboard/advertiser/photoshoot`,
      { propertyId }
    );
  } catch (error) {
    console.error('Failed to create photoshoot reminder notification:', error);
  }
};

/**
 * Creates a notification for a property being created
 */
export const createPropertyCreatedNotification = async (
  advertiserId: string,
  propertyName: string,
  propertyId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'property_created',
      'Property Created',
      `Your property "${propertyName}" has been successfully created`,
      `/dashboard/advertiser/properties`,
      { propertyId }
    );
  } catch (error) {
    console.error('Failed to create property created notification:', error);
  }
};

/**
 * Creates a notification for a reservation request
 */
export const createReservationRequestNotification = async (
  advertiserId: string,
  clientName: string,
  propertyName: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'reservation_request',
      'New Reservation Request',
      `${clientName} has requested to reserve "${propertyName}"`,
      `/dashboard/advertiser/reservations`,
      { reservationId }
    );
  } catch (error) {
    console.error('Failed to create reservation request notification:', error);
  }
};

/**
 * Creates a notification for a payment confirmation
 */
export const createPaymentConfirmedNotification = async (
  advertiserId: string,
  clientName: string,
  amount: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'payment_confirmed',
      'Payment Confirmed',
      `${clientName} has confirmed payment of ${amount} for their reservation`,
      `/dashboard/advertiser/reservations`,
      { reservationId }
    );
  } catch (error) {
    console.error('Failed to create payment confirmed notification:', error);
  }
};

/**
 * Creates a notification for client move-in
 */
export const createClientMovedInNotification = async (
  advertiserId: string,
  clientName: string,
  propertyName: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'client_moved_in',
      'Client Moved In',
      `${clientName} has confirmed they've moved into "${propertyName}"`,
      `/dashboard/advertiser/reservations`,
      { reservationId }
    );
  } catch (error) {
    console.error('Failed to create client moved in notification:', error);
  }
};

// Client (user) notifications

/**
 * Creates a notification for when a reservation is accepted
 */
export const createReservationAcceptedNotification = async (
  userId: string,
  propertyName: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      userId,
      'user',
      'reservation_accepted',
      'Reservation Accepted',
      `Your reservation for "${propertyName}" has been accepted!`,
      `/dashboard/user/reservations`,
      { reservationId }
    );
  } catch (error) {
    console.error('Failed to create reservation accepted notification:', error);
  }
};

/**
 * Creates a notification for when a reservation is rejected
 */
export const createReservationRejectedNotification = async (
  userId: string,
  propertyName: string,
  reason?: string
): Promise<string | undefined> => {
  try {
    const reasonText = reason ? ` Reason: ${reason}` : '';
    return await NotificationService.createNotification(
      userId,
      'user',
      'reservation_rejected',
      'Reservation Rejected',
      `Your reservation for "${propertyName}" has been rejected.${reasonText}`,
      `/dashboard/user/reservations`,
      { reason }
    );
  } catch (error) {
    console.error('Failed to create reservation rejected notification:', error);
  }
};

/**
 * Creates a notification for payment reminder
 */
export const createPaymentReminderNotification = async (
  userId: string,
  propertyName: string,
  dueDate: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      userId,
      'user',
      'payment_reminder',
      'Payment Reminder',
      `Your payment for "${propertyName}" is due on ${dueDate}`,
      `/dashboard/user/payments`,
      { reservationId, dueDate }
    );
  } catch (error) {
    console.error('Failed to create payment reminder notification:', error);
  }
};

/**
 * Creates a notification for move-in reminder
 */
export const createMoveInReminderNotification = async (
  userId: string,
  propertyName: string,
  moveInDate: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      userId,
      'user',
      'move_in_reminder',
      'Move-in Reminder',
      `Your move-in date for "${propertyName}" is scheduled for ${moveInDate}`,
      `/dashboard/user/reservations`,
      { reservationId, moveInDate }
    );
  } catch (error) {
    console.error('Failed to create move-in reminder notification:', error);
  }
};

/**
 * Creates a notification for move-in confirmation
 */
export const createMoveInConfirmationNotification = async (
  userId: string,
  propertyName: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      userId,
      'user',
      'move_in_confirmation',
      'Move-in Confirmed',
      `Your move-in to "${propertyName}" has been confirmed`,
      `/dashboard/user/reservations`,
      { reservationId }
    );
  } catch (error) {
    console.error('Failed to create move-in confirmation notification:', error);
  }
};

/**
 * Creates a notification for a refund request being handled
 */
export const createRefundRequestHandledNotification = async (
  userId: string,
  status: 'approved' | 'rejected',
  amount: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    const title = status === 'approved' 
      ? 'Refund Request Approved' 
      : 'Refund Request Rejected';
      
    const message = status === 'approved'
      ? `Your refund request for ${amount} has been approved`
      : `Your refund request for ${amount} has been rejected`;
      
    return await NotificationService.createNotification(
      userId,
      'user',
      'refund_request_handled',
      title,
      message,
      `/dashboard/user/reservation-status`,
      { reservationId, status }
    );
  } catch (error) {
    console.error('Failed to create refund request handled notification:', error);
  }
};

/**
 * Creates a notification for a cancellation request being handled
 */
export const createCancellationRequestHandledNotification = async (
  userId: string,
  status: 'approved' | 'rejected',
  propertyName: string,
  reservationId: string
): Promise<string | undefined> => {
  try {
    const title = status === 'approved' 
      ? 'Cancellation Request Approved' 
      : 'Cancellation Request Rejected';
      
    const message = status === 'approved'
      ? `Your request to cancel your reservation for "${propertyName}" has been approved`
      : `Your request to cancel your reservation for "${propertyName}" has been rejected`;
      
    return await NotificationService.createNotification(
      userId,
      'user',
      'cancellation_request_handled',
      title,
      message,
      `/dashboard/user/reservation-status`,
      { reservationId, status }
    );
  } catch (error) {
    console.error('Failed to create cancellation request handled notification:', error);
  }
};

interface Property {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
}

interface Reservation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  startDate: Date;
  endDate: Date;
  clientId: string;
  clientName: string;
  advertiserId: string;
  status: string;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  reservationId: string;
}

interface PhotoshootBooking {
  id: string;
  date: Date;
  propertyId: string;
  propertyTitle: string;
  advertiserId: string;
}

// Helper function to convert Date to Timestamp if it's not already a Timestamp
const ensureTimestamp = (date: Date | any): Timestamp => {
  if (!date) return Timestamp.now();
  if (date instanceof Timestamp) return date;
  if (date.seconds && date.nanoseconds) return date; // Already a Firestore timestamp-like object
  if (date instanceof Date) return Timestamp.fromDate(date);
  if (typeof date === 'string') return Timestamp.fromDate(new Date(date));
  if (typeof date === 'number') return Timestamp.fromDate(new Date(date));
  return Timestamp.now(); // Fallback
};

/**
 * Notification helpers for advertisers
 */
export const advertiserNotifications = {
  // Notify advertiser about new photoshoot booking
  photoshootBooked: async (
    advertiserId: string, 
    booking: PhotoshootBooking
  ): Promise<string> => {
    console.log(`advertiserNotifications.photoshootBooked called for advertiser ${advertiserId}`);
    const title = 'Photoshoot Booked';
    const message = `A new photoshoot has been booked for ${booking.propertyTitle}.`;
    const link = `/dashboard/advertiser/photoshoots/${booking.id}`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'photoshoot_booked',
      title,
      message,
      link,
      { bookingId: booking.id, propertyId: booking.propertyId }
    );
  },
  
  // Notify advertiser about new reservation request
  reservationRequest: async (
    advertiserId: string,
    reservation: Reservation
  ): Promise<string> => {
    console.log(`advertiserNotifications.reservationRequest called for advertiser ${advertiserId}`);
    console.log('Reservation data:', JSON.stringify(reservation));
    const title = 'New Reservation Request';
    const message = `${reservation.clientName} has requested to book ${reservation.propertyTitle}.`;
    const link = `/dashboard/advertiser/reservations`;
    
    // Ensure dates are proper Timestamps
    const reservationWithTimestamps = {
      ...reservation,
      startDate: ensureTimestamp(reservation.startDate),
      endDate: ensureTimestamp(reservation.endDate)
    };
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'reservation_request',
      title,
      message,
      link,
      { 
        reservationId: reservation.id, 
        propertyId: reservation.propertyId,
        clientId: reservation.clientId
      }
    );
  },
  
  // Notify advertiser about reservation cancellation
  reservationCancelled: async (
    advertiserId: string,
    reservation: Reservation
  ): Promise<string> => {
    console.log(`advertiserNotifications.reservationCancelled called for advertiser ${advertiserId}`);
    const title = 'Reservation Cancelled';
    const message = `${reservation.clientName} has cancelled their reservation for ${reservation.propertyTitle}.`;
    const link = `/dashboard/advertiser/reservations`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'reservation_cancelled',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify advertiser about payment confirmation
  paymentConfirmed: async (
    advertiserId: string,
    reservation: Reservation
  ): Promise<string> => {
    console.log(`advertiserNotifications.paymentConfirmed called for advertiser ${advertiserId}`);
    const title = 'Payment Received';
    const message = `${reservation.clientName} has completed payment for their reservation at ${reservation.propertyTitle}.`;
    const link = `/dashboard/advertiser/reservations`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'payment_confirmed',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify advertiser when client moves in
  clientMovedIn: async (
    advertiserId: string,
    reservation: Reservation
  ): Promise<string> => {
    console.log(`advertiserNotifications.clientMovedIn called for advertiser ${advertiserId}`);
    const title = 'Client Has Moved In';
    const message = `${reservation.clientName} has confirmed they have moved into ${reservation.propertyTitle}.`;
    const link = `/dashboard/advertiser/reservations`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'client_moved_in',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify advertiser when client requests cancellation
  cancellationUnderReview: async (
    advertiserId: string,
    reservation: Reservation
  ): Promise<string> => {
    console.log(`advertiserNotifications.cancellationUnderReview called for advertiser ${advertiserId}`);
    const title = 'Cancellation Request Received';
    const message = `${reservation.clientName} has requested to cancel their reservation for ${reservation.propertyTitle}.`;
    const link = `/dashboard/advertiser/reservations`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'reservation_cancelled',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify advertiser when client requests a refund
  refundRequested: async (
    advertiserId: string,
    clientName: string,
    propertyTitle: string,
    propertyId: string,
    reservationId: string,
    refundAmount?: number
  ): Promise<string | undefined> => {
    console.log(`advertiserNotifications.refundRequested called for advertiser ${advertiserId}`);
    try {
      const amountText = refundAmount ? ` of ${refundAmount}` : '';
      return await NotificationService.createNotification(
        advertiserId,
        'advertiser',
        'refund_requested',
        'Refund Requested',
        `${clientName} has requested a refund${amountText} for ${propertyTitle}.`,
        `/dashboard/advertiser/refunds`,
        { 
          reservationId, 
          propertyId,
          refundAmount 
        }
      );
    } catch (error) {
      console.error('Failed to create refund requested notification:', error);
    }
  },
  
  // Property liked notification
  propertyLiked: async (
    advertiserId: string,
    clientName: string,
    propertyName: string,
    propertyId: string
  ): Promise<string | undefined> => {
    console.log(`advertiserNotifications.propertyLiked called for advertiser ${advertiserId}`);
    try {
      return await NotificationService.createNotification(
        advertiserId,
        'advertiser',
        'property_liked',
        'Property Added to Favorites',
        `${clientName} has added your property "${propertyName}" to their favorites.`,
        `/dashboard/advertiser/properties/${propertyId}`,
        { propertyId }
      );
    } catch (error) {
      console.error('Failed to create property liked notification:', error);
    }
  },
  
  // Notify advertiser about new message
  newMessage: async (
    advertiserId: string,
    senderId: string,
    senderName: string,
    conversationId: string
  ): Promise<string> => {
    const title = 'New Message';
    const message = `You have received a new message from ${senderName}.`;
    const link = `/dashboard/advertiser/messages/${conversationId}`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'new_message',
      title,
      message,
      link,
      { conversationId, senderId }
    );
  }
};

/**
 * Notification helpers for users/clients
 */
export const userNotifications = {
  // Notify user when reservation is accepted
  reservationAccepted: async (
    userId: string,
    reservation: Reservation
  ): Promise<string> => {
    console.log(`userNotifications.reservationAccepted called for user ${userId}`);
    const title = 'Reservation Accepted';
    const message = `Your reservation for ${reservation.propertyTitle} has been accepted!`;
    const link = `/dashboard/user/reservations/${reservation.id}`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'reservation_accepted',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify user when reservation is rejected
  reservationRejected: async (
    userId: string,
    reservation: Reservation,
    reason?: string
  ): Promise<string> => {
    console.log(`userNotifications.reservationRejected called for user ${userId}`);
    const title = 'Reservation Declined';
    const reasonText = reason ? ` Reason: ${reason}` : '';
    const message = `Your reservation for ${reservation.propertyTitle} has been declined.${reasonText}`;
    const link = `/dashboard/user/reservations`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'reservation_rejected',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify user when reservation is cancelled by advertiser
  reservationCancelledByAdvertiser: async (
    userId: string,
    reservation: Reservation,
    reason?: string
  ): Promise<string> => {
    const title = 'Reservation Cancelled';
    const reasonText = reason ? ` Reason: ${reason}` : '';
    const message = `Your reservation for ${reservation.propertyTitle} has been cancelled by the advertiser.${reasonText}`;
    const link = `/dashboard/user/reservations`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'reservation_cancelled_by_advertiser',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify user about payment reminder
  paymentReminder: async (
    userId: string,
    reservation: Reservation,
    dueDate: Date
  ): Promise<string> => {
    const title = 'Payment Reminder';
    const message = `Your payment for ${reservation.propertyTitle} is due on ${dueDate.toLocaleDateString()}.`;
    const link = `/dashboard/user/payments`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'payment_reminder',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify user about reservation expiry
  reservationExpired: async (
    userId: string,
    reservation: Reservation
  ): Promise<string> => {
    const title = 'Reservation Expired';
    const message = `Your reservation request for ${reservation.propertyTitle} has expired without a response.`;
    const link = `/dashboard/user/reservations`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'reservation_expired',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify user about upcoming move-in
  moveInReminder: async (
    userId: string,
    reservation: Reservation
  ): Promise<string> => {
    const title = 'Move-in Reminder';
    const message = `Your move-in date for ${reservation.propertyTitle} is approaching (${reservation.startDate.toLocaleDateString()}).`;
    const link = `/dashboard/user/reservations/${reservation.id}`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'move_in_reminder',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify user about move-in confirmation
  moveInConfirmation: async (
    userId: string,
    reservation: Reservation
  ): Promise<string> => {
    const title = 'Move-in Confirmed';
    const message = `Your move-in for ${reservation.propertyTitle} has been confirmed.`;
    const link = `/dashboard/user/reservations/${reservation.id}`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'move_in_confirmation',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify user about refund request result
  refundRequestHandled: async (
    userId: string,
    reservation: Reservation,
    approved: boolean,
    reason?: string
  ): Promise<string> => {
    const title = approved ? 'Refund Approved' : 'Refund Declined';
    const reasonText = reason ? ` Reason: ${reason}` : '';
    const message = approved
      ? `Your refund request for ${reservation.propertyTitle} has been approved.${reasonText}`
      : `Your refund request for ${reservation.propertyTitle} has been declined.${reasonText}`;
    const link = `/dashboard/user/payments`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'refund_request_handled',
      title,
      message,
      link,
      { 
        reservationId: reservation.id, 
        propertyId: reservation.propertyId,
        approved
      }
    );
  },
  
  // Notify user about cancellation request result
  cancellationRequestHandled: async (
    userId: string,
    reservation: Reservation,
    approved: boolean,
    reason?: string
  ): Promise<string> => {
    const title = approved ? 'Cancellation Approved' : 'Cancellation Declined';
    const reasonText = reason ? ` Reason: ${reason}` : '';
    const message = approved
      ? `Your cancellation request for ${reservation.propertyTitle} has been approved.${reasonText}`
      : `Your cancellation request for ${reservation.propertyTitle} has been declined.${reasonText}`;
    const link = `/dashboard/user/reservations`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'cancellation_request_handled',
      title,
      message,
      link,
      { 
        reservationId: reservation.id, 
        propertyId: reservation.propertyId,
        approved
      }
    );
  },
  
  // Notify user about new message
  newMessage: async (
    userId: string,
    senderId: string,
    senderName: string,
    conversationId: string
  ): Promise<string> => {
    const title = 'New Message';
    const message = `You have received a new message from ${senderName}.`;
    const link = `/dashboard/user/messages/${conversationId}`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'new_message',
      title,
      message,
      link,
      { conversationId, senderId }
    );
  },
  
  // Notify user when payment is confirmed
  paymentConfirmation: async (
    userId: string,
    reservation: Reservation
  ): Promise<string> => {
    console.log(`userNotifications.paymentConfirmation called for user ${userId}`);
    const title = 'Payment Confirmed';
    const message = `Your payment for ${reservation.propertyTitle} has been confirmed. You're all set to move in!`;
    const link = `/dashboard/user/reservations/${reservation.id}`;
    
    // Ensure dates are proper Timestamps
    const reservationWithTimestamps = {
      ...reservation,
      startDate: ensureTimestamp(reservation.startDate),
      endDate: ensureTimestamp(reservation.endDate)
    };
    
    return NotificationService.createNotification(
      userId,
      'user',
      'payment_confirmation',
      title,
      message,
      link,
      { 
        reservationId: reservation.id, 
        propertyId: reservation.propertyId,
        amount: reservation.totalPrice,
        currency: reservation.currency
      }
    );
  },

  // Notify user about payment expiration
  paymentExpired: async (
    userId: string,
    reservation: Reservation
  ): Promise<string> => {
    const title = 'Payment Time Expired';
    const message = `Your payment time for ${reservation.propertyTitle} has expired. The reservation has been cancelled.`;
    const link = `/dashboard/user/reservations`;
    
    return NotificationService.createNotification(
      userId,
      'user',
      'payment_expired',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },

  // Property liked notification helper
  propertyLiked: async (
    advertiserId: string,
    clientName: string,
    propertyName: string,
    propertyId: string
  ): Promise<string | undefined> => {
    try {
      return await NotificationService.createNotification(
        advertiserId,
        'advertiser',
        'property_liked',
        'Property Added to Favorites',
        `${clientName} has added your property "${propertyName}" to their favorites.`,
        `/dashboard/advertiser/properties/${propertyId}`,
        { propertyId }
      );
    } catch (error) {
      console.error('Failed to create property liked notification:', error);
    }
  }
};

/**
 * Create a generic notification
 */
export const createCustomNotification = async (
  userId: string,
  userType: 'user' | 'advertiser' | 'admin',
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  metadata?: Record<string, any>
): Promise<string> => {
  return NotificationService.createNotification(
    userId,
    userType,
    type,
    title,
    message,
    link,
    metadata
  );
};

/**
 * Creates a notification for a photoshoot team assignment
 */
export const createPhotoshootTeamAssignedNotification = async (
  advertiserId: string,
  teamName: string,
  bookingId: string,
  propertyLocation: string,
  bookingDate: string,
  timeSlot: string
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'team_assigned_photoshoot',
      'Photoshoot Team Assigned',
      `A team has been assigned to your photoshoot booking${propertyLocation ? ` for your property in ${propertyLocation}` : ''} on ${bookingDate} at ${timeSlot}.`,
      `/dashboard/advertiser/photoshoot`,
      { 
        bookingId,
        teamName,
        bookingDate,
        timeSlot
      }
    );
  } catch (error) {
    console.error('Failed to create photoshoot team assigned notification:', error);
  }
};

/**
 * Admin notification helpers
 */
export const adminNotifications = {
  // Notify admin about new photoshoot booking
  newPhotoshootBooking: async (
    adminId: string,
    bookingId: string,
    propertyLocation: string,
    bookingDate: string,
    timeSlot: string
  ): Promise<string> => {
    const title = 'New Photoshoot Booking';
    const message = `A new photoshoot booking has been created${propertyLocation ? ` for ${propertyLocation}` : ''} on ${bookingDate} at ${timeSlot}. Team assignment needed.`;
    const link = `/dashboard/admin/photoshoot-bookings/view/${bookingId}`;
    
    return NotificationService.createNotification(
      adminId,
      'admin',
      'new_photoshoot_booking',
      title,
      message,
      link,
      { bookingId, propertyLocation, bookingDate, timeSlot }
    );
  },

  // Notify admin that team assignment is needed
  teamAssignmentNeeded: async (
    adminId: string,
    bookingId: string,
    propertyLocation: string,
    bookingDate: string,
    timeSlot: string
  ): Promise<string> => {
    const title = 'Team Assignment Needed';
    const message = `Photoshoot booking${propertyLocation ? ` for ${propertyLocation}` : ''} on ${bookingDate} at ${timeSlot} needs a team assignment.`;
    const link = `/dashboard/admin/photoshoot-bookings/view/${bookingId}`;
    
    return NotificationService.createNotification(
      adminId,
      'admin',
      'team_assignment_needed',
      title,
      message,
      link,
      { bookingId, propertyLocation, bookingDate, timeSlot }
    );
  },

  // Notify admin about completed photoshoot
  photoshootCompleted: async (
    adminId: string,
    bookingId: string,
    propertyId: string,
    propertyLocation: string,
    imageCount: number
  ): Promise<string> => {
    const title = 'Photoshoot Completed';
    const message = `Photoshoot${propertyLocation ? ` for ${propertyLocation}` : ''} has been completed. Property created with ${imageCount} images.`;
    const link = `/dashboard/admin/properties`;
    
    return NotificationService.createNotification(
      adminId,
      'admin',
      'photoshoot_completed',
      title,
      message,
      link,
      { bookingId, propertyId, imageCount }
    );
  }
};

/**
 * Creates a notification for property refresh reminder (7 days)
 */
export const createPropertyRefreshReminderNotification = async (
  advertiserId: string,
  propertyTitle: string,
  propertyId: string,
  daysSinceRefresh: number
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'property_refresh_reminder',
      'Property Refresh Reminder',
      `Your property "${propertyTitle}" needs availability refresh. It's been ${daysSinceRefresh} days since last update.`,
      `/dashboard/advertiser/properties`,
      { propertyId, daysSinceRefresh }
    );
  } catch (error) {
    console.error('Failed to create property refresh reminder notification:', error);
  }
};

/**
 * Creates a notification for property refresh warning (14 days)
 */
export const createPropertyRefreshWarningNotification = async (
  advertiserId: string,
  propertyTitle: string,
  propertyId: string,
  daysSinceRefresh: number
): Promise<string | undefined> => {
  try {
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'property_refresh_warning',
      'Property Refresh Warning',
      `URGENT: Your property "${propertyTitle}" hasn't been refreshed for ${daysSinceRefresh} days. Please update availability immediately to keep your listing active.`,
      `/dashboard/advertiser/properties`,
      { propertyId, daysSinceRefresh, urgent: true }
    );
  } catch (error) {
    console.error('Failed to create property refresh warning notification:', error);
  }
};

/**
 * Creates a notification for multiple properties needing refresh
 */
export const createMultiplePropertiesRefreshNotification = async (
  advertiserId: string,
  propertiesCount: number,
  urgentCount: number = 0
): Promise<string | undefined> => {
  try {
    const title = urgentCount > 0 ? 'Urgent: Properties Need Refresh' : 'Properties Need Refresh';
    const urgentText = urgentCount > 0 ? ` (${urgentCount} urgent)` : '';
    const message = `You have ${propertiesCount} properties that need availability refresh${urgentText}. Please update them to keep your listings active.`;
    
    return await NotificationService.createNotification(
      advertiserId,
      'advertiser',
      urgentCount > 0 ? 'property_refresh_warning' : 'property_refresh_reminder',
      title,
      message,
      `/dashboard/advertiser/properties`,
      { propertiesCount, urgentCount }
    );
  } catch (error) {
    console.error('Failed to create multiple properties refresh notification:', error);
  }
}; 