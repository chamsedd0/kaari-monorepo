import React, { useState, useEffect } from 'react';
import { NavigationPannel } from '../../../components/skeletons/constructed/dashboard-navigation-pannel/navigation-pannel';
import { UserDashboardStyle } from './styles';
import LoadingScreen from '../../../components/loading/LoadingScreen';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import DashboardFooter from '../../../components/skeletons/constructed/footer/dashboard-footer';

// Import all section pages
import ProfilePage from './profile/page';
import MessagesPage from './messages/page';
import ReservationsPage from './reservations/page';
import ReviewsPage from './reviews/page';
import WriteReviewPage from './reviews/write/page';
import MyReviewsPage from './reviews/my-reviews/page';
import PaymentsPage from './payments/page';
import PerksPage from './perks/page';
import SettingsPage from './settings/page';
import ContactsPage from './contacts/page';
import FAQsPage from './FAQs/page';
import ReservationStatusPage from './reservation-status/page';

type Section = 'profile' | 'messages' | 'reservations' | 'reviews' | 'payments' | 'perks' | 'settings' | 'contacts' | 'faq' | 'reservation-status';

// Map URL segments to section names for better readability in the URL
const URL_TO_SECTION: Record<string, Section> = {
    '': 'profile',
    'profile': 'profile',
    'messages': 'messages',
    'reservations': 'reservations',
    'reviews': 'reviews',
    'payments': 'payments',
    'perks': 'perks',
    'settings': 'settings',
    'contacts': 'contacts',
    'faq': 'faq',
    'reservation-status': 'reservation-status'
};

const UserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get the current section from the URL
    const getInitialSection = (): Section => {
        const path = location.pathname.split('/');
        
        // Special cases for nested routes
        if (location.pathname.includes('/dashboard/user/reviews/')) {
            return 'reviews';
        }
        
        // Special case for the /account, /payments, and /reservations routes
        if (location.pathname.startsWith('/account')) {
            return 'profile';
        }
        if (location.pathname.startsWith('/payments')) {
            return 'payments';
        }
        if (location.pathname.startsWith('/reservations')) {
            return 'reservations';
        }
        
        // For normal sections, get the last part of the URL
        const sectionFromUrl = path[path.length - 1];
        return URL_TO_SECTION[sectionFromUrl] || 'profile';
    };
    
    const [activeSection, setActiveSection] = useState<Section>(getInitialSection());
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSectionLoading, setIsSectionLoading] = useState(false);

    // Update URL when section changes
    const handleSectionChange = (section: Section) => {
        // Handle direct routes
        if (location.pathname.startsWith('/account') ||
            location.pathname.startsWith('/payments') ||
            location.pathname.startsWith('/reservations')) {
            navigate(`/dashboard/user/${section}`);
        } else {
            navigate(`/dashboard/user/${section}`);
        }
        setActiveSection(section);
    };

    // Update active section when URL changes
    useEffect(() => {
        const newSection = getInitialSection();
        if (newSection !== activeSection) {
            setActiveSection(newSection);
        }
    }, [location.pathname]);

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

    // Updated renderSection function to handle nested routes for reviews
    const renderSection = () => {
        // Special handling for review sub-pages
        if (location.pathname.includes('/dashboard/user/reviews/write')) {
            return <WriteReviewPage />;
        } else if (location.pathname.includes('/dashboard/user/reviews/my-reviews')) {
            return <MyReviewsPage />;
        }
        
        // Default sections
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
            case 'reservation-status':
                return <ReservationStatusPage />;
            default:
                return <ProfilePage />;
        }
    };

    return (
        <>
            <LoadingScreen isLoading={isLoading || isSectionLoading} />
            <div style={{ display: 'flex', maxWidth: '1500px', margin: '0 auto' }}>
                <NavigationPannel 
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />
                <UserDashboardStyle>
                    <div className={`section-container ${isAnimating ? 'animating' : ''}`}>
                        {renderSection()}
                    </div>
                </UserDashboardStyle>
            </div>
            <DashboardFooter />
        </>
    );
};

export default UserDashboard;
