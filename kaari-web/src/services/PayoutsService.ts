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
  serverTimestamp,
  setDoc,
  addDoc,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { getAuth } from 'firebase/auth';

// Collection references
const PAYOUTS_COLLECTION = 'payouts';
const PAYOUT_REQUESTS_COLLECTION = 'payoutRequests';
const USERS_COLLECTION = 'users';
const PAYMENTS_COLLECTION = 'payments';
const REFERRALS_COLLECTION = 'referrals';
const REFUND_REQUESTS_COLLECTION = 'refundRequests';
const REQUESTS_COLLECTION = 'requests'; // For bookings/reservations

// Payout source types
export type PayoutSourceType = 'rent' | 'referral' | 'refund' | 'cancellation';

// Payout reason types
export type PayoutReason = 
  'Rent – Move-in' | 
  'Cushion – Pre-move Cancel' | 
  'Cushion – Haani Max Cancel' | 
  'Referral Commission' | 
  'Tenant Refund';

// Payout status types
export type PayoutStatus = 'pending' | 'approved' | 'paid' | 'rejected';

// Payout request interface
export interface PayoutRequest {
  id: string;
  userId: string;
  userType: 'advertiser' | 'client';
  amount: number;
  currency: string;
  sourceType: PayoutSourceType;
  sourceId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  notes?: string;
  paymentMethod?: {
    type: 'RIB' | 'IBAN';
    bankName: string;
    accountNumber: string;
    accountLast4: string;
  };
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  approvedBy?: string;
  rejectedBy?: string;
}

// Payout interface
export interface Payout {
  id: string;
  payeeId: string;
  payeeName: string;
  payeePhone: string;
  payeeType: 'advertiser' | 'client';
  paymentMethod: {
    bankName: string;
    accountLast4: string;
    type: 'RIB' | 'IBAN';
  };
  reason: PayoutReason;
  amount: number;
  currency: string;
  status: PayoutStatus;
  sourceId?: string;
  sourceType?: PayoutSourceType;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  paidBy?: string;
  notes?: string;
}

class PayoutsService {
  /**
   * Request a payout for rent money after move-in
   * @param reservationId The ID of the reservation/booking
   */
  async requestRentPayout(reservationId: string): Promise<boolean> {
    try {
      console.log(`[DEBUG] Starting requestRentPayout for reservation: ${reservationId}`);
      
      // Ensure collections exist first
      await this.ensureCollectionsExist();
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error('[DEBUG] User not authenticated');
        throw new Error('User not authenticated');
      }
      
      console.log(`[DEBUG] Authenticated user ID: ${user.uid}`);
      
      // Get the reservation
      const reservationRef = doc(db, REQUESTS_COLLECTION, reservationId);
      const reservationDoc = await getDoc(reservationRef);
      
      if (!reservationDoc.exists()) {
        console.error(`[DEBUG] Reservation not found: ${reservationId}`);
        throw new Error('Reservation not found');
      }
      
      const reservation = reservationDoc.data();
      console.log(`[DEBUG] Reservation data:`, JSON.stringify(reservation, null, 2));
      
      // Get advertiserId - either directly from reservation or by looking up the property
      let advertiserId = reservation.advertiserId;
      
      // If advertiserId is undefined, try to get it from the property
      if (!advertiserId && reservation.propertyId) {
        console.log(`[DEBUG] AdvertiserId not found in reservation, looking up property: ${reservation.propertyId}`);
        
        // First try to get advertiserId directly from property
        const propertyRef = doc(db, 'properties', reservation.propertyId);
        const propertyDoc = await getDoc(propertyRef);
        
        if (propertyDoc.exists()) {
          const propertyData = propertyDoc.data();
          advertiserId = propertyData.advertiserId;
          console.log(`[DEBUG] Direct property lookup result - advertiserId: ${advertiserId}`);
        }
        
        // If still no advertiserId, search through all advertisers
        if (!advertiserId) {
          console.log(`[DEBUG] No advertiserId in property, searching through all advertisers...`);
          
          // Query all users with role 'advertiser'
          const usersRef = collection(db, USERS_COLLECTION);
          const q = query(usersRef, where('role', '==', 'advertiser'));
          const querySnapshot = await getDocs(q);
          
          // Loop through advertisers to find one with this property
          for (const advertiserDoc of querySnapshot.docs) {
            const advertiserData = advertiserDoc.data();
            
            // Check if this advertiser has the property in their properties array
            if (advertiserData.properties && 
                Array.isArray(advertiserData.properties) && 
                advertiserData.properties.includes(reservation.propertyId)) {
              advertiserId = advertiserDoc.id;
              console.log(`[DEBUG] Found advertiser ${advertiserId} with property in their properties array`);
              break;
            }
          }
        }
        
        if (advertiserId) {
          console.log(`[DEBUG] Found advertiserId from searches: ${advertiserId}`);
        } else {
          console.error(`[DEBUG] Could not find advertiser for property: ${reservation.propertyId}`);
        }
      }
      
      // Check if the current user is an admin
      const userRef = doc(db, USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error(`[DEBUG] User profile not found: ${user.uid}`);
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      const isAdmin = userData.role === 'admin';
      console.log(`[DEBUG] User role: ${userData.role}, isAdmin: ${isAdmin}`);
      
      // Verify that the reservation belongs to the current user (advertiser) or user is admin
      if (advertiserId !== user.uid && !isAdmin) {
        console.error(`[DEBUG] Not authorized. Reservation advertiser ID: ${advertiserId}, User ID: ${user.uid}, Is Admin: ${isAdmin}`);
        throw new Error('Not authorized to request payout for this reservation');
      }
      
      // Verify that the reservation is in 'movedIn' status
      if (reservation.status !== 'movedIn') {
        console.error(`[DEBUG] Invalid reservation status: ${reservation.status}`);
        throw new Error('Cannot request payout for a reservation that is not in moved-in status');
      }
      
      // Check if a payout request already exists for this reservation
      const payoutRequestsRef = collection(db, PAYOUT_REQUESTS_COLLECTION);
      const q = query(
        payoutRequestsRef,
        where('sourceId', '==', reservationId),
        where('sourceType', '==', 'rent')
      );
      
      console.log(`[DEBUG] Checking for existing payout requests`);
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.error(`[DEBUG] Payout request already exists. Count: ${querySnapshot.size}`);
        throw new Error('A payout request already exists for this reservation');
      }
      
      // Determine which user to create the payout for
      const payoutUserId = isAdmin ? advertiserId : user.uid;
      console.log(`[DEBUG] Creating payout for user: ${payoutUserId}`);
      
      // Get payment method for the payout user from payoutMethods collection
      const payoutMethodsRef = collection(db, 'payoutMethods');
      const payoutMethodQuery = query(payoutMethodsRef, where('userId', '==', payoutUserId), limit(1));
      const payoutMethodSnapshot = await getDocs(payoutMethodQuery);
      
      let paymentMethod = null;
      
      if (!payoutMethodSnapshot.empty) {
        const payoutMethodDoc = payoutMethodSnapshot.docs[0];
        paymentMethod = payoutMethodDoc.data();
        console.log(`[DEBUG] Found payment method in payoutMethods collection:`, JSON.stringify({
          id: payoutMethodDoc.id,
          type: paymentMethod.type,
          bankName: paymentMethod.bankName,
          hasAccountNumber: !!paymentMethod.accountNumber
        }, null, 2));
      } else {
        // Fallback to check in user document
        console.log(`[DEBUG] No payment method found in payoutMethods collection, checking user document...`);
        const payoutUserRef = doc(db, USERS_COLLECTION, payoutUserId);
        const payoutUserDoc = await getDoc(payoutUserRef);
        
        if (payoutUserDoc.exists()) {
          const payoutUserData = payoutUserDoc.data();
          if (payoutUserData.paymentMethod) {
            paymentMethod = payoutUserData.paymentMethod;
            console.log(`[DEBUG] Found payment method in user document`);
          }
        }
      }
      
      if (!paymentMethod) {
        console.error(`[DEBUG] No payment method found for payout user: ${payoutUserId}`);
        throw new Error(`No payment method found for ${isAdmin ? 'advertiser' : 'user'}. Please add a payment method to the profile.`);
      }
      
      // Calculate amount (this would be the advertiser's share of the payment)
      // In a real implementation, this would account for platform fees, etc.
      const amount = reservation.totalPrice || 0;
      console.log(`[DEBUG] Calculated payout amount: ${amount}`);
      
      // Create payout request
      console.log(`[DEBUG] Creating payout request document`);
      const payoutRequestRef = await addDoc(collection(db, PAYOUT_REQUESTS_COLLECTION), {
        userId: payoutUserId,
        userType: 'advertiser',
        amount,
        currency: 'MAD',
        sourceType: 'rent',
        sourceId: reservationId,
        status: 'pending',
        reason: 'Rent – Move-in',
        paymentMethod: {
          type: paymentMethod.type || 'IBAN',
          bankName: paymentMethod.bankName || '',
          accountNumber: paymentMethod.accountNumber || '',
          accountLast4: paymentMethod.accountNumber ? 
            paymentMethod.accountNumber.slice(-4) : '****'
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: user.uid,
        isAdminCreated: isAdmin
      });
      
      console.log(`[DEBUG] Successfully created payout request with ID: ${payoutRequestRef.id}`);
      return true;
    } catch (error) {
      console.error('[DEBUG] Error requesting rent payout:', error);
      return false;
    }
  }
  
  /**
   * Request a payout for referral earnings
   * @param referralId The ID of the referral record
   */
  async requestReferralPayout(referralId: string): Promise<boolean> {
    try {
      console.log(`[DEBUG] Starting requestReferralPayout for referral: ${referralId}`);
      
      // Ensure collections exist first
      await this.ensureCollectionsExist();
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error('[DEBUG] User not authenticated');
        throw new Error('User not authenticated');
      }
      
      console.log(`[DEBUG] Authenticated user ID: ${user.uid}`);
      
      // Get the referral data
      const referralRef = doc(db, REFERRALS_COLLECTION, referralId);
      const referralDoc = await getDoc(referralRef);
      
      if (!referralDoc.exists()) {
        console.error(`[DEBUG] Referral record not found: ${referralId}`);
        throw new Error('Referral record not found');
      }
      
      const referralData = referralDoc.data();
      console.log(`[DEBUG] Referral data:`, JSON.stringify({
        advertiserId: referralData.advertiserId,
        referralId: referralId
      }, null, 2));
      
      // Verify that the referral belongs to the current user
      if (referralData.advertiserId !== user.uid) {
        console.error(`[DEBUG] Not authorized. Referral advertiser ID: ${referralData.advertiserId}, User ID: ${user.uid}`);
        throw new Error('Not authorized to request payout for this referral');
      }
      
      // Calculate available earnings
      const referralStats = referralData.referralStats || {};
      const availableEarnings = referralStats.monthlyEarnings || 0;
      console.log(`[DEBUG] Available earnings: ${availableEarnings}`);
      
      if (availableEarnings <= 0) {
        console.error(`[DEBUG] No earnings available for payout`);
        throw new Error('No earnings available for payout');
      }
      
      // Check if a payout request already exists for this referral
      const payoutRequestsRef = collection(db, PAYOUT_REQUESTS_COLLECTION);
      const q = query(
        payoutRequestsRef,
        where('sourceId', '==', referralId),
        where('sourceType', '==', 'referral'),
        where('status', '==', 'pending')
      );
      
      console.log(`[DEBUG] Checking for existing payout requests`);
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.error(`[DEBUG] Payout request already exists. Count: ${querySnapshot.size}`);
        throw new Error('A pending payout request already exists for this referral');
      }
      
      // Get user's payment method
      const userRef = doc(db, USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error(`[DEBUG] User profile not found: ${user.uid}`);
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      console.log(`[DEBUG] User data:`, JSON.stringify({
        hasPaymentMethod: !!userData.paymentMethod,
        userId: user.uid
      }, null, 2));
      
      if (!userData.paymentMethod) {
        console.error(`[DEBUG] No payment method found for user: ${user.uid}`);
        throw new Error('No payment method found. Please add a payment method to your profile.');
      }
      
      // Create payout request
      console.log(`[DEBUG] Creating payout request document`);
      const payoutRequestRef = await addDoc(collection(db, PAYOUT_REQUESTS_COLLECTION), {
        userId: user.uid,
        userType: 'advertiser',
        amount: availableEarnings,
        currency: 'MAD',
        sourceType: 'referral',
        sourceId: referralId,
        status: 'pending',
        reason: 'Referral Commission',
        paymentMethod: {
          type: userData.paymentMethod.type || 'IBAN',
          bankName: userData.paymentMethod.bankName || '',
          accountNumber: userData.paymentMethod.accountNumber || '',
          accountLast4: userData.paymentMethod.accountNumber ? 
            userData.paymentMethod.accountNumber.slice(-4) : '****'
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      console.log(`[DEBUG] Successfully created payout request with ID: ${payoutRequestRef.id}`);
      return true;
    } catch (error) {
      console.error('[DEBUG] Error requesting referral payout:', error);
      return false;
    }
  }
  
  /**
   * Get all pending payout requests
   */
  async getPendingPayoutRequests(): Promise<PayoutRequest[]> {
    try {
      const payoutRequestsRef = collection(db, PAYOUT_REQUESTS_COLLECTION);
      const q = query(
        payoutRequestsRef,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const payoutRequests: PayoutRequest[] = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        
        payoutRequests.push({
          id: docSnapshot.id,
          userId: data.userId,
          userType: data.userType,
          amount: data.amount,
          currency: data.currency || 'MAD',
          sourceType: data.sourceType,
          sourceId: data.sourceId,
          status: data.status,
          reason: data.reason,
          notes: data.notes,
          paymentMethod: data.paymentMethod,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          approvedAt: data.approvedAt?.toDate(),
          rejectedAt: data.rejectedAt?.toDate(),
          approvedBy: data.approvedBy,
          rejectedBy: data.rejectedBy
        });
      }
      
      return payoutRequests;
    } catch (error) {
      console.error('Error getting pending payout requests:', error);
      throw new Error('Failed to get pending payout requests');
    }
  }
  
  /**
   * Get payout requests for a specific user
   * @param userId The ID of the user
   */
  async getUserPayoutRequests(userId: string): Promise<PayoutRequest[]> {
    try {
      const payoutRequestsRef = collection(db, PAYOUT_REQUESTS_COLLECTION);
      const q = query(
        payoutRequestsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const payoutRequests: PayoutRequest[] = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        
        payoutRequests.push({
          id: docSnapshot.id,
          userId: data.userId,
          userType: data.userType,
          amount: data.amount,
          currency: data.currency || 'MAD',
          sourceType: data.sourceType,
          sourceId: data.sourceId,
          status: data.status,
          reason: data.reason,
          notes: data.notes,
          paymentMethod: data.paymentMethod,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          approvedAt: data.approvedAt?.toDate(),
          rejectedAt: data.rejectedAt?.toDate(),
          approvedBy: data.approvedBy,
          rejectedBy: data.rejectedBy
        });
      }
      
      return payoutRequests;
    } catch (error) {
      console.error('Error getting user payout requests:', error);
      throw new Error('Failed to get user payout requests');
    }
  }
  
  /**
   * Approve a payout request and create a payout record
   * @param requestId The ID of the payout request
   */
  async approvePayoutRequest(requestId: string): Promise<boolean> {
    try {
      const auth = getAuth();
      const adminUser = auth.currentUser;
      
      if (!adminUser) {
        throw new Error('Admin not authenticated');
      }
      
      // Get the payout request
      const requestRef = doc(db, PAYOUT_REQUESTS_COLLECTION, requestId);
      const requestDoc = await getDoc(requestRef);
      
      if (!requestDoc.exists()) {
        throw new Error('Payout request not found');
      }
      
      const requestData = requestDoc.data();
      
      // Verify that the request is in pending status
      if (requestData.status !== 'pending') {
        throw new Error('Payout request is not in pending status');
      }
      
      // Get user details
      const userRef = doc(db, USERS_COLLECTION, requestData.userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      
      // Create a payout record
      const payoutRef = await addDoc(collection(db, PAYOUTS_COLLECTION), {
        payeeId: requestData.userId,
        payeeName: userData.name + (userData.surname ? ` ${userData.surname}` : ''),
        payeePhone: userData.phoneNumber || 'No phone',
        payeeType: requestData.userType,
        paymentMethod: requestData.paymentMethod,
        reason: requestData.reason,
        amount: requestData.amount,
        currency: requestData.currency || 'MAD',
        status: 'pending',
        sourceId: requestData.sourceId,
        sourceType: requestData.sourceType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Update the payout request status
      await updateDoc(requestRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: adminUser.uid,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error approving payout request:', error);
      return false;
    }
  }
  
  /**
   * Reject a payout request
   * @param requestId The ID of the payout request
   * @param reason Reason for rejection
   */
  async rejectPayoutRequest(requestId: string, reason: string): Promise<boolean> {
    try {
      const auth = getAuth();
      const adminUser = auth.currentUser;
      
      if (!adminUser) {
        throw new Error('Admin not authenticated');
      }
      
      // Get the payout request
      const requestRef = doc(db, PAYOUT_REQUESTS_COLLECTION, requestId);
      const requestDoc = await getDoc(requestRef);
      
      if (!requestDoc.exists()) {
        throw new Error('Payout request not found');
      }
      
      const requestData = requestDoc.data();
      
      // Verify that the request is in pending status
      if (requestData.status !== 'pending') {
        throw new Error('Payout request is not in pending status');
      }
      
      // Update the payout request status
      await updateDoc(requestRef, {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: adminUser.uid,
        notes: reason,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error rejecting payout request:', error);
      return false;
    }
  }
  
  /**
   * Mark a payout as paid
   * @param payoutId The ID of the payout
   */
  async markPayoutAsPaid(payoutId: string): Promise<boolean> {
    try {
      const auth = getAuth();
      const adminUser = auth.currentUser;
      
      if (!adminUser) {
        throw new Error('Admin not authenticated');
      }
      
      // Get the payout
      const payoutRef = doc(db, PAYOUTS_COLLECTION, payoutId);
      const payoutDoc = await getDoc(payoutRef);
      
      if (!payoutDoc.exists()) {
        throw new Error('Payout not found');
      }
      
      const payoutData = payoutDoc.data();
      
      // Verify that the payout is in pending status
      if (payoutData.status !== 'pending') {
        throw new Error('Payout is not in pending status');
      }
      
      // Update the payout status
      await updateDoc(payoutRef, {
        status: 'paid',
        paidAt: serverTimestamp(),
        paidBy: adminUser.uid,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error marking payout as paid:', error);
      return false;
    }
  }
  
  /**
   * Get all pending payouts
   */
  async getAllPendingPayouts(): Promise<Payout[]> {
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
        const data = docSnapshot.data();
        
        payouts.push({
          id: docSnapshot.id,
          payeeId: data.payeeId,
          payeeName: data.payeeName,
          payeePhone: data.payeePhone,
          payeeType: data.payeeType,
          paymentMethod: data.paymentMethod,
          reason: data.reason,
          amount: data.amount,
          currency: data.currency || 'MAD',
          status: data.status,
          sourceId: data.sourceId,
          sourceType: data.sourceType,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          paidAt: data.paidAt?.toDate(),
          paidBy: data.paidBy,
          notes: data.notes
        });
      }
      
      return payouts;
    } catch (error) {
      console.error('Error getting pending payouts:', error);
      throw new Error('Failed to get pending payouts');
    }
  }

/**
 * Process all pending payouts for a specific reason
 * This can be used for automated processing of certain types of payouts
 * @param reason The reason for the payouts to process
 */
async processPendingPayoutsByReason(reason: PayoutReason): Promise<{
  success: boolean;
  processedCount: number;
  error?: string;
}> {
  try {
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    const q = query(
      payoutsRef,
      where('status', '==', 'pending'),
      where('reason', '==', reason)
    );
    
    const querySnapshot = await getDocs(q);
    let processedCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const payoutId = docSnapshot.id;
      
      try {
        // Mark the payout as paid
        const success = await this.markPayoutAsPaid(payoutId);
        
        if (success) {
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
    console.error(`Error processing pending payouts for reason ${reason}:`, error);
    return {
      success: false,
      processedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error processing payouts'
    };
  }
}

/**
 * Process all pending payouts for a specific user
 * @param userId The ID of the user whose payouts to process
 */
async processPendingPayoutsForUser(userId: string): Promise<{
  success: boolean;
  processedCount: number;
  error?: string;
}> {
  try {
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    const q = query(
      payoutsRef,
      where('status', '==', 'pending'),
      where('payeeId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    let processedCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const payoutId = docSnapshot.id;
      
      try {
        // Mark the payout as paid
        const success = await this.markPayoutAsPaid(payoutId);
        
        if (success) {
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
    console.error(`Error processing pending payouts for user ${userId}:`, error);
    return {
      success: false,
      processedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error processing payouts'
    };
  }
}

/**
 * Get payout history for a specific user
 * @param userId The ID of the user
 */
async getUserPayoutHistory(userId: string): Promise<Payout[]> {
  try {
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    const q = query(
      payoutsRef,
      where('payeeId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const payouts: Payout[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      
      payouts.push({
        id: docSnapshot.id,
        payeeId: data.payeeId,
        payeeName: data.payeeName,
        payeePhone: data.payeePhone,
        payeeType: data.payeeType,
        paymentMethod: data.paymentMethod,
        reason: data.reason,
        amount: data.amount,
        currency: data.currency || 'MAD',
        status: data.status,
        sourceId: data.sourceId,
        sourceType: data.sourceType,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        paidAt: data.paidAt?.toDate(),
        paidBy: data.paidBy,
        notes: data.notes
      });
    }
    
    return payouts;
  } catch (error) {
    console.error(`Error getting payout history for user ${userId}:`, error);
    throw new Error('Failed to get payout history');
  }
}

/**
 * Get all payouts with pagination
 * @param limit2 Maximum number of payouts to return
 * @param startAfter Document to start after for pagination
 */
async getAllPayouts(limit2: number = 50, lastDocId?: string): Promise<{
  payouts: Payout[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  try {
    const payoutsRef = collection(db, PAYOUTS_COLLECTION);
    let q = query(
      payoutsRef,
      orderBy('createdAt', 'desc'),
      limit(limit2)
    );
    
    // If lastDocId is provided, start after that document
    if (lastDocId) {
      const lastDocRef = doc(db, PAYOUTS_COLLECTION, lastDocId);
      const lastDocSnapshot = await getDoc(lastDocRef);
      
      if (lastDocSnapshot.exists()) {
        q = query(
          payoutsRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDocSnapshot),
          limit(limit2)
        );
      }
    }
    
    const querySnapshot = await getDocs(q);
    const payouts: Payout[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      
      payouts.push({
        id: docSnapshot.id,
        payeeId: data.payeeId,
        payeeName: data.payeeName,
        payeePhone: data.payeePhone,
        payeeType: data.payeeType,
        paymentMethod: data.paymentMethod,
        reason: data.reason,
        amount: data.amount,
        currency: data.currency || 'MAD',
        status: data.status,
        sourceId: data.sourceId,
        sourceType: data.sourceType,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        paidAt: data.paidAt?.toDate(),
        paidBy: data.paidBy,
        notes: data.notes
      });
    }
    
    return {
      payouts,
      lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
      hasMore: querySnapshot.docs.length === limit2
    };
  } catch (error) {
    console.error('Error fetching all payouts:', error);
    return {
      payouts: [],
      lastDoc: null,
      hasMore: false
    };
  }
}

  /**
   * Create a payout directly for refunds (bypassing the request stage)
   * @param userId The ID of the user receiving the refund
   * @param refundAmount The amount to refund
   * @param refundRequestId The ID of the refund request
   * @param propertyId Optional property ID for context
   */
  async createRefundPayout(
    userId: string, 
    refundAmount: number, 
    refundRequestId: string,
    propertyId?: string
  ): Promise<boolean> {
    try {
      // Get user details to determine payment method
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error(`User ${userId} not found for refund payout`);
        return false;
      }
      
      const userData = userDoc.data();
      
      // Check if user has payment method
      if (!userData.paymentMethod) {
        console.error(`User ${userId} has no payment method for refund payout`);
        return false;
      }
      
      // Get user's name and phone for the payout record
      const userName = userData.displayName || userData.name || 'Unknown User';
      const userPhone = userData.phoneNumber || 'No phone';
      
      // Create a new payout document
      const payoutsRef = collection(db, PAYOUTS_COLLECTION);
      const newPayoutRef = doc(payoutsRef);
      
      await setDoc(newPayoutRef, {
        payeeId: userId,
        payeeName: userName,
        payeePhone: userPhone,
        payeeType: 'client', // Refunds are always to tenants/clients
        paymentMethod: {
          bankName: userData.paymentMethod.bankName || 'Unknown Bank',
          accountLast4: userData.paymentMethod.accountNumber ? 
            userData.paymentMethod.accountNumber.slice(-4) : '****',
          type: userData.paymentMethod.type || 'IBAN'
        },
        reason: 'Tenant Refund',
        amount: refundAmount,
        currency: 'MAD',
        status: 'pending',
        sourceId: refundRequestId,
        sourceType: 'refund',
        propertyId: propertyId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: 'system'
      });
      
      console.log(`Created payout ${newPayoutRef.id} for refund ${refundRequestId} with amount ${refundAmount}`);
      return true;
    } catch (error) {
      console.error('Error creating refund payout:', error);
      return false;
    }
  }

  /**
   * Create a payout directly for rent after safety window closes (bypassing the request stage)
   * @param reservationId The ID of the reservation/booking
   */
  async createRentPayout(reservationId: string): Promise<boolean> {
    try {
      // Get the reservation
      const reservationRef = doc(db, REQUESTS_COLLECTION, reservationId);
      const reservationDoc = await getDoc(reservationRef);
      
      if (!reservationDoc.exists()) {
        console.error(`Reservation ${reservationId} not found for rent payout`);
        return false;
      }
      
      const reservation = reservationDoc.data();
      
      // Verify that the reservation is in 'movedIn' or 'paid' status
      if (reservation.status !== 'movedIn' && reservation.status !== 'paid') {
        console.error(`Cannot create payout for reservation ${reservationId} with status ${reservation.status}`);
        return false;
      }
      
      // Get advertiser details
      const advertiserId = reservation.advertiserId;
      if (!advertiserId) {
        console.error(`No advertiser ID found for reservation ${reservationId}`);
        return false;
      }
      
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
      
      // Get advertiser's name and phone for the payout record
      const advertiserName = advertiserData.displayName || advertiserData.name || 'Unknown Advertiser';
      const advertiserPhone = advertiserData.phoneNumber || 'No phone';
      
      // Calculate amount (this would be the advertiser's share of the payment)
      const amount = reservation.totalPrice || 0;
      const platformFee = amount * 0.05; // 5% platform fee
      
      // Note: Haani Max fee does NOT go to the advertiser, it's for Kaari
      let haaniMaxFee = 0;
      let payoutAmount = amount - platformFee;
      let notes = `Platform fee: ${platformFee.toFixed(2)} MAD`;
      
      if (reservation.haaniMaxSelected) {
        haaniMaxFee = reservation.haaniMaxFee || (amount * 0.03); // Default to 3% if not specified
        notes += `, Haani Max fee: ${haaniMaxFee.toFixed(2)} MAD (retained by Kaari)`;
        console.log(`Reservation has Haani Max fee of ${haaniMaxFee} MAD (not added to advertiser payout)`);
      }
      
      // Check if a payout already exists for this reservation
      const payoutsRef = collection(db, PAYOUTS_COLLECTION);
      const q = query(
        payoutsRef,
        where('sourceId', '==', reservationId),
        where('sourceType', '==', 'rent')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.error(`A payout already exists for reservation ${reservationId}`);
        return false;
      }
      
      // Create a new payout document
      const newPayoutRef = doc(payoutsRef);
      
      await setDoc(newPayoutRef, {
        payeeId: advertiserId,
        payeeName: advertiserName,
        payeePhone: advertiserPhone,
        payeeType: 'advertiser',
        paymentMethod: {
          bankName: advertiserData.paymentMethod.bankName || 'Unknown Bank',
          accountLast4: advertiserData.paymentMethod.accountNumber ? 
            advertiserData.paymentMethod.accountNumber.slice(-4) : '****',
          type: advertiserData.paymentMethod.type || 'IBAN'
        },
        reason: 'Rent – Move-in',
        amount: payoutAmount,
        currency: 'MAD',
        status: 'pending',
        sourceId: reservationId,
        sourceType: 'rent',
        propertyId: reservation.propertyId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: 'system',
        notes: notes,
        haaniMaxFee: haaniMaxFee > 0 ? haaniMaxFee : undefined
      });
      
      console.log(`Created payout ${newPayoutRef.id} for reservation ${reservationId} with amount ${payoutAmount}`);
      
      // Update the reservation to indicate that payout has been created
      await updateDoc(reservationRef, {
        payoutCreated: true,
        payoutId: newPayoutRef.id,
        payoutCreatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error creating rent payout:', error);
      return false;
    }
  }

  /**
   * Ensure that the necessary collections exist
   * This is a workaround for Firestore's behavior where collections don't exist until documents are added
   */
  async ensureCollectionsExist(): Promise<void> {
    try {
      console.log('[DEBUG] Ensuring collections exist...');
      
      // Check if payoutRequests collection exists by trying to get a document
      const payoutRequestsRef = collection(db, PAYOUT_REQUESTS_COLLECTION);
      const payoutRequestsQuery = query(payoutRequestsRef, limit(1));
      const payoutRequestsSnapshot = await getDocs(payoutRequestsQuery);
      
      console.log(`[DEBUG] Found ${payoutRequestsSnapshot.size} documents in payoutRequests collection`);
      
      // If collection is empty, create a dummy document and then delete it
      if (payoutRequestsSnapshot.empty) {
        console.log('[DEBUG] Creating dummy document in payoutRequests collection');
        const dummyRef = await addDoc(payoutRequestsRef, {
          _dummy: true,
          createdAt: Timestamp.now()
        });
        
        // Delete the dummy document
        await deleteDoc(dummyRef);
        console.log('[DEBUG] Deleted dummy document from payoutRequests collection');
      }
      
      // Check if payouts collection exists
      const payoutsRef = collection(db, PAYOUTS_COLLECTION);
      const payoutsQuery = query(payoutsRef, limit(1));
      const payoutsSnapshot = await getDocs(payoutsQuery);
      
      console.log(`[DEBUG] Found ${payoutsSnapshot.size} documents in payouts collection`);
      
      // If collection is empty, create a dummy document and then delete it
      if (payoutsSnapshot.empty) {
        console.log('[DEBUG] Creating dummy document in payouts collection');
        const dummyRef = await addDoc(payoutsRef, {
          _dummy: true,
          createdAt: Timestamp.now()
        });
        
        // Delete the dummy document
        await deleteDoc(dummyRef);
        console.log('[DEBUG] Deleted dummy document from payouts collection');
      }
      
      console.log('[DEBUG] Collections exist check complete');
    } catch (error) {
      console.error('[DEBUG] Error ensuring collections exist:', error);
    }
  }
}

export default new PayoutsService(); 