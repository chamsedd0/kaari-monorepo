import React, { useState, useEffect, lazy } from 'react';
import { NavigationPannelAdviser } from '../../../components/skeletons/constructed/dashboard-navigation-pannel/navigation-pannel-adviser';
import { AdvertiserDashboardStyle } from './styles';
import LoadingScreen from '../../../components/loading/LoadingScreen';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import eventBus from '../../../utils/event-bus';
import DashboardFooter from '../../../components/skeletons/constructed/footer/dashboard-footer';
// import PhotoshootBanner from '../../../components/skeletons/banners/photoshoot-banner';

// Import all section pages
import DashboardPage from './dashboard/page';
import ProfilePage from './profile/page';
import MessagesPage from './messages/page';
import PropertyPage from './properties/page';
import PropertyEditRequestPage from './properties/edit-request/page';
import ReservationsPage from './reservations/page';
import ReviewsPage from './reviews/page';
import PaymentsPage from './payments/page';
import TenantsPage from './tenants/page';
import PhotoshootsPage from './photoshoot/page';
import SupportPage from './support/page';
import ReferralProgramPage from './referral-program/page';

// Export the dashboard page directly for direct access
export { default as AdvertiserDashboardPage } from './dashboard/page';

type Section = 'Dashboard' | 'MyProfile' | 'Messages' | 'Properties' | 'Reservations' | 'Reviews' | 'Payments' | 'Tenants' | 'Photoshoot' | 'Support' | 'ReferralProgram';

// Map URL segments to section names for better readability in the URL
const URL_TO_SECTION: Record<string, Section> = {
    '': 'Dashboard',
    'dashboard': 'Dashboard',
    'profile': 'MyProfile',
    'messages': 'Messages',
    'properties': 'Properties',
    'reservations': 'Reservations',
    'reviews': 'Reviews',
    'payments': 'Payments',
    'tenants': 'Tenants',
    'photoshoot': 'Photoshoot',
    'support': 'Support',
    'referral-program': 'ReferralProgram'
};

// Map section names to URL segments for navigation
const SECTION_TO_URL: Record<Section, string> = {
    'Dashboard': 'dashboard',
    'MyProfile': 'profile',
    'Messages': 'messages',
    'Properties': 'properties',
    'Reservations': 'reservations',
    'Reviews': 'reviews',
    'Payments': 'payments',
    'Tenants': 'tenants',
    'Photoshoot': 'photoshoot',
    'Support': 'support',
    'ReferralProgram': 'referral-program'
};

// Map section names to translation keys
const SECTION_TO_TRANSLATION: Record<Section, string> = {
    'Dashboard': 'advertiser_dashboard.sections.dashboard',
    'MyProfile': 'advertiser_dashboard.sections.my_profile',
    'Messages': 'advertiser_dashboard.sections.messages',
    'Properties': 'advertiser_dashboard.sections.properties',
    'Reservations': 'advertiser_dashboard.sections.reservations',
    'Reviews': 'advertiser_dashboard.sections.reviews',
    'Payments': 'advertiser_dashboard.sections.payments',
    'Tenants': 'advertiser_dashboard.sections.tenants',
    'Photoshoot': 'advertiser_dashboard.sections.photoshoot',
    'Support': 'advertiser_dashboard.sections.support',
    'ReferralProgram': 'advertiser_dashboard.sections.referral_program'
};

const AdvertiserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    
    // State for showing/hiding the photoshoot banner
    const [showPhotoshootBanner, setShowPhotoshootBanner] = useState(() => {
        // Check localStorage for banner visibility state
        const savedState = localStorage.getItem('showPhotoshootBanner');
        // If it's not set yet or set to "true", show the banner
        return savedState === null || savedState === "true";
    });
    
    // Handle banner close
    const handleBannerClose = () => {
        setShowPhotoshootBanner(false);
        localStorage.setItem('showPhotoshootBanner', 'false');
    };
    
    // Check if we're at the root path of advertiser dashboard
    const isRootPath = location.pathname === '/dashboard/advertiser' || location.pathname === '/dashboard/advertiser/';
    
    // If we're at the root path, redirect to the dashboard page
    useEffect(() => {
        if (isRootPath) {
            navigate('/dashboard/advertiser/dashboard');
        }
    }, [isRootPath, navigate]);
    
    // Get the current section from the URL
    const getInitialSection = (): Section => {
        const path = location.pathname.split('/');
        const sectionFromUrl = path[path.length - 1];
        return URL_TO_SECTION[sectionFromUrl] || 'Dashboard';
    };
    
    const [activeSection, setActiveSection] = useState<Section>(getInitialSection());
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSectionLoading, setIsSectionLoading] = useState(false);

    // Update URL when section changes
    const handleSectionChange = (section: Section) => {
        const url = SECTION_TO_URL[section];
        navigate(`/dashboard/advertiser/${url}`);
        setActiveSection(section);
        setIsSidebarOpen(false);
    };

    // Update active section when URL changes
    useEffect(() => {
        const newSection = getInitialSection();
        // Check if we're on the property edit request page and set active section to Properties
        if (location.pathname.includes('/properties/edit-request/')) {
            setActiveSection('Properties');
        } else if (newSection !== activeSection) {
            setActiveSection(newSection);
        }
    }, [location.pathname]);

    // Sidebar open (mobile/tablet)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNarrow, setIsNarrow] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 1200 : false);

    useEffect(() => {
        const onResize = () => setIsNarrow(window.innerWidth <= 1200);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Listen for header menu button toggle
    useEffect(() => {
        const unsubscribe = eventBus.on('dashboard:toggleSidebar', (payload: any) => {
            if (payload && typeof payload.open === 'boolean') {
                setIsSidebarOpen(payload.open);
            } else {
                setIsSidebarOpen(true);
            }
        });
        return () => { unsubscribe(); };
    }, []);

    // Lock body scroll when sidebar is open on small screens
    useEffect(() => {
        if (isSidebarOpen && isNarrow) {
            const original = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = original; };
        }
    }, [isSidebarOpen, isNarrow]);

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

    // If we're at the root path, show loading until redirect happens
    if (isRootPath) {
        return <LoadingScreen isLoading={true} />;
    }

    // Check if the current path is the property edit request page
    const isPropertyEditRequest = location.pathname.includes('/properties/edit-request/');
    
    // Modify the renderSection function to handle the property edit request case
    const renderSection = () => {
        // If the URL matches the property edit request pattern, render that component
        if (isPropertyEditRequest) {
            return <PropertyEditRequestPage />;
        }
        
        // Handle referral program sub-routes
        if (location.pathname.includes('/referral-program/performance')) {
            // Import using the index file
            const PerformancePage = lazy(() => import('./referral-program/performance'));
            return (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <PerformancePage />
                </React.Suspense>
            );
        }
        
        if (location.pathname.includes('/referral-program/simulator')) {
            // Import using the index file
            const SimulatorPage = lazy(() => import('./referral-program/simulator'));
            return (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <SimulatorPage />
                </React.Suspense>
            );
        }
        
        // Otherwise use the standard section rendering logic
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
                return <SupportPage />;
            case 'ReferralProgram':
                return <ReferralProgramPage />;
        }
    };

    // Get translated section names for the navigation panel
    const getTranslatedSectionName = (section: Section): string => {
        return t(SECTION_TO_TRANSLATION[section]);
    };

    return (
        <>
            <LoadingScreen isLoading={isLoading || isSectionLoading} />
            <div style={{ display: 'flex', maxWidth: '1500px', margin: '0 auto', position: 'relative', width: '100%', overflowX: 'hidden' }}>

                {/* Dim background when sidebar is open on small screens */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 80,
                            left: 0,
                            width: '100%',
                            height: 'calc(100vh - 80px)',
                            background: 'rgba(0,0,0,0.25)',
                            zIndex: 59
                        }}
                    />
                )}

                <NavigationPannelAdviser 
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    getTranslatedSectionName={getTranslatedSectionName}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <AdvertiserDashboardStyle>
                    <div className={`section-container ${isAnimating ? 'animating' : ''}`}>
                        {renderSection()}
                    </div>
                </AdvertiserDashboardStyle>
            </div>
            <DashboardFooter />
        </>
    );
};

export default AdvertiserDashboard;
