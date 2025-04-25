import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from "styled-components";
import { HeaderBaseModel } from "../../../styles/constructed/headers/header-base-model";
import { Theme } from "../../../../theme/theme";
import LogoWhite from '../../icons/LogoWhite.svg';
import LogoPurple from '../../../../assets/images/purpleLogo.svg';
import { HeartIcon } from "../../icons/heartIcon";
import { Notifications } from "../../icons/NotificationsIcon";
import { MessageBubble } from "../../icons/messageBubbleIcon";
import { House } from "../../icons/HouseIcon";
import { FaSearch, FaCamera } from 'react-icons/fa';
import ProfilePic from '../../../../assets/images/ProfilePicture.png';
import { useStore } from '../../../../backend/store';
import { AuthModal } from '../modals/auth-modal';
import { SignOutConfirmationModal } from '../modals/signout-confirmation-modal';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import { signOut } from '../../../../backend/firebase/auth';
import eventBus, { AUTH_EVENTS } from '../../../../utils/event-bus';

// Define the styled components for different header styles
const HeaderContainer = styled(HeaderBaseModel)<{
  isTransparent?: boolean;
  scrolled?: boolean;
  isWhite?: boolean;
}>`
  background: ${({ isTransparent, scrolled, isWhite }) => 
    isWhite ? Theme.colors.white : 
    (isTransparent ? (scrolled ? Theme.colors.primary : 'transparent') : Theme.colors.primary)
  };
  border: ${({ isWhite }) => isWhite ? Theme.borders.primary : 'none !important'};
  padding: ${({ scrolled, isWhite }) => isWhite ? '20px' : (scrolled ? '0 40px' : '0 6%')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  transition: all 0.3s ease;
  box-shadow: ${({ scrolled, isWhite }) => 
    isWhite ? 'none' : 
    (scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none')
  };
  z-index: 1000;
  display: flex;
  align-items: center;
  
  .wrapper {
    max-width: 1400px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: auto;
  }
  
  .logo {
    height: 40px;
    max-width: 120px;
    z-index: 10;
    cursor: pointer;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  
  .link {
    font: ${Theme.typography.fonts.largeB};
    color: ${({ isWhite }) => isWhite ? Theme.colors.primary : Theme.colors.white};
    padding: 8px 16px;
    transition: all 0.3s;
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  .search-container {
    position: relative;
    flex: 1;
    max-width: 400px;
    height: 40px;
    margin: 0 15px;
    
    input {
      width: 100%;
      height: 100%;
      padding: 10px 40px 10px 16px;
      border-radius: 20px;
      border: 1px solid ${({ isWhite }) => isWhite ? Theme.colors.gray : 'rgba(255, 255, 255, 0.3)'};
      background: ${({ isWhite }) => isWhite ? Theme.colors.white : 'rgba(255, 255, 255, 0.15)'};
      color: ${({ isWhite }) => isWhite ? Theme.colors.black : Theme.colors.white};
      font-size: 14px;
      outline: none;
      transition: all 0.3s ease;
      
      &::placeholder {
        color: ${({ isWhite }) => isWhite ? Theme.colors.gray2 : 'rgba(255, 255, 255, 0.7)'};
      }
      
      &:focus {
        border-color: ${({ isWhite }) => isWhite ? Theme.colors.primary : Theme.colors.white};
        box-shadow: 0 0 8px rgba(103, 58, 183, 0.2);
      }
    }
    
    .search-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: ${({ isWhite }) => isWhite ? Theme.colors.gray2 : 'rgba(255, 255, 255, 0.7)'};
      cursor: pointer;
    }
  }
  
  .language-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 16px;
    height: 36px;
    background-color: ${({ isWhite }) => isWhite ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};
    border: ${({ isWhite }) => isWhite ? `1px solid ${Theme.colors.primary}` : 'none'};
    border-radius: 18px;
    color: ${({ isWhite }) => isWhite ? Theme.colors.primary : Theme.colors.white};
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${({ isWhite }) => isWhite ? `${Theme.colors.primary}10` : 'rgba(255, 255, 255, 0.3)'};
    }
  }
  
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    
    svg {
      width: 21px;
      height: 21px;
      margin-top: 3px;
    }
    
    &:hover {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
  
  .sign-in {
    color: ${({ isWhite }) => isWhite ? Theme.colors.primary : Theme.colors.white};
    font-weight: 600;
    font-size: 15px;
    transition: all 0.3s;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
      background-color: ${({ isWhite }) => isWhite ? Theme.colors.primary + '10' : Theme.colors.white};
      color: ${({ isWhite }) => isWhite ? Theme.colors.primary : Theme.colors.primary};
    }
    
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  
  .profilePic {
    cursor: pointer;
    
    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
`;

interface UnifiedHeaderProps {
  variant?: 'landing' | 'white' | 'advertiser-landing'; // The type of header to display
  userType?: 'user' | 'advertiser' | 'admin' | 'none'; // User role for conditional rendering
  isAuthenticated?: boolean; // Override authentication status (useful for previews)
  onLanguageChange?: (lang: string) => void; // Language change handler
  showSearchBar?: boolean; // Whether to display the search bar
  customLink?: {
    text: string;
    onClick: () => void;
  }; // Custom link text and action (like "Looking for a place?")
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  variant = 'white',
  userType = 'none',
  isAuthenticated: authOverride,
  onLanguageChange,
  showSearchBar = false,
  customLink,
}) => {
  const navigate = useNavigate();
  
  // Check if we should use transparent background for landing pages
  const isTransparent = variant === 'landing' || variant === 'advertiser-landing';
  const isWhite = variant === 'white';
  
  // Handle scroll behavior for landing pages
  const [scrolled, setScrolled] = useState(false);
  
  // Access store for user data
  const storeIsAuthenticated = useStore(state => state.isAuthenticated);
  const userName = useStore(state => state.user?.name || 'User');
  const userEmail = useStore(state => state.user?.email);
  const userProfilePic = useStore(state => state.user?.profilePicture);
  const setUser = useStore(state => state.setUser);
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
  
  // Use override if provided, otherwise use store value
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    authOverride !== undefined ? authOverride : storeIsAuthenticated
  );
  
  // Listen for changes in authentication state
  useEffect(() => {
    // Only update if we're not using an override
    if (authOverride === undefined) {
      setIsUserAuthenticated(storeIsAuthenticated);
    }
  }, [storeIsAuthenticated, authOverride]);
  
  // UI state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Handle scroll events for transparent headers
  useEffect(() => {
    if (isTransparent) {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 100;
        if (isScrolled !== scrolled) {
          setScrolled(isScrolled);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrolled, isTransparent]);

  // Add event listener to document body for auth changes
  useEffect(() => {
    function checkAuth() {
      // Force re-render
      setIsUserAuthenticated(authOverride !== undefined ? authOverride : storeIsAuthenticated);
    }
    
    // Check every 500ms
    const interval = setInterval(checkAuth, 500);
    
    // Add global auth change event listener
    document.body.addEventListener('auth-change', checkAuth);
    
    return () => {
      clearInterval(interval);
      document.body.removeEventListener('auth-change', checkAuth);
    };
  }, [storeIsAuthenticated, authOverride]);

  // Navigation handlers
  const handleHomeClick = () => navigate('/');
  const handleLandlordClick = () => navigate('/for-advertisers');
  const handleTenantClick = () => navigate('/');
  const handleHelpClick = () => navigate('/help');
  const handleFavoritesClick = () => isUserAuthenticated ? navigate('/favourites') : setShowAuthModal(true);
  const handleMessagesClick = () => {
    if (isUserAuthenticated) {
      navigate(userType === 'advertiser' 
        ? '/dashboard/advertiser/messages' 
        : '/dashboard/user/messages');
    } else {
      setShowAuthModal(true);
    }
  };
  const handleNotificationsClick = () => isUserAuthenticated ? navigate('/notifications') : setShowAuthModal(true);
  const handlePropertiesClick = () => {
    if (isUserAuthenticated) {
      navigate(userType === 'advertiser' 
        ? '/dashboard/advertiser/properties' 
        : '/dashboard/user');
    } else {
      setShowAuthModal(true);
    }
  };
  const handleCameraClick = () => navigate('/photoshoot-booking');

  // Auth handlers
  const handleSignIn = () => {
    if (isUserAuthenticated) {
      setShowProfileDropdown(!showProfileDropdown);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    try {
      setShowSignOutModal(false);
      
      // Execute logout directly
      await signOut();
      
      // Update local state immediately
      setUser(null);
      setIsAuthenticated(false);
      setIsUserAuthenticated(false);
      
      // Dispatch event for other components
      document.body.dispatchEvent(new Event('auth-change'));
      
      // Wait a moment, then redirect to homepage using client-side navigation
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error("Error signing out:", error);
      // Navigate to home page even if there's an error
      navigate('/', { replace: true });
    }
  };

  // Call this function after successful sign-in in AuthModal
  const handleAuthSuccess = () => {
    // Only update local state if we're not using an override
    if (authOverride === undefined) {
      setIsUserAuthenticated(true);
    }
    setShowAuthModal(false);
  };

  const handleLanguageChange = () => {
    if (onLanguageChange) {
      onLanguageChange('ENG');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchValue)}`);
    }
  };

  // Determine content based on variant and user type
  const getLogo = () => {
    return isWhite ? LogoPurple : LogoWhite;
  };

  const getIconColor = () => {
    return isWhite ? Theme.colors.primary : Theme.colors.white;
  };

  // Conditional content rendering
  const renderSwitchRoleLink = () => {
    // If we have a custom link, use that instead
    if (customLink) {
      return (
        <div className="link" onClick={() => {
          if (customLink.onClick) customLink.onClick();
        }}>
          {customLink.text}
        </div>
      );
    }
    
    if (userType === 'advertiser' || variant === 'advertiser-landing') {
      return (
        <div className="link" onClick={handleTenantClick}>
          Are you a tenant?
        </div>
      );
    }
    
    return (
      <div className="link" onClick={handleLandlordClick}>
        Are you a landlord?
      </div>
    );
  };

  const renderSearchBar = () => {
    if (!showSearchBar) return null;
    
    return (
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <span className="search-icon" onClick={handleSearch}>
            <FaSearch />
          </span>
        </form>
      </div>
    );
  };

  const renderLanguageButton = () => {
    return (
      <button className="language-button" onClick={handleLanguageChange}>
        ENG
      </button>
    );
  };

  const renderNavIcons = () => {
    // For non-authenticated users, just show heart icon
    if (!isUserAuthenticated) {
      return (
        <div className="icon-container" onClick={handleFavoritesClick}>
          <HeartIcon bgColor={getIconColor()} />
        </div>
      );
    }
    
    // For user dashboard, show different icon set
    if (userType === 'user' && isUserAuthenticated) {
      return (
        <>
          <div className="icon-container" onClick={handlePropertiesClick}>
            <House bgColor={getIconColor()} />
          </div>
          
          <div className="icon-container" onClick={handleMessagesClick}>
            <MessageBubble bgColor={getIconColor()} />
          </div>
          
          <div className="icon-container" onClick={handleNotificationsClick}>
            <Notifications bgColor={getIconColor()} />
          </div>
          
          <div className="icon-container" onClick={handleFavoritesClick}>
            <HeartIcon bgColor={getIconColor()} />
          </div>
        </>
      );
    }
    
    // For advertiser dashboard, include camera icon
    if (userType === 'advertiser' && isUserAuthenticated) {
      return (
        <>
          <div className="icon-container" onClick={handleCameraClick}>
            <FaCamera color={getIconColor()} />
          </div>
          
          <div className="icon-container" onClick={handleNotificationsClick}>
            <Notifications bgColor={getIconColor()} />
          </div>
        </>
      );
    }
    
    // Default case
    return (
      <div className="icon-container" onClick={handleFavoritesClick}>
        <HeartIcon bgColor={getIconColor()} />
      </div>
    );
  };

  const renderAuthSection = () => {
    if (!isUserAuthenticated) {
      return (
        <div className="sign-in" onClick={handleSignIn}>
          Sign in
        </div>
      );
    }
    
    // For white headers with authenticated users, show only profile picture
    if (isUserAuthenticated) {
      return (
        <div className="profilePic" onClick={handleSignIn} style={{ position: 'relative' }}>
          <img 
            src={userProfilePic || ProfilePic} 
            alt={userName}
          />
          {showProfileDropdown && (
            <ProfileDropdown
              isOpen={showProfileDropdown}
              onClose={() => setShowProfileDropdown(false)}
              userName={userName}
              userEmail={userEmail || "user@example.com"}
              userImage={userProfilePic || ProfilePic}
              onLogout={() => {
                setShowProfileDropdown(false);
                setShowSignOutModal(true);
              }}
            />
          )}
        </div>
      );
    }
  };

  // Determine the right order of elements based on the design
  const renderHeaderContent = () => {
    return (
      <div className="wrapper">
        <div className="logo" onClick={handleHomeClick}>
          <img src={getLogo()} alt="Kaari Logo" />
        </div>
        
        {renderSearchBar()}
        
        <div className="nav-links">
          {renderSwitchRoleLink()}
          
          {renderLanguageButton()}
          
          {renderNavIcons()}
          
          <div className="link" onClick={handleHelpClick}>
            Help
          </div>
          
          {renderAuthSection()}
        </div>
      </div>
    );
  };

  // Force re-render when authentication state changes
  const [, forceUpdate] = useState({});
  
  // Listen for authentication events
  useEffect(() => {
    const handleAuthChange = () => {
      // This will trigger a re-render
      forceUpdate({});
    };
    
    // Listen for authentication events
    const unsubscribe = eventBus.on(AUTH_EVENTS.AUTH_STATE_CHANGED, handleAuthChange);
    
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <HeaderContainer 
        isTransparent={isTransparent}
        scrolled={scrolled} 
        isWhite={isWhite}
      >
        {renderHeaderContent()}
      </HeaderContainer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode="signin"
        onSuccess={handleAuthSuccess}
      />

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmationModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
};

export default UnifiedHeader; 