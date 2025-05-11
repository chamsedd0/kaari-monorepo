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

    const initializeNotifications = async () => {
      setLoading(true);
      
      if (user && user.id) {
        try {
          // Determine user type
          const userType = user.userType || 'user';
          
          // Subscribe to notifications
          unsubscribe = NotificationService.subscribeToNotifications(
            user.id,
            userType,
            (updatedNotifications) => {
              setNotifications(updatedNotifications);
              const unreadNotifications = updatedNotifications.filter(n => !n.isRead);
              setUnreadCount(unreadNotifications.length);
              setLoading(false);
            }
          );
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

    // Cleanup subscription on unmount or user change
    return () => {
      if (unsubscribe) {
        unsubscribe();
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
    
    setLoading(true);
    try {
      const userType = user.userType || 'user';
      const refreshedNotifications = await NotificationService.getNotifications(user.id, userType);
      setNotifications(refreshedNotifications);
      const unreadNotifications = refreshedNotifications.filter(n => !n.isRead);
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