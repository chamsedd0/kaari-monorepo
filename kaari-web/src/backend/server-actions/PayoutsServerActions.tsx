'use server';

import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy,
  updateDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection references
const PAYOUTS_COLLECTION = 'payouts';
const USERS_COLLECTION = 'users';
const REFERRALS_COLLECTION = 'referrals';
const REFUND_REQUESTS_COLLECTION = 'refundRequests';
const REQUESTS_COLLECTION = 'requests'; // For bookings/reservations
const PROPERTIES_COLLECTION = 'properties';

// Payout interface
export interface Payout {
  id: string;
  payeeId: string;
  payeeName: string;
  payeePhone: string;
  payeeType: 'advertiser' | 'tenant';
  paymentMethod: {
    bankName: string;
    accountLast4: string;
    type: 'RIB' | 'IBAN';
  };
  reason: 'Rent – Move-in' | 'Cushion – Pre-move Cancel' | 'Cushion – Haani Max Cancel' | 'Referral Commission' | 'Tenant Refund';
  amount: number;
  status: 'pending' | 'paid';
  createdAt: Date;
  paidAt?: Date;
  sourceId?: string; // ID of the source document (booking, refund request, etc.)
  sourceType?: string; // Type of the source (booking, refund, referral)
}

/**
 * Process a payout document and convert to Payout interface
 */
async function processPayoutDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Promise<Payout> {
  try {
    const data = docSnapshot.data();
    
    // Get payee information
    let payeeName = 'Unknown';
    let payeePhone = '';
    
    if (data.payeeId) {
      try {
        const payeeDoc = await getDoc(doc(db, USERS_COLLECTION, data.payeeId));
        if (payeeDoc.exists()) {
          const payeeData = payeeDoc.data();
          payeeName = payeeData.name || payeeData.displayName || 'Unknown';
          payeePhone = payeeData.phoneNumber || '';
        }
      } catch (error) {
        console.error('Error fetching payee data:', error);
      }
    }
    
    // Get payment method info
    const paymentMethod = {
      bankName: data.paymentMethod?.bankName || 'Unknown Bank',
      accountLast4: data.paymentMethod?.accountLast4 || '****',
      type: data.paymentMethod?.type || 'IBAN'
    };
    
    return {
      id: docSnapshot.id,
      payeeId: data.payeeId || '',
      payeeName,
      payeePhone,
      payeeType: data.payeeType || 'advertiser',
      paymentMethod,
      reason: data.reason || 'Rent – Move-in',
      amount: data.amount || 0,
      status: data.status || 'pending',
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      paidAt: data.paidAt?.toDate ? data.paidAt.toDate() : undefined,
      sourceId: data.sourceId,
      sourceType: data.sourceType
    };
  } catch (error) {
    console.error('Error processing payout:', error);
    return {
      id: docSnapshot.id,
      payeeId: '',
      payeeName: 'Error',
      payeePhone: '',
      payeeType: 'advertiser',
      paymentMethod: {
        bankName: 'Unknown',
        accountLast4: '****',
        type: 'IBAN'
      },
      reason: 'Rent – Move-in',
      amount: 0,
      status: 'pending',
      createdAt: new Date()
    };
  }
}

/**
 * Get all pending payouts
 */
export async function getAllPendingPayouts(): Promise<Payout[]> {
  try {
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    const q = query(
      payoutsRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const payouts: Payout[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const payout = await processPayoutDoc(docSnapshot);
      payouts.push(payout);
    }
    
    return payouts;
  } catch (error) {
    console.error('Error fetching pending payouts:', error);
    throw new Error('Failed to fetch pending payouts');
  }
}

/**
 * Mark a payout as paid
 */
export async function markPayoutAsPaid(payoutId: string): Promise<void> {
  try {
    const payoutRef = doc(db, PAYOUTS_COLLECTION, payoutId);
    const payoutDoc = await getDoc(payoutRef);
    
    if (!payoutDoc.exists()) {
      throw new Error('Payout not found');
    }
    
    // Update the payout status
    await updateDoc(payoutRef, {
      status: 'paid',
      paidAt: serverTimestamp()
    });
    
    // If this is a referral commission, update the referral status
    const data = payoutDoc.data();
    if (data.sourceType === 'referral' && data.sourceId) {
      try {
        const referralRef = doc(db, REFERRALS_COLLECTION, data.sourceId);
        await updateDoc(referralRef, {
          'referralStats.commissionPaid': true,
          'referralStats.commissionPaidAt': serverTimestamp()
        });
      } catch (referralError) {
        console.error('Error updating referral status:', referralError);
      }
    }
    
    // If this is a refund, update the refund request status
    if (data.sourceType === 'refund' && data.sourceId) {
      try {
        const refundRef = doc(db, REFUND_REQUESTS_COLLECTION, data.sourceId);
        await updateDoc(refundRef, {
          status: 'refundCompleted',
          refundCompletedAt: serverTimestamp()
        });
      } catch (refundError) {
        console.error('Error updating refund status:', refundError);
      }
    }
    
    // If this is a rent payout, update the booking status if needed
    if ((data.reason === 'Rent – Move-in' || data.reason.includes('Cushion')) && data.sourceId) {
      try {
        const bookingRef = doc(db, REQUESTS_COLLECTION, data.sourceId);
        await updateDoc(bookingRef, {
          payoutCompleted: true,
          payoutCompletedAt: serverTimestamp()
        });
      } catch (bookingError) {
        console.error('Error updating booking status:', bookingError);
      }
    }
  } catch (error) {
    console.error('Error marking payout as paid:', error);
    throw new Error('Failed to mark payout as paid');
  }
}

/**
 * Get all payouts (including paid ones)
 */
export async function getAllPayouts(): Promise<Payout[]> {
  try {
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    const q = query(
      payoutsRef,
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const payouts: Payout[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const payout = await processPayoutDoc(docSnapshot);
      payouts.push(payout);
    }
    
    return payouts;
  } catch (error) {
    console.error('Error fetching all payouts:', error);
    throw new Error('Failed to fetch payouts');
  }
}

/**
 * Get payouts by payee ID
 */
export async function getPayoutsByPayeeId(payeeId: string): Promise<Payout[]> {
  try {
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    const q = query(
      payoutsRef,
      where('payeeId', '==', payeeId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const payouts: Payout[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const payout = await processPayoutDoc(docSnapshot);
      payouts.push(payout);
    }
    
    return payouts;
  } catch (error) {
    console.error('Error fetching payouts by payee ID:', error);
    throw new Error('Failed to fetch payouts');
  }
} 

/**
 * Create a payout for a booking's rent payment to the advertiser
 * This should be called when a booking has moved in and the safety window has passed
 */
export async function createRentPayout(bookingId: string): Promise<boolean> {
  try {
    // Get the booking
    const bookingRef = doc(db, REQUESTS_COLLECTION, bookingId);
    const bookingDoc = await getDoc(bookingRef);
    
    if (!bookingDoc.exists()) {
      console.error(`Booking ${bookingId} not found for rent payout`);
      return false;
    }
    
    const bookingData = bookingDoc.data();
    
    // Check if booking is in the right state (moved in and safety window passed)
    if (bookingData.status !== 'movedIn') {
      console.error(`Booking ${bookingId} is not in 'movedIn' status for rent payout`);
      return false;
    }
    
    // Check if payout was already created
    if (bookingData.payoutCreated) {
      console.error(`Payout for booking ${bookingId} was already created`);
      return false;
    }
    
    // Get property details to find advertiser
    const propertyRef = doc(db, PROPERTIES_COLLECTION, bookingData.propertyId);
    const propertyDoc = await getDoc(propertyRef);
    
    if (!propertyDoc.exists()) {
      console.error(`Property ${bookingData.propertyId} not found for booking ${bookingId}`);
      return false;
    }
    
    const propertyData = propertyDoc.data();
    const advertiserId = propertyData.ownerId || propertyData.advertiserId;
    
    if (!advertiserId) {
      console.error(`No advertiser ID found for property ${bookingData.propertyId}`);
      return false;
    }
    
    // Get advertiser details for payment method
    const advertiserRef = doc(db, USERS_COLLECTION, advertiserId);
    const advertiserDoc = await getDoc(advertiserRef);
    
    if (!advertiserDoc.exists()) {
      console.error(`Advertiser ${advertiserId} not found for rent payout`);
      return false;
    }
    
    const advertiserData = advertiserDoc.data();
    
    // Check if advertiser has payment method
    if (!advertiserData.paymentMethod) {
      console.error(`Advertiser ${advertiserId} has no payment method for rent payout`);
      return false;
    }
    
    // Calculate the amount to pay to the advertiser (total price minus platform fee)
    const totalPrice = bookingData.totalPrice || bookingData.price || 0;
    const platformFeePercentage = 0.10; // 10% platform fee
    const platformFee = totalPrice * platformFeePercentage;
    const payoutAmount = totalPrice - platformFee;
    
    // Create a new payout document
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    const newPayoutRef = doc(payoutsRef);
    
    await setDoc(newPayoutRef, {
      payeeId: advertiserId,
      payeeType: 'advertiser',
      paymentMethod: {
        bankName: advertiserData.paymentMethod.bankName || 'Unknown Bank',
        accountLast4: advertiserData.paymentMethod.accountLast4 || '****',
        type: advertiserData.paymentMethod.type || 'IBAN'
      },
      reason: 'Rent – Move-in',
      amount: payoutAmount,
      status: 'pending',
      createdAt: serverTimestamp(),
      sourceId: bookingId,
      sourceType: 'booking',
      createdBy: 'system'
    });
    
    console.log(`Created rent payout ${newPayoutRef.id} for booking ${bookingId} to advertiser ${advertiserId} with amount ${payoutAmount}`);
    
    // Update the booking with the payout ID
    await updateDoc(bookingRef, {
      payoutId: newPayoutRef.id,
      payoutCreated: true,
      payoutCreatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error creating rent payout:', error);
    return false;
  }
}

/**
 * Create a payout for a booking cancellation (cushion payment) to the advertiser
 */
export async function createCancellationPayout(bookingId: string, reason: 'Cushion – Pre-move Cancel' | 'Cushion – Haani Max Cancel'): Promise<boolean> {
  try {
    // Get the booking
    const bookingRef = doc(db, REQUESTS_COLLECTION, bookingId);
    const bookingDoc = await getDoc(bookingRef);
    
    if (!bookingDoc.exists()) {
      console.error(`Booking ${bookingId} not found for cancellation payout`);
      return false;
    }
    
    const bookingData = bookingDoc.data();
    
    // Check if booking is in the right state (cancelled or refundProcessing)
    if (bookingData.status !== 'cancelled' && bookingData.status !== 'refundProcessing' && bookingData.status !== 'refundCompleted') {
      console.error(`Booking ${bookingId} is not in a cancellation status for cushion payout`);
      return false;
    }
    
    // Check if payout was already created
    if (bookingData.payoutCreated) {
      console.error(`Payout for booking ${bookingId} was already created`);
      return false;
    }
    
    // Get property details to find advertiser
    const propertyRef = doc(db, PROPERTIES_COLLECTION, bookingData.propertyId);
    const propertyDoc = await getDoc(propertyRef);
    
    if (!propertyDoc.exists()) {
      console.error(`Property ${bookingData.propertyId} not found for booking ${bookingId}`);
      return false;
    }
    
    const propertyData = propertyDoc.data();
    const advertiserId = propertyData.ownerId || propertyData.advertiserId;
    
    if (!advertiserId) {
      console.error(`No advertiser ID found for property ${bookingData.propertyId}`);
      return false;
    }
    
    // Get advertiser details for payment method
    const advertiserRef = doc(db, USERS_COLLECTION, advertiserId);
    const advertiserDoc = await getDoc(advertiserRef);
    
    if (!advertiserDoc.exists()) {
      console.error(`Advertiser ${advertiserId} not found for cancellation payout`);
      return false;
    }
    
    const advertiserData = advertiserDoc.data();
    
    // Check if advertiser has payment method
    if (!advertiserData.paymentMethod) {
      console.error(`Advertiser ${advertiserId} has no payment method for cancellation payout`);
      return false;
    }
    
    // Calculate the cushion amount based on the reason
    const totalPrice = bookingData.totalPrice || bookingData.price || 0;
    let payoutAmount = 0;
    
    if (reason === 'Cushion – Pre-move Cancel') {
      // Pre-move cancellation: 50% of total price
      payoutAmount = totalPrice * 0.5;
    } else if (reason === 'Cushion – Haani Max Cancel') {
      // Haani Max cancellation: 30% of total price
      payoutAmount = totalPrice * 0.3;
    }
    
    // Create a new payout document
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    const newPayoutRef = doc(payoutsRef);
    
    await setDoc(newPayoutRef, {
      payeeId: advertiserId,
      payeeType: 'advertiser',
      paymentMethod: {
        bankName: advertiserData.paymentMethod.bankName || 'Unknown Bank',
        accountLast4: advertiserData.paymentMethod.accountLast4 || '****',
        type: advertiserData.paymentMethod.type || 'IBAN'
      },
      reason: reason,
      amount: payoutAmount,
      status: 'pending',
      createdAt: serverTimestamp(),
      sourceId: bookingId,
      sourceType: 'booking',
      createdBy: 'system'
    });
    
    console.log(`Created cancellation payout ${newPayoutRef.id} for booking ${bookingId} to advertiser ${advertiserId} with amount ${payoutAmount}`);
    
    // Update the booking with the payout ID
    await updateDoc(bookingRef, {
      payoutId: newPayoutRef.id,
      payoutCreated: true,
      payoutCreatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error creating cancellation payout:', error);
    return false;
  }
} 