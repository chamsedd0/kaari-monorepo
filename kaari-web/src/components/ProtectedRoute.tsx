import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../backend/store';

// IMPORTANT: Add your email here to get access to restricted features
const ADMIN_EMAILS = [
  'intag@gmail.com',
  'admin@kaari.com',
  'developer@kaari.com',
  // Add any other emails that should have access
];

/**
 * A simple component that protects routes before the August 1st launch
 * Only users with emails in the ADMIN_EMAILS list can access protected routes
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const user = useStore(state => state.user);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  
  // Add detailed console logs for debugging
  useEffect(() => {
    console.log('=== Protected Route Check ===');
    console.log('Path:', location.pathname);
    console.log('User authenticated:', isAuthenticated ? 'Yes' : 'No');
    console.log('User email:', user?.email || 'No email');
    console.log('User object:', user);
    
    // Check if user is in the admin list
    const hasAccess = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
    console.log('Has access:', hasAccess ? 'Yes' : 'No');
    console.log('==========================');
  }, [location.pathname, user, isAuthenticated]);
  
  // If no user or email, redirect to coming soon page
  if (!user || !user.email) {
    console.log('ACCESS DENIED: No user or email');
    return <Navigate to="/static/coming-soon" replace state={{ from: location }} />;
  }
  
  // Check if user is in the admin list
  const hasAccess = ADMIN_EMAILS.includes(user.email.toLowerCase());
  
  // If not in admin list, redirect to coming soon page
  if (!hasAccess) {
    console.log(`ACCESS DENIED for ${user.email}: Not in admin list`);
    return <Navigate to="/static/coming-soon" replace state={{ from: location }} />;
  }
  
  // If user has access, render the children
  console.log(`ACCESS GRANTED for ${user.email}`);
  return <>{children}</>;
};

export default ProtectedRoute; 