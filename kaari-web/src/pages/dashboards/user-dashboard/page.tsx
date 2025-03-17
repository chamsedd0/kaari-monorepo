import React, { useState, useEffect } from 'react';
import { NavigationPannel } from '../../../components/skeletons/constructed/dashboard-navigation-pannel/navigation-pannel';
import { WhiteHeaderUsers } from '../../../components/skeletons/constructed/headers/header-users-white';
import { UserDashboardStyle } from './styles';
import LoadingScreen from '../../../components/loading/LoadingScreen';

// Import all section pages
import ProfilePage from './profile/page';
import MessagesPage from './messages/page';
import ReservationsPage from './reservations/page';
import ReviewsPage from './reviews/page';
import PaymentsPage from './payments/page';
import PerksPage from './perks/page';
import SettingsPage from './settings/page';
import ContactsPage from './contacts/page';
import FAQsPage from './FAQs/page';

type Section = 'profile' | 'messages' | 'reservations' | 'reviews' | 'payments' | 'perks' | 'settings' | 'contacts' | 'faq';

const UserDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>('profile');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSectionLoading, setIsSectionLoading] = useState(false);

    // Initial loading when the dashboard first loads
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Show loading screen for 1.5 seconds
        
        return () => clearTimeout(timer);
    }, []);

    // Loading when switching between sections
    useEffect(() => {
        if (isLoading) return; // Skip if initial loading is still happening
        
        setIsSectionLoading(true);
        setIsAnimating(true);
        
        const animationTimer = setTimeout(() => {
            setIsAnimating(false);
        }, 300);
        
        const loadingTimer = setTimeout(() => {
            setIsSectionLoading(false);
        }, 800); // Show section loading for 800ms
        
        return () => {
            clearTimeout(animationTimer);
            clearTimeout(loadingTimer);
        };
    }, [activeSection, isLoading]);

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfilePage />;
            case 'messages':
                return <MessagesPage />;
            case 'reservations':
                return <ReservationsPage />;
            case 'reviews':
                return <ReviewsPage />;
            case 'payments':
                return <PaymentsPage />;
            case 'perks':
                return <PerksPage />;
            case 'settings':
                return <SettingsPage />;
            case 'contacts':
                return <ContactsPage />;
            case 'faq':
                return <FAQsPage />;
            default:
                return <ProfilePage />;
        }
    };

    return (
        <>
            <LoadingScreen isLoading={isLoading || isSectionLoading} />
            <div style={{ display: 'flex', maxWidth: '1500px', margin: '0 auto' }}>
                <WhiteHeaderUsers user={true} />
                <NavigationPannel 
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <UserDashboardStyle>
                    <div className={`section-container ${isAnimating ? 'animating' : ''}`}>
                        {renderSection()}
                    </div>
                </UserDashboardStyle>
            </div>
        </>
    );
};

export default UserDashboard;
