import ReservationService from './ReservationService';

class ExpirationService {
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 5 * 60 * 1000; // Check every 5 minutes

  startExpirationCheck() {
    // Clear any existing interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Set up periodic check
    this.checkInterval = setInterval(async () => {
      try {
        await ReservationService.checkAndHandleExpiredReservations();
      } catch (error) {
        console.error('Error in expiration check:', error);
      }
    }, this.CHECK_INTERVAL_MS);

    // Run initial check
    ReservationService.checkAndHandleExpiredReservations().catch(error => {
      console.error('Error in initial expiration check:', error);
    });
  }

  stopExpirationCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export default new ExpirationService(); 