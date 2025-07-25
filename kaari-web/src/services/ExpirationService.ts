import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  Timestamp,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import PayoutsService from './PayoutsService';

/**
 * Service to handle various expiration-related tasks
 */
class ExpirationService {
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 5 * 60 * 1000; // Check every 5 minutes

  /**
   * Start the expiration check service
   * This method is called from App.tsx to initialize the service
   */
  startExpirationCheck() {
    // Clear any existing interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Set up periodic check
    this.checkInterval = setInterval(async () => {
      try {
        await this.processSafetyWindowClosures();
        console.log('Processed safety window closures');
      } catch (error) {
        console.error('Error in expiration check:', error);
      }
    }, this.CHECK_INTERVAL_MS);

    // Run initial check
    this.processSafetyWindowClosures().catch(error => {
      console.error('Error in initial expiration check:', error);
    });
    
    return () => {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    };
  }

  /**
   * Stop the expiration check service
   */
  stopExpirationCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Process safety window closures for move-ins
   * This should be called by a scheduled function or cron job
   */
  async processSafetyWindowClosures(): Promise<{
    processed: number;
    errors: number;
    payoutsCreated: number;
  }> {
    let processed = 0;
    let errors = 0;
    let payoutsCreated = 0;
    
    try {
      // Get current time
      const now = new Date();
      
      // Calculate 24 hours ago
      const safetyWindowThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Query for bookings that are in 'paid' or 'movedIn' status and have move-in date older than 24 hours
      const requestsRef = collection(db, 'requests');
      const q = query(
        requestsRef,
        where('status', 'in', ['paid', 'movedIn']),
        where('moveInDate', '<', Timestamp.fromDate(safetyWindowThreshold)),
        where('payoutCreated', '!=', true) // Only get bookings where payout hasn't been created yet
      );
      
      const querySnapshot = await getDocs(q);
      
      // Process each booking
      for (const docSnapshot of querySnapshot.docs) {
        try {
          const bookingId = docSnapshot.id;
          const bookingData = docSnapshot.data();
          
          console.log(`Processing safety window closure for booking ${bookingId}`);
          
          // Update booking status to indicate safety window closed
          await updateDoc(doc(requestsRef, bookingId), {
            safetyWindowClosed: true,
            safetyWindowClosedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          // Create payout for the advertiser
          const payoutCreated = await PayoutsService.createRentPayout(bookingId);
          
          if (payoutCreated) {
            payoutsCreated++;
            console.log(`Created rent payout for booking ${bookingId}`);
          } else {
            console.error(`Failed to create rent payout for booking ${bookingId}`);
            errors++;
          }
          
          processed++;
        } catch (err) {
          console.error(`Error processing safety window closure for booking ${docSnapshot.id}:`, err);
          errors++;
        }
      }
      
      return { processed, errors, payoutsCreated };
    } catch (err) {
      console.error('Error processing safety window closures:', err);
      return { processed, errors: errors + 1, payoutsCreated };
    }
  }
  
  /**
   * Check and process a specific booking's safety window
   * This can be called on-demand for a specific booking
   */
  async checkAndProcessSafetyWindow(bookingId: string): Promise<{
    processed: boolean;
    payoutCreated: boolean;
    error?: string;
  }> {
    try {
      // Get the booking
      const bookingRef = doc(db, 'requests', bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (!bookingDoc.exists()) {
        return { 
          processed: false, 
          payoutCreated: false,
          error: 'Booking not found' 
        };
      }
      
      const bookingData = bookingDoc.data();
      
      // Check if the booking is in the right status
      if (bookingData.status !== 'paid' && bookingData.status !== 'movedIn') {
        return { 
          processed: false, 
          payoutCreated: false,
          error: `Booking has invalid status: ${bookingData.status}` 
        };
      }
      
      // Check if payout has already been created
      if (bookingData.payoutCreated) {
        return { 
          processed: false, 
          payoutCreated: false,
          error: 'Payout has already been created for this booking' 
        };
      }
      
      // Check if safety window has closed
      const moveInDate = bookingData.moveInDate?.toDate ? 
        bookingData.moveInDate.toDate() : 
        new Date(bookingData.moveInDate);
      
      const now = new Date();
      const safetyWindowEnd = new Date(moveInDate.getTime() + 24 * 60 * 60 * 1000);
      
      if (now < safetyWindowEnd) {
        return { 
          processed: false, 
          payoutCreated: false,
          error: 'Safety window has not closed yet' 
        };
      }
      
      // Update booking to indicate safety window closed
      await updateDoc(bookingRef, {
        safetyWindowClosed: true,
        safetyWindowClosedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Create payout for the advertiser
      const payoutCreated = await PayoutsService.createRentPayout(bookingId);
      
      if (payoutCreated) {
        console.log(`Created rent payout for booking ${bookingId}`);
        return { processed: true, payoutCreated: true };
      } else {
        console.error(`Failed to create rent payout for booking ${bookingId}`);
        return { 
          processed: true, 
          payoutCreated: false,
          error: 'Failed to create payout' 
        };
      }
    } catch (err) {
      console.error(`Error checking safety window for booking ${bookingId}:`, err);
      return { 
        processed: false, 
        payoutCreated: false,
        error: `Error: ${err instanceof Error ? err.message : String(err)}` 
      };
    }
  }
}

export default new ExpirationService(); 