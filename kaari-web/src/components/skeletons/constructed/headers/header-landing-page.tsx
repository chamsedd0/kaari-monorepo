import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderLandingPageStyle } from '../../../styles/constructed/headers/header-landing-page-style';
import Logo from '../../icons/LogoWhite.svg';
import { HeartIcon } from "../../icons/heartIcon";
import { Theme } from "../../../../theme/theme";
import { useStore } from '../../../../backend/store';
import { AuthModal } from '../modals/auth-modal';
import { LogoutConfirmationModal } from '../modals/logout-confirmation-modal';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import ProfilePic from '../../../../assets/images/ProfilePicture.png';

interface HeaderLandingPageProps {
  onLanguageChange?: (lang: string) => void;
}

export const HeaderLandingPage: React.FC<HeaderLandingPageProps> = ({ onLanguageChange }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // Use individual selectors to avoid unnecessary re-renders
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const userName = useStore(state => state.user?.name || 'User');
  const userEmail = useStore(state => state.user?.email);
  const userProfilePic = useStore(state => state.user?.profilePicture);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
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
  }, [scrolled]);
  
  // Re-render component when authentication state changes
  useEffect(() => {
    // This empty dependency array effect will make the component 
    // re-render when isAuthenticated changes
  }, [isAuthenticated]);

  const handleSignIn = () => {
    if (isAuthenticated) {
      setShowProfileDropdown(!showProfileDropdown);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLandlordClick = () => {
    navigate('/for-advertisers');
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  const handleLanguageChange = () => {
    if (onLanguageChange) {
      onLanguageChange('ENG');
    }
  };

  const handleFavoritesClick = () => {
    if (isAuthenticated) {
      navigate('/favourites');
    } else {
      setShowAuthModal(true);
    }
  };

  const displayName = isAuthenticated ? `Hi, ${userName.split(' ')[0]}` : 'Sign in';

  return (
    <>
      <HeaderLandingPageStyle scrolled={scrolled}>
        <div className="wrapper">
          <div className="logo">
            <img src={Logo} alt="Kaari Logo" onClick={() => navigate('/')} />
          </div>
          
          <div className="nav-links">
            <div className="link" onClick={handleLandlordClick}>
              Are you a landlord?
            </div>
            
            <div className="language-container" onClick={handleLanguageChange}>
              <p>ENG</p>
            </div>
            
            <div className="heart-icon" onClick={handleFavoritesClick}>
              <HeartIcon bgColor={Theme.colors.white} />
            </div>
            
            <div className="link" onClick={handleHelpClick}>
              Help
            </div>
            
            <div className="sign-in" onClick={handleSignIn} style={{ position: 'relative' }}>
              {isAuthenticated ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{displayName}</span>
                    <img 
                      src={userProfilePic || ProfilePic} 
                      alt={userName}
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  <ProfileDropdown
                    isOpen={showProfileDropdown}
                    onClose={() => setShowProfileDropdown(false)}
                    userName={userName}
                    userEmail={userEmail || "user@example.com"}
                    userImage={userProfilePic || ProfilePic}
                    onLogout={() => {
                      setShowProfileDropdown(false);
                      setShowLogoutModal(true);
                    }}
                  />
                </>
              ) : (
                'Sign in'
              )}
            </div>
          </div>
        </div>
      </HeaderLandingPageStyle>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode="signin"
        onSuccess={() => {
          // Force re-render of component after successful login
          setTimeout(() => window.location.reload(), 100);
        }}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default HeaderLandingPage; 