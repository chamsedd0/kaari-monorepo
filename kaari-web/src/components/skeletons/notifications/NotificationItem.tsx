import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { Notification, NotificationType } from '../../../types/Notification';
import { useNotifications } from '../../../contexts/notifications/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

const NotificationItemContainer = styled.div<{ isRead: boolean }>`
  padding: 16px;
  border-bottom: 1px solid #eaecf0;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.isRead ? 'white' : '#f0f9ff'};

  &:hover {
    background-color: ${props => props.isRead ? '#f9fafb' : '#e0f2fe'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const IconContainer = styled.div<{ type: NotificationType }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  ${({ type }) => {
    // Different colors based on notification type
    if (type.includes('photoshoot')) {
      return `background-color: #fef3c7; color: #d97706;`; // Yellow/amber for photoshoot notifications
    } else if (type.includes('property_refresh_warning')) {
      return `background-color: #fee2e2; color: #ef4444;`; // Red for urgent refresh warnings
    } else if (type.includes('property_refresh')) {
      return `background-color: #fef3c7; color: #f59e0b;`; // Orange for refresh reminders
    } else if (type.includes('property')) {
      return `background-color: #d1fae5; color: #059669;`; // Green for property notifications
    } else if (type.includes('reservation')) {
      return `background-color: #dbeafe; color: #3b82f6;`; // Blue for reservation notifications
    } else if (type.includes('payment')) {
      return `background-color: #e0e7ff; color: #4f46e5;`; // Indigo for payment notifications
    } else if (type.includes('message')) {
      return `background-color: #fce7f3; color: #db2777;`; // Pink for message notifications
    } else if (type.includes('move_in')) {
      return `background-color: #ede9fe; color: #8b5cf6;`; // Purple for move in notifications
    } else if (type.includes('team')) {
      return `background-color: #ffedd5; color: #f97316;`; // Orange for team notifications
    } else if (type.includes('refund') || type.includes('cancellation')) {
      return `background-color: #fee2e2; color: #ef4444;`; // Red for refund/cancellation notifications
    } else {
      return `background-color: #f3f4f6; color: #6b7280;`; // Gray for other notifications
    }
  }}
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const Message = styled.div`
  color: #4b5563;
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 6px;
`;

const Time = styled.div`
  color: #9ca3af;
  font-size: 12px;
`;

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const handleClick = async () => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
      if (onClose) onClose();
    }
  };
  
  // Function to get icon based on notification type
  const getIcon = (type: NotificationType) => {
    if (type.includes('photoshoot')) {
      return '📸';
    } else if (type.includes('property_refresh')) {
      return '🔄';
    } else if (type.includes('property')) {
      return '🏠';
    } else if (type.includes('reservation')) {
      return '📅';
    } else if (type.includes('payment')) {
      return '💰';
    } else if (type.includes('message')) {
      return '💬';
    } else if (type.includes('move_in')) {
      return '🔑';
    } else if (type.includes('team')) {
      return '👥';
    } else if (type.includes('refund') || type.includes('cancellation')) {
      return '↩️';
    } else {
      return '🔔';
    }
  };
  
  return (
    <NotificationItemContainer 
      isRead={notification.isRead}
      onClick={handleClick}
    >
      <IconContainer type={notification.type}>
        {getIcon(notification.type)}
      </IconContainer>
      
      <Content>
        <Title>{notification.title}</Title>
        <Message>{notification.message}</Message>
        <Time>
          {notification.timestamp
            ? formatDistanceToNow(notification.timestamp.toDate(), { addSuffix: true })
            : ''}
        </Time>
      </Content>
    </NotificationItemContainer>
  );
};

export default NotificationItem; 