import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { Notification, NotificationType } from '../types/Notification';

class NotificationService {
  private collection = 'notifications';

  // Create a new notification
  async createNotification(
    userId: string,
    userType: 'user' | 'advertiser' | 'admin',
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const notificationData = {
        userId,
        userType,
        type,
        title,
        message,
        timestamp: serverTimestamp(),
        isRead: false,
        link,
        metadata
      };

      const docRef = await addDoc(collection(db, this.collection), notificationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get notifications for a user
  async getNotifications(
    userId: string,
    userType: 'user' | 'advertiser' | 'admin',
    limit = 20
  ): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('userType', '==', userType),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp as Timestamp
      })) as Notification[];
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount(userId: string, userType: 'user' | 'advertiser' | 'admin'): Promise<number> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('userType', '==', userType),
        where('isRead', '==', false)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, this.collection, notificationId);
      await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string, userType: 'user' | 'advertiser' | 'admin'): Promise<void> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('userType', '==', userType),
        where('isRead', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      querySnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Set up a real-time listener for notifications
  subscribeToNotifications(
    userId: string,
    userType: 'user' | 'advertiser' | 'admin',
    callback: (notifications: Notification[]) => void
  ): () => void {
    const q = query(
      collection(db, this.collection),
      where('userId', '==', userId),
      where('userType', '==', userType),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp as Timestamp
      })) as Notification[];
      
      callback(notifications);
    }, error => {
      console.error('Error listening to notifications:', error);
    });
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export default new NotificationService(); 