'use server';

import { User, Request, Property } from '../entities';
import { 
  getDocumentById, 
  createDocument, 
  updateDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { advertiserNotifications, userNotifications } from '../../utils/notification-helpers';
import NotificationService from '../../services/NotificationService';

// Collection names
const USERS_COLLECTION = 'users';
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const PAYMENT_METHODS_COLLECTION = 'paymentMethods';

/**
 * Interface for payment method
 */
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for checkout data
 */
export interface CheckoutData {
  user: User;
  property: Property;
  paymentMethods: PaymentMethod[];
}

/**
 * Initiate checkout process
 */
export async function initiateCheckout(propertyId: string): Promise<CheckoutData> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get property details
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Get user's saved payment methods
    const paymentMethods = await getUserPaymentMethods(currentUser.id);
    
    return {
      user: currentUser,
      property,
      paymentMethods
    };
  } catch (error) {
    console.error('Error initiating checkout:', error);
    throw new Error('Failed to initiate checkout');
  }
}

/**
 * Create a new payment method
 */
export async function createPaymentMethod(
  cardDetails: {
    cardholderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    makeDefault: boolean;
  }
): Promise<PaymentMethod> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // In a real application, you would use a payment processor like Stripe
    // and tokenize the card details. For this implementation, we'll simulate
    // the process by storing minimal card info (never store full card numbers in your db)
    
    // Determine card brand based on first digit
    let brand = 'Unknown';
    if (cardDetails.cardNumber.startsWith('4')) {
      brand = 'Visa';
    } else if (cardDetails.cardNumber.startsWith('5')) {
      brand = 'Mastercard';
    } else if (cardDetails.cardNumber.startsWith('3')) {
      brand = 'American Express';
    }
    
    // Get last 4 digits of card number
    const last4 = cardDetails.cardNumber.slice(-4);
    
    // If this is the default card, update existing default cards
    if (cardDetails.makeDefault) {
      // Get all payment methods for this user
      const paymentMethods = await getUserPaymentMethods(currentUser.id);
      
      // Update any default cards
      for (const method of paymentMethods) {
        if (method.isDefault) {
          await updateDocument<PaymentMethod>(PAYMENT_METHODS_COLLECTION, method.id, {
            isDefault: false
          });
        }
      }
    }
    
    // Get user's payment methods to check if this is the first card
    const userPaymentMethods = await getUserPaymentMethods(currentUser.id);
    
    // Create the payment method
    const paymentMethodData = {
      userId: currentUser.id,
      type: 'card' as const,
      brand,
      last4,
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear,
      cardholderName: cardDetails.cardholderName,
      isDefault: cardDetails.makeDefault || userPaymentMethods.length === 0, // Make default if it's the first card
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const paymentMethod = await createDocument<PaymentMethod>(
      PAYMENT_METHODS_COLLECTION,
      paymentMethodData as Omit<PaymentMethod, 'id'>
    );
    
    return paymentMethod;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw new Error('Failed to create payment method');
  }
}

/**
 * Get all payment methods for a user
 */
export async function getUserPaymentMethods(userId?: string): Promise<PaymentMethod[]> {
  try {
    // If no userId provided, get current authenticated user
    let userIdToUse = userId;
    if (!userIdToUse) {
      const currentUser = await getCurrentUserProfile();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      userIdToUse = currentUser.id;
    }
    
    // Get payment methods from the database
    // In a real application, you would query your database for payment methods
    // For now, we'll return a hardcoded response
    return []; // In a real implementation, this would be replaced with a database query
  } catch (error) {
    console.error('Error getting user payment methods:', error);
    throw new Error('Failed to get user payment methods');
  }
}

/**
 * Create a new reservation request during checkout
 */
export async function createCheckoutReservation(data: {
  propertyId: string;
  userId: string;
  rentalData: any;
  paymentMethodId: string;
}): Promise<Request> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Verify that propertyId is provided
    if (!data.propertyId) {
      throw new Error('Property ID must be provided');
    }
    
    // Extract all rental data with defaults for required fields
    const {
      fullName = currentUser.name && currentUser.surname ? `${currentUser.name} ${currentUser.surname}` : currentUser.name || '',
      email = currentUser.email,
      phoneNumber = currentUser.phoneNumber || '',
      gender = currentUser.gender || '',
      dateOfBirth = currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth) : null,
      scheduledDate = new Date(), // Use this instead of movingDate
      leavingDate = null,
      numPeople = '1',
      roommates = '',
      occupationType = 'work',
      studyPlace = '',
      workPlace = '',
      occupationRole = '',
      funding = '',
      hasPets = false,
      hasSmoking = false,
      aboutMe = currentUser.aboutMe || '',
      message = ''
    } = data.rentalData;
    
    // Create the request data
    const requestData = {
      userId: currentUser.id,
      propertyId: data.propertyId,
      requestType: 'rent' as const,
      status: 'pending' as const,
      scheduledDate, // This is the move-in date
      paymentMethodId: data.paymentMethodId,
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Personal information
      fullName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      
      // Stay information
      leavingDate,
      numPeople,
      roommates,
      occupationType,
      studyPlace,
      workPlace,
      occupationRole,
      funding,
      hasPets,
      hasSmoking,
      aboutMe,
      message
    };
    
    // Create the request
    const request = await createDocument<Request>(
      REQUESTS_COLLECTION,
      requestData as Omit<Request, 'id'>
    );
    
    // Add request to user's requests array
    const userRequests = currentUser.requests || [];
    await updateDocument<User>(USERS_COLLECTION, currentUser.id, {
      requests: [...userRequests, request.id]
    });
    
    // Update property status to 'occupied' immediately when reservation is created
    await updateDocument<Property>(PROPERTIES_COLLECTION, data.propertyId, {
      status: 'occupied',
      updatedAt: new Date()
    });

    // Send a direct notification to the advertiser
    try {
      // Get property details for notification
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, data.propertyId);
      if (property) {
        const clientName = currentUser.name && currentUser.surname 
          ? `${currentUser.name} ${currentUser.surname}` 
          : currentUser.email || 'A client';

        // Send notification to the property owner
        await NotificationService.createNotification(
          property.ownerId,
          'advertiser',
          'reservation_request',
          'New Reservation Request',
          `${clientName} has requested to rent your property: ${property.title || 'Property'}.`,
          `/dashboard/advertiser/reservations`,
          { 
            requestId: request.id, 
            propertyId: property.id,
            clientId: currentUser.id,
            status: 'pending'
          }
        );
        
        // Also use the advertiserNotifications helper for more structured notifications
        try {
          // Create a reservation object for structured notifications
          const reservationForNotification = {
            id: request.id,
            propertyId: property.id,
            propertyTitle: property.title || 'Property',
            startDate: scheduledDate,
            endDate: leavingDate,
            clientId: currentUser.id,
            clientName: clientName,
            clientEmail: currentUser.email || '',
            clientPhone: currentUser.phoneNumber || '',
            advertiserId: property.ownerId,
            status: 'pending'
          };
          
          // Send using the helper
          await advertiserNotifications.reservationRequest(
            property.ownerId,
            reservationForNotification
          );
          
          console.log(`Reservation request notifications sent to advertiser: ${property.ownerId}`);
        } catch (helperError) {
          console.error('Error using notification helper:', helperError);
          // The direct notification above should still work even if this fails
        }
      }
    } catch (notifError) {
      console.error('Error sending reservation request notification:', notifError);
      // Don't throw error here so the main action can still succeed
    }
    
    return request;
  } catch (error) {
    console.error('Error creating checkout reservation:', error);
    throw new Error('Failed to create checkout reservation');
  }
}

/**
 * Process payment after reservation is accepted
 * This would normally integrate with a payment processor like Stripe
 */
export async function processPayment(reservationId: string): Promise<boolean> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation belongs to the current user
    if (reservation.userId !== currentUser.id) {
      throw new Error('Not authorized to process payment for this reservation');
    }
    
    // Verify that the reservation is in "accepted" status
    if (reservation.status !== 'accepted') {
      throw new Error('Cannot process payment for a reservation that is not accepted');
    }
    
    // In a real application, you would:
    // 1. Retrieve the payment method details
    // 2. Make a call to your payment processor to charge the card
    // 3. Update the reservation status based on payment success/failure
    
    // For this implementation, we'll simulate a successful payment
    
    // Update the reservation status to "paid"
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'paid',
      updatedAt: new Date()
    });
    
    // Get property details for notification
    if (reservation.propertyId) {
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
      if (property) {
        const clientName = currentUser.name && currentUser.surname 
          ? `${currentUser.name} ${currentUser.surname}` 
          : currentUser.email || 'A client';
          
        // Send notification to the advertiser about the payment
        try {
          // Import NotificationService dynamically to avoid circular dependencies
          const NotificationService = (await import('../../services/NotificationService')).default;
          
          // Send a direct notification to the advertiser
          await NotificationService.createNotification(
            property.ownerId,
            'advertiser',
            'payment_confirmed',
            'Reservation Payment Received',
            `${clientName} has completed payment for their reservation at ${property.title || 'Property'}.`,
            `/dashboard/advertiser/reservations`,
            { 
              reservationId: reservationId, 
              propertyId: property.id,
              status: 'paid'
            }
          );
          
          // Also send a confirmation to the client
          await NotificationService.createNotification(
            currentUser.id,
            'user',
            'payment_confirmation',
            'Payment Confirmed',
            `Your payment for ${property.title || 'Property'} has been successfully processed.`,
            `/dashboard/user/reservations`,
            { 
              reservationId: reservationId, 
              propertyId: property.id,
              status: 'paid'
            }
          );
          
          console.log(`Direct payment notifications sent to advertiser and client`);
        } catch (notifError) {
          console.error('Error sending payment notification:', notifError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment');
  }
} 