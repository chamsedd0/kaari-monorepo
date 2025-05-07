import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';

const StayProtectionAdvertisersPage: React.FC = () => {
  return (
    <StaticPageWrapper>
      <div className="page-header">
        <h1>StayProtection™ for Advertisers</h1>
        <p className="subtitle">Protecting your property and rental income</p>
      </div>

      <div className="content-section">
        <h2>What is StayProtection™?</h2>
        <p>
          StayProtection™ is Kaari's exclusive protection program designed to give property owners and managers peace of mind when renting their properties through our platform. It safeguards your property and rental income against various risks.
        </p>
        <p>
          With StayProtection™, you can list your property with confidence, knowing that you're protected against common rental issues including property damage, payment defaults, and more.
        </p>
      </div>

      <div className="cta-section">
        <h3>Protect Your Property with Kaari</h3>
        <p>
          Join our platform today and enjoy the peace of mind that comes with StayProtection™.
        </p>
        <a href="/signin" className="cta-button">
          List Your Property
        </a>
      </div>
    </StaticPageWrapper>
  );
};

export default StayProtectionAdvertisersPage; 