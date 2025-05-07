import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaShieldAlt, FaHandshake, FaHome, FaMoneyBillWave, FaUserShield } from 'react-icons/fa';

// Additional styles for the StayProtection page
const StayProtectionStyles = styled(StaticPageWrapper)`
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin-top: 40px;
    margin-bottom: 40px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .benefit-card {
    background-color: white;
    border-radius: ${Theme.borders.radius.md};
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }
    
    .icon {
      font-size: 40px;
      color: ${Theme.colors.primary};
      margin-bottom: 20px;
    }
    
    h3 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};
      margin-bottom: 15px;
    }
    
    p {
      font: ${Theme.typography.fonts.text16};
      color: ${Theme.colors.gray2};
      margin-bottom: 0;
    }
  }
  
  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
    
    th, td {
      padding: 15px 20px;
      text-align: left;
      border-bottom: 1px solid ${Theme.colors.gray3};
    }
    
    th {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      background-color: ${Theme.colors.tertiary}10;
    }
    
    td {
      font: ${Theme.typography.fonts.text16};
      color: ${Theme.colors.gray2};
    }
    
    .feature-available {
      color: ${Theme.colors.primary};
      font-weight: bold;
    }
    
    .feature-unavailable {
      color: ${Theme.colors.gray3};
    }
    
    @media (max-width: 768px) {
      display: block;
      overflow-x: auto;
      
      th, td {
        padding: 10px 15px;
      }
    }
  }
`;

const StayProtectionTenantsPage: React.FC = () => {
  return (
    <StayProtectionStyles>
      <div className="page-header">
        <h1>StayProtection™ for Tenants</h1>
        <p className="subtitle">Your safety net for worry-free renting</p>
      </div>

      <div className="content-section">
        <h2>What is StayProtection™?</h2>
        <p>
          StayProtection™ is Kaari's exclusive protection program designed to give tenants peace of mind when renting properties through our platform. It's a comprehensive policy that safeguards your rental experience, from the booking process to your entire stay.
        </p>
        <p>
          Unlike traditional security deposits that only cover property damage, StayProtection™ provides broader coverage to address various issues that might arise during your tenancy, ensuring a smooth and stress-free rental experience.
        </p>
      </div>
      
      <div className="content-section">
        <h2>Your StayProtection™ Benefits</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="icon">
              <FaShieldAlt />
            </div>
            <h3>Booking Protection</h3>
            <p>
              If the property you booked doesn't match its description or isn't available upon arrival, we'll help you find an alternative accommodation of similar or better quality at no extra cost.
            </p>
          </div>
          
          <div className="benefit-card">
            <div className="icon">
              <FaHome />
            </div>
            <h3>Essential Amenities Guarantee</h3>
            <p>
              If essential amenities like water, electricity, or internet fail during your stay and aren't repaired within 24 hours, you'll receive compensation for each day the issue persists.
            </p>
          </div>
          
          <div className="benefit-card">
            <div className="icon">
              <FaMoneyBillWave />
            </div>
            <h3>Transparent Payments</h3>
            <p>
              All payments are processed securely through our platform, with clear receipts and documentation. No hidden fees or unexpected charges during your tenancy.
            </p>
          </div>
          
          <div className="benefit-card">
            <div className="icon">
              <FaHandshake />
            </div>
            <h3>Mediation Services</h3>
            <p>
              In case of disputes with the property owner, our dedicated team provides mediation services to help reach a fair resolution for both parties.
            </p>
          </div>
          
          <div className="benefit-card">
            <div className="icon">
              <FaUserShield />
            </div>
            <h3>Extended Cancellation Options</h3>
            <p>
              Life happens. With StayProtection™, you have access to more flexible cancellation options in case of emergencies or unexpected life events.
            </p>
          </div>
        </div>
      </div>
      
      <div className="content-section">
        <h2>How StayProtection™ Compares</h2>
        <p>
          See how renting with Kaari's StayProtection™ compares to traditional renting:
        </p>
        
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Traditional Renting</th>
              <th>Kaari with StayProtection™</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Property Verification</td>
              <td className="feature-unavailable">Not guaranteed</td>
              <td className="feature-available">All properties verified in person</td>
            </tr>
            <tr>
              <td>Payment Protection</td>
              <td className="feature-unavailable">Limited or none</td>
              <td className="feature-available">Secure payment processing</td>
            </tr>
            <tr>
              <td>Misrepresentation Protection</td>
              <td className="feature-unavailable">None</td>
              <td className="feature-available">Alternative accommodation provided</td>
            </tr>
            <tr>
              <td>Amenities Guarantee</td>
              <td className="feature-unavailable">None</td>
              <td className="feature-available">Compensation for failures</td>
            </tr>
            <tr>
              <td>Dispute Resolution</td>
              <td className="feature-unavailable">Often complex legal process</td>
              <td className="feature-available">Dedicated mediation team</td>
            </tr>
            <tr>
              <td>Cancellation Flexibility</td>
              <td className="feature-unavailable">Usually strict</td>
              <td className="feature-available">Extended options available</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="content-section">
        <h2>How to Access StayProtection™</h2>
        <p>
          StayProtection™ is automatically included with every booking made through the Kaari platform. There's no need to sign up separately or pay additional fees—it's our commitment to providing you with the best rental experience possible.
        </p>
      </div>

      <div className="cta-section">
        <h3>Ready to Experience Worry-Free Renting?</h3>
        <p>
          Start browsing our verified properties today and enjoy the peace of mind that comes with StayProtection™.
        </p>
        <a href="/property-list" className="cta-button">
          Browse Properties
        </a>
      </div>
    </StayProtectionStyles>
  );
};

export default StayProtectionTenantsPage; 