import { advertiserNotifications, userNotifications } from './notification-helpers';
import { Timestamp } from 'firebase/firestore';

/**
 * This utility is for testing the notification system
 * It allows you to manually trigger different notification types
 */

// Sample data for creating notifications
const createSampleData = (userId: string, userType: 'user' | 'advertiser') => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return {
    reservation: {
      id: 'test-reservation-' + Date.now(),
      propertyId: 'test-property-id',
      propertyTitle: 'Luxury Apartment',
      advertiserId: userType === 'advertiser' ? userId : 'test-advertiser-id',
      clientId: userType === 'user' ? userId : 'test-client-id',
      clientName: 'Test Client',
      startDate: tomorrow,
      endDate: nextWeek,
      status: 'pending'
    },
    payment: {
      id: 'test-payment-' + Date.now(),
      amount: 1500,
      currency: 'USD',
      status: 'paid',
      reservationId: 'test-reservation-id'
    },
    property: {
      id: 'test-property-id',
      title: 'Luxury Apartment'
    },
    user: {
      id: 'test-user-id',
      name: 'Test User'
    },
    photoshootBooking: {
      id: 'test-booking-' + Date.now(),
      date: tomorrow,
      propertyId: 'test-property-id',
      propertyTitle: 'Luxury Apartment',
      advertiserId: userType === 'advertiser' ? userId : 'test-advertiser-id'
    },
    conversationId: 'test-conversation-' + Date.now()
  };
};

/**
 * Test utility to generate sample notifications
 * @param userId The user ID to create notifications for
 * @param userType Whether the user is a regular user or advertiser
 */
export const generateTestNotifications = async (
  userId: string,
  userType: 'user' | 'advertiser'
): Promise<void> => {
  const data = createSampleData(userId, userType);

  try {
    if (userType === 'advertiser') {
      // Advertiser notifications
      await advertiserNotifications.photoshootBooked(
        userId,
        data.photoshootBooking as any
      );

      await advertiserNotifications.reservationRequest(
        userId,
        data.reservation as any
      );

      await advertiserNotifications.paymentConfirmed(
        userId,
        data.payment,
        data.property,
        data.user
      );

      await advertiserNotifications.clientMovedIn(
        userId,
        data.reservation as any
      );

      await advertiserNotifications.reservationCancelled(
        userId,
        data.reservation as any
      );
    } else {
      // User notifications
      await userNotifications.reservationAccepted(
        userId,
        data.reservation as any
      );

      await userNotifications.reservationRejected(
        userId,
        data.reservation as any,
        'Property unavailable'
      );

      await userNotifications.paymentReminder(
        userId,
        data.reservation as any,
        new Date(Date.now() + 86400000 * 3) // 3 days from now
      );

      await userNotifications.moveInReminder(
        userId,
        data.reservation as any
      );

      await userNotifications.reservationCancelledByAdvertiser(
        userId,
        data.reservation as any,
        'Property maintenance required'
      );

      await userNotifications.refundRequestHandled(
        userId,
        data.reservation as any,
        true,
        'Full refund approved'
      );

      await userNotifications.cancellationRequestHandled(
        userId,
        data.reservation as any,
        true,
        'Cancellation fee waived'
      );
    }

    console.log(`Successfully generated test notifications for ${userType} with ID ${userId}`);
  } catch (error) {
    console.error('Error generating test notifications:', error);
  }
};

/**
 * Generate a single sample notification of the specified type
 */
export const generateSingleNotification = async (
  userId: string,
  userType: 'user' | 'advertiser',
  notificationType: string
): Promise<void> => {
  const data = createSampleData(userId, userType);

  try {
    if (userType === 'advertiser') {
      switch (notificationType) {
        case 'photoshoot':
          await advertiserNotifications.photoshootBooked(
            userId,
            data.photoshootBooking as any
          );
          break;
        case 'reservation_request':
          await advertiserNotifications.reservationRequest(
            userId,
            data.reservation as any
          );
          break;
        case 'payment':
          await advertiserNotifications.paymentConfirmed(
            userId,
            data.payment,
            data.property,
            data.user
          );
          break;
        case 'move_in':
          await advertiserNotifications.clientMovedIn(
            userId,
            data.reservation as any
          );
          break;
        case 'cancellation':
          await advertiserNotifications.reservationCancelled(
            userId,
            data.reservation as any
          );
          break;
        default:
          console.error(`Unknown notification type: ${notificationType}`);
          return;
      }
    } else {
      switch (notificationType) {
        case 'accepted':
          await userNotifications.reservationAccepted(
            userId,
            data.reservation as any
          );
          break;
        case 'rejected':
          await userNotifications.reservationRejected(
            userId,
            data.reservation as any,
            'Property unavailable'
          );
          break;
        case 'payment_reminder':
          await userNotifications.paymentReminder(
            userId,
            data.reservation as any,
            new Date(Date.now() + 86400000 * 3) // 3 days from now
          );
          break;
        case 'move_in_reminder':
          await userNotifications.moveInReminder(
            userId,
            data.reservation as any
          );
          break;
        case 'cancelled_by_advertiser':
          await userNotifications.reservationCancelledByAdvertiser(
            userId,
            data.reservation as any,
            'Property maintenance required'
          );
          break;
        case 'refund':
          await userNotifications.refundRequestHandled(
            userId,
            data.reservation as any,
            true,
            'Full refund approved'
          );
          break;
        case 'cancellation':
          await userNotifications.cancellationRequestHandled(
            userId,
            data.reservation as any,
            true,
            'Cancellation fee waived'
          );
          break;
        default:
          console.error(`Unknown notification type: ${notificationType}`);
          return;
      }
    }

    console.log(`Successfully generated ${notificationType} notification for ${userType} with ID ${userId}`);
  } catch (error) {
    console.error(`Error generating ${notificationType} notification:`, error);
  }
}; 