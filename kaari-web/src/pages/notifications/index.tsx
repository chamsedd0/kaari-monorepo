import React, { useState } from 'react';
import styled from 'styled-components';
import { useNotifications } from '../../contexts/notifications/NotificationContext';
import NotificationItem from '../../components/skeletons/notifications/NotificationItem';
import { Theme } from '../../theme/theme';
import { useAuth } from '../../contexts/auth/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f7f9fc;
  padding-top: 80px; /* Space for header */
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
  
  .actions {
    display: flex;
    gap: 12px;
  }
  
  button {
    background: none;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    
    &:hover {
      background-color: #f9fafb;
    }
    
    &.primary {
      background-color: ${Theme.colors.primary};
      color: white;
      border-color: ${Theme.colors.primary};
      
      &:hover {
        background-color: #0046cc;
      }
      
      &:disabled {
        background-color: #9ca3af;
        border-color: #9ca3af;
        cursor: not-allowed;
      }
    }
  }
`;

const NotificationsContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #eaecf0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #6b7280;
  
  svg {
    margin-bottom: 16px;
    color: #d1d5db;
    width: 64px;
    height: 64px;
  }
  
  h3 {
    color: #111827;
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 16px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid #f3f4f6;
    border-top: 3px solid ${Theme.colors.primary};
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  gap: 8px;
  padding: 0 4px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  background-color: ${props => props.active ? Theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : '#4b5563'};
  border: 1px solid ${props => props.active ? Theme.colors.primary : '#d1d5db'};
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#0046cc' : '#f9fafb'};
  }
`;

type FilterType = 'all' | 'unread' | 'read';

const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, loading, refreshNotifications } = useNotifications();
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('all');
  
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };
  
  const handleRefresh = async () => {
    await refreshNotifications();
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });
  
  return (
    <PageContainer>
      
      <ContentContainer>
        <HeaderContainer>
          <h1>Notifications</h1>
          <div className="actions">
            <button onClick={handleRefresh}>Refresh</button>
            <button 
              className="primary" 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>
        </HeaderContainer>
        
        <FilterContainer>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={filter === 'unread'} 
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </FilterButton>
          <FilterButton 
            active={filter === 'read'} 
            onClick={() => setFilter('read')}
          >
            Read
          </FilterButton>
        </FilterContainer>
        
        {loading ? (
          <LoadingState />
        ) : notifications.length === 0 ? (
          <EmptyState>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3>No notifications</h3>
            <p>You don't have any notifications yet. They will appear here when you receive them.</p>
          </EmptyState>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3>No {filter === 'unread' ? 'unread' : 'read'} notifications</h3>
            <p>You don't have any {filter === 'unread' ? 'unread' : 'read'} notifications at the moment.</p>
          </EmptyState>
        ) : (
          <NotificationsContainer>
            {filteredNotifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </NotificationsContainer>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default NotificationsPage; 