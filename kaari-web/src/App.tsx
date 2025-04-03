import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/skeletons/constructed/footer/footer';
import PropertyPageComponent from './pages/property-page/page';
import CheckoutProcess from './pages/checkout-process/page';
import UsersLanding from './pages/users-landing/page';
import PropertyList from './pages/property-list/page';
import { FavouritesPage } from './pages/favourites/page';
import UserDashboard from './pages/dashboards/user-dashboard/page';
import AdvertiserDashboard from './pages/dashboards/advertiser-dashboard/page';
import ProfileShowcasePage from './pages/profile-advertiser-showcase/page';

function App() {
  // Simple check for whether the user is logged in
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Simple check for user type (advertiser or regular user)
  const userType = localStorage.getItem('userType') || 'user';
  
  return (
    <Router>
      <div className="app">
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<UsersLanding />} />

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
              element={isAuthenticated && userType === 'user' ? <UserDashboard /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/dashboard/advertiser/*" 
              element={isAuthenticated && userType === 'advertiser' ? <AdvertiserDashboard /> : <Navigate to="/" replace />} 
            />
            
            {/* Fallback route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;