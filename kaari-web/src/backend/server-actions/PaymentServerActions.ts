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
  advertiserStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
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
    
    // Check if propertyId exists before using it
    if (!reservation.propertyId) {
      throw new Error('Property ID not found in reservation');
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
    
    // Get advertiser ID from property
    const advertiserId = property.ownerId;
    if (!advertiserId) {
      throw new Error('Advertiser ID not found for this property');
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
        advertiserId
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
      advertiserId,
      amount: reservation.totalPrice || 0,
      currency: 'MAD',
      status: 'completed', // For the client, the payment is completed
      advertiserStatus: 'pending', // For the advertiser, it's pending until move-in + 24 hours
      paymentMethod: 'card', // This would come from the actual payment method used
      transactionId: simulatedTransactionId,
      paymentDate: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Update the reservation with payment information
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'paid',
      updatedAt: new Date()
    });
    
    // Note: Advertiser settlement is scheduled at move-in in handleMoveIn via SettlementService
    
    // Send notifications
    try {
      // Import NotificationService dynamically to avoid circular dependencies
      const NotificationService = (await import('../../services/NotificationService')).default;
      
      // Notify advertiser about payment (but clarify they'll receive it after move-in)
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
    
    // Check if propertyId exists before using it
    if (!reservation.propertyId) {
      throw new Error('Property ID not found in reservation');
    }
    
    // Get property details
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    const advertiserId = property.ownerId;
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
      updatedAt: new Date()
    });

    // Schedule a review prompt for the user after move-in to keep parity with ClientServerActions
    try {
      const { scheduleReviewPromptAfterMoveIn } = await import('./ReviewManagementActions');
      await scheduleReviewPromptAfterMoveIn(reservationId);
    } catch (e) {
      // Non-critical
      console.warn('Failed to schedule review prompt after move-in:', e);
    }
    
    // Schedule settlement consistently (pending payout + advertiser payment status)
    try {
      const { schedulePendingPayout } = await import('../settlements/SettlementService');
      await schedulePendingPayout(reservationId, scheduledReleaseDate);
    } catch (e) {
      console.warn('Failed to schedule pending payout:', e);
    }

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
        'move_in_confirmation',
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
        // Use unified settlement completion helper
        const { completePayoutForReservation } = await import('../settlements/SettlementService');
        const ok = await completePayoutForReservation(payoutData.reservationId);
        if (!ok) throw new Error('Failed to finalize payout');

        // Update advertiser aggregates
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
        }

        // Mark pending payout completed
        await updateDoc(doc(db, PENDING_PAYOUTS_COLLECTION, payoutId), {
          status: 'completed',
          updatedAt: Timestamp.now()
        });

        // Notify advertiser
        const NotificationService = (await import('../../services/NotificationService')).default;
        await NotificationService.createNotification(
          payoutData.advertiserId,
          'advertiser',
          'payout_processed',
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
      const bookingData = docSnapshot.data();
      
      try {
        // Get property details
        const propertyRef = doc(db, PROPERTIES_COLLECTION, bookingData.propertyId);
        const propertyDoc = await getDoc(propertyRef);
        
        if (!propertyDoc.exists()) {
          console.error(`Property not found for booking ${bookingId}`);
          continue;
        }
        
        const property = propertyDoc.data();
        const advertiserId = property.ownerId;
        
        if (!advertiserId) {
          console.error(`Advertiser ID not found for property ${bookingData.propertyId}`);
          continue;
        }
        
        // Create payout request for this booking
        const success = await createRentPayout(bookingId);
        
        if (success) {
          // Update the booking to indicate that payout has been created
          await updateDoc(doc(db, REQUESTS_COLLECTION, bookingId), {
            payoutPending: false,
            payoutProcessed: true,
            payoutProcessedAt: serverTimestamp()
          });
          
          // Update the payment record to change advertiserStatus to 'completed'
          // Find the payment record for this booking
          const paymentsRef = collection(db, PAYMENTS_COLLECTION);
          const paymentQuery = query(paymentsRef, where('reservationId', '==', bookingId));
          const paymentSnapshot = await getDocs(paymentQuery);
          
          if (!paymentSnapshot.empty) {
            const paymentDoc = paymentSnapshot.docs[0];
            await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentDoc.id), {
              advertiserStatus: 'completed',
              updatedAt: serverTimestamp()
            });
          }
          
          // Send notification to advertiser
          const NotificationService = (await import('../../services/NotificationService')).default;
          await NotificationService.createNotification(
            advertiserId,
            'advertiser',
            'payout_request_approved',
            'Payout Ready',
            `A payout for ${bookingData.totalPrice || 0} MAD is now ready for your property. You can request this payout from your payments page.`,
            `/dashboard/advertiser/payments`,
            {
              reservationId: bookingId,
              propertyId: bookingData.propertyId,
              amount: bookingData.totalPrice || 0
            }
          );
          
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
      
      // Use advertiserStatus if available, otherwise fall back to status
      const status = paymentData.advertiserStatus || paymentData.status;
      
      const payment: Payment = {
        id: docSnapshot.id,
        ...paymentData,
        status, // Use the advertiser-specific status
        paymentDate,
        createdAt,
        updatedAt
      } as Payment;
      
      // Get property information
      let property: Property | undefined;
      if (payment.propertyId) {
        try {
          const propertyResult = await getDocumentById<Property>(PROPERTIES_COLLECTION, payment.propertyId);
          property = propertyResult || undefined;
        } catch (err) {
          console.error(`Error fetching property ${payment.propertyId}:`, err);
        }
      }
      
      // Get client information
      let client: User | undefined;
      if (payment.userId) {
        try {
          const clientResult = await getDocumentById<User>(USERS_COLLECTION, payment.userId);
          client = clientResult || undefined;
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
          const propertyResult = await getDocumentById<Property>(PROPERTIES_COLLECTION, payment.propertyId);
          property = propertyResult || undefined;
        } catch (err) {
          console.error(`Error fetching property ${payment.propertyId}:`, err);
        }
      }
      
      // Get advertiser information
      let advertiser: User | undefined;
      if (payment.advertiserId) {
        try {
          const advertiserResult = await getDocumentById<User>(USERS_COLLECTION, payment.advertiserId);
          advertiser = advertiserResult || undefined;
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
    
    // Calculate pending amount from pending payouts
    let pendingAmount = 0;
    
    // Get pending payouts for this advertiser
    const pendingPayoutsRef = collection(db, PENDING_PAYOUTS_COLLECTION);
    const q = query(
      pendingPayoutsRef,
      where('advertiserId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    
    // Sum up the total amount of pending payouts
    querySnapshot.docs.forEach(doc => {
      const payoutData = doc.data();
      pendingAmount += payoutData.amount || 0;
    });
    
    // Include payments with advertiserStatus='pending'
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const paymentsQuery = query(
      paymentsRef,
      where('advertiserId', '==', user.uid),
      where('advertiserStatus', '==', 'pending')
    );
    const paymentsSnapshot = await getDocs(paymentsQuery);
    
    // Get all reservationIds from pending payments to avoid double counting
    const pendingPaymentReservationIds = new Set(
      paymentsSnapshot.docs.map(doc => doc.data().reservationId)
    );
    
    // Sum up the total amount of pending payments
    paymentsSnapshot.docs.forEach(doc => {
      const paymentData = doc.data();
      pendingAmount += paymentData.amount || 0;
    });
    
    // Get all properties for this advertiser
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const propertiesQuery = query(propertiesRef, where('ownerId', '==', user.uid));
    const propertiesSnapshot = await getDocs(propertiesQuery);
    
    const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
    
    // For each property, get paid reservations (before move-in)
    // but only count those that don't already have a payment record
    for (const propertyId of propertyIds) {
      const requestsRef = collection(db, REQUESTS_COLLECTION);
      const requestsQuery = query(
        requestsRef, 
        where('propertyId', '==', propertyId),
        where('status', '==', 'paid')
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      
      // Sum up the total price of paid reservations that don't have a payment record yet
      requestsSnapshot.docs.forEach(doc => {
        const requestData = doc.data();
        const reservationId = doc.id;
        
        // Only count if we haven't already counted a payment for this reservation
        if (!pendingPaymentReservationIds.has(reservationId)) {
          pendingAmount += requestData.totalPrice || 0;
        }
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

/**
 * Get pending payouts for current advertiser with scheduled release dates
 */
export async function getAdvertiserPendingPayouts(): Promise<Array<{ reservationId: string; scheduledReleaseDate: Date }>> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const pendingRef = collection(db, PENDING_PAYOUTS_COLLECTION);
  const q = query(pendingRef, where('advertiserId', '==', user.uid), where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  const results: Array<{ reservationId: string; scheduledReleaseDate: Date }> = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const sched = data.scheduledReleaseDate instanceof Timestamp ? data.scheduledReleaseDate.toDate() : new Date(data.scheduledReleaseDate);
    results.push({ reservationId: data.reservationId, scheduledReleaseDate: sched });
  });
  return results;
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