import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/skeletons/constructed/footer/footer';
import UnifiedHeader from '../components/skeletons/constructed/headers/unified-header';
import { useStore } from '../backend/store';
import eventBus, { AUTH_EVENTS, EventType } from '../utils/event-bus';
import styled from 'styled-components';
import LoadingScreen from '../components/loading/LoadingScreen';
import ReviewPrompt from '../components/ReviewPrompt';
import { NotificationProvider } from '../contexts/notifications/NotificationContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ChecklistProvider } from '../contexts/checklist/ChecklistContext';

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: #6a5acd;
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s;
  
  &:focus {
    top: 0;
  }
`;

const MainContent = styled.main`
  scroll-margin-top: 100px;
  min-height: 100vh;
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const userRole = useStore(state => state.user?.role || 'user');
  const userType = userRole === 'admin' ? 'admin' : userRole === 'advertiser' ? 'advertiser' : 'user';
  const isAuthenticated = useStore(state => state.isAuthenticated);
  // Add page loading state
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  // Handle page loading
  useEffect(() => {
    // Reset loading state on route change
    setIsPageLoading(true);
    setContentLoaded(false);
    
    // When content is mounted
    const contentTimer = setTimeout(() => {
      setContentLoaded(true);
    }, 100);
    
    // When everything is loaded
    const loadingTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800); // Adjust time as needed
    
    return () => {
      clearTimeout(contentTimer);
      clearTimeout(loadingTimer);
    };
  }, [location.pathname]);
  
  // Listen for app loaded event
  useEffect(() => {
    const handleAppLoaded = () => {
      setIsPageLoading(false);
    };
    
    // Store the unsubscribe function returned by eventBus.on()
    const unsubscribe = eventBus.on(EventType.APP_LOADED, handleAppLoaded);
    
    return () => {
      // Call the unsubscribe function instead of eventBus.off
      unsubscribe();
    };
  }, []);
  
  const getHeaderConfig = () => {
    const dynamicHeaderConfig = {
      userType: userType as 'user' | 'advertiser' | 'admin',
        isAuthenticated
      };
    
    // User Dashboard
    if (location.pathname.startsWith('/dashboard/user')) {
      return {
        variant: 'white' as const,
        userType: 'user' as const,
        isAuthenticated
      };
    }
    
    // Advertiser Dashboard
    if (location.pathname.startsWith('/dashboard/advertiser')) {
      return {
        variant: 'white' as const,
        userType: 'advertiser' as const,
        isAuthenticated
      };
    }
    
    // Admin Dashboard
    if (location.pathname.startsWith('/dashboard/admin')) {
      return {
        variant: 'white' as const,
        userType: 'admin' as const,
        isAuthenticated
      };
    }
    
    // Referral claim/signup pages: hide header entirely
    if (location.pathname.startsWith('/referral/claim-discount') || location.pathname.startsWith('/referral/signup')) {
      return {
        variant: 'white' as const,
        userType: userType,
        isAuthenticated,
        showMinimalHeader: true
      };
    }
    
    // Home page
    if (location.pathname === '/') {
      return {
        variant: 'landing' as const,
        userType: userType,
        isAuthenticated,
        showSearchBar: false
      };
    }
    
    // Property listing page
    if (location.pathname === '/properties') {
      return {
        variant: 'white' as const,
        userType: userType,
        isAuthenticated,
        showSearchBar: true
      };
    }
    
    // Property details page
    if (location.pathname.startsWith('/property/')) {
      return {
        variant: 'white' as const,
        userType: userType,
        isAuthenticated,
        showSearchBar: false
      };
    }
    
    // Checkout process
    if (location.pathname.startsWith('/checkout-process')) {
      return {
        variant: 'white' as const,
        userType: userType,
        isAuthenticated,
        showMinimalHeader: true
      };
    }
    
    // Favorites page
    if (location.pathname.startsWith('/favourites')) {
      return {
        variant: 'white' as const,
        userType: 'user' as const,
        isAuthenticated: true,
        showSearchBar: true
      };
    }
    
    // Photoshoot booking pages
    if (location.pathname.startsWith('/photoshoot-booking')) {
      return {
        variant: 'white' as const,
        userType: userType,
        isAuthenticated
      };
    }
    
    // Advertiser profile showcase
    if (location.pathname.startsWith('/advertiser-profile/')) {
      return {
        variant: 'white' as const,
        userType: 'user' as const,
        isAuthenticated
      };
    }
    
    // Default to white header for other pages
    return {
      variant: 'white' as const,
      userType: userType,
      isAuthenticated
    };
  };
  
  const headerConfig = getHeaderConfig();
  
  // Determine if footer should be shown
  const shouldShowFooter = () => {
    // Don't show footer on dashboard pages
    if (location.pathname.includes('/dashboard')) {
      return false;
    }
    
    // Don't show footer on checkout process
    if (location.pathname.includes('/checkout-process')) {
      return false;
    }
    
    // Don't show footer on referral claim/signup pages
    if (location.pathname.startsWith('/referral/')) {
      return false;
    }
    
    return true;
  };
  
  return (
    <NotificationProvider>
      <ChecklistProvider>
        <LoadingScreen isLoading={isPageLoading} />
        <SkipLink href="#main-content" className="skip-to-content">
          Skip to content
        </SkipLink>
        {headerConfig.showMinimalHeader ? null : (
          <UnifiedHeader
            variant={headerConfig.variant}
            userType={(headerConfig.userType as 'user' | 'advertiser' | 'admin' | 'none')}
            isAuthenticated={headerConfig.isAuthenticated}
            showSearchBar={headerConfig.showSearchBar}
          />
        )}
        <MainContent id="main-content" className={contentLoaded ? 'loaded' : ''}>
          {isPageLoading ? <LoadingScreen isLoading={true} /> : children}
        </MainContent>
        {shouldShowFooter() && contentLoaded && !isPageLoading && <Footer />}
        
        {/* Show review prompt only for authenticated clients */}
        {isAuthenticated && userType === 'user' && <ReviewPrompt />}
      </ChecklistProvider>
    </NotificationProvider>
  );
};

export default MainLayout; 