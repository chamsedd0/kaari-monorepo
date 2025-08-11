import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderBlogStyle } from '../../../styles/constructed/headers/header-blog-style';
import Logo from '../../icons/LogoPurple.svg';
import { HeartIcon } from "../../icons/heartIcon";
import { Theme } from "../../../../theme/theme";
import { useStore } from '../../../../backend/store';
import { AuthModal } from '../modals/auth-modal';
import { SignOutConfirmationModal } from '../modals/signout-confirmation-modal';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import ProfilePic from '../../../../assets/images/ProfilePicture.png';
import { signOut } from '../../../../backend/firebase/auth';

export const HeaderBlog: React.FC = () => {
  const navigate = useNavigate();
  
  // Use individual selectors to avoid unnecessary re-renders
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const userName = useStore(state => state.user?.name || 'User');
  const userEmail = useStore(state => state.user?.email);
  const userProfilePic = useStore(state => state.user?.profilePicture);
  const setUser = useStore(state => state.setUser);
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
  
  // Modal visibility states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleFavoritesClick = () => {
    if (isAuthenticated) {
      navigate('/favourites');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/blog/category/${category.toLowerCase()}`);
  };

  const handleSignIn = () => {
    if (isAuthenticated) {
      setShowProfileDropdown(!showProfileDropdown);
    } else {
      setShowAuthModal(true);
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
      <HeaderBlogStyle>
        <div className="wrapper">
          <div className="logo">
            <img src={Logo} alt="Kaari Logo" onClick={handleHomeClick} />
          </div>
          
          <div className="categories">
            <div className="category" onClick={() => handleCategoryClick('Lifestyle')}>
              Lifestyle
            </div>
            <div className="category" onClick={() => handleCategoryClick('Travel')}>
              Travel
            </div>
            <div className="category" onClick={() => handleCategoryClick('Tips')}>
              Tips
            </div>
            <div className="category" onClick={() => handleCategoryClick('News')}>
              News
            </div>
          </div>
          
          <div className="nav-links">
            <div className="heart-icon" onClick={handleFavoritesClick}>
              <HeartIcon bgColor={Theme.colors.primary} />
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
                    // @ts-expect-error legacy prop
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
      </HeaderBlogStyle>

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

export default HeaderBlog; 