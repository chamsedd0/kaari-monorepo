import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
try {
  admin.initializeApp();
} catch (e) {
  // App already initialized
}

const db = admin.firestore();
const REQUESTS_COLLECTION = 'requests';
const REFERRAL_DISCOUNTS_COLLECTION = 'referralDiscounts';

// Scheduled function to finalize referral discounts after refund window passes
export const finalizeReferralDiscounts = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    try {
      console.log('Starting scheduled referral discount finalization job');
      
      // Find all discounts that are associated with a booking but not marked as used
      const results = {
        total: 0,
        finalized: 0,
        failed: 0,
        skipped: 0
      };

      const discountsRef = db.collection(REFERRAL_DISCOUNTS_COLLECTION);
      const q = discountsRef.where('bookingId', '!=', null).where('isUsed', '==', false);
      const querySnapshot = await q.get();
      
      results.total = querySnapshot.size;
      console.log(`Found ${results.total} pending discounts to check`);

      // Process each pending discount
      for (const doc of querySnapshot.docs) {
        const discountData = doc.data();
        const bookingId = discountData.bookingId;

        if (!bookingId) {
          results.skipped++;
          continue;
        }

        try {
          // Check if this discount can be finalized
          const finalized = await checkAndFinalizeDiscount(bookingId);
          
          if (finalized) {
            results.finalized++;
            console.log(`Finalized discount for booking ${bookingId}`);
          } else {
            results.skipped++;
            console.log(`Skipped discount finalization for booking ${bookingId} - not eligible yet`);
          }
        } catch (error) {
          results.failed++;
          console.error(`Error finalizing discount for booking ${bookingId}:`, error);
        }
      }

      console.log(`Referral discount finalization job completed: ${results.finalized} finalized, ${results.failed} failed, ${results.skipped} skipped out of ${results.total} total`);
      return null;
    } catch (error) {
      console.error('Error running referral discount finalization job:', error);
      return null;
    }
  });

/**
 * Check if a booking has a pending discount and finalize it if:
 * 1. The client has moved in
 * 2. The 24-hour refund window has passed
 * 
 * @param bookingId The ID of the booking to check
 * @returns True if discount was finalized, false otherwise
 */
async function checkAndFinalizeDiscount(bookingId: string): Promise<boolean> {
  try {
    // Get the booking details
    const bookingRef = db.collection(REQUESTS_COLLECTION).doc(bookingId);
    const bookingDoc = await bookingRef.get();
    
    if (!bookingDoc.exists) {
      console.error('Booking not found:', bookingId);
      return false;
    }
    
    const booking = bookingDoc.data();
    
    // Check if the booking is in movedIn status
    if (booking?.status !== 'movedIn') {
      console.log('Booking not in moved-in status, skipping discount finalization:', bookingId);
      return false;
    }
    
    // Check if the 24-hour refund window has passed
    if (!booking.movedInAt) {
      console.log('Move-in date not recorded, skipping discount finalization:', bookingId);
      return false;
    }
    
    // Convert Firestore timestamp to Date if needed
    let moveInDate: Date;
    if (booking.movedInAt instanceof Timestamp) {
      moveInDate = booking.movedInAt.toDate();
    } else {
      moveInDate = new Date(booking.movedInAt);
    }
    
    // Calculate refund deadline (24 hours after move-in)
    const refundDeadline = new Date(moveInDate);
    refundDeadline.setHours(refundDeadline.getHours() + 24);
    
    // Check if refund window has passed
    if (new Date() <= refundDeadline) {
      console.log('Refund window still active, skipping discount finalization:', bookingId);
      return false;
    }
    
    // Refund window has passed, finalize the discount
    return await finalizeDiscountUsage(bookingId);
  } catch (error) {
    console.error('Error checking and finalizing discount:', error);
    return false;
  }
}

/**
 * Finalize a discount after the refund window has passed
 * 
 * @param bookingId The ID of the booking
 * @returns True if discount was finalized, false otherwise
 */
async function finalizeDiscountUsage(bookingId: string): Promise<boolean> {
  try {
    // Find the discount associated with this booking
    const discountsRef = db.collection(REFERRAL_DISCOUNTS_COLLECTION);
    const q = discountsRef.where('bookingId', '==', bookingId).where('isUsed', '==', false);
    
    const querySnapshot = await q.get();
    
    if (querySnapshot.empty) {
      console.log('No pending discount found for booking:', bookingId);
      return false;
    }
    
    const discountDoc = querySnapshot.docs[0];
    const discountData = discountDoc.data();
    const userId = discountData.userId;
    const advertiserId = discountData.advertiserId;
    const propertyId = discountData.bookingPropertyId;
    const propertyName = discountData.bookingPropertyName;
    const bookingAmount = discountData.bookingAmount || 0;
    
    // Mark discount as used
    await discountDoc.ref.update({
      isUsed: true,
      usedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Update the advertiser's referral stats
    const referralDocRef = db.collection('referrals').doc(advertiserId);
    const referralDoc = await referralDocRef.get();
    
    if (referralDoc.exists) {
      const referralData = referralDoc.data();
      const referralStats = referralData?.referralStats || {};
      const referralHistory = referralData?.referralHistory || [];
      
      // Update successful bookings count
      referralStats.successfulBookings = (referralStats.successfulBookings || 0) + 1;
      
      // Calculate earnings based on bonus rate and booking amount
      const bonusRate = getBonusRateValue(referralStats.firstRentBonus || "5%");
      const earnings = bookingAmount * bonusRate;
      
      // Update monthly and annual earnings
      referralStats.monthlyEarnings = (referralStats.monthlyEarnings || 0) + earnings;
      referralStats.annualEarnings = (referralStats.annualEarnings || 0) + earnings;
      
      // Find and update the history item for this tenant
      const historyIndex = referralHistory.findIndex((item: any) => item.tenantId === userId);
      
      if (historyIndex >= 0) {
        referralHistory[historyIndex] = {
          ...referralHistory[historyIndex],
          status: 'success',
          propertyId: propertyId,
          propertyName: propertyName,
          amount: earnings,
          date: admin.firestore.FieldValue.serverTimestamp()
        };
      }
      
      // Update the referral document
      await referralDocRef.update({
        'referralStats': referralStats,
        'referralHistory': referralHistory
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error finalizing discount usage:', error);
    return false;
  }
}

/**
 * Convert bonus rate string to a number (e.g. "5%" -> 0.05)
 */
function getBonusRateValue(bonusRate: string): number {
  const percentage = parseInt(bonusRate.replace('%', ''));
  return percentage / 100;
} 