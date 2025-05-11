import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useNotifications } from '../../../contexts/notifications/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  onClose: () => void;
}

const DropdownWrapper = styled.div`
  width: 350px;
  max-height: 450px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
  border: 1px solid #eaecf0;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eaecf0;
  background-color: #f9fafb;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: ${Theme.colors.primary};
    font-size: 14px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 87, 255, 0.05);
    }

    &:disabled {
      color: #9ca3af;
      cursor: default;
      background-color: transparent;
    }
  }
`;

const NotificationList = styled.div`
  max-height: 350px;
  overflow-y: auto;
  padding: 0;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  min-height: 250px;

  .icon-container {
    background-color: ${Theme.colors.primary}10;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  svg {
    color: ${Theme.colors.primary};
    width: 32px;
    height: 32px;
  }

  h4 {
    font-size: 16px;
    margin: 0 0 8px 0;
    color: #374151;
    font-weight: 600;
  }

  p {
    font-size: 14px;
    margin: 0;
    color: #6b7280;
    max-width: 240px;
    line-height: 1.4;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  padding: 16px;
  
  &::after {
    content: '';
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #f3f4f6;
    border-top: 2px solid ${Theme.colors.primary};
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Footer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #eaecf0;
  display: flex;
  justify-content: center;

  button {
    width: 100%;
    padding: 8px;
    background-color: #f9fafb;
    border: 1px solid #eaecf0;
    border-radius: 6px;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #f3f4f6;
      color: #111827;
    }
  }
`;

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAllAsRead, loading } = useNotifications();
  const navigate = useNavigate();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleViewAllClick = () => {
    navigate('/notifications');
    onClose();
  };

  return (
    <DropdownWrapper>
      <Header>
        <h3>Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
        <button 
          onClick={handleMarkAllAsRead} 
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </Header>
      
      {loading ? (
        <LoadingState />
      ) : notifications.length === 0 ? (
        <EmptyState>
          <div className="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h4>No notifications yet</h4>
          <p>We'll notify you when there's activity or updates relevant to you.</p>
        </EmptyState>
      ) : (
        <NotificationList>
          {notifications.slice(0, 5).map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onClose={onClose}
            />
          ))}
        </NotificationList>
      )}
      
      {notifications.length > 0 && (
        <Footer>
          <button onClick={handleViewAllClick}>
            View all notifications
          </button>
        </Footer>
      )}
    </DropdownWrapper>
  );
};

export default NotificationDropdown; 