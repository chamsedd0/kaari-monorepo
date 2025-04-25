import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/skeletons/constructed/footer/footer';
import UnifiedHeader from '../components/skeletons/constructed/headers/unified-header';
import { useStore } from '../backend/store';
import eventBus, { AUTH_EVENTS } from '../utils/event-bus';
import styled from 'styled-components';

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
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  const [, forceUpdate] = useState({});
  
  // Force re-render when authentication state changes
  useEffect(() => {
    const handleAuthChange = () => {
      // This will trigger a re-render
      forceUpdate({});
    };
    
    // Listen for authentication events
    const unsubscribe = eventBus.on(AUTH_EVENTS.AUTH_STATE_CHANGED, handleAuthChange);
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Determine if user is advertiser, client, or admin
  const isAdvertiser = user?.role === 'advertiser';
  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';
  
  // Get userType based on role
  const getUserType = (): "user" | "admin" | "advertiser" => {
    if (isAdvertiser) return 'advertiser';
    if (isClient) return 'user';
    if (isAdmin) return 'admin';
    
    // Default based on path if not authenticated
    if (location.pathname === '/for-advertisers') return 'advertiser';
    return 'user';
  };
  
  // Centralized header configuration based on route path
  const getHeaderConfig = () => {
    const userType = getUserType();
    
    // Landing pages
    if (location.pathname === '/') {
      return {
        variant: 'landing' as const,
        userType: 'user' as const,
        isAuthenticated
      };
    }
    
    // Advertiser landing
    if (location.pathname === '/for-advertisers') {
      return {
        variant: 'advertiser-landing' as const,
        userType: 'advertiser' as const,
        isAuthenticated,
        customLink: {
          text: "Looking for a place?",
          onClick: () => window.location.href = '/'
        }
      };
    }
    
    // User dashboard pages
    if (location.pathname.startsWith('/dashboard/user')) {
      return {
        variant: 'white' as const,
        userType: 'user' as const,
        isAuthenticated: true,
        showSearchBar: true
      };
    }
    
    // Advertiser dashboard pages
    if (location.pathname.startsWith('/dashboard/advertiser')) {
      return {
        variant: 'white' as const,
        userType: 'advertiser' as const,
        isAuthenticated: true,
        showSearchBar: true
      };
    }
    
    // Admin uses a custom header, not UnifiedHeader
    if (location.pathname.startsWith('/dashboard/admin')) {
      return null;
    }
    
    // Checkout process
    if (location.pathname.startsWith('/checkout-process')) {
      return {
        variant: 'white' as const,
        userType: 'user' as const,
        isAuthenticated
      };
    }
    
    // Property list
    if (location.pathname.startsWith('/properties')) {
      return {
        variant: 'white' as const,
        userType: 'user' as const,
        isAuthenticated,
        showSearchBar: true
      };
    }
    
    // Property detail page
    if (location.pathname.startsWith('/property/')) {
      return {
        variant: 'white' as const,
        userType: 'user' as const,
        isAuthenticated,
        showSearchBar: true
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
    
    return true;
  };
  
  return (
    <>
      <SkipLink href="#main-content" className="skip-to-content">
        Skip to content
      </SkipLink>
      {headerConfig && <UnifiedHeader {...headerConfig} />}
      <MainContent id="main-content" tabIndex={-1}>{children}</MainContent>
      {shouldShowFooter() && <Footer />}
    </>
  );
};

export default MainLayout; 