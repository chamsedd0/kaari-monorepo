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
import BecomeAdvertiserPage from './pages/become-advertiser/page';
import AdvertiserThankYouPage from './pages/become-advertiser/thank-you';
import { 
  EmailVerificationHandler,
  EmailVerificationSuccessPage,
  EmailVerificationErrorPage,
  EmailVerificationWaitingPage
} from './pages/email-verification';
import HelpPage from './pages/help/page';
import ReservationStatusPage from './pages/dashboards/user-dashboard/reservation-status/page';
import CancellationRequestPage from './pages/dashboards/user-dashboard/cancellation-request/page';
import RefundRequestPage from './pages/dashboards/user-dashboard/refund-request/page';
import UsersManagementPage from './pages/dashboards/admin-dashboard/users-management';
import UserManagementDetailPage from './pages/dashboards/admin-dashboard/user-management-detail';
import { useStore } from './backend/store';
import { useMemo, useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import { isAdmin, isAdvertiser, isRegularUser } from './utils/user-roles';
import eventBus, { EventType } from './utils/event-bus';
import { 
  registerSignupListener, 
  checkIncompleteSignup, 
  registerAuthListener,
  isInSignupFlow,
  hideHeadersAndFooters
} from './utils/advertiser-signup';
import { ToastProvider } from './contexts/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import { NotificationProvider } from './contexts/notifications/NotificationContext';
import { ChecklistProvider } from './contexts/checklist/ChecklistContext';
import NotificationsPage from './pages/notifications';
import ProtectedRoute from './components/ProtectedRoute';
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
  PrivacyPage,
  ComingSoonPage
} from './pages/static';
import ExpirationService from './services/ExpirationService';
import { AdvertiserOnboardingPage, AdvertiserSignupForm, FoundingPartnersPage } from './pages/advertiser-signup';
import i18n from './i18n';
import { ClaimDiscountPage, ReferralSignupPage } from './pages/referral';
import { checkAndFixLanguage } from './utils/language-utils';
import PaymentCallback from './pages/payment-callback';
import PaymentSuccess from './pages/payment-success';
import { PaymentMethodProvider } from './components/PaymentMethodProvider';

// Function to ensure French is the default language
const ensureFrenchAsDefault = () => {
  const currentLang = i18n.language;
  if (!currentLang || (!currentLang.startsWith('fr') && !currentLang.startsWith('en'))) {
    i18n.changeLanguage('fr');
    localStorage.setItem('i18nextLng', 'fr');
    console.log('Setting default language to French');
  } else {
    console.log('Current language:', currentLang);
  }
};

function App() {
  const [renderKey, setRenderKey] = useState(0);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  const initAuth = useStore(state => state.initAuth);
  
  // Initialize auth on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  // Register signup listener
  useEffect(() => {
    registerSignupListener();
    
    // Check for incomplete signup
    checkIncompleteSignup();
    
    // Register auth listener
    registerAuthListener();
    
    // Initialize expiration service
    ExpirationService.startExpirationCheck();
    
    // Ensure French as default language
    ensureFrenchAsDefault();
    
    // Check and fix language if needed (e.g., if Arabic is selected but not in onboarding flow)
    checkAndFixLanguage();
    
    // Force a re-render when language changes
    const handleLanguageChanged = () => {
      setRenderKey(prev => prev + 1);
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);
  
  // Hide headers and footers when in signup flow
  useEffect(() => {
    // Use a ref to store the current cleanup function
    const cleanupRef = { current: () => {} };
    
    // Check if we're in the signup flow
    const checkAndHideElements = () => {
      if (isInSignupFlow()) {
        // Hide headers and footers
        return hideHeadersAndFooters();
      }
      return () => {};
    };
    
    // Initial check - call immediately
    cleanupRef.current = checkAndHideElements();
    
    // Listen for route changes
    const unsubscribeRouteChange = eventBus.on(EventType.NAV_ROUTE_CHANGED, () => {
      // Clean up previous effect
      cleanupRef.current();
      // Check again after route change
      cleanupRef.current = checkAndHideElements();
    });
    
    // Also hide headers after a short delay to catch any late-rendered components
    const delayedHideTimeout = setTimeout(() => {
      if (isInSignupFlow()) {
        hideHeadersAndFooters();
      }
    }, 500);
    
    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
      unsubscribeRouteChange();
      clearTimeout(delayedHideTimeout);
    };
  }, []);
  
  // Also listen for auth state changes directly from store
  useEffect(() => {
    // This effect will run when isAuthenticated or user changes
    setRenderKey(prev => prev + 1);
    
    // If the user just logged in, check for incomplete signup
    if (isAuthenticated && user && !isInSignupFlow()) {
      checkIncompleteSignup();
    }
    
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
      
      {/* Payment Routes */}
      <Route path="/payment-callback" element={<PaymentCallback />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      
      {/* Isolated Advertiser Signup Flow - No MainLayout */}
      <Route path="/advertiser-signup" element={<AdvertiserOnboardingPage />} />
      <Route path="/advertiser-signup/founding-partners" element={<FoundingPartnersPage />} />
      <Route path="/advertiser-signup/form" element={<AdvertiserSignupForm />} />
      <Route path="/become-advertiser" element={<BecomeAdvertiserPage />} />
      <Route path="/become-advertiser/thank-you" element={<AdvertiserThankYouPage />} />
      
      {/* Email Verification Routes - No MainLayout */}
      <Route path="/email-verification" element={<EmailVerificationHandler />} />
      <Route path="/email-verification/success" element={<EmailVerificationSuccessPage />} />
      <Route path="/email-verification/error" element={<EmailVerificationErrorPage />} />
      <Route path="/email-verification/waiting" element={<EmailVerificationWaitingPage />} />
      
      {/* Protected Routes with Coming Soon page */}
      <Route path="/photoshoot-booking" element={
        <ProtectedRoute>
          <PhotoshootBookingPage />
        </ProtectedRoute>
      } />
      <Route path="/photoshoot-booking/thank-you" element={
        <ProtectedRoute>
          <ThankYouPage />
        </ProtectedRoute>
      } />
      
      <Route path="/static/coming-soon" element={<ComingSoonPage />} />

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
      
      {/* Advertiser Dashboard Routes - Protected with Coming Soon */}
      <Route 
        path="/dashboard/advertiser" 
        element={
          <ProtectedRoute>
            {isAuthenticated && userIsAdvertiser ? 
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
          </ProtectedRoute>
        }
      />
      {/* Add route for property edit requests - must be before the generic route */}
      <Route 
        path="/dashboard/advertiser/properties/edit-request/:propertyId" 
        element={
          <ProtectedRoute>
            {isAuthenticated && userIsAdvertiser ? 
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
          </ProtectedRoute>
        }
      />
      {/* Add routes for referral program sub-pages */}
      <Route 
        path="/dashboard/advertiser/referral-program/performance" 
        element={
          <ProtectedRoute>
            {isAuthenticated && userIsAdvertiser ? 
              <AdvertiserDashboard /> : 
              (() => {
                eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                  path: '/dashboard/advertiser/referral-program/performance',
                  redirectTo: '/',
                  isAuthenticated: isAuthenticated
                });
                return <Navigate to="/" replace />;
              })()
            }
          </ProtectedRoute>
        }
      />
      <Route 
        path="/dashboard/advertiser/referral-program/simulator" 
        element={
          isAuthenticated && userIsAdvertiser ? 
            <AdvertiserDashboard /> : 
            (() => {
              eventBus.emit(EventType.NAV_PRIVATE_ROUTE_ACCESS, {
                path: '/dashboard/advertiser/referral-program/simulator',
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
          <ProtectedRoute>
            {isAuthenticated && userIsAdvertiser ? 
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
          </ProtectedRoute>
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
      
      {/* Claim Discount Page */}
      <Route path="/referral/claim-discount" element={<ClaimDiscountPage />} />
      <Route path="/referral/signup" element={<ReferralSignupPage />} />
      
      {/* Redirects for old claim URLs */}
      <Route path="/claim-discount" element={<Navigate to="/referral/claim-discount" replace />} />
      <Route path="/claim" element={<Navigate to="/referral/claim-discount" replace />} />
      
      {/* Default route - redirect to home if no path matched */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ), [isAuthenticated, userIsAdvertiser, userIsRegular, userIsAdmin, renderKey]);

  // Profile reminder has been removed as requested by the owner
  // This was previously used to remind users to complete their profile
  
  // Wrapper component for all providers
  const Wrapper = () => {
    // Check if the current path is part of the isolated advertiser signup flow
    const currentPath = window.location.pathname;
    const isAdvertiserSignupFlow = 
      currentPath === '/advertiser-signup' || 
      currentPath === '/advertiser-signup/form' ||
      currentPath === '/advertiser-signup/founding-partners' ||
      currentPath === '/become-advertiser' || 
      currentPath === '/become-advertiser/thank-you' ||
      currentPath === '/email-verification' ||
      currentPath === '/email-verification/waiting' ||
      currentPath === '/email-verification/success' ||
      currentPath === '/email-verification/error';
    
    // If it's part of the isolated flow, don't use MainLayout
    if (isAdvertiserSignupFlow) {
      return (
        <ToastProvider>
          <NotificationProvider>
            <ChecklistProvider>
              <PaymentMethodProvider>
                <ScrollToTop />
                {routes}
              </PaymentMethodProvider>
            </ChecklistProvider>
          </NotificationProvider>
        </ToastProvider>
      );
    }
    
    // Otherwise use MainLayout
    return (
      <ToastProvider>
        <NotificationProvider>
          <ChecklistProvider>
            <PaymentMethodProvider>
              <ScrollToTop />
              <MainLayout>
                {routes}
              </MainLayout>
            </PaymentMethodProvider>
          </ChecklistProvider>
        </NotificationProvider>
      </ToastProvider>
    );
  };
  
  useEffect(() => {
    // Start the expiration check service
    ExpirationService.startExpirationCheck();

    // Clean up on unmount
    return () => {
      ExpirationService.stopExpirationCheck();
    };
  }, []);
  
  return <Wrapper />;
}

export default App;