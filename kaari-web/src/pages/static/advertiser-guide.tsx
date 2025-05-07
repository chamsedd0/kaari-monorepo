import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';

const AdvertiserGuidePage: React.FC = () => {
  return (
    <StaticPageWrapper>
      <div className="page-header">
        <h1>Advertiser Guide</h1>
        <p className="subtitle">Everything you need to know about listing your property on Kaari</p>
      </div>

      <div className="content-section">
        <h2>Getting Started with Kaari</h2>
        <p>
          Welcome to Kaari's Advertiser Guide. This page will provide you with all the information you need to successfully list and manage your properties on our platform.
        </p>
        <p>
          At Kaari, we're committed to helping property owners and managers showcase their listings to qualified tenants across Africa. Our platform provides tools and resources to make the rental process simple, secure, and efficient.
        </p>
      </div>

      <div className="cta-section">
        <h3>Ready to List Your Property?</h3>
        <p>
          Join thousands of successful property advertisers on Kaari and find quality tenants for your properties.
        </p>
        <a href="/signin" className="cta-button">
          Get Started
        </a>
      </div>
    </StaticPageWrapper>
  );
};

export default AdvertiserGuidePage; 