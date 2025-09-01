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
import { IoHomeOutline, IoHelpCircleOutline, IoHeartOutline, IoCameraOutline, IoGridOutline, IoLogOutOutline, IoLogInOutline, IoGlobeOutline, IoClose } from 'react-icons/io5';
import UserAvatar from '../../../../components/UserAvatar';
import { useStore } from '../../../../backend/store';
import { AuthModal } from '../modals/auth-modal';
import { SignOutConfirmationModal } from '../modals/signout-confirmation-modal';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import { signOut } from '../../../../backend/firebase/auth';
import eventBus, { AUTH_EVENTS, EventType } from '../../../../utils/event-bus';
import LanguageSwitcher from '../../language-switcher/language-switcher';
import { useTranslation } from 'react-i18next';
import NotificationBell from '../../notifications/NotificationBell';

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
  border: none;
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
    gap: 12px;
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

  @media (max-width: 700px) {
    .logo { height: 28px; max-width: 90px; }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: clamp(12px, 2.5vw, 30px);
    flex-wrap: wrap;
    min-width: 0;
  }

  /* Make header prettier: add subtle divider and compact icon group */
  .nav-links::before {
    content: '';
    display: inline-block;
    width: 1px;
    height: 28px;
    background: ${Theme.colors.gray}22;
    margin-right: 8px;
  }

  .icon-container { border-radius: 10px; padding: 6px; }

  /* Dashboard menu button: hidden by default, shown on <=1200px */
  .dash-menu-button {
    display: none;
    align-items: center;
    justify-content: center;
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
    flex: 1 1 260px;
    max-width: min(46vw, 420px);
    height: 40px;
    margin: 0 12px;
    
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

  .notif {
    &:hover {
      opacity: 1 !important;
      transform: none !important;
    }
  }
  
  .sign-in {
    color: ${({ isWhite }) => isWhite ? Theme.colors.primary : Theme.colors.white};
    font-weight: 600;
    font-size: clamp(13px, 1.8vw, 15px);
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

  /* Tablet */
  @media (max-width: 1050px) {
    padding: 0 20px;

    .nav-links { gap: clamp(10px, 2vw, 18px); }
    .search-container { max-width: 360px; }
    .link { display: none; } /* hide secondary links to reduce crowding */
    .language-button { display: none; }
    .dash-menu-button { display: inline-flex; align-items: center; justify-content: center; }
    .nav-links::before { display: none; }
  }

  /* Large tablet/small desktop: ensure visible up to 1200px */
  @media (max-width: 1200px) {
    .dash-menu-button { display: inline-flex; }
  }

  /* Explicitly hide on >1200px */
  @media (min-width: 1201px) {
    .dash-menu-button { display: none !important; }
  }

  /* Phone */
  @media (max-width: 640px) {
    height: 72px;
    .wrapper { gap: 8px; }
    .logo { max-width: 100px; }
    .search-container { display: none; }
    .link { display: none; }
    .language-button { display: none; }
    .dash-menu-button { display: inline-flex; align-items: center; justify-content: center; }
  }

  /* Mobile hamburger header */
  .mobile-menu-button {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    transform: translateX(10px);
    border-radius: 10px;
    border: ${({ isWhite }) => isWhite ? `0px solid ${Theme.colors.fifth}` : '0px solid rgba(255,255,255,0.4)'};
    background: ${({ isWhite }) => isWhite ? 'transparent' : 'transparent'};
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
  }
  .mobile-menu-button:active { transform: scale(0.98); }
  .mobile-menu-button .bar {
    width: 18px;
    height: 2px;
    background: ${({ isWhite }) => isWhite ? Theme.colors.primary : Theme.colors.white};
    border-radius: 2px;
    position: relative;
  }
  .mobile-menu-button .bar::before,
  .mobile-menu-button .bar::after {
    content: '';
    position: absolute;
    left: 0;
    width: 18px;
    height: 2px;
    background: inherit;
    border-radius: 2px;
  }
  .mobile-menu-button .bar::before { top: -6px; }
  .mobile-menu-button .bar::after { top: 6px; }

  @media (max-width: 800px) {
    .nav-links { display: none; }
    .language-button { display: none; }
    .mobile-menu-button { display: inline-flex; margin-left: auto; }
  }

  /* Extra small phones */
  @media (max-width: 480px) {
    .nav-links { display: none; }
  }
`;

interface UnifiedHeaderProps {
  variant?: 'landing' | 'white' | 'advertiser-landing'; // The type of header to display
  userType?: 'user' | 'advertiser' | 'admin' | 'none'; // User role for conditional rendering
  isAuthenticated?: boolean; // Override authentication status (useful for previews)
  onLanguageChange?: (lang: string) => void; // Language change handler
  showSearchBar?: boolean; // Whether to display the search bar (deprecated)
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
  const { t } = useTranslation();
  
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setTimeout(() => setMobileMenuVisible(false), 250);
  };
  const [searchValue, setSearchValue] = useState('');
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin');
  const [referralCode, setReferralCode] = useState<string | null>(null);

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

  // Listen for OPEN_AUTH_MODAL events
  useEffect(() => {
    const unsubscribe = eventBus.on(EventType.OPEN_AUTH_MODAL, (payload) => {
      setAuthModalMode(payload.initialMode || 'signin');
      setReferralCode(payload.referralCode || null);
      setShowAuthModal(true);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

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
          {t('common.are_you_tenant')}
        </div>
      );
    }
    
    return (
      <div className="link" onClick={handleLandlordClick}>
        {t('common.are_you_landlord')}
      </div>
    );
  };

  const renderSearchBar = () => null; // permanently hide header search per product decision

  const renderLanguageButton = () => {
    return (
      <LanguageSwitcher />
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
          
          <div className="icon-container notif">
            <NotificationBell color={getIconColor()} />
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
          
          <div className="icon-container notif">
            <NotificationBell color={getIconColor()} />
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
          {t('common.login')}
        </div>
      );
    }
    
    // For white headers with authenticated users, show only profile picture
    if (isUserAuthenticated) {
      return (
        <div className="profilePic" onClick={handleSignIn} style={{ position: 'relative' }}>
          <UserAvatar
            size={40}
            name={userName}
            profileImage={userProfilePic}
          />
          {showProfileDropdown && (
            <ProfileDropdown
              userName={userName}
              userEmail={userEmail || "user@example.com"}
              userImage={userProfilePic}
              onLogout={() => {
                setShowProfileDropdown(false);
                setShowSignOutModal(true);
              }}
              onClose={() => setShowProfileDropdown(false)}
              userType={userType}
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
        {userType === 'advertiser' && (
          <button
            aria-label="Open dashboard menu"
            onClick={() => eventBus.emit('dashboard:toggleSidebar', { open: true })}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: '1px solid #e5e5e5',
              background: isWhite ? '#fff' : 'rgba(255,255,255,0.2)',
              marginRight: 8
            }}
            className="dash-menu-button"
          >
            ☰
          </button>
        )}
        <div className="logo" onClick={handleHomeClick}>
          <img src={getLogo()} alt="Kaari Logo" />
        </div>
        {/* Mobile hamburger */}
        <button
          className="mobile-menu-button"
          aria-label="Open menu"
          onClick={() => {
            setMobileMenuVisible(true);
            requestAnimationFrame(() => setMobileMenuOpen(true));
          }}
        >
          <span className="bar" />
        </button>
        
        {/* header search removed */}
        
        <div className="nav-links">
          {renderSwitchRoleLink()}
          
          {renderLanguageButton()}
          
          {renderNavIcons()}
          
          <div className="link" onClick={handleHelpClick}>
            {t('common.help')}
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

      {/* Mobile slide-over mount point (for future menu) */}
      {mobileMenuVisible && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1100,
            background: `rgba(0,0,0,${mobileMenuOpen ? 0.5 : 0})`, display: 'flex', justifyContent: 'flex-end',
            transition: 'background 250ms ease'
          }}
          onClick={closeMobileMenu}
        >
          <div
            style={{
              width: '80%', maxWidth: 360, height: '100%', background: '#fff',
              boxShadow: '0 0 30px rgba(0,0,0,0.2)', transform: `translateX(${mobileMenuOpen ? 0 : 100}%)`, display: 'flex', flexDirection: 'column',
              transition: 'transform 250ms ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              .mm-link { 
                text-align: left; background: transparent; border: 0; padding: 14px 12px; cursor: pointer; 
                display: flex; align-items: center; gap: 12px; width: 100%; font-size: 16px; font-weight: 600; border-radius: 12px; color: #222;
                transition: background 0.2s ease, transform 0.02s ease; 
              }
              .mm-link:hover { background: ${Theme.colors.tertiary}; }
              .mm-link:active { transform: scale(0.995); background: ${Theme.colors.primary}10; }
              .mm-footer { margin-top: auto; padding-top: 12px; border-top: 1px solid #eee; }
              .mm-locale { display: flex; align-items: center; gap: 10px; padding: 10px 8px; }
              .mm-locale-switch { display: flex; align-items: center; }
            `}</style>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={getLogo()} alt="Kaari" style={{ height: 28 }} />
              </div>
              <button
                aria-label="Close menu"
                onClick={closeMobileMenu}
                style={{ background: 'transparent', border: 0, fontSize: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <IoClose />
              </button>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button onClick={() => { handleHomeClick(); closeMobileMenu(); }} className="mm-link">
                <IoHomeOutline size={20} color={Theme.colors.secondary} /> Home
              </button>
              <button onClick={() => { navigate('/properties'); closeMobileMenu(); }} className="mm-link">
                <IoGridOutline size={20} color={Theme.colors.secondary} /> Browse properties
              </button>
              <button onClick={() => { handleHelpClick(); closeMobileMenu(); }} className="mm-link">
                <IoHelpCircleOutline size={20} color={Theme.colors.secondary} /> Help
              </button>
              {isUserAuthenticated ? (
                <>
                  <button onClick={() => { handleFavoritesClick(); closeMobileMenu(); }} className="mm-link">
                    <IoHeartOutline size={20} color={Theme.colors.secondary} /> Favourites
                  </button>
                  {userType === 'advertiser' ? (
                    <button onClick={() => { handleCameraClick(); closeMobileMenu(); }} className="mm-link">
                      <IoCameraOutline size={20} color={Theme.colors.secondary} /> Book photoshoot
                    </button>
                  ) : (
                    <button onClick={() => { handlePropertiesClick(); closeMobileMenu(); }} className="mm-link">
                      <IoGridOutline size={20} color={Theme.colors.secondary} /> My dashboard
                    </button>
                  )}
                  <button onClick={() => { setShowSignOutModal(true); closeMobileMenu(); }} className="mm-link" style={{ color: '#c00' }}>
                    <IoLogOutOutline size={20} color={Theme.colors.secondary} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { handleSignIn(); closeMobileMenu(); }} className="mm-link">
                    <IoLogInOutline size={20} color={Theme.colors.secondary} /> Sign in
                  </button>
                </>
              )}
              <div className="mm-footer">
                <div className="mm-locale">
                  <IoGlobeOutline size={20} color={Theme.colors.secondary} />
                  <div className="mm-locale-switch"><LanguageSwitcher /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authModalMode}
        referralCode={referralCode}
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