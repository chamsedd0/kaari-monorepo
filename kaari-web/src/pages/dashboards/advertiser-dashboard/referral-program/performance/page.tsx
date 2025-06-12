import React, { useState } from 'react';
import { PerformancePageStyle } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Theme } from '../../../../../theme/theme';
import { PurpleButtonLB40 } from '../../../../../components/skeletons/buttons/purple_LB40';
import { BackButton } from '../../../../../components/skeletons/buttons/back_button';

// Mock data for the referral program performance (replace with actual API calls later)
const mockPerformanceData = {
  totalReferrals: 10,
  successfulBookings: 7,
  totalEarnings: 1200,
  pendingPayouts: 600,
  currentBonus: '5%',
  listings: 1,
  isEligible: true,
  history: [
    { 
      id: 1, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      amount: 200,
      date: new Date(2023, 5, 15)
    },
    { 
      id: 2, 
      tenant: 'John Price', 
      status: 'success', 
      property: 'Apartment - flat in the center of Agadir',
      amount: 200,
      date: new Date(2023, 5, 10)
    },
    { 
      id: 3, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      amount: 200,
      date: new Date(2023, 5, 5)
    },
    { 
      id: 4, 
      tenant: 'John Price', 
      status: 'success', 
      property: 'Apartment - flat in the center of Agadir',
      amount: 200,
      date: new Date(2023, 4, 28)
    },
    { 
      id: 5, 
      tenant: 'John Price', 
      status: 'success', 
      property: 'Apartment - flat in the center of Agadir',
      amount: 200,
      date: new Date(2023, 4, 20)
    }
  ]
};

// Icons
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#25A348" />
    <path d="M16 9L10.5 14.5L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9.5" stroke="#D1D1D1" />
    <path d="M10 6V7" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 10V14" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Up and Down arrow indicators
const UpArrowIndicator = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3L13 8L8 13" stroke="#25A348" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45 8 8)" />
  </svg>
);

const DownArrowIndicator = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3L13 8L8 13" stroke="#B51717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(135 8 8)" />
  </svg>
);

const PerformancePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState(mockPerformanceData);

  // Function to handle going back to the main referral program page
  const handleBackClick = () => {
    navigate('/dashboard/advertiser/referral-program');
  };

  // Function to handle payout request
  const handleRequestPayout = () => {
    // This would make an API call to request a payout
    console.log('Requesting payout');
  };

  return (
    <PerformancePageStyle>
      <div className="page-header">
        <div>
          <div className="back-button-wrapper" onClick={handleBackClick}>
            <BackButton onClick={handleBackClick} />
          </div>
          <h1>Your Referral Performance</h1>
        </div>
      </div>

      <div className="cards-row">
        {/* Current Performance Card */}
        <div className="card performance-card">
          <h2>Your Current Performance</h2>
          
          <div className="performance-metrics">
            <div className="metric">
              <div className="metric-name">Referrals</div>
              <div className="metric-value">
                <UpArrowIndicator />
                <span className="number">10</span>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-name">Bookings</div>
              <div className="metric-value">
                <DownArrowIndicator />
                <span className="number">7</span>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-name">Bonus</div>
              <div className="metric-value">
                <span className="number purple">5%</span>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-name">Monthly Earnings</div>
              <div className="metric-value">
                <span className="number purple">1200</span>
                <span className="currency">MAD</span>
              </div>
            </div>
          </div>
          
          {/* Bonus Progress Bar */}
          <div className="progress-container">
            <div className="percentage-labels">
              <span>5%</span>
              <span>8%</span>
              <span>10%</span>
            </div>
            <div className="progress-bar">
              <div className="segment active"></div>
              <div className="segment"></div>
              <div className="segment"></div>
            </div>
            <div className="range-labels">
              <span>1-2 listings</span>
              <span>3-10 listings</span>
              <span>11+ listings</span>
            </div>
          </div>
        </div>

        {/* Eligibility Card */}
        <div className="card eligibility-card">
          <h2>Eligibility</h2>
          
          <div className="eligibility-status">
            <CheckIcon />
            <span className="status-text">You are eligible</span>
            <div className="info-icon-wrapper">
              <InfoIcon />
            </div>
          </div>
          
          <p className="eligibility-note">
            You need to have at least 1 listing in the last 60 days to be eligible for the payout request
          </p>
          
          <div className="request-payout">
            <PurpleButtonLB40 
              text="Request Payout" 
              onClick={handleRequestPayout}
            />
          </div>
        </div>
      </div>
    </PerformancePageStyle>
  );
};

// Export the Performance component
export default PerformancePage; 