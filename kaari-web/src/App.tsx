import { Routes, Route, Navigate } from 'react-router-dom';
import PropertyPageComponent from './pages/property-page/page';
import CheckoutPage from './pages/checkout/page';
import UsersLanding from './pages/users-landing/page';
import AdvertisersLanding from './pages/advertisers-landing/page';
import PropertyList from './pages/property-list/page';
import { FavouritesPage } from './pages/favourites/page';
import UserDashboard from './pages/dashboards/user-dashboard/page';
import AdvertiserDashboard from './pages/dashboards/advertiser-dashboard/page';
import AdminDashboard from './pages/dashboards/admin-dashboard/page';
import ProfileShowcasePage from './pages/profile-advertiser-showcase/page';
import PhotoshootBookingPage from './pages/photoshoot-booking/page';
import ThankYouPage from './pages/photoshoot-booking/thank-you';
import HelpPage from './pages/help/page';
import ReservationStatusPage from './pages/dashboards/user-dashboard/reservation-status/page';
import CancellationRequestPage from './pages/dashboards/user-dashboard/cancellation-request/page';
import RefundRequestPage from './pages/dashboards/user-dashboard/refund-request/page';
import { useStore } from './backend/store';
import { useMemo, useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import { isAdmin, isAdvertiser, isRegularUser } from './utils/user-roles';
import eventBus, { EventType } from './utils/event-bus';
import { ToastProvider } from './contexts/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import { useProfileCompletionReminder } from './hooks/useProfileCompletionReminder';
import { NotificationProvider } from './contexts/notifications/NotificationContext';
import NotificationsPage from './pages/notifications';
import NotificationDebug from './components/skeletons/notifications/NotificationDebug';
// Import static pages
import {
  AboutUsPage,
  BecomeAPartnerPage,
  CareersPage,
  BlogPage,
  ContactPage,
  HowItWorksPage,
  StayProtectionTenantsPage,
  HelpTenantsPage,
  TenantResourcesPage,
  TestimonialsPage,
  AdvertiserGuidePage,
  StayProtectionAdvertisersPage,
  TermsPage,
  PrivacyPage
} from './pages/static';

function App() {
  // Use the global store for authentication
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  const initAuth = useStore(state => state.initAuth);
  const [renderKey, setRenderKey] = useState(0);
  
  // Initialize authentication on app load
  useEffect(() => {
    // Initialize auth once
    initAuth();
    
    // Listen for auth state changes through event bus instead of DOM events
    const unsubscribe = eventBus.on(EventType.AUTH_STATE_CHANGED, () => {
      // This forces a controlled re-render without page refresh
      setRenderKey(prev => prev + 1);
    });
    
    // Also listen for specific sign in/out events
    const signInUnsubscribe = eventBus.on(EventType.AUTH_SIGNED_IN, () => {
      setRenderKey(prev => prev + 1);
    });
    
    const signOutUnsubscribe = eventBus.on(EventType.AUTH_SIGNED_OUT, () => {
      setRenderKey(prev => prev + 1);
    });
    
    return () => {
      unsubscribe();
      signInUnsubscribe();
      signOutUnsubscribe();
    };
  }, [initAuth]);
  
  // Also listen for auth state changes directly from store
  useEffect(() => {
    // This effect will run when isAuthenticated or user changes
    setRenderKey(prev => prev + 1);
    
    // Emit route change event
    if (window.location) {
      eventBus.emit(EventType.NAV_ROUTE_CHANGED, {
        path: window.location.pathname,
        params: Object.fromEntries(new URLSearchParams(window.location.search))
      });
    }
  }, [isAuthenticated, user]);
  
  // Determine user types for routing
  const userIsAdmin = isAdmin(user);
  const userIsAdvertiser = isAdvertiser(user);
  const userIsRegular = isRegularUser(user);
  
  // Separate the APP_LOADED event emission into its own effect
  useEffect(() => {
    // Wait for DOM content to be fully loaded before emitting app loaded event
    if (document.readyState === 'complete') {
      eventBus.emit(EventType.APP_LOADED, {
        timestamp: Date.now()
      });
    } else {
      const handleContentLoaded = () => {
    eventBus.emit(EventType.APP_LOADED, {
      timestamp: Date.now()
    });
      };
      
      window.addEventListener('load', handleContentLoaded);
      
      return () => {
        window.removeEventListener('load', handleContentLoaded);
      };
    }
  }, []);
    
  // Set up online/offline detection in a separate effect
  useEffect(() => {
    const handleOnlineStatus = () => {
      eventBus.emit(EventType.APP_ONLINE_STATUS_CHANGED, {
        isOnline: navigator.onLine
      });
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Initial emit of online status
    eventBus.emit(EventType.APP_ONLINE_STATUS_CHANGED, {
      isOnline: navigator.onLine
    });
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Memoize routes to prevent unnecessary re-renders, but update when auth changes
  const routes = useMemo(() => (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<UsersLanding key={renderKey} />} />
      <Route path="/for-advertisers" element={<AdvertisersLanding key={renderKey} />} />
      <Route path="/photoshoot-booking" element={<PhotoshootBookingPage />} />
      <Route path="/photoshoot-booking/thank-you" element={<ThankYouPage />} />

      <Route path="/properties" element={<PropertyList />} />
      <Route path="/property/:id" element={<PropertyPageComponent />} />
      <Route path="/advertiser-profile/:id" element={<ProfileShowcasePage />} />
      
      {/* New Checkout Page */}
      <Route path="/checkout" element={<CheckoutPage />} />
      
      {/* Protected Routes - redirect to home if not authenticated */}
      <Route 
        path="/favourites" 
        element={
          isAuthenticated ? 
            <FavouritesPage /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/favourites',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      {/* User Dashboard Routes */}
      <Route 
        path="/dashboard/user" 
        element={
          isAuthenticated && userIsRegular ? 
            <Navigate to="/dashboard/user/profile" replace /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/user',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      {/* Add explicit routes for nested review paths - place these BEFORE the generic route */}
      <Route 
        path="/dashboard/user/reviews/write" 
        element={
          isAuthenticated && userIsRegular ? 
            <UserDashboard /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/user/reviews/write',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      <Route 
        path="/dashboard/user/reviews/my-reviews" 
        element={
          isAuthenticated && userIsRegular ? 
            <UserDashboard /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/user/reviews/my-reviews',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      <Route 
        path="/dashboard/user/:section" 
        element={
          isAuthenticated && userIsRegular ? 
            <UserDashboard /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/user',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      {/* Advertiser Dashboard Routes */}
      <Route 
        path="/dashboard/advertiser" 
        element={
          isAuthenticated && userIsAdvertiser ? 
            <Navigate to="/dashboard/advertiser/dashboard" replace /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/advertiser',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      {/* Add route for property edit requests - must be before the generic route */}
      <Route 
        path="/dashboard/advertiser/properties/edit-request/:propertyId" 
        element={
          isAuthenticated && userIsAdvertiser ? 
            <AdvertiserDashboard /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/advertiser/properties/edit-request',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      <Route 
        path="/dashboard/advertiser/:section" 
        element={
          isAuthenticated && userIsAdvertiser ? 
            <AdvertiserDashboard /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/advertiser',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      
      {/* Admin Dashboard Routes */}
      <Route 
        path="/dashboard/admin/*" 
        element={
          isAuthenticated && userIsAdmin ? 
            <AdminDashboard /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/admin',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      
      {/* Account Routes - Redirect to user dashboard with appropriate section */}
      <Route 
        path="/account" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard/user/profile" replace /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/account',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      <Route 
        path="/account/*" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard/user/profile" replace /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/account',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      <Route 
        path="/payments" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard/user/payments" replace /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/payments',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      <Route 
        path="/payments/*" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard/user/payments" replace /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/payments',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      <Route 
        path="/reservations" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard/user/reservations" replace /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/reservations',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      <Route 
        path="/reservations/*" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard/user/reservations" replace /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/reservations',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        }
      />
      
      {/* Help Page Route */}
      <Route path="/help" element={<HelpPage />} />
      
      {/* Static Pages */}
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/become-a-partner" element={<BecomeAPartnerPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/stay-protection-tenants" element={<StayProtectionTenantsPage />} />
      <Route path="/help-tenants" element={<HelpTenantsPage />} />
      <Route path="/tenant-resources" element={<TenantResourcesPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/advertiser-guide" element={<AdvertiserGuidePage />} />
      <Route path="/stay-protection-advertisers" element={<StayProtectionAdvertisersPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      
      {/* Reservation Status Page Routes */}
      <Route 
        path="/reservation-status" 
        element={
          isAuthenticated ? 
            <ReservationStatusPage /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/reservation-status',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      <Route 
        path="/reservation-status/:reservationId" 
        element={
          isAuthenticated ? 
            <ReservationStatusPage /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/reservation-status',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      {/* Cancellation Request Page Route */}
      <Route 
        path="/dashboard/user/cancellation-request" 
        element={
          isAuthenticated && userIsRegular ? 
            <CancellationRequestPage /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/user/cancellation-request',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      {/* Refund Request Page Route */}
      <Route 
        path="/dashboard/user/refund-request" 
        element={
          isAuthenticated && userIsRegular ? 
            <RefundRequestPage /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/user/refund-request',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      {/* Reservation Status Page Route */}
      <Route 
        path="/dashboard/user/reservation-status" 
        element={
          isAuthenticated && userIsRegular ? 
            <ReservationStatusPage /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/user/reservation-status',
                redirectTo: '/',
                isAuthenticated: isAuthenticated
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      {/* Notifications Page */}
      <Route 
        path="/notifications" 
        element={
          isAuthenticated ? 
            <NotificationsPage /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/notifications',
                redirectTo: '/',
                isAuthenticated: false
              });
              return <Navigate to="/" replace />;
            })()
        } 
      />
      
      {/* Default route - redirect to home if no path matched */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ), [isAuthenticated, userIsAdvertiser, userIsRegular, userIsAdmin, renderKey]);

  // Create a ProfileReminderWrapper component to use the hook within the ToastProvider
  // Memoize to prevent unnecessary remounting and duplicate notifications
  const ProfileReminderWrapper = useMemo(() => {
    const Wrapper = () => {
      useProfileCompletionReminder();
      return null;
    };
    return <Wrapper />;
  }, [isAuthenticated, user?.id]); // Only re-create when auth state or user ID changes
  
  const Wrapper = () => {
    return (
      <ToastProvider>
        <NotificationProvider>
          <MainLayout>
            <ScrollToTop />
            {ProfileReminderWrapper}
            {routes}
          </MainLayout>
        </NotificationProvider>
      </ToastProvider>
    );
  };
  
  return <Wrapper />;
}

export default App;