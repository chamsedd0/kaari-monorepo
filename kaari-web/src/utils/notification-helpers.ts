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