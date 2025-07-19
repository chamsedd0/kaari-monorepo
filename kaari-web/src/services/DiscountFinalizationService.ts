import { 
  collection, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  doc, 
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { Request } from '../backend/entities';
import referralService from './ReferralService';
import NotificationService from './NotificationService';

const REQUESTS_COLLECTION = 'requests';
const REFERRAL_DISCOUNTS_COLLECTION = 'referralDiscounts';
const USERS_COLLECTION = 'users';

class DiscountFinalizationService {
  /**
   * Check if a booking has a pending discount and finalize it if:
   * 1. The client has moved in
   * 2. The 24-hour refund window has passed
   * 
   * @param bookingId The ID of the booking to check
   * @returns True if discount was finalized, false otherwise
   */
  async checkAndFinalizeDiscount(bookingId: string): Promise<boolean> {
    try {
      // Get the booking details
      const bookingRef = doc(db, REQUESTS_COLLECTION, bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (!bookingDoc.exists()) {
        console.error('Booking not found:', bookingId);
        return false;
      }
      
      const booking = bookingDoc.data() as Request;
      
      // Check if the booking is in movedIn status
      if (booking.status !== 'movedIn') {
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
      if (typeof booking.movedInAt === 'object' && 'seconds' in booking.movedInAt) {
        moveInDate = new Date((booking.movedInAt as any).seconds * 1000);
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
      
      // Find the discount associated with this booking
      const discountsRef = collection(db, REFERRAL_DISCOUNTS_COLLECTION);
      const q = query(
        discountsRef, 
        where('bookingId', '==', bookingId),
        where('isUsed', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('No pending discount found for booking:', bookingId);
        return false;
      }
      
      const discountDoc = querySnapshot.docs[0];
      const discountData = discountDoc.data();
      const userId = discountData.userId;
      const advertiserId = discountData.advertiserId;
      const bookingAmount = discountData.bookingAmount || 0;
      
      // Refund window has passed, finalize the discount
      const result = await referralService.finalizeDiscountUsage(bookingId);
      
      if (result) {
        // Update advertiser's total earnings and payment stats
        const advertiserRef = doc(db, USERS_COLLECTION, advertiserId);
        const advertiserDoc = await getDoc(advertiserRef);
        
        if (advertiserDoc.exists()) {
          const advertiserData = advertiserDoc.data();
          const referralStats = advertiserData.referralStats || {};
          
          // Calculate earnings based on bonus rate
          const bonusRate = this.getBonusRateValue(referralStats.firstRentBonus || "5%");
          const earnings = bookingAmount * bonusRate;
          
          // Update advertiser payment stats
          await updateDoc(advertiserRef, {
            totalCollected: increment(earnings),
            paymentCount: increment(1)
          });
          
          // Send notification to the advertiser
          try {
            await NotificationService.createNotification(
              advertiserId,
              'advertiser',
              'referral_commission_earned',
              'Referral Commission Earned',
              `You've earned ${earnings} MAD in commission from a successful referral booking.`,
              `/dashboard/advertiser/referral-program`,
              {
                amount: earnings,
                bookingId: bookingId
              }
            );
          } catch (notificationError) {
            console.error('Error sending referral commission notification:', notificationError);
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error checking and finalizing discount:', error);
      return false;
    }
  }
  
  /**
   * Schedule discount finalization for a booking
   * This should be called when a client moves in
   * 
   * @param bookingId The ID of the booking
   * @param moveInDate The date the client moved in
   */
  scheduleDiscountFinalization(bookingId: string, moveInDate: Date): void {
    // Calculate when the refund window will end (24 hours after move-in)
    const refundDeadline = new Date(moveInDate);
    refundDeadline.setHours(refundDeadline.getHours() + 24);
    
    // Calculate milliseconds until the refund deadline
    const now = new Date();
    const msUntilDeadline = Math.max(0, refundDeadline.getTime() - now.getTime());
    
    // Schedule the finalization to run after the refund window passes
    setTimeout(async () => {
      try {
        const result = await this.checkAndFinalizeDiscount(bookingId);
        console.log(`Scheduled discount finalization for booking ${bookingId}: ${result ? 'Success' : 'No action needed'}`);
      } catch (error) {
        console.error(`Error in scheduled discount finalization for booking ${bookingId}:`, error);
      }
    }, msUntilDeadline + 1000); // Add 1 second buffer
  }

  /**
   * Check all pending discounts that need to be finalized
   * This can be run as a scheduled job (e.g., daily) to catch any discounts
   * that weren't finalized by the scheduled tasks
   */
  async checkAllPendingDiscounts(): Promise<{
    total: number;
    finalized: number;
    failed: number;
    skipped: number;
  }> {
    try {
      const results = {
        total: 0,
        finalized: 0,
        failed: 0,
        skipped: 0
      };

      // Find all discounts that are associated with a booking but not marked as used
      const discountsRef = collection(db, REFERRAL_DISCOUNTS_COLLECTION);
      const q = query(
        discountsRef,
        where('bookingId', '!=', null),
        where('isUsed', '==', false)
      );

      const querySnapshot = await getDocs(q);
      results.total = querySnapshot.size;

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
          const finalized = await this.checkAndFinalizeDiscount(bookingId);
          
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

      console.log(`Discount finalization job completed: ${results.finalized} finalized, ${results.failed} failed, ${results.skipped} skipped out of ${results.total} total`);
      return results;
    } catch (error) {
      console.error('Error checking all pending discounts:', error);
      throw error;
    }
  }

  /**
   * Convert bonus rate string to a number (e.g. "5%" -> 0.05)
   */
  private getBonusRateValue(bonusRate: string): number {
    const percentage = parseInt(bonusRate.replace('%', ''));
    return percentage / 100;
  }
}

const discountFinalizationService = new DiscountFinalizationService();
export default discountFinalizationService; 