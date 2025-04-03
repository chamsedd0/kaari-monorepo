import React, { useState } from 'react';
import { PurpleButtonMB48 } from '../../buttons/purple_MB48';
import { BackButton } from '../../buttons/back_button';
import { ConfirmationSummary } from '../../../styles/checkoutprocess/checkout-process-sections-style';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

interface ConfirmationProps {
  onContinue: () => void;
  onBack: () => void;
}

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .icon {
    width: 32px;
    height: 32px;
    color: ${Theme.colors.secondary};
    margin-right: 12px;
  }

  h3 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin: 0;
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background-color: ${Theme.colors.gray};
  margin: 24px 0;
  width: 100%;
`;

const Confirmation: React.FC<ConfirmationProps> = ({ onContinue, onBack }) => {
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    onBack();
    scrollToTop();
  };

  const handleContinue = () => {
    onContinue();
    scrollToTop();
  };

  return (
    <div className="checkout-process-form">
      <ConfirmationSummary>
        <IconContainer>
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.9999 2C6.47712 2 2.00003 6.47709 2.00003 12C2.00003 17.5229 6.47712 22 11.9999 22C17.5228 22 21.9999 17.5229 21.9999 12C21.9999 6.47709 17.5228 2 11.9999 2ZM11.9999 20C7.58165 20 4.00003 16.4184 4.00003 12C4.00003 7.58165 7.58165 4 11.9999 4C16.4183 4 19.9999 7.58165 19.9999 12C19.9999 16.4184 16.4183 20 11.9999 20ZM16.2425 8.34296L10.9999 13.5856L8.75733 11.3429C8.3668 10.9524 7.73364 10.9524 7.34311 11.3429C6.95259 11.7334 6.95259 12.3666 7.34311 12.7571L10.2928 15.7069C10.6834 16.0974 11.3165 16.0974 11.7071 15.7069L17.7071 9.70694C18.0976 9.31641 18.0976 8.68325 17.7071 8.29272C17.3165 7.9022 16.6834 7.9022 16.2928 8.29272L16.2425 8.34296Z" />
          </svg>
          <h3>Booking Summary</h3>
        </IconContainer>
        
        <div className="summary-section">
          <h4>Personal Information</h4>
          <div className="summary-item">
            <span className="label">Name:</span>
            <span className="value">John Doe</span>
          </div>
          <div className="summary-item">
            <span className="label">Email:</span>
            <span className="value">john.doe@example.com</span>
          </div>
          <div className="summary-item">
            <span className="label">Phone:</span>
            <span className="value">+1 234 567 8900</span>
          </div>
        </div>
        
        <SectionDivider />
        
        <div className="summary-section">
          <h4>Payment Details</h4>
          <div className="summary-item">
            <span className="label">Card Number:</span>
            <span className="value">**** **** **** 1234</span>
          </div>
          <div className="summary-item">
            <span className="label">Cardholder:</span>
            <span className="value">John Doe</span>
          </div>
        </div>
        
        <SectionDivider />
        
        <div className="summary-section">
          <h4>Booking Details</h4>
          <div className="summary-item">
            <span className="label">Property:</span>
            <span className="value">Modern Studio in Downtown</span>
          </div>
          <div className="summary-item">
            <span className="label">Move-in Date:</span>
            <span className="value">January 1, 2023</span>
          </div>
          <div className="summary-item">
            <span className="label">Length of Stay:</span>
            <span className="value">1 month</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Amount:</span>
            <span className="value">$3,000</span>
          </div>
        </div>
        
        <SectionDivider />
        
        <div className="terms-container">
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              id="terms" 
              checked={termsAgreed}
              onChange={() => setTermsAgreed(!termsAgreed)}
            />
            <label htmlFor="terms">
              I agree to the <span style={{ color: Theme.colors.secondary, textDecoration: 'underline', cursor: 'pointer' }}>terms and conditions</span>
            </label>
          </div>
        </div>
      </ConfirmationSummary>
      
      <div className="button-container">
        <BackButton onClick={handleBack} />
        <PurpleButtonMB48 
          text="Complete Booking" 
          onClick={handleContinue} 
          disabled={!termsAgreed}
        />
      </div>
    </div>
  );
};

export default Confirmation; 