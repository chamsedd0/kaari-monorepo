import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderLandingPageStyle } from '../../../styles/constructed/headers/header-landing-page-style';
import Logo from '../../icons/LogoWhite.svg';
import { HeartIcon } from "../../icons/heartIcon";
import { Theme } from "../../../../theme/theme";
import { useStore } from '../../../../backend/store';
import { AuthModal } from '../modals/auth-modal';
import { SignOutConfirmationModal } from '../modals/signout-confirmation-modal';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import ProfilePic from '../../../../assets/images/ProfilePicture.png';
import { signOut } from '../../../../backend/firebase/auth';

interface HeaderAdvertisersLandingProps {
  onLanguageChange?: (lang: string) => void;
}

export const HeaderAdvertisersLanding: React.FC<HeaderAdvertisersLandingProps> = ({ onLanguageChange }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // Use individual selectors to avoid unnecessary re-renders
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const userName = useStore(state => state.user?.name || 'User');
  const userEmail = useStore(state => state.user?.email);
  const userProfilePic = useStore(state => state.user?.profilePicture);
  const setUser = useStore(state => state.setUser);
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
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

  const handleSignIn = () => {
    if (isAuthenticated) {
      setShowProfileDropdown(!showProfileDropdown);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleTenantClick = () => {
    navigate('/');
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  const handleFavoritesClick = () => {
    if (isAuthenticated) {
      navigate('/favourites');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLanguageChange = () => {
    if (onLanguageChange) {
      onLanguageChange('ENG');
    }
  };

  const handleSignOut = async () => {
    try {
      // Close the modal
      setShowSignOutModal(false);
      
      // Using the direct Firebase approach
      await signOut();
      
      // Manually update the store state
      setUser(null);
      setIsAuthenticated(false);
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <HeaderLandingPageStyle scrolled={scrolled}>
        <div className="wrapper">
          <div className="logo">
            <img src={Logo} alt="Kaari Logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }} />
          </div>
          
          <div className="nav-links">
            <div className="link" onClick={handleTenantClick}>
              Are you a tenant?
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
                    <span>{`Hi, ${userName.split(' ')[0]}`}</span>
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
                    // @ts-expect-error prop signature mismatch for this legacy component usage
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

export default HeaderAdvertisersLanding; 