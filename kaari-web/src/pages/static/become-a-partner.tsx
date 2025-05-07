import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';

const BecomeAPartnerPage: React.FC = () => {
  return (
    <StaticPageWrapper>
      <div className="page-header">
        <h1>Become a Partner</h1>
        <p className="subtitle">Join our network of property partners and grow your business with Kaari</p>
      </div>

      <div className="content-section">
        <h2>Why Partner With Kaari?</h2>
        <p>
          Partnering with Kaari opens up a world of opportunities for property owners, management companies, and real estate agencies. Our platform provides you with the tools, visibility, and support you need to succeed in the competitive rental market.
        </p>
        
        <h3>Benefits of Partnership</h3>
        <ul>
          <li>Increased visibility through our platform</li>
          <li>Access to our verified tenant database</li>
          <li>Professional photography and listing support</li>
          <li>StayProtection™ coverage for your properties</li>
          <li>Streamlined payment and booking processes</li>
          <li>Dedicated partner support team</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>Partnership Options</h2>
        
        <h3>Property Owners</h3>
        <p>
          List your properties on our platform and benefit from our marketing, tenant verification, and booking management services. Whether you have one property or a portfolio, we have solutions to meet your needs.
        </p>
        
        <h3>Property Management Companies</h3>
        <p>
          Integrate your property management system with our platform to streamline your operations and expand your reach. Our API allows for seamless synchronization of listings, bookings, and payments.
        </p>
        
        <h3>Real Estate Agencies</h3>
        <p>
          Enhance your rental services by leveraging our technology and tenant protection policies. Our partner program for agencies includes co-branding opportunities and commission structures.
        </p>
      </div>

      <div className="content-section">
        <h2>How to Become a Partner</h2>
        <p>
          Joining the Kaari partner network is simple:
        </p>
        <ol>
          <li>Complete the partner application form below</li>
          <li>Schedule a consultation with our partnership team</li>
          <li>Sign our partner agreement</li>
          <li>Set up your account and listings</li>
          <li>Start receiving bookings and growing your business</li>
        </ol>
      </div>

      <div className="cta-section">
        <h3>Ready to Take Your Rental Business to the Next Level?</h3>
        <p>
          Fill out our partner application form, and a member of our team will contact you to discuss the next steps.
        </p>
        <a href="/partner-application" className="cta-button">
          Apply Now
        </a>
      </div>
    </StaticPageWrapper>
  );
};

export default BecomeAPartnerPage; 