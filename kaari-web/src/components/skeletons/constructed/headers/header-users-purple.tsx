import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderPurpleUsers } from '../../../styles/constructed/headers/header-purple-users-style';
import Logo from '../../icons/LogoWhite.svg'
import { HeartIcon } from "../../icons/heartIcon";
import ProfilePic from '../../../../assets/images/ProfilePicture.png'
import LanguageBanner from "../../banners/status/banner-base-model-language";
import { Theme } from "../../../../theme/theme";
import { House } from '../../icons/HouseIcon';
import { Notifications } from '../../icons/NotificationsIcon';
import { MessageBubble } from '../../icons/messageBubbleIcon';
import { useStore } from "../../../../backend/store";
import { AuthModal } from "../modals/auth-modal";
import { SignOutConfirmationModal } from "../modals/signout-confirmation-modal";
import { ProfileDropdown } from "../profile-dropdown/profile-dropdown";
import { signOut } from '../../../../backend/firebase/auth';

export const PurpleHeaderUsers = () => {
    const navigate = useNavigate();
    
    // Use individual selectors to avoid re-render loops
    const isAuthenticated = useStore(state => state.isAuthenticated);
    const userRole = useStore(state => state.user?.role);
    const userProfilePic = useStore(state => state.user?.profilePicture);
    const userName = useStore(state => state.user?.name);
    const userEmail = useStore(state => state.user?.email);
    const setUser = useStore(state => state.setUser);
    const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
    
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    
    const handleSignIn = () => {
        if (isAuthenticated) {
            setShowSignOutModal(true);
        } else {
            setShowAuthModal(true);
        }
    };
    
    const handleProfileClick = () => {
        if (isAuthenticated) {
            setShowProfileDropdown(!showProfileDropdown);
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
    
    const handleLandlordClick = () => {
        navigate('/for-advertisers');
    };
    
    const handleHelpClick = () => {
        navigate('/help');
    };
    
    const handleHomeClick = () => {
        navigate('/');
    };
    
    const handleMessagesClick = () => {
        if (isAuthenticated) {
            navigate('/messages');
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

    const handleSignOut = async () => {
        try {
            // Close the modal first
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
            {isAuthenticated ? (
                <HeaderPurpleUsers>
                    <div className="wrapper">
                    <div className="logo" onClick={handleHomeClick}>
                        <img src={Logo} alt="Kaari Logo" />
                    </div>
                    
                    <div className="nav-links">
                        <div className="link" onClick={handleHelpClick}>Help</div>
                        <LanguageBanner text="ENG"></LanguageBanner>

                        <div className="favorites" onClick={handleHomeClick}>
                            <House bgColor={Theme.colors.white}></House>
                        </div>

                        <div className="favorites" onClick={handleMessagesClick}>
                            <MessageBubble bgColor={Theme.colors.white}></MessageBubble>
                        </div>
                        
                        <div className="favorites" onClick={handleNotificationsClick}>
                            <Notifications bgColor={Theme.colors.white}></Notifications>
                        </div>

                        <div className="favorites" onClick={handleFavoritesClick}>
                            <HeartIcon bgColor={Theme.colors.white}></HeartIcon>
                        </div>
                        
                        <div className="profilePic" onClick={handleProfileClick} style={{ position: 'relative' }}>
                            <img 
                                src={userProfilePic || ProfilePic} 
                                alt={userName || "User profile"} 
                            />
                            
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
                        </div>
                    </div>
                    </div>
                </HeaderPurpleUsers>
                
            ) : (
                <HeaderPurpleUsers>
                    <div className="wrapper">
                    <div className="logo" onClick={handleHomeClick}>
                        <img src={Logo} alt="Kaari Logo" />
                    </div>
                    <div className="nav-links">
                        <div className="link" onClick={handleLandlordClick}>Are you a landlord?</div>
                        <LanguageBanner text="ENG"></LanguageBanner>
                        <div className="favorites" onClick={handleFavoritesClick}>
                            <HeartIcon bgColor={Theme.colors.white}></HeartIcon>
                        </div>
                        <div className="link" onClick={handleHelpClick}>Help</div>
                        <div className="link" onClick={handleSignIn}>
                            Sign in
                        </div>
                    </div>
                    </div>
                </HeaderPurpleUsers>
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