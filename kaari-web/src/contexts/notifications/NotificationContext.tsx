import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import NotificationService from '../../services/NotificationService';
import { Notification } from '../../types/Notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch notifications when user changes
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let refreshInterval: NodeJS.Timeout | null = null;

    const initializeNotifications = async () => {
      setLoading(true);
      
      if (user && user.id) {
        try {
          // Determine user type
          const userType = user.userType || 'user';
          
          console.log(`Initializing notifications for ${userType} ${user.id}`);
          
          // Force an initial refresh of notifications
          await refreshNotifications();
          
          // Subscribe to notifications
          try {
            unsubscribe = NotificationService.subscribeToNotifications(
              user.id,
              userType,
              (updatedNotifications) => {
                setNotifications(updatedNotifications);
                const unreadNotifications = updatedNotifications.filter(n => !n.isRead);
                setUnreadCount(unreadNotifications.length);
                setLoading(false);
                console.log(`Got ${updatedNotifications.length} notifications, ${unreadNotifications.length} unread`);
              }
            );
          } catch (subscribeError) {
            console.error('Error subscribing to notifications:', subscribeError);
            // Silent failure, we'll use polling as fallback
          }
          
          // Set up a fallback polling mechanism in case real-time updates fail
          refreshInterval = setInterval(async () => {
            try {
              console.log('Polling for notifications...');
              await refreshNotifications();
            } catch (pollingError) {
              console.error('Error in notification polling:', pollingError);
            }
          }, 15000); // Poll every 15 seconds
          
        } catch (error) {
          console.error('Error initializing notifications:', error);
          setLoading(false);
        }
      } else {
        // No user is logged in
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
      }
    };

    initializeNotifications();

    // Cleanup subscription and polling on unmount or user change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user]);

  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      await NotificationService.markAsRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (!user || !user.id) return;
    
    try {
      const userType = user.userType || 'user';
      await NotificationService.markAllAsRead(user.id, userType);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId: string): Promise<void> => {
    try {
      await NotificationService.deleteNotification(notificationId);
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update unread count if needed
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  const refreshNotifications = async (): Promise<void> => {
    if (!user || !user.id) return;
    
    try {
      console.log(`Manually refreshing notifications for ${user.userType || 'user'} ${user.id}`);
      const userType = user.userType || 'user';
      
      // Get debug info first
      const debugInfo = await NotificationService.getNotificationsDebugInfo(user.id, userType);
      console.log(`Notification debug info:`, debugInfo);
      
      // Then get the actual notifications
      const refreshedNotifications = await NotificationService.getNotifications(user.id, userType);
      console.log(`Refreshed ${refreshedNotifications.length} notifications:`, 
        refreshedNotifications.map(n => ({ id: n.id, title: n.title, type: n.type })));
      
      setNotifications(refreshedNotifications);
      const unreadNotifications = refreshedNotifications.filter(n => !n.isRead);
      console.log(`Found ${unreadNotifications.length} unread notifications`);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    loading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 