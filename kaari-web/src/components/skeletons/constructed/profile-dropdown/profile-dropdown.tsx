import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useStore } from '../../../../backend/store';
import { Theme } from '../../../../theme/theme';
import { SignOutConfirmationModal } from '../modals/signout-confirmation-modal';
import { signOut } from '../../../../backend/firebase/auth';

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
  top: 45px;
  right: 0;
  width: 280px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
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
  color: #666;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 8px 0;
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const LogoutButton = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  color: #ff3b30;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 600;

  &:hover {
    background-color: #fff1f0;
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
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  
  // Get user role and logout function from store
  const userRole = useStore(state => state.user?.role);
  const setUser = useStore(state => state.setUser);
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const isAdvertiser = userRole === 'advertiser';
  
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
    if (userRole === 'advertiser') {
      navigate('/dashboard/advertiser');
    } else {
      navigate('/dashboard/user');
    }
  };

  const handleReservationsClick = () => {
    onClose();
    if (userRole === 'advertiser') {
      navigate('/dashboard/advertiser/reservations');
    } else {
      navigate('/dashboard/user/reservations');
    }
  };

  const handleAccountSettingsClick = () => {
    onClose();
    navigate('/account/settings');
  };

  const handlePaymentsClick = () => {
    onClose();
    navigate('/account/payments');
  };

  const handleHelpClick = () => {
    onClose();
    navigate('/help');
  };

  const handleLogOut = () => {
    onClose();
    // If an onLogout prop was provided, use that instead
    if (onLogout) {
      onLogout();
    } else {
      setShowSignOutModal(true);
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
        
        <Divider />
        
        <MenuItems>
          <MenuItem onClick={handleDashboardClick}>
            Dashboard
          </MenuItem>
          
          <MenuItem onClick={handleReservationsClick}>
            {isAdvertiser ? 'My Properties' : 'My Reservations'}
          </MenuItem>
          
          <MenuItem onClick={handleAccountSettingsClick}>
            Account Settings
          </MenuItem>
          
          <MenuItem onClick={handlePaymentsClick}>
            Payments
          </MenuItem>
          
          <MenuItem onClick={handleHelpClick}>
            Help
          </MenuItem>
        </MenuItems>
        
        <Divider />
        
        <LogoutButton onClick={handleLogOut}>
          Log Out
        </LogoutButton>
      </DropdownContainer>
      
      {/* Sign Out Confirmation Modal - rendered outside the dropdown */}
      <SignOutConfirmationModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={async () => {
          await handleLogOut();
          setShowSignOutModal(false);
        }}
      />
    </>
  );
};

export default ProfileDropdown; 