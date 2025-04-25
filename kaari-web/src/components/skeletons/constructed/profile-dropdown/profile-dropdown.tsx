import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useStore } from '../../../../backend/store';
import { Theme } from '../../../../theme/theme';
import { LogoutConfirmationModal } from '../modals/logout-confirmation-modal';
import { useAuth } from '../../../../contexts/auth';
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaHome, FaWallet, FaQuestionCircle } from 'react-icons/fa';
import { isAdmin, isAdvertiser, isRegularUser } from '../../../../utils/user-roles';
import eventBus, { EventType } from '../../../../utils/event-bus';

export interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userImage: string;
  onLogout?: () => void;
}

const DropdownContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 250px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    right: -20px;
    width: 240px;
  }
  
  @media (max-width: 480px) {
    right: -10px;
    width: 230px;
  }
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const UserAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
`;

const UserEmail = styled.span`
  font-size: 14px;
  color: #777;
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0 4px;
`;

const MenuItem = styled.div`
  padding: 10px 16px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: ${Theme.colors.primary};
    font-size: 18px;
    min-width: 20px;
    display: flex;
    justify-content: center;
  }

  &:hover {
    background-color: rgba(103, 58, 183, 0.05);
  }
`;

const LogoutButton = styled(MenuItem)`
  color: ${Theme.colors.primary};
  margin-top: 4px;

  svg {
    color: ${Theme.colors.primary};
  }

  &:hover {
    background-color: rgba(103, 58, 183, 0.05);
  }
`;

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  userImage,
  onLogout
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { forceUpdate } = useAuth();
  const [forceRender, setForceRender] = useState(0);
  
  // Get user from store
  const user = useStore(state => state.user);
  
  // Determine user roles using utility functions
  const userIsAdmin = isAdmin(user);
  const userIsAdvertiser = isAdvertiser(user);
  const userIsRegular = isRegularUser(user);
  
  // Use effect to listen for auth state changes
  useEffect(() => {
    // Listen for auth state changes through event bus
    const unsubscribe = eventBus.on(EventType.AUTH_STATE_CHANGED, () => {
      // Force component to re-render when auth state changes
      setForceRender(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);
  
  // Also listen for sign out events to close dropdown
  useEffect(() => {
    const unsubscribe = eventBus.on(EventType.AUTH_SIGNED_OUT, () => {
      onClose(); // Close the dropdown when user signs out
    });
    
    return unsubscribe;
  }, [onClose]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDashboardClick = () => {
    onClose();
    if (userIsAdmin) {
      navigate('/dashboard/admin');
    } else if (userIsAdvertiser) {
      navigate('/dashboard/advertiser/dashboard');
    } else {
      navigate('/dashboard/user/profile');
    }
  };

  const handleReservationsClick = () => {
    onClose();
    navigate('/dashboard/user/reservations');
  };

  const handleAccountSettingsClick = () => {
    onClose();
    if (userIsAdvertiser) {
      navigate('/dashboard/advertiser/profile');
    } else {
      navigate('/dashboard/user/profile');
    }
  };

  const handlePaymentsClick = () => {
    onClose();
    if (userIsAdvertiser) {
      navigate('/dashboard/advertiser/payments');
    } else {
      navigate('/dashboard/user/payments');
    }
  };

  const handleHelpClick = () => {
    onClose();
    if (userIsAdvertiser) {
      navigate('/dashboard/advertiser/support');
    } else {
      navigate('/dashboard/user/faq');
    }
  };

  const handleLogOut = () => {
    onClose();
    // Emit UI toast notification for better user feedback
    eventBus.emit(EventType.UI_TOAST_NOTIFICATION, {
      type: 'info',
      message: 'Signing you out...',
      duration: 3000
    });
    
    // If an onLogout prop was provided, use that instead
    if (onLogout) {
      onLogout();
    } else {
      setShowLogoutModal(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <DropdownContainer ref={dropdownRef}>
        <UserInfoSection>
          <UserAvatar src={userImage} alt={userName} />
          <UserDetails>
            <UserName>{userName}</UserName>
            <UserEmail>{userEmail}</UserEmail>
          </UserDetails>
        </UserInfoSection>
        
        <MenuItems>
          {/* Admin menu items */}
          {userIsAdmin && (
            <>
              <MenuItem onClick={handleDashboardClick}>
                <FaTachometerAlt /> Dashboard
              </MenuItem>
              <MenuItem onClick={handleAccountSettingsClick}>
                <FaUser /> Account
              </MenuItem>
            </>
          )}
          
          {/* Advertiser menu items */}
          {userIsAdvertiser && (
            <>
              <MenuItem onClick={handleDashboardClick}>
                <FaTachometerAlt /> Dashboard
              </MenuItem>
              <MenuItem onClick={handleAccountSettingsClick}>
                <FaUser /> Account
              </MenuItem>
              <MenuItem onClick={handlePaymentsClick}>
                <FaWallet /> Payments
              </MenuItem>
              <MenuItem onClick={handleHelpClick}>
                <FaQuestionCircle /> Help
              </MenuItem>
            </>
          )}
          
          {/* Regular user menu items */}
          {userIsRegular && (
            <>
              <MenuItem onClick={handleReservationsClick}>
                <FaHome /> Reservation
              </MenuItem>
              <MenuItem onClick={handleAccountSettingsClick}>
                <FaUser /> Account
              </MenuItem>
              <MenuItem onClick={handlePaymentsClick}>
                <FaWallet /> Payments
              </MenuItem>
              <MenuItem onClick={handleHelpClick}>
                <FaQuestionCircle /> Help
              </MenuItem>
            </>
          )}
          
          <LogoutButton onClick={handleLogOut}>
            <FaSignOutAlt /> Log Out
          </LogoutButton>
        </MenuItems>
      </DropdownContainer>
      
      {/* Logout Confirmation Modal - rendered outside the dropdown */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default ProfileDropdown; 