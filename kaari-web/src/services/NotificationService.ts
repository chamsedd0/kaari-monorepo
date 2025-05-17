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
    console.log(`NotificationService: Creating notification for ${userType} ${userId}`);
    console.log(`NotificationService: Type: ${type}, Title: ${title}`);
    
    if (!userId) {
      console.error('Error creating notification: userId is required');
      throw new Error('userId is required');
    }
    
    if (!userType) {
      console.error('Error creating notification: userType is required');
      throw new Error('userType is required');
    }
    
    try {
      // Create timestamp as a regular JavaScript Date
      const timestamp = new Date();
      console.log(`NotificationService: Using timestamp: ${timestamp.toISOString()}`);
      
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

      console.log(`NotificationService: Adding notification data:`, 
        JSON.stringify({
          ...notificationData,
          timestamp: timestamp.toISOString() // Convert Date to string for logging
        }, null, 2)
      );
      
      // Using simple try-catch for direct debugging
      try {
        // Get a reference to the collection
        const notificationsCollection = collection(db, this.collection);
        
        // Add the document with all fields
        const docRef = await addDoc(notificationsCollection, notificationData);
        
        console.log(`NotificationService: SUCCESS! Notification created with ID: ${docRef.id}`);
        
        // Return the document ID
        return docRef.id;
      } catch (innerError) {
        console.error('NotificationService: ERROR in Firestore addDoc operation', innerError);
        throw innerError;
      }
    } catch (error) {
      console.error('NotificationService: OUTER ERROR', error);
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
      console.log(`getNotifications called with userId: ${userId}, userType: ${userType}, limit: ${limit2}`);
      
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('userType', '==', userType),
        orderBy('timestamp', 'desc'),
        limit(limit2)
      );

      console.log(`Executing Firestore query: collection=${this.collection}, userId=${userId}, userType=${userType}`);
      const querySnapshot = await getDocs(q);
      console.log(`Query returned ${querySnapshot.size} documents`);
      
      if (querySnapshot.empty) {
        // No documents found, let's check if we have any notifications at all
        const allNotificationsQuery = query(collection(db, this.collection), limit(5));
        const allNotificationsSnapshot = await getDocs(allNotificationsQuery);
        console.log(`Database has ${allNotificationsSnapshot.size} notifications in total. Sample:`, 
          allNotificationsSnapshot.docs.map(doc => ({
            id: doc.id, 
            userId: doc.data().userId,
            userType: doc.data().userType,
            title: doc.data().title
          }))
        );
      }
      
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
    console.log(`NotificationService: Subscribing to notifications for ${userType} ${userId}`);
    
    try {
      const notificationsRef = collection(db, this.collection);
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('userType', '==', userType),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      
      console.log(`NotificationService: Query created for ${userType} ${userId}`);
      
      // Set up the real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notificationsData: Notification[] = [];
        
        console.log(`NotificationService: Snapshot received with ${snapshot.docs.length} notifications`);
        
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
        
        console.log(`NotificationService: Processed ${notificationsData.length} notifications:`, 
          notificationsData.map(n => ({ id: n.id, title: n.title, isRead: n.isRead })));
        
        // Pass the notifications to the callback
        callback(notificationsData);
      }, (error) => {
        console.error('Error listening to notifications:', error);
        // Still call the callback with an empty array to avoid UI hanging
        callback([]);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up notification subscription:', error);
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
      console.error('Error deleting notification:', error);
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
    console.log(`NotificationService.getNotificationsDebugInfo called for ${userType} ${userId}`);
    
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
      
      console.log(`NotificationService.getNotificationsDebugInfo query created`);
      
      const snapshot = await getDocs(q);
      
      console.log(`NotificationService.getNotificationsDebugInfo snapshot received with ${snapshot.docs.length} documents`);
      
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
      console.error('Error in getNotificationsDebugInfo:', error);
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