import { db } from '../firebase/config';
import { doc, collection, query, where, getDocs, getDoc, updateDoc, setDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { User, Property, Request } from '../entities';
import { getAuth } from 'firebase/auth';
import { getDocumentById, updateDocument } from '../firebase/firestore';

// Constants
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';
const PAYMENTS_COLLECTION = 'payments';

// Payment interface
export interface Payment {
  id: string;
  reservationId: string;
  propertyId: string;
  userId: string;
  advertiserId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Process a payment through Payzone payment gateway
 * @param reservationId - The ID of the reservation to process payment for
 * @returns The payment result object
 */
export async function processPayment(reservationId: string): Promise<{
  success: boolean;
  paymentId?: string;
  error?: string;
}> {
  try {
    // Check if user is authenticated
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the reservation
    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Verify that the reservation belongs to the current user
    if (reservation.userId !== user.uid) {
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
    
    // Get user details
    const userDoc = await getDocumentById<User>(USERS_COLLECTION, user.uid);
    if (!userDoc) {
      throw new Error('User profile not found');
    }
    
    // Prepare payment data
    const paymentData = {
      amount: reservation.totalPrice || 0,
      currency: 'MAD', // Moroccan Dirham
      orderID,
      customerEmail: userDoc.email || user.email || '',
      customerName: userDoc.name && userDoc.surname 
        ? `${userDoc.name} ${userDoc.surname}` 
        : userDoc.name || 'Client',
      redirectURL: `${window.location.origin}/payment-success?reservationId=${reservationId}`,
      callbackURL: `${window.location.origin}/api/payment-callback`,
      customData: {
        reservationId,
        propertyId: property.id,
        userId: user.uid,
        advertiserId: property.ownerId || property.advertiserId
      }
    };
    
    // Here you would integrate with Payzone
    // For now, we'll simulate a successful payment
    
    // In a real implementation, you would:
    // const paymentResponse = await PaymentGatewayService.initiatePayment(paymentData);
    // if (!paymentResponse.success || !paymentResponse.paymentUrl) {
    //   throw new Error(paymentResponse.error || 'Failed to initiate payment');
    // }
    
    // For simulation purposes:
    const simulatedTransactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create a payment record
    const paymentRef = await addDoc(collection(db, PAYMENTS_COLLECTION), {
      reservationId,
      propertyId: property.id,
      userId: user.uid,
      advertiserId: property.ownerId || property.advertiserId,
      amount: reservation.totalPrice || 0,
      currency: 'MAD',
      status: 'completed', // In real implementation, this would initially be 'pending'
      paymentMethod: 'card', // This would come from the actual payment method used
      transactionId: simulatedTransactionId,
      paymentDate: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Update the reservation with payment information
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      paymentOrderId: orderID,
      paymentStatus: 'paid',
      status: 'paid',
      updatedAt: new Date()
    });
    
    // Update advertiser's payment records - increment total collected amount
    if (property.ownerId || property.advertiserId) {
      const advertiserId = property.ownerId || property.advertiserId;
      const advertiserRef = doc(db, USERS_COLLECTION, advertiserId);
      const advertiserDoc = await getDoc(advertiserRef);
      
      if (advertiserDoc.exists()) {
        const advertiserData = advertiserDoc.data();
        const currentTotal = advertiserData.totalCollected || 0;
        const paymentCount = advertiserData.paymentCount || 0;
        
        await updateDoc(advertiserRef, {
          totalCollected: currentTotal + (reservation.totalPrice || 0),
          paymentCount: paymentCount + 1,
          updatedAt: Timestamp.now()
        });
      }
    }
    
    // Send notifications
    try {
      // Import NotificationService dynamically to avoid circular dependencies
      const NotificationService = (await import('../../services/NotificationService')).default;
      
      // Notify advertiser about payment
      if (property.ownerId || property.advertiserId) {
        const advertiserId = property.ownerId || property.advertiserId;
        
        await NotificationService.createNotification(
          advertiserId,
          'advertiser',
          'payment_confirmed',
          'Payment Received',
          `Payment has been received for the reservation at ${property.title || 'your property'}.`,
          `/dashboard/advertiser/reservations`,
          {
            reservationId,
            propertyId: property.id,
            status: 'paid'
          }
        );
      }
      
      // Notify user about payment confirmation
      await NotificationService.createNotification(
        user.uid,
        'user',
        'payment_confirmation',
        'Payment Confirmed',
        `Your payment for ${property.title || 'the property'} has been successfully processed.`,
        `/dashboard/user/reservations`,
        {
          reservationId,
          propertyId: property.id,
          status: 'paid'
        }
      );
    } catch (notifError) {
      console.error('Error sending payment notifications:', notifError);
      // Don't throw error here so the main action can still succeed
    }
    
    return {
      success: true,
      paymentId: paymentRef.id
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error processing payment'
    };
  }
}

/**
 * Get payment history for an advertiser
 * @returns Array of payments with related information
 */
export async function getAdvertiserPayments(): Promise<{
  payment: Payment;
  property?: Property;
  client?: User;
}[]> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Query payments collection for payments where advertiserId matches the current user
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(paymentsRef, where('advertiserId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    const payments: {
      payment: Payment;
      property?: Property;
      client?: User;
    }[] = [];
    
    // Process each payment
    for (const docSnapshot of querySnapshot.docs) {
      const paymentData = docSnapshot.data();
      
      // Convert Firestore timestamps to JavaScript Date objects
      const paymentDate = paymentData.paymentDate instanceof Timestamp 
        ? paymentData.paymentDate.toDate() 
        : new Date(paymentData.paymentDate);
        
      const createdAt = paymentData.createdAt instanceof Timestamp 
        ? paymentData.createdAt.toDate() 
        : new Date(paymentData.createdAt);
        
      const updatedAt = paymentData.updatedAt instanceof Timestamp 
        ? paymentData.updatedAt.toDate() 
        : new Date(paymentData.updatedAt);
      
      const payment: Payment = {
        id: docSnapshot.id,
        ...paymentData,
        paymentDate,
        createdAt,
        updatedAt
      } as Payment;
      
      // Get property information
      let property: Property | undefined;
      if (payment.propertyId) {
        try {
          property = await getDocumentById<Property>(PROPERTIES_COLLECTION, payment.propertyId);
        } catch (err) {
          console.error(`Error fetching property ${payment.propertyId}:`, err);
        }
      }
      
      // Get client information
      let client: User | undefined;
      if (payment.userId) {
        try {
          client = await getDocumentById<User>(USERS_COLLECTION, payment.userId);
        } catch (err) {
          console.error(`Error fetching client ${payment.userId}:`, err);
        }
      }
      
      payments.push({
        payment,
        property,
        client
      });
    }
    
    return payments;
  } catch (error) {
    console.error('Error fetching advertiser payments:', error);
    throw error;
  }
}

/**
 * Get payment history for a user
 * @returns Array of payments with related information
 */
export async function getUserPayments(): Promise<{
  payment: Payment;
  property?: Property;
  advertiser?: User;
}[]> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Query payments collection for payments where userId matches the current user
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(paymentsRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    const payments: {
      payment: Payment;
      property?: Property;
      advertiser?: User;
    }[] = [];
    
    // Process each payment
    for (const docSnapshot of querySnapshot.docs) {
      const paymentData = docSnapshot.data();
      
      // Convert Firestore timestamps to JavaScript Date objects
      const paymentDate = paymentData.paymentDate instanceof Timestamp 
        ? paymentData.paymentDate.toDate() 
        : new Date(paymentData.paymentDate);
        
      const createdAt = paymentData.createdAt instanceof Timestamp 
        ? paymentData.createdAt.toDate() 
        : new Date(paymentData.createdAt);
        
      const updatedAt = paymentData.updatedAt instanceof Timestamp 
        ? paymentData.updatedAt.toDate() 
        : new Date(paymentData.updatedAt);
      
      const payment: Payment = {
        id: docSnapshot.id,
        ...paymentData,
        paymentDate,
        createdAt,
        updatedAt
      } as Payment;
      
      // Get property information
      let property: Property | undefined;
      if (payment.propertyId) {
        try {
          property = await getDocumentById<Property>(PROPERTIES_COLLECTION, payment.propertyId);
        } catch (err) {
          console.error(`Error fetching property ${payment.propertyId}:`, err);
        }
      }
      
      // Get advertiser information
      let advertiser: User | undefined;
      if (payment.advertiserId) {
        try {
          advertiser = await getDocumentById<User>(USERS_COLLECTION, payment.advertiserId);
        } catch (err) {
          console.error(`Error fetching advertiser ${payment.advertiserId}:`, err);
        }
      }
      
      payments.push({
        payment,
        property,
        advertiser
      });
    }
    
    return payments;
  } catch (error) {
    console.error('Error fetching user payments:', error);
    throw error;
  }
}

/**
 * Get payment statistics for an advertiser
 */
export async function getAdvertiserPaymentStats(): Promise<{
  totalCollected: number;
  paymentCount: number;
  pendingAmount: number;
}> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get advertiser document which should have payment stats
    const advertiserRef = doc(db, USERS_COLLECTION, user.uid);
    const advertiserDoc = await getDoc(advertiserRef);
    
    if (!advertiserDoc.exists()) {
      return {
        totalCollected: 0,
        paymentCount: 0,
        pendingAmount: 0
      };
    }
    
    const advertiserData = advertiserDoc.data();
    
    // Calculate pending amount from pending reservations
    let pendingAmount = 0;
    
    // Get all properties for this advertiser
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const propertiesQuery = query(propertiesRef, where('ownerId', '==', user.uid));
    const propertiesSnapshot = await getDocs(propertiesQuery);
    
    const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
    
    // For each property, get pending reservations
    for (const propertyId of propertyIds) {
      const requestsRef = collection(db, REQUESTS_COLLECTION);
      const requestsQuery = query(
        requestsRef, 
        where('propertyId', '==', propertyId),
        where('status', '==', 'accepted')
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      
      // Sum up the total price of all pending reservations
      requestsSnapshot.docs.forEach(doc => {
        const requestData = doc.data();
        pendingAmount += requestData.totalPrice || 0;
      });
    }
    
    return {
      totalCollected: advertiserData.totalCollected || 0,
      paymentCount: advertiserData.paymentCount || 0,
      pendingAmount
    };
  } catch (error) {
    console.error('Error fetching advertiser payment stats:', error);
    return {
      totalCollected: 0,
      paymentCount: 0,
      pendingAmount: 0
    };
  }
}

export default {
  processPayment,
  getAdvertiserPayments,
  getUserPayments,
  getAdvertiserPaymentStats
}; 