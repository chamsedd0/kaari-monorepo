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
  onSnapshot,
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
    
    
    if (!userId) {
      throw new Error('userId is required');
    }
    
    if (!userType) {
      throw new Error('userType is required');
    }
    
    try {
      // Create timestamp as a regular JavaScript Date
      const timestamp = new Date();
      
      // Prepare notification data with explicit Date object
      const notificationData = {
        userId,
        userType,
        type,
        title,
        message,
        timestamp, // Use regular Date object
        isRead: false,
        link: link || '',
        metadata: metadata || {}
      };

      
      
      // Using simple try-catch for direct debugging
      try {
        // Get a reference to the collection
        const notificationsCollection = collection(db, this.collection);
        
        // Add the document with all fields
        const docRef = await addDoc(notificationsCollection, notificationData);
        
        
        // Return the document ID
        return docRef.id;
      } catch (innerError) {
        throw innerError;
      }
    } catch (error) {
      throw error;
    }
  }

  // Get notifications for a user
  async getNotifications(
    userId: string,
    userType: 'user' | 'advertiser' | 'admin',
    limit2 = 20
  ): Promise<Notification[]> {
    try {
      
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('userType', '==', userType),
        orderBy('timestamp', 'desc'),
        limit(limit2)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // No documents found, let's check if we have any notifications at all
        const allNotificationsQuery = query(collection(db, this.collection), limit(5));
        const allNotificationsSnapshot = await getDocs(allNotificationsQuery);
        
      }
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp as Timestamp
      })) as Notification[];
    } catch (error) {
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
      throw error;
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, this.collection, notificationId);
      await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
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
      throw error;
    }
  }

  // Set up a real-time listener for notifications
  subscribeToNotifications(
    userId: string,
    userType: 'user' | 'advertiser' | 'admin',
    callback: (notifications: Notification[]) => void
  ): () => void {
    
    try {
      const notificationsRef = collection(db, this.collection);
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('userType', '==', userType),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      
      
      // Set up the real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notificationsData: Notification[] = [];
        
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const notification: Notification = {
            id: doc.id,
            userId: data.userId,
            userType: data.userType,
            type: data.type,
            title: data.title,
            message: data.message,
            timestamp: data.timestamp,
            isRead: data.isRead,
            link: data.link,
            metadata: data.metadata
          };
          notificationsData.push(notification);
        });
        
       
        
        // Pass the notifications to the callback
        callback(notificationsData);
      }, (error) => {
        // Still call the callback with an empty array to avoid UI hanging
        callback([]);
      });
      
      return unsubscribe;
    } catch (error) {
      // Return empty cleanup function in case of error
      callback([]);
      return () => {};
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, notificationId));
    } catch (error) {
      throw error;
    }
  }

  // Add a diagnostic method to check if notifications exist in Firestore
  async getNotificationsDebugInfo(
    userId: string,
    userType: 'user' | 'advertiser' | 'admin'
  ): Promise<{
    notificationsExist: boolean;
    count: number;
    collectionPath: string;
    sampleNotifications: any[];
    error?: string;
  }> {
    
    try {
      const collectionPath = this.collection;
      const notificationsRef = collection(db, collectionPath);
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('userType', '==', userType),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      
      
      const snapshot = await getDocs(q);
      
      
      const notificationsData: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notificationsData.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate().toISOString() : data.timestamp) : null
        });
      });
      
      return {
        notificationsExist: snapshot.docs.length > 0,
        count: snapshot.docs.length,
        collectionPath,
        sampleNotifications: notificationsData
      };
    } catch (error) {
      return {
        notificationsExist: false,
        count: 0,
        collectionPath: this.collection,
        sampleNotifications: [],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

export default new NotificationService(); 