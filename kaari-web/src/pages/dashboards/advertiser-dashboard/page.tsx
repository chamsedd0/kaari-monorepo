import React, { useState, useEffect } from 'react';
import { NavigationPannelAdviser } from '../../../components/skeletons/constructed/dashboard-navigation-pannel/navigation-pannel-adviser';
import UnifiedHeader from '../../../components/skeletons/constructed/headers/unified-header';
import { AdvertiserDashboardStyle } from './styles';
import LoadingScreen from '../../../components/loading/LoadingScreen';

// Import all section pages
import DashboardPage from './dashboard/page';
import ProfilePage from './profile/page';
import MessagesPage from './messages/page';
import PropertyPage from './properties/page';
import ReservationsPage from './reservations/page';
import ReviewsPage from './reviews/page';
import PaymentsPage from './payments/page';
import TenantsPage from './tenants/page';
import PhotoshootsPage from './photoshoot/page';
import SupprotPage from './support/page';




type Section = 'Dashboard' | 'MyProfile' | 'Messages' | 'Properties' | 'Reservations' | 'Reviews' | 'Payments' | 'Tenants' | 'Photoshoot' | 'Support';

const AdvertiserDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>('Dashboard');
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
            case 'Dashboard':
                return <DashboardPage />;
            case 'MyProfile':
                return <ProfilePage />;
            case 'Messages':
                return <MessagesPage />;
            case 'Properties':
                return <PropertyPage />;
            case 'Reservations':
                return <ReservationsPage />;
            case 'Reviews':
                return <ReviewsPage />;
            case 'Payments':
                return <PaymentsPage />;
            case 'Tenants':
                return <TenantsPage />;
            case 'Photoshoot':
                return <PhotoshootsPage />;
            case 'Support':
                return <SupprotPage />;
        }
    };

    return (
        <>
            <LoadingScreen isLoading={isLoading || isSectionLoading} />
            <div style={{ display: 'flex', maxWidth: '1500px', margin: '0 auto' }}>
                <UnifiedHeader 
                    variant="white" 
                    userType="advertiser" 
                    isAuthenticated={true}
                    showSearchBar={true} 
                />
                <NavigationPannelAdviser 
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <AdvertiserDashboardStyle>
                    <div className={`section-container ${isAnimating ? 'animating' : ''}`}>
                        {renderSection()}
                    </div>
                </AdvertiserDashboardStyle>
            </div>
        </>
    );
};

export default AdvertiserDashboard;
