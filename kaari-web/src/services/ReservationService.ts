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
  Timestamp
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { advertiserNotifications, userNotifications } from '../utils/notification-helpers';

// Define reservation status types
export type ReservationStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled_by_user'
  | 'cancelled_by_advertiser'
  | 'confirmed'
  | 'completed'
  | 'expired';

// Define reservation interface
export interface Reservation {
  id?: string;
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

  // Create a new reservation
  async createReservation(reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const newReservation = {
        ...reservationData,
        status: 'pending' as ReservationStatus,
        createdAt: now,
        updatedAt: now,
      };

      // Add to database
      const docRef = await addDoc(collection(db, this.collection), newReservation);
      
      // Send notification to advertiser
      await advertiserNotifications.reservationRequest(
        reservationData.advertiserId,
        {
          id: docRef.id,
          ...reservationData,
          status: 'pending'
        } as Reservation
      );
      
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
        ...(status === 'cancelled_by_advertiser' || status === 'cancelled_by_user' 
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
      switch (newStatus) {
        case 'accepted':
          // Notify user that reservation was accepted
          await userNotifications.reservationAccepted(
            reservation.clientId,
            reservation as Reservation
          );
          break;
          
        case 'rejected':
          // Notify user that reservation was rejected
          await userNotifications.reservationRejected(
            reservation.clientId,
            reservation as Reservation,
            reason
          );
          break;
          
        case 'cancelled_by_user':
          // Notify advertiser that user cancelled
          await advertiserNotifications.reservationCancelled(
            reservation.advertiserId,
            reservation as Reservation
          );
          break;
          
        case 'cancelled_by_advertiser':
          // Notify user that advertiser cancelled
          await userNotifications.reservationCancelledByAdvertiser(
            reservation.clientId,
            reservation as Reservation,
            reason
          );
          break;
          
        case 'expired':
          // Notify user that reservation request expired
          await userNotifications.reservationExpired(
            reservation.clientId,
            reservation as Reservation
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
        status: 'confirmed',
        updatedAt: Timestamp.now()
      });
      
      // Notify advertiser about payment
      await advertiserNotifications.paymentConfirmed(
        reservation.advertiserId,
        {
          id: reservationId,
          amount: reservation.totalPrice,
          currency: reservation.currency,
          status: 'paid',
          reservationId: reservationId
        },
        {
          id: reservation.propertyId,
          title: reservation.propertyTitle
        },
        {
          id: reservation.clientId,
          name: reservation.clientName
        }
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
        reservation,
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
        reservation
      );
      
      // Notify user about move-in confirmation
      await userNotifications.moveInConfirmation(
        reservation.clientId,
        reservation
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
      
      if (reservation.status !== 'confirmed') {
        throw new Error('Reservation is not confirmed');
      }
      
      // Send move-in reminder notification
      await userNotifications.moveInReminder(
        reservation.clientId,
        reservation
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
        reservation,
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
          status: 'cancelled_by_user',
          cancellationReason: reason,
          updatedAt: Timestamp.now()
        });
      }
      
      // Notify user about cancellation request result
      await userNotifications.cancellationRequestHandled(
        reservation.clientId,
        reservation,
        approved,
        reason
      );
      
      // If approved, also notify advertiser
      if (approved) {
        await advertiserNotifications.reservationCancelled(
          reservation.advertiserId,
          reservation
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
}

export default new ReservationService(); 