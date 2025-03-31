import React, { useState } from 'react';
import { ProfilePageStyle } from './styles';
import { NavigationCard } from '../../../../components/skeletons/cards/navigation-card';
import { GoogleCard } from '../../../../components/skeletons/cards/google-card';
import ProfileSection from './sections/profile-section/page';
import SupportingDocumentsPage from './sections/supporting-documents/page';
import RecommendToFriendPage from './sections/recommend-to-friend/page';
import ContactDetailsPage from './sections/contact-details/page';
import ChangePasswordPage from './sections/change-password/page';
import PayoutMethodPage from './sections/payout-method/page';

const ProfilePage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('profile');

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSection />;
            case 'documents':
                return <SupportingDocumentsPage />;
            case 'recommend':
                return <RecommendToFriendPage />;
            case 'contact':
                return <ContactDetailsPage />;
            case 'password':
                return <ChangePasswordPage />;
            case 'payout':
                return <PayoutMethodPage />;

            default:
                return <ProfileSection />;
        }
    };

    return (
        <ProfilePageStyle>
            <div className="left">
                {renderSection()}
            </div>
            <div className="right">
                <NavigationCard 
                    activeSection={activeSection} 
                    onSectionChange={setActiveSection} 
                />
                <GoogleCard 
                    title="Connect to Google" 
                    description="Connect your Google account to your Kaari account to easily sign in and access your reservations." 
                />
            </div>
        </ProfilePageStyle>
    );
};

export default ProfilePage;
