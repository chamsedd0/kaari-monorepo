import React from 'react';
import { Navigate } from 'react-router-dom';

const AdvertiserSignupPage: React.FC = () => {
  // This is just a fallback in case someone tries to access this directly
  return <Navigate to="/advertiser-signup" replace />;
};

export default AdvertiserSignupPage;