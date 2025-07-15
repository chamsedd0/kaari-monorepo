'use server';

import { User, Request, Property } from '../entities';
import { 
  getDocumentById, 
  createDocument, 
  updateDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { advertiserNotifications } from '../../utils/notification-helpers';
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
      message = '',
      // Payment information
      price = 0,
      serviceFee = 0,
      totalPrice = 0,
      // Discount information
      discount = null
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
      message,
      
      // Payment information
      price,
      serviceFee,
      totalPrice,
      
      // Discount information (if available)
      discount: discount ? {
        amount: discount.amount,
        code: discount.code,
        appliedAt: new Date()
      } : null
    };
    
    // Create the request in the database
    const request = await createDocument<Request>(REQUESTS_COLLECTION, requestData as Omit<Request, 'id'>);
    
    // Get property details to include in notifications
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, data.propertyId);
    
    if (property) {
      try {
        // Send notification to the advertiser using the reservationRequest function
        await advertiserNotifications.reservationRequest(
          property.ownerId,
          {
            id: request.id,
            propertyId: property.id,
            propertyTitle: property.title || 'Property',
            startDate: scheduledDate,
            endDate: leavingDate || scheduledDate,
            clientId: currentUser.id,
            clientName: fullName || currentUser.name || 'Client',
            advertiserId: property.ownerId,
            status: 'pending'
          }
        );
        
        // Create a direct notification for the user
        await NotificationService.createNotification(
          currentUser.id,
          'user',
          'reservation_request',
          'Reservation Request Sent',
          `Your request for "${property.title || 'Property'}" has been sent to the advertiser`,
          `/dashboard/user/reservations`,
          { 
            reservationId: request.id, 
            propertyId: property.id
          }
        );
      } catch (notificationError) {
        console.error('Error sending notifications:', notificationError);
        // Don't fail the entire request if notifications fail
      }
    }
    
    return request;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('Failed to create reservation');
  }
}

/**
 * Process payment after reservation is accepted
 * This integrates with our Express payment gateway service
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
    
    // Get property details for payment
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Import the payment gateway service
    const PaymentGatewayService = (await import('../../services/PaymentGatewayService')).default;
    
    // Generate a unique order ID
    const orderID = `res_${reservationId}_${Date.now()}`;
    
    // Prepare payment data
    const paymentData = {
      amount: reservation.totalPrice || 0,
      currency: 'MAD', // Update with your currency
      orderID,
      customerEmail: currentUser.email,
      customerName: currentUser.name && currentUser.surname 
        ? `${currentUser.name} ${currentUser.surname}` 
        : currentUser.name || 'Client',
      redirectURL: `${window.location.origin}/payment-success?reservationId=${reservationId}`,
      callbackURL: `${window.location.origin}/api/payment-callback`,
      customData: {
        reservationId,
        propertyId: property.id,
        userId: currentUser.id
      }
    };
    
    // Initiate payment with our payment gateway
    const paymentResponse = await PaymentGatewayService.initiatePayment(paymentData);
    
    if (!paymentResponse.success || !paymentResponse.paymentUrl) {
      throw new Error(paymentResponse.error || 'Failed to initiate payment');
    }
    
    // Update the reservation with payment information
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      paymentOrderId: orderID,
      paymentStatus: 'pending',
      updatedAt: new Date()
    });
    
    // Redirect the user to the payment gateway page
    window.location.href = paymentResponse.paymentUrl;
    
    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment');
  }
} 