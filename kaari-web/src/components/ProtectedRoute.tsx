import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../backend/store';

// IMPORTANT: Add your email here to get access to restricted features
const ADMIN_EMAILS = [
  'lhouijcham@gmail.com',
  // Add any other emails that should have access
];

// User IDs that should have admin access
const ADMIN_IDS = [
  'Yw2FKw9Fdwe0wZ7wEROn1tuH8273',
  // Add any other user IDs that should have access
];

/**
 * A simple component that protects routes before the August 1st launch
 * Only users with emails in the ADMIN_EMAILS list or IDs in the ADMIN_IDS list can access protected routes
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const user = useStore(state => state.user);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  
  // Add detailed console logs for debugging
  useEffect(() => {
    
    // Check if user is in the admin list (by email or ID)
    const hasEmailAccess = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
    const hasIdAccess = user?.id && ADMIN_IDS.includes(user.id);
  }, [location.pathname, user, isAuthenticated]);
  
  // If no user, redirect to coming soon page
  if (!user) {
    return <Navigate to="/static/coming-soon" replace state={{ from: location }} />;
  }
  
  // Check if user is in the admin list by email or ID
  const hasEmailAccess = user.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const hasIdAccess = user.id && ADMIN_IDS.includes(user.id);
  
  // If not in admin list, redirect to coming soon page
  if (!hasEmailAccess && !hasIdAccess) {
    return <Navigate to="/static/coming-soon" replace state={{ from: location }} />;
  }
  
  // If user has access, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 