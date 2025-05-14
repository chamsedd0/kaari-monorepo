import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNotifications } from '../../../contexts/notifications/NotificationContext';
import { Theme } from '../../../theme/theme';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { FaBell } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';
import NotificationService from '../../../services/NotificationService';
import { useAuth } from '../../../contexts/auth/AuthContext';

interface NotificationBellProps {
  color?: string;
  showBadge?: boolean;
  iconSize?: number;
}

const BellContainer = styled.div`
  position: relative;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: fill 0.2s ease;


  svg {
    transition: fill 0.2s ease;
  }
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #f44336;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 5px rgba(244, 67, 54, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
    }
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 45px;
  right: -10px;
  z-index: 100;
`;

const DebugButton = styled.button`
  background: transparent;
  color: ${Theme.colors.primary};
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 8px;
  padding: 0;
  transition: color 0.2s;
  
  &:hover {
    color: ${Theme.colors.secondary};
  }
`;

export const NotificationBell: React.FC<NotificationBellProps> = ({
  color = Theme.colors.primary,
  
  showBadge = true,
  iconSize = 24
}) => {
  const { notifications, unreadCount, markAsRead, refreshNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <BellContainer ref={bellRef} onClick={toggleDropdown}>
      <FaBell size={iconSize} color={color} />
      {showBadge && unreadCount > 0 && <UnreadBadge />}
      {isOpen && (
        <DropdownContainer>
          <NotificationDropdown
            notifications={notifications}
            onClose={() => setIsOpen(false)}
            onMarkAsRead={markAsRead}
            onViewAll={() => {
              navigate('/notifications');
              setIsOpen(false);
            }}
          />
        </DropdownContainer>
      )}
    </BellContainer>
  );
};

export default NotificationBell; 