import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';

// Additional styles for the how it works page
const HowItWorksPageStyles = styled(StaticPageWrapper)`
  .steps-container {
    margin-top: 40px;
  }
  
  .step {
    display: flex;
    margin-bottom: 60px;
    position: relative;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
    
    &:not(:last-child):after {
      content: '';
      position: absolute;
      left: 40px;
      top: 80px;
      bottom: -40px;
      width: 2px;
      background-color: ${Theme.colors.tertiary};
      
      @media (max-width: 768px) {
        left: 40px;
        top: 80px;
        bottom: -40px;
      }
    }
    
    .step-number {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: ${Theme.colors.primary};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font: ${Theme.typography.fonts.h2};
      margin-right: 30px;
      z-index: 1;
    }
    
    .step-content {
      h3 {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
        margin-bottom: 15px;
      }
      
      p {
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
        margin-bottom: 20px;
      }
      
      .tip {
        background-color: ${Theme.colors.tertiary}20;
        padding: 15px 20px;
        border-radius: ${Theme.borders.radius.md};
        margin-top: 15px;
        
        h4 {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin-bottom: 8px;
        }
        
        p {
          font: ${Theme.typography.fonts.text16};
          color: ${Theme.colors.gray2};
          margin-bottom: 0;
        }
      }
    }
  }
`;

const HowItWorksPage: React.FC = () => {
  return (
    <HowItWorksPageStyles>
      <div className="page-header">
        <h1>How Kaari Works</h1>
        <p className="subtitle">Your guide to finding and booking the perfect rental property</p>
      </div>

      <div className="content-section">
        <p>
          At Kaari, we've simplified the rental process to make finding your next home as easy and stress-free as possible. Follow these simple steps to find and secure your perfect rental property.
        </p>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Search for Properties</h3>
              <p>
                Start by exploring our extensive database of verified rental properties. Use our advanced filters to narrow down your search based on location, price range, property type, and amenities to find listings that match your requirements.
              </p>
              <p>
                Every property on Kaari is personally verified by our team to ensure accuracy and quality, so you can trust that what you see is what you get.
              </p>
              <div className="tip">
                <h4>Pro Tip</h4>
                <p>Save your search preferences to receive notifications when new properties matching your criteria become available.</p>
              </div>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Schedule Viewings</h3>
              <p>
                Found a property you like? Schedule a viewing directly through our platform. You can choose between in-person viewings or virtual tours, depending on your preference and availability.
              </p>
              <p>
                Our booking system makes it easy to find available time slots and communicate with property owners or managers.
              </p>
              <div className="tip">
                <h4>Pro Tip</h4>
                <p>Prepare a list of questions before your viewing to make sure you gather all the information you need about the property.</p>
              </div>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Apply for Your Chosen Property</h3>
              <p>
                Found the perfect place? Submit your rental application through our secure platform. Our standardized application process makes it easy to apply for multiple properties without having to fill out different forms each time.
              </p>
              <p>
                Your application will include basic personal information, employment details, and rental history. We use secure verification methods to protect your privacy while giving property owners the confidence they need.
              </p>
              <div className="tip">
                <h4>Pro Tip</h4>
                <p>Complete your profile with all necessary verification documents in advance to speed up the application process.</p>
              </div>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Secure Your Booking</h3>
              <p>
                Once your application is approved, you can secure your booking directly through our platform. Our transparent booking process clearly outlines all costs, terms, and conditions before you commit.
              </p>
              <p>
                Pay your security deposit and first month's rent securely through our payment system. All payments are protected by our StayProtection™ policy, giving you peace of mind.
              </p>
              <div className="tip">
                <h4>Pro Tip</h4>
                <p>Review the rental agreement carefully before signing and reach out to our support team if you have any questions.</p>
              </div>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>Move In and Enjoy</h3>
              <p>
                Congratulations on your new home! Coordinate with the property owner for key handover and move-in details. Our platform allows for seamless communication throughout this process.
              </p>
              <p>
                Once you move in, you can use your Kaari account to manage your rental, including making monthly payments, requesting maintenance, and communicating with your landlord.
              </p>
              <div className="tip">
                <h4>Pro Tip</h4>
                <p>Document the condition of the property when you move in by taking photos and noting any existing issues to avoid disputes later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h3>Ready to Find Your Perfect Rental?</h3>
        <p>
          Start your search today and experience the easiest way to rent property in Africa.
        </p>
        <a href="/property-list" className="cta-button">
          Start Searching
        </a>
      </div>
    </HowItWorksPageStyles>
  );
};

export default HowItWorksPage; 