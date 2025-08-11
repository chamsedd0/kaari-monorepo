import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { advertiserNotifications, userNotifications } from '../utils/notification-helpers';

// Define reservation status types
export type ReservationStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'paid'
  | 'movedIn'
  | 'refundComplete'
  | 'refundFailed'
  | 'cancellationUnderReview'
  | 'expired';

// Define reservation interface
export interface Reservation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  advertiserId: string;
  clientId: string;
  clientName: string;
  startDate: Timestamp;
  endDate: Timestamp;
  guests: number;
  status: ReservationStatus;
  totalPrice: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  paymentDueDate?: Timestamp;
  moveInConfirmed?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  cancellationReason?: string;
  rejectionReason?: string;
  specialRequests?: string;
}

class ReservationService {
  private collection = 'reservations';

  private convertToNotificationReservation(reservation: Reservation) {
    return {
      id: reservation.id,
      propertyId: reservation.propertyId,
      propertyTitle: reservation.propertyTitle,
      advertiserId: reservation.advertiserId,
      clientId: reservation.clientId,
      clientName: reservation.clientName,
      startDate: reservation.startDate instanceof Timestamp ? reservation.startDate.toDate() : new Date(reservation.startDate as any),
      endDate: reservation.endDate instanceof Timestamp ? reservation.endDate.toDate() : new Date(reservation.endDate as any),
      status: reservation.status,
      totalPrice: reservation.totalPrice,
      currency: reservation.currency
    } as any;
  }

  // Create a new reservation
  async createReservation(reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!reservationData.advertiserId) {
        console.error('Error: Missing advertiserId in reservation data');
        throw new Error('advertiserId is required for reservation creation');
      }

      const now = Timestamp.now();
      
      // Ensure dates are Timestamps
      const startDate = reservationData.startDate instanceof Timestamp ? 
        reservationData.startDate : 
        Timestamp.fromDate(new Date(reservationData.startDate));
        
      const endDate = reservationData.endDate instanceof Timestamp ? 
        reservationData.endDate : 
        Timestamp.fromDate(new Date(reservationData.endDate));
        
      const newReservation = {
        ...reservationData,
        startDate,
        endDate,
        status: 'pending' as ReservationStatus,
        createdAt: now,
        updatedAt: now,
      };

      console.log(`Creating reservation with data:`, JSON.stringify({
        advertiserId: newReservation.advertiserId,
        clientId: newReservation.clientId,
        propertyId: newReservation.propertyId,
        status: newReservation.status
      }));

      // Add to database
      const docRef = await addDoc(collection(db, this.collection), newReservation);
      console.log(`Reservation created with ID: ${docRef.id}`);
      
      // Send notification to advertiser
      try {
        const notifReservation = this.convertToNotificationReservation({
          id: docRef.id,
          ...newReservation
        } as Reservation);
        await advertiserNotifications.reservationRequest(
          reservationData.advertiserId,
          notifReservation
        );
        console.log(`Reservation notification sent to advertiser: ${reservationData.advertiserId}`);
      } catch (notifError) {
        console.error('Error sending reservation notification:', notifError);
        // Don't throw this error as it's non-critical
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  // Get a reservation by ID
  async getReservation(reservationId: string): Promise<Reservation | null> {
    try {
      const docRef = doc(db, this.collection, reservationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Reservation;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting reservation:', error);
      throw error;
    }
  }

  // Update reservation status
  async updateReservationStatus(
    reservationId: string, 
    status: ReservationStatus, 
    reason?: string
  ): Promise<void> {
    try {
      const reservationRef = doc(db, this.collection, reservationId);
      const docSnap = await getDoc(reservationRef);
      
      if (!docSnap.exists()) {
        throw new Error('Reservation not found');
      }
      
      const reservation = { id: docSnap.id, ...docSnap.data() } as Reservation;
      
      // Update the document
      await updateDoc(reservationRef, {
        status,
        updatedAt: Timestamp.now(),
        ...(status === 'rejected' ? { rejectionReason: reason } : {}),
        ...(status === 'cancelled' || status === 'cancellationUnderReview' 
          ? { cancellationReason: reason } : {})
      });
      
      // Send appropriate notifications based on status change
      await this.sendStatusChangeNotifications(reservation, status, reason);
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  }
  
  // Handle sending notifications for status changes
  private async sendStatusChangeNotifications(
    reservation: Reservation,
    newStatus: ReservationStatus,
    reason?: string
  ): Promise<void> {
    try {
      const notifReservation = this.convertToNotificationReservation(reservation);
      switch (newStatus) {
        case 'accepted':
          // Notify user that reservation was accepted
          await userNotifications.reservationAccepted(
            reservation.clientId,
            notifReservation
          );
          break;
          
        case 'rejected':
          // Notify user that reservation was rejected
          await userNotifications.reservationRejected(
            reservation.clientId,
            notifReservation,
            reason
          );
          break;
          
        case 'cancelled':
          // Notify advertiser that user cancelled
          await advertiserNotifications.reservationCancelled(
            reservation.advertiserId,
            notifReservation
          );
          break;
          
        case 'paid':
          // Notify user about payment
          await userNotifications.paymentConfirmation(
            reservation.clientId,
            notifReservation
          );
          break;
          
        case 'movedIn':
          // Notify advertiser about move-in
          await advertiserNotifications.clientMovedIn(
            reservation.advertiserId,
            notifReservation
          );
          break;
          
        case 'refundComplete':
          // Notify user about refund
          await userNotifications.refundRequestHandled(
            reservation.clientId,
            notifReservation,
            true
          );
          break;
          
        case 'refundFailed':
          // Notify user about refund failure
          await userNotifications.refundRequestHandled(
            reservation.clientId,
            notifReservation,
            false
          );
          break;
          
        case 'cancellationUnderReview':
          // Notify advertiser about cancellation under review
          await advertiserNotifications.cancellationUnderReview(
            reservation.advertiserId,
            notifReservation
          );
          break;
          
        case 'expired':
          // Notify user about reservation request expired
          await userNotifications.reservationExpired(
            reservation.clientId,
            notifReservation
          );
          break;
          
        default:
          // Other status changes don't need notifications
          break;
      }
    } catch (error) {
      console.error('Error sending status change notifications:', error);
      // Don't throw error to prevent disrupting the main flow
    }
  }
  
  // Confirm payment for a reservation
  async confirmPayment(reservationId: string): Promise<void> {
    try {
      const reservationRef = doc(db, this.collection, reservationId);
      const docSnap = await getDoc(reservationRef);
      
      if (!docSnap.exists()) {
        throw new Error('Reservation not found');
      }
      
      const reservation = { id: docSnap.id, ...docSnap.data() } as Reservation;
      
      // Update payment status
      await updateDoc(reservationRef, {
        paymentStatus: 'paid',
        status: 'paid',
        updatedAt: Timestamp.now()
      });
      
      // Notify advertiser about payment
      await advertiserNotifications.paymentConfirmed(
        reservation.advertiserId,
        this.convertToNotificationReservation(reservation)
      );
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }
  
  // Send payment reminder to user
  async sendPaymentReminder(reservationId: string): Promise<void> {
    try {
      const reservation = await this.getReservation(reservationId);
      
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      
      if (reservation.paymentStatus !== 'pending') {
        throw new Error('Payment has already been made or reservation is invalid');
      }
      
      // Calculate due date (if not set, default to 3 days from now)
      const dueDate = reservation.paymentDueDate 
        ? new Date(reservation.paymentDueDate.toDate()) 
        : new Date(new Date().setDate(new Date().getDate() + 3));
      
      // Send payment reminder notification
      await userNotifications.paymentReminder(
        reservation.clientId,
        this.convertToNotificationReservation(reservation),
        dueDate
      );
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      throw error;
    }
  }
  
  // Confirm move-in
  async confirmMoveIn(reservationId: string): Promise<void> {
    try {
      const reservationRef = doc(db, this.collection, reservationId);
      const docSnap = await getDoc(reservationRef);
      
      if (!docSnap.exists()) {
        throw new Error('Reservation not found');
      }
      
      const reservation = { id: docSnap.id, ...docSnap.data() } as Reservation;
      
      // Update move-in status
      await updateDoc(reservationRef, {
        moveInConfirmed: true,
        updatedAt: Timestamp.now()
      });
      
      // Notify advertiser about move-in
      await advertiserNotifications.clientMovedIn(
        reservation.advertiserId,
        this.convertToNotificationReservation(reservation)
      );
      
      // Notify user about move-in confirmation
      await userNotifications.moveInConfirmation(
        reservation.clientId,
        this.convertToNotificationReservation(reservation)
      );
    } catch (error) {
      console.error('Error confirming move-in:', error);
      throw error;
    }
  }
  
  // Send move-in reminder
  async sendMoveInReminder(reservationId: string): Promise<void> {
    try {
      const reservation = await this.getReservation(reservationId);
      
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      
      if (reservation.status !== 'paid') {
        throw new Error('Reservation is not confirmed');
      }
      
      // Send move-in reminder notification
      await userNotifications.moveInReminder(
        reservation.clientId,
        this.convertToNotificationReservation(reservation)
      );
    } catch (error) {
      console.error('Error sending move-in reminder:', error);
      throw error;
    }
  }
  
  // Handle refund request
  async handleRefundRequest(
    reservationId: string, 
    approved: boolean, 
    reason?: string
  ): Promise<void> {
    try {
      const reservation = await this.getReservation(reservationId);
      
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      
      // Update reservation status based on approval
      await updateDoc(doc(db, this.collection, reservationId), {
        paymentStatus: approved ? 'refunded' : 'paid',
        updatedAt: Timestamp.now()
      });
      
      // Notify user about refund request result
      await userNotifications.refundRequestHandled(
        reservation.clientId,
        this.convertToNotificationReservation(reservation),
        approved,
        reason
      );
    } catch (error) {
      console.error('Error handling refund request:', error);
      throw error;
    }
  }
  
  // Handle cancellation request
  async handleCancellationRequest(
    reservationId: string, 
    approved: boolean, 
    reason?: string
  ): Promise<void> {
    try {
      const reservation = await this.getReservation(reservationId);
      
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      
      // Update reservation status based on approval
      if (approved) {
        await updateDoc(doc(db, this.collection, reservationId), {
          status: 'cancelled',
          cancellationReason: reason,
          updatedAt: Timestamp.now()
        });
      }
      
      // Notify user about cancellation request result
      await userNotifications.cancellationRequestHandled(
        reservation.clientId,
        this.convertToNotificationReservation(reservation),
        approved,
        reason
      );
      
      // If approved, also notify advertiser
      if (approved) {
        await advertiserNotifications.reservationCancelled(
          reservation.advertiserId,
          this.convertToNotificationReservation(reservation)
        );
      }
    } catch (error) {
      console.error('Error handling cancellation request:', error);
      throw error;
    }
  }
  
  // Get user's reservations
  async getUserReservations(userId: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('clientId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Reservation[];
    } catch (error) {
      console.error('Error getting user reservations:', error);
      throw error;
    }
  }
  
  // Get advertiser's reservations
  async getAdvertiserReservations(advertiserId: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('advertiserId', '==', advertiserId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Reservation[];
    } catch (error) {
      console.error('Error getting advertiser reservations:', error);
      throw error;
    }
  }
  
  // Get property reservations
  async getPropertyReservations(propertyId: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Reservation[];
    } catch (error) {
      console.error('Error getting property reservations:', error);
      throw error;
    }
  }

  // Check and handle expired reservations
  async checkAndHandleExpiredReservations(): Promise<void> {
    try {
      const now = Timestamp.now();
      const twentyFourHoursAgo = new Timestamp(
        now.seconds - (24 * 60 * 60),
        now.nanoseconds
      );

      // Query for reservations that might be expired
      const q = query(
        collection(db, this.collection),
        where('status', 'in', ['pending', 'accepted']),
        where('updatedAt', '<=', twentyFourHoursAgo)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      let expiredCount = 0;

      for (const doc of querySnapshot.docs) {
        const reservation = { id: doc.id, ...doc.data() } as Reservation;
        const reservationRef = doc.ref;

        // Update the reservation status to expired
        batch.update(reservationRef, {
          status: 'expired',
          updatedAt: now
        });

        // Send notification about expiration
        try {
          if (reservation.status === 'pending') {
            await userNotifications.reservationExpired(
              reservation.clientId,
              this.convertToNotificationReservation(reservation)
            );
          } else if (reservation.status === 'accepted') {
            await userNotifications.paymentExpired(
              reservation.clientId,
              this.convertToNotificationReservation(reservation)
            );
          }
        } catch (notifError) {
          console.error('Error sending expiration notification:', notifError);
        }

        expiredCount++;
      }

      if (expiredCount > 0) {
        await batch.commit();
        console.log(`Updated ${expiredCount} expired reservations`);
      }
    } catch (error) {
      console.error('Error handling expired reservations:', error);
      throw error;
    }
  }
}

export default new ReservationService(); 