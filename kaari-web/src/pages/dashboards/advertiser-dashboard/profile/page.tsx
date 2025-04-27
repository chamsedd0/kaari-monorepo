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
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState(t('advertiser_dashboard.profile.profile_section'));

    const renderSection = () => {
        switch (activeSection) {
            case t('advertiser_dashboard.profile.profile_section'):
                return <ProfileSection />;
            case t('advertiser_dashboard.profile.documents_section'):
                return <SupportingDocumentsPage />;
            case t('advertiser_dashboard.profile.recommend_section'):
                return <RecommendToFriendPage />;
            case t('advertiser_dashboard.profile.contact_section'):
                return <ContactDetailsPage />;
            case t('advertiser_dashboard.profile.password_section'):
                return <ChangePasswordPage />;
            case t('advertiser_dashboard.profile.payout_section'):
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
            </div>
        </ProfilePageStyle>
    );
};

export default ProfilePage;
