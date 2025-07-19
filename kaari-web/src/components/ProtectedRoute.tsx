import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../backend/store';

// IMPORTANT: Add your email here to get access to restricted features
const ADMIN_EMAILS = [
  'lhouijchams@gmail.com',
  // Add any other emails that should have access
];

// User IDs that should have admin access
const ADMIN_IDS = [
  'Je9GyJ0ZL8N8QoSALZaBvzy5Erf1',
  'bVctXP6Vi7U0P11zeJ2cKAfFU713',
  'EiSukRXUiZZ8hlEKi3lNzq3Kk6m1',
  // Add any other user IDs that should have access
];

/**
 * A simple component that protects routes before the August 1st launch
 * Only users with emails in the ADMIN_EMAILS list or IDs in the ADMIN_IDS list can access protected routes
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const user = useStore(state => state.user);
  
  
  
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