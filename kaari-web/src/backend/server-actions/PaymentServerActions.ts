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
const PENDING_PAYOUTS_COLLECTION = 'pendingPayouts';

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

// Pending Payout interface
export interface PendingPayout {
  id: string;
  reservationId: string;
  propertyId: string;
  userId: string;
  advertiserId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentId: string;
  scheduledReleaseDate: Date;
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
    
    // Note: We do NOT update advertiser's payment records here
    // The payment will be released to the advertiser 24 hours after move-in
    // This is handled by the handleMoveIn function and a scheduled job
    
    // Send notifications
    try {
      // Import NotificationService dynamically to avoid circular dependencies
      const NotificationService = (await import('../../services/NotificationService')).default;
      
      // Notify advertiser about payment (but clarify they'll receive it after move-in)
      if (property.ownerId || property.advertiserId) {
        const advertiserId = property.ownerId || property.advertiserId;
        
        await NotificationService.createNotification(
          advertiserId,
          'advertiser',
          'payment_confirmed',
          'Payment Received',
          `Payment has been received for the reservation at ${property.title || 'your property'}. Funds will be released 24 hours after client move-in.`,
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
 * Handle client move-in and schedule payout to advertiser
 * @param reservationId The ID of the reservation
 * @returns Success status
 */
export async function handleMoveIn(reservationId: string): Promise<{
  success: boolean;
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
      throw new Error('Not authorized to confirm move-in for this reservation');
    }
    
    // Verify that the reservation is in "paid" status
    if (reservation.status !== 'paid') {
      throw new Error('Cannot confirm move-in for a reservation that is not paid');
    }
    
    // Get property details
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    const advertiserId = property.ownerId || property.advertiserId;
    if (!advertiserId) {
      throw new Error('Advertiser ID not found for this property');
    }
    
    // Find the payment record for this reservation
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(paymentsRef, where('reservationId', '==', reservationId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Payment record not found for this reservation');
    }
    
    const paymentDoc = querySnapshot.docs[0];
    const paymentData = paymentDoc.data();
    
    // Calculate the scheduled release date (24 hours from now)
    const now = new Date();
    const scheduledReleaseDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Update the reservation status to "movedIn"
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'movedIn',
      movedIn: true,
      movedInAt: new Date(),
      safetyWindowEndsAt: scheduledReleaseDate,
      updatedAt: new Date()
    });
    
    // Schedule a job to create a payout after the safety window ends
    // This will be handled by a Cloud Function or a cron job
    // For now, we'll just set a flag to indicate that a payout should be created
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      payoutPending: true,
      payoutScheduledFor: scheduledReleaseDate
    });
    
    // Send notifications
    try {
      // Import NotificationService dynamically to avoid circular dependencies
      const NotificationService = (await import('../../services/NotificationService')).default;
      
      // Notify advertiser about move-in and upcoming payout
      await NotificationService.createNotification(
        advertiserId,
        'advertiser',
        'client_moved_in',
        'Client Moved In',
        `The client has confirmed move-in for ${property.title || 'your property'}. Payment will be released to you in 24 hours.`,
        `/dashboard/advertiser/reservations`,
        {
          reservationId,
          propertyId: property.id,
          status: 'movedIn'
        }
      );
      
      // Notify user about successful move-in
      await NotificationService.createNotification(
        user.uid,
        'user',
        'move_in_confirmed',
        'Move-In Confirmed',
        `Your move-in for ${property.title || 'the property'} has been confirmed.`,
        `/dashboard/user/reservations`,
        {
          reservationId,
          propertyId: property.id,
          status: 'movedIn'
        }
      );
    } catch (notifError) {
      console.error('Error sending move-in notifications:', notifError);
      // Don't throw error here so the main action can still succeed
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error handling move-in:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error handling move-in'
    };
  }
}

/**
 * Process pending payouts that are due (called by a scheduled job)
 * This would typically be called by a Cloud Function on a schedule
 */
export async function processPendingPayouts(): Promise<{
  success: boolean;
  processedCount: number;
  error?: string;
}> {
  try {
    const now = new Date();
    const payoutsRef = collection(db, PENDING_PAYOUTS_COLLECTION);
    const q = query(
      payoutsRef,
      where('status', '==', 'pending'),
      where('scheduledReleaseDate', '<=', Timestamp.fromDate(now))
    );
    
    const querySnapshot = await getDocs(q);
    let processedCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const payoutData = docSnapshot.data();
      const payoutId = docSnapshot.id;
      
      try {
        // Update advertiser's payment records - increment total collected amount
        const advertiserRef = doc(db, USERS_COLLECTION, payoutData.advertiserId);
        const advertiserDoc = await getDoc(advertiserRef);
        
        if (advertiserDoc.exists()) {
          const advertiserData = advertiserDoc.data();
          const currentTotal = advertiserData.totalCollected || 0;
          const paymentCount = advertiserData.paymentCount || 0;
          
          await updateDoc(advertiserRef, {
            totalCollected: currentTotal + (payoutData.amount || 0),
            paymentCount: paymentCount + 1,
            updatedAt: Timestamp.now()
          });
          
          // Update the payout status to completed
          await updateDoc(doc(db, PENDING_PAYOUTS_COLLECTION, payoutId), {
            status: 'completed',
            updatedAt: Timestamp.now()
          });
          
          // Send notification to advertiser
          const NotificationService = (await import('../../services/NotificationService')).default;
          await NotificationService.createNotification(
            payoutData.advertiserId,
            'advertiser',
            'payout_completed',
            'Payout Completed',
            `A payment of ${payoutData.amount} ${payoutData.currency} has been released to your account.`,
            `/dashboard/advertiser/payments`,
            {
              payoutId,
              amount: payoutData.amount,
              currency: payoutData.currency
            }
          );
          
          processedCount++;
        }
      } catch (err) {
        console.error(`Error processing payout ${payoutId}:`, err);
        // Continue with other payouts even if one fails
      }
    }
    
    return {
      success: true,
      processedCount
    };
  } catch (error) {
    console.error('Error processing pending payouts:', error);
    return {
      success: false,
      processedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error processing payouts'
    };
  }
}

/**
 * Process bookings with expired safety windows and create payouts
 * This should be called by a scheduled job (e.g., Cloud Function)
 */
export async function processSafetyWindowExpirations(): Promise<{
  success: boolean;
  processedCount: number;
  error?: string;
}> {
  try {
    const now = new Date();
    
    // Query for bookings with expired safety windows that need payouts
    const bookingsRef = collection(db, REQUESTS_COLLECTION);
    const q = query(
      bookingsRef,
      where('status', '==', 'movedIn'),
      where('payoutPending', '==', true),
      where('payoutScheduledFor', '<=', Timestamp.fromDate(now))
    );
    
    const querySnapshot = await getDocs(q);
    let processedCount = 0;
    
    // Import PayoutsServerActions dynamically to avoid circular dependencies
    const { createRentPayout } = await import('./PayoutsServerActions');
    
    for (const docSnapshot of querySnapshot.docs) {
      const bookingId = docSnapshot.id;
      
      try {
        // Create payout for this booking
        const success = await createRentPayout(bookingId);
        
        if (success) {
          // Update the booking to indicate that payout has been created
          await updateDoc(doc(db, REQUESTS_COLLECTION, bookingId), {
            payoutPending: false,
            payoutProcessed: true,
            payoutProcessedAt: serverTimestamp()
          });
          
          processedCount++;
        }
      } catch (err) {
        console.error(`Error processing safety window expiration for booking ${bookingId}:`, err);
        // Continue with the next booking
      }
    }
    
    return {
      success: true,
      processedCount
    };
  } catch (error) {
    console.error('Error processing safety window expirations:', error);
    return {
      success: false,
      processedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error processing safety window expirations'
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
  requestableAmount: number;
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
        pendingAmount: 0,
        requestableAmount: 0
      };
    }
    
    const advertiserData = advertiserDoc.data();
    
    // Calculate pending amount from pending payouts
    let pendingAmount = 0;
    let requestableAmount = 0;
    
    // Get all properties for this advertiser
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const propertiesQuery = query(propertiesRef, where('ownerId', '==', user.uid));
    const propertiesSnapshot = await getDocs(propertiesQuery);
    
    const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
    
    // For each property, get paid reservations (before move-in)
    for (const propertyId of propertyIds) {
      const requestsRef = collection(db, REQUESTS_COLLECTION);
      
      // Get paid reservations (before move-in) - these are pending
      const paidRequestsQuery = query(
        requestsRef, 
        where('propertyId', '==', propertyId),
        where('status', '==', 'paid')
      );
      const paidRequestsSnapshot = await getDocs(paidRequestsQuery);
      
      // Sum up the total price of all paid reservations
      paidRequestsSnapshot.docs.forEach(doc => {
        const requestData = doc.data();
        pendingAmount += requestData.totalPrice || 0;
      });
      
      // Get moved-in reservations where refund window has passed - these are requestable
      const now = new Date();
      const movedInRequestsQuery = query(
        requestsRef, 
        where('propertyId', '==', propertyId),
        where('status', '==', 'movedIn')
      );
      const movedInRequestsSnapshot = await getDocs(movedInRequestsQuery);
      
      // Check each moved-in reservation to see if refund window has passed
      for (const docSnapshot of movedInRequestsSnapshot.docs) {
        const requestData = docSnapshot.data();
        
        // Skip if already processed for payout
        if (requestData.payoutProcessed) {
          continue;
        }
        
        // Check if the 24-hour refund window has passed
        if (!requestData.movedInAt) {
          continue;
        }
        
        // Convert Firestore timestamp to Date if needed
        let moveInDate: Date;
        if (typeof requestData.movedInAt === 'object' && 'seconds' in requestData.movedInAt) {
          moveInDate = new Date((requestData.movedInAt as any).seconds * 1000);
        } else {
          moveInDate = new Date(requestData.movedInAt);
        }
        
        // Calculate refund deadline (24 hours after move-in)
        const refundDeadline = new Date(moveInDate);
        refundDeadline.setHours(refundDeadline.getHours() + 24);
        
        // If refund window has passed, add to requestable amount
        if (now > refundDeadline) {
          requestableAmount += requestData.totalPrice || 0;
        } else {
          // Otherwise, add to pending amount
          pendingAmount += requestData.totalPrice || 0;
        }
      }
    }
    
    // Check for existing payout requests that haven't been approved yet
    const payoutRequestsRef = collection(db, 'payoutRequests');
    const payoutRequestsQuery = query(
      payoutRequestsRef,
      where('userId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const payoutRequestsSnapshot = await getDocs(payoutRequestsQuery);
    
    // Subtract requested amounts from requestable amount
    payoutRequestsSnapshot.docs.forEach(doc => {
      const requestData = doc.data();
      requestableAmount -= requestData.amount || 0;
    });
    
    // Ensure requestable amount doesn't go negative
    requestableAmount = Math.max(0, requestableAmount);
    
    return {
      totalCollected: advertiserData.totalCollected || 0,
      paymentCount: advertiserData.paymentCount || 0,
      pendingAmount,
      requestableAmount
    };
  } catch (error) {
    console.error('Error fetching advertiser payment stats:', error);
    return {
      totalCollected: 0,
      paymentCount: 0,
      pendingAmount: 0,
      requestableAmount: 0
    };
  }
}

export default {
  processPayment,
  handleMoveIn,
  processPendingPayouts,
  processSafetyWindowExpirations,
  getAdvertiserPayments,
  getUserPayments,
  getAdvertiserPaymentStats
}; 