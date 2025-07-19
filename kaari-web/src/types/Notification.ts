import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  userId: string;
  userType: 'user' | 'advertiser' | 'admin';
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Timestamp;
  isRead: boolean;
  link?: string; // Optional link to navigate to when clicking the notification
  metadata?: Record<string, any>; // Additional data specific to the notification type
}

// Notification types for advertisers
export type AdvertiserNotificationType = 
  | 'team_assigned_photoshoot'
  | 'photoshoot_reminder'
  | 'property_created'
  | 'reservation_request'
  | 'reservation_cancelled'
  | 'payment_confirmed'
  | 'client_moved_in'
  | 'photoshoot_cancelled'
  | 'property_liked'
  | 'refund_requested'
  | 'new_message'
  | 'property_refresh_reminder'
  | 'property_refresh_warning'
  | 'payout_request_approved'
  | 'payout_request_rejected'
  | 'payout_processed';

// Notification types for clients/users
export type ClientNotificationType = 
  | 'reservation_accepted' 
  | 'reservation_rejected'
  | 'reservation_cancelled_by_advertiser'
  | 'payment_reminder'
  | 'payment_confirmation'
  | 'reservation_expired'
  | 'move_in_reminder'
  | 'move_in_confirmation'
  | 'refund_request_handled'
  | 'cancellation_request_handled'
  | 'inquiry_response'
  | 'property_availability'
  | 'new_message'
  | 'payout_request_approved'
  | 'payout_request_rejected'
  | 'payout_processed'
  | 'refund_processed';

// Add a new type for admin notifications
export type AdminNotificationType = 
  | 'new_photoshoot_booking'
  | 'team_assignment_needed'
  | 'photoshoot_completed';

// Combined notification types
export type NotificationType = AdvertiserNotificationType | ClientNotificationType | AdminNotificationType;

// Helper type to differentiate by user type
export type UserNotifications = {
  advertiser: AdvertiserNotificationType[];
  client: ClientNotificationType[];
  admin: AdminNotificationType[];
}; 