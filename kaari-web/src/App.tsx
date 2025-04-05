import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/skeletons/constructed/footer/footer';
import PropertyPageComponent from './pages/property-page/page';
import CheckoutProcess from './pages/checkout-process/page';
import UsersLanding from './pages/users-landing/page';
import AdvertisersLanding from './pages/advertisers-landing/page';
import PropertyList from './pages/property-list/page';
import { FavouritesPage } from './pages/favourites/page';
import UserDashboard from './pages/dashboards/user-dashboard/page';
import AdvertiserDashboard from './pages/dashboards/advertiser-dashboard/page';
import ProfileShowcasePage from './pages/profile-advertiser-showcase/page';
import { useStore } from './backend/store';
import { useMemo } from 'react';

function App() {
  // Use the global store for authentication
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  
  // Map roles to user types for routing
  const isAdvertiser = user?.role === 'advertiser';
  const isClient = user?.role === 'client';
  
  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<UsersLanding />} />
      <Route path="/for-advertisers" element={<AdvertisersLanding />} />

      <Route path="/properties" element={<PropertyList />} />
      <Route path="/property/:id" element={<PropertyPageComponent />} />
      <Route path="/advertiser-profile/:id" element={<ProfileShowcasePage />} />
      
      {/* Checkout Process with status handling */}
      <Route path="/checkout-process" element={<CheckoutProcess />} />
      
      {/* Protected Routes - redirect to home if not authenticated */}
      <Route 
        path="/favourites" 
        element={isAuthenticated ? <FavouritesPage /> : <Navigate to="/" replace />} 
      />
      
      {/* Dashboard Routes */}
      <Route 
        path="/dashboard/user/*" 
        element={isAuthenticated && isClient ? <UserDashboard /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/dashboard/advertiser/*" 
        element={isAuthenticated && isAdvertiser ? <AdvertiserDashboard /> : <Navigate to="/" replace />} 
      />
      
      {/* Fallback route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ), [isAuthenticated, isAdvertiser, isClient]);
  
  return (
    <Router>
      <div className="app">
        <main>
          {routes}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;