import {
  AdvertiserNotificationType,
  ClientNotificationType,
  NotificationType
} from '../types/Notification';
import NotificationService from '../services/NotificationService';
import { User } from 'firebase/auth';

/**
 * Creates a notification for a new message
 */
export const createNewMessageNotification = async (
  recipientId: string,
  recipientType: 'user' | 'advertiser',
  senderName: string,
  conversationId: string
): Promise<string | undefined> => {
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
      `/dashboard/advertiser/photoshoots`,
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
      `/dashboard/advertiser/photoshoots`,
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
      `/dashboard/user/reservation-status`,
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
    const message = reason
      ? `Your reservation for "${propertyName}" was not accepted. Reason: ${reason}`
      : `Your reservation for "${propertyName}" was not accepted`;
    
    return await NotificationService.createNotification(
      userId,
      'user',
      'reservation_rejected',
      'Reservation Rejected',
      message,
      `/dashboard/user/reservations`,
      { reason }
    );
  } catch (error) {
    console.error('Failed to create reservation rejected notification:', error);
  }
};

/**
 * Creates a notification for a payment reminder
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
      `Your payment for "${propertyName}" is due by ${dueDate}`,
      `/dashboard/user/reservation-status`,
      { reservationId }
    );
  } catch (error) {
    console.error('Failed to create payment reminder notification:', error);
  }
};

/**
 * Creates a notification for a move-in reminder
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
      `Your move-in date for "${propertyName}" is tomorrow, ${moveInDate}`,
      `/dashboard/user/reservation-status`,
      { reservationId }
    );
  } catch (error) {
    console.error('Failed to create move-in reminder notification:', error);
  }
};

/**
 * Creates a notification for a move-in confirmation request
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
      'Move-in Confirmation',
      `Please confirm that you've moved into "${propertyName}"`,
      `/dashboard/user/reservation-status`,
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

/**
 * Notification helpers for advertisers
 */
export const advertiserNotifications = {
  // Notify advertiser about new photoshoot booking
  photoshootBooked: async (
    advertiserId: string, 
    booking: PhotoshootBooking
  ): Promise<string> => {
    const title = 'Photoshoot Scheduled';
    const message = `Your photoshoot for ${booking.propertyTitle} has been scheduled for ${booking.date.toLocaleDateString()}.`;
    const link = `/dashboard/advertiser/photoshoots`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'photoshoot_reminder',
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
    const title = 'New Reservation Request';
    const message = `${reservation.clientName} has requested to book ${reservation.propertyTitle} from ${reservation.startDate.toLocaleDateString()} to ${reservation.endDate.toLocaleDateString()}.`;
    const link = `/dashboard/advertiser/reservations/${reservation.id}`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'reservation_request',
      title,
      message,
      link,
      { reservationId: reservation.id, propertyId: reservation.propertyId }
    );
  },
  
  // Notify advertiser about reservation cancellation
  reservationCancelled: async (
    advertiserId: string,
    reservation: Reservation
  ): Promise<string> => {
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
    payment: Payment,
    property: Property,
    client: User
  ): Promise<string> => {
    const title = 'Payment Confirmed';
    const message = `Payment of ${payment.amount} ${payment.currency} has been confirmed for ${property.title} from ${client.name}.`;
    const link = `/dashboard/advertiser/financials`;
    
    return NotificationService.createNotification(
      advertiserId,
      'advertiser',
      'payment_confirmed',
      title,
      message,
      link,
      { paymentId: payment.id, propertyId: property.id, clientId: client.id }
    );
  },
  
  // Notify advertiser when client moves in
  clientMovedIn: async (
    advertiserId: string,
    reservation: Reservation
  ): Promise<string> => {
    const title = 'Client Moved In';
    const message = `${reservation.clientName} has confirmed move-in for ${reservation.propertyTitle}.`;
    const link = `/dashboard/advertiser/reservations/${reservation.id}`;
    
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