import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderWhiteUsers } from "../../../styles/constructed/headers/header-white-users-style";
import Logo from '../../../../assets/images/purpleLogo.svg'
import { HeartIcon } from "../../icons/heartIcon";
import ProfilePic from '../../../../assets/images/ProfilePicture.png'
import LanguageBanner from "../../banners/status/banner-base-model-language";
import { Theme } from "../../../../theme/theme";
import { Notifications } from "../../icons/NotificationsIcon";
import { MessageBubble } from "../../icons/messageBubbleIcon";
import { House } from "../../icons/HouseIcon";
import { useStore } from '../../../../backend/store';
import { AuthModal } from '../modals/auth-modal';
import { SignOutConfirmationModal } from '../modals/signout-confirmation-modal';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import { signOut } from '../../../../backend/firebase/auth';

export const WhiteHeaderAdviser = ({advertiser}: {advertiser: boolean}) => {
    const navigate = useNavigate();
    
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

    const handleSignIn = () => {
        if (isAuthenticated) {
            setShowProfileDropdown(!showProfileDropdown);
        } else {
            setShowAuthModal(true);
        }
    };

    const handleHelpClick = () => {
        navigate('/help');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleMessagesClick = () => {
        if (isAuthenticated) {
            navigate('/dashboard/advertiser/messages');
        } else {
            setShowAuthModal(true);
        }
    };

    const handleNotificationsClick = () => {
        if (isAuthenticated) {
            navigate('/notifications');
        } else {
            setShowAuthModal(true);
        }
    };

    const handleFavoritesClick = () => {
        if (isAuthenticated) {
            navigate('/favourites');
        } else {
            setShowAuthModal(true);
        }
    };

    const handlePropertiesClick = () => {
        if (isAuthenticated) {
            navigate('/dashboard/advertiser/properties');
        } else {
            setShowAuthModal(true);
        }
    };

    const handleLandlordClick = () => {
        navigate('/for-advertisers');
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

    return(
        <>
            {advertiser && isAuthenticated ? (
                <HeaderWhiteUsers>
                    <div className="wrapper">
                        <div className="logo">
                            <img src={Logo} alt="Kaari Logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }} />
                        </div>
                        
                        <div className="nav-links">
                            <div className="link" onClick={handleHelpClick}>Help</div>
                            <LanguageBanner text="ENG"></LanguageBanner>

                            <div className="favorites" onClick={handlePropertiesClick}>
                                <House bgColor={Theme.colors.primary}></House>
                            </div>

                            <div className="favorites" onClick={handleMessagesClick}>
                                <MessageBubble bgColor={Theme.colors.primary}></MessageBubble>
                            </div>
                            
                            <div className="favorites" onClick={handleNotificationsClick}>
                                <Notifications bgColor={Theme.colors.primary}></Notifications>
                            </div>

                            <div className="favorites" onClick={handleFavoritesClick}>
                                <HeartIcon bgColor={Theme.colors.primary}></HeartIcon>
                            </div>
                            
                            <div className="profilePic" onClick={handleSignIn} style={{ position: 'relative' }}>
                                <img 
                                  src={userProfilePic || ProfilePic} 
                                  alt={userName}
                                />
                                {showProfileDropdown && (
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
                                )}
                            </div>
                        </div>
                    </div>
                </HeaderWhiteUsers>
            ) : (
                <HeaderWhiteUsers>
                    <div className="wrapper">
                        <div className="logo">
                            <img src={Logo} alt="Kaari Logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="nav-links">
                            <div className="link" onClick={handleLandlordClick}>Are you a landlord?</div>
                            <LanguageBanner text="ENG"></LanguageBanner>
                            <div className="favorites" onClick={handleFavoritesClick}>
                                <HeartIcon bgColor={Theme.colors.primary}></HeartIcon>
                            </div>
                            <div className="link" onClick={handleHelpClick}>Help</div>
                            <div className="link" onClick={handleSignIn}>
                                {isAuthenticated ? `Hi, ${userName.split(' ')[0]}` : 'Sign in'}
                            </div>
                        </div>
                    </div>
                </HeaderWhiteUsers>
            )}

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
}