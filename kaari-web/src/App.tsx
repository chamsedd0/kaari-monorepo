import { Routes, Route, Navigate } from 'react-router-dom';
import PropertyPageComponent from './pages/property-page/page';
import CheckoutProcess from './pages/checkout-process/page';
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
import { useStore } from './backend/store';
import { useMemo, useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import { isAdmin, isAdvertiser, isRegularUser } from './utils/user-roles';
import eventBus, { EventType } from './utils/event-bus';

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
  
  // Listen for app load completion
  useEffect(() => {
    // Emit app loaded event once the app is rendered
    eventBus.emit(EventType.APP_LOADED, {
      timestamp: Date.now()
    });
    
    // Set up online/offline detection
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
      
      {/* Checkout Process with status handling */}
      <Route path="/checkout-process" element={<CheckoutProcess />} />
      
      {/* Protected Routes - redirect to home if not authenticated */}
      <Route 
        path="/favourites" 
        element={
          isAuthenticated ? 
            <FavouritesPage /> : 
            (() => {
              // Emit event for protected route access attempt
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
      
      {/* Fallback route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ), [isAuthenticated, userIsAdvertiser, userIsRegular, userIsAdmin, renderKey]);
  
  return (
    <MainLayout key={renderKey}>
          {routes}
    </MainLayout>
  );
}

export default App;