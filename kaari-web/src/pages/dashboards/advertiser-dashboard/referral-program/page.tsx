import React, { useState } from 'react';
import { ReferralProgramPageStyle } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PurpleButtonLB60 } from '../../../../components/skeletons/buttons/purple_LB60';
import { BpurpleButtonLB60 } from '../../../../components/skeletons/buttons/border_purple_LB60';
import { PurpleButtonSM32 } from '../../../../components/skeletons/buttons/purple_SM32';
import { PurpleButtonMB48 } from "../../../../components/skeletons/buttons/purple_MB48";
import ArrowIcon from '../../../../components/skeletons/icons/Icon_Arrow_Right_W.svg';

// Mock data for the referral program (replace with actual API calls later)
const mockReferralData = {
  code: 'ABC1234',
  totalReferrals: 10,
  successfulBookings: 7,
  monthlyEarnings: 1200,
  annualEarnings: 14400,
  isEligible: true,
  listings: 1,
  history: [
    { 
      id: 1, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      date: new Date(2023, 5, 15)
    },
    { 
      id: 2, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      date: new Date(2023, 5, 10)
    },
    { 
      id: 3, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      date: new Date(2023, 5, 5)
    },
    { 
      id: 4, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      date: new Date(2023, 4, 28)
    },
    { 
      id: 5, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      date: new Date(2023, 4, 20)
    },
    { 
      id: 6, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      date: new Date(2023, 4, 15)
    },
    { 
      id: 7, 
      tenant: 'John Price', 
      status: 'pending', 
      property: 'Apartment - flat in the center of Agadir',
      date: new Date(2023, 4, 10)
    }
  ]
};

// Icons
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9.5" stroke="#D1D1D1" />
    <path d="M10 6V7" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 10V14" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#25A348" />
    <path d="M16 9L10.5 14.5L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="white"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4L10 8L6 12" stroke="#8F27CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

// Performance Button Component with arrow
const PerformanceButton = ({ text, onClick }: { text: string, onClick: () => void }) => {
  return (
    <div className="performance-button-wrapper" onClick={onClick}>
      <PurpleButtonSM32 text={`${text} →`} />
    </div>
  );
};

// View More Button Component with arrow
const ViewMoreButton = ({ text, onClick }: { text: string, onClick: () => void }) => {
  return (
    <div className="view-more-button-wrapper" onClick={onClick}>
      <PurpleButtonSM32 text={`${text} →`} />
    </div>
  );
};

// Let's create a referral illustration component
const ReferralIllustration = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M90 10C45.8 10 10 45.8 10 90c0 44.2 35.8 80 80 80s80-35.8 80-80c0-44.2-35.8-80-80-80z" fill="#F5F0FA"/>
      <g>
        <path d="M61 65c0-3.3 2.7-6 6-6h46c3.3 0 6 2.7 6 6v50c0 3.3-2.7 6-6 6H67c-3.3 0-6-2.7-6-6V65z" fill="#8F27CE"/>
        <text x="90" y="95" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">200</text>
      </g>
      <g>
        <circle cx="50" cy="85" r="25" fill="#FFD6C2"/>
        <path d="M50 70c-8.3 0-15 6.7-15 15s6.7 15 15 15c4.1 0 7.8-1.6 10.6-4.3l-5.3-5.3c-1.4 1.4-3.2 2.1-5.3 2.1-4.1 0-7.5-3.4-7.5-7.5s3.4-7.5 7.5-7.5 7.5 3.4 7.5 7.5c0 1-.2 2-.6 2.9l5.7 5.7c1.7-2.7 2.7-5.9 2.7-9.4 0-8.3-6.7-15-15-15z" fill="#FF7F50"/>
      </g>
      <g>
        <circle cx="130" cy="85" r="25" fill="#FFD6C2"/>
        <path d="M130 70c8.3 0 15 6.7 15 15s-6.7 15-15 15c-4.1 0-7.8-1.6-10.6-4.3l5.3-5.3c1.4 1.4 3.2 2.1 5.3 2.1 4.1 0 7.5-3.4 7.5-7.5s-3.4-7.5-7.5-7.5-7.5 3.4-7.5 7.5c0 1 .2 2 .6 2.9l-5.7 5.7c-1.7-2.7-2.7-5.9-2.7-9.4 0-8.3 6.7-15 15-15z" fill="#FF7F50"/>
      </g>
      <path d="M60 85h60" stroke="#8F27CE" strokeWidth="2" strokeDasharray="4 4"/>
    </g>
  </svg>
);

const ReferralProgramPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState(mockReferralData);
  const [currentBonus, setCurrentBonus] = useState("5%");
  const [isCopied, setIsCopied] = useState(false);

  // Function to copy referral code to clipboard
  const copyReferralCode = () => {
    navigator.clipboard.writeText(data.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Function to navigate to the performance details
  const handleViewPerformance = () => {
    navigate('/dashboard/advertiser/referral-program/performance');
  };

  // Function to navigate to the booking simulator
  const handleGoToSimulator = () => {
    navigate('/dashboard/advertiser/referral-program/simulator');
  };

  // Function to handle payout request
  const handleRequestPayout = () => {
    // This would make an API call to request a payout
    console.log('Requesting payout');
  };

  // Function to book a photoshoot
  const handleBookPhotoshoot = () => {
    navigate('/photoshoot-booking');
  };

  // Component for the copy button with custom styling
  const CopyButton = () => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
      navigator.clipboard.writeText("ABC1234");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    
    return (
      <div className="copy-button-wrapper">
        <button className="copy-button" onClick={handleCopy}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="none"/>
            <path d="M8 4V16H20V4H8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 16V20H4V8H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {copied && <div className="tooltip">Copied!</div>}
        </button>
      </div>
    );
  };

  return (
    <ReferralProgramPageStyle>
      <div className="page-header">
        <h2>Kaari's Referral Program</h2>
        <div className="header-buttons">
          <PurpleButtonMB48 
            text="My Performance"
            onClick={handleViewPerformance}
            type="button"
            children={<img src={ArrowIcon} alt="Arrow" style={{ width: '20px', height: '20px' }}/>}
          >
          </PurpleButtonMB48>
        </div>
      </div>

      <div className="cards-layout">
        <div className="main-column">
          {/* Referral Code Card */}
          <div className="card referral-code">
            <h2>Your Referral Code</h2>
            <div className="referral-code-content">
              <div className="code-section">
                <div className="code-container">
                  <input type="text" value="ABC1234" readOnly />
                  <CopyButton />
                </div>
                <p className="info-text">
                  Give tenants your unique promocode when you can't accommodate them. They get 200 MAD off, and you earn a bonus!
                </p>
              </div>
              <div className="illustration">
                <ReferralIllustration />
              </div>
            </div>
          </div>

          {/* Current Performance Card */}
          <div className="card performance">
            <h2>Your Current Performance</h2>
            <p className="bonus-text">
              Current bonus: 5% of tenant's first rent
            </p>

            <div className="bonus-explainer">
              <InfoIcon />
              <span>List 1 more property to get 8% bonus</span>
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

            {/* Action Buttons */}
            <div className="button-group">
              <div className="button-wrapper">
                <PurpleButtonLB60 text="Book a Photoshoot" onClick={handleBookPhotoshoot} />
              </div>
              <div className="button-wrapper">
                <BpurpleButtonLB60 text="Go to Simulator" onClick={handleGoToSimulator} />
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          {/* Your Progress Card */}
          <div className="card progress-card">
            <div className="card-header">
              <h2>Your Progress</h2>
              <a href="#" className="details-link" onClick={(e) => { e.preventDefault(); handleViewPerformance(); }}>
                Details <ArrowRightIcon />
              </a>
            </div>

            <div className="progress-divider"></div>

            <div className="progress-stats">
              <div className="stat-row">
                <span className="stat-label">Total Referrals</span>
                <span className="stat-value positive">
                  <span className="trend-indicator up">
                    <UpArrowIndicator />
                  </span>
                  10
                </span>
              </div>
              
              <div className="progress-divider"></div>

              <div className="stat-row">
                <span className="stat-label">Successful Bookings</span>
                <span className="stat-value negative">
                  <span className="trend-indicator down">
                    <DownArrowIndicator />
                  </span>
                  7
                </span>
              </div>
              
              <div className="progress-divider"></div>

              <div className="stat-row">
                <span className="stat-label">Monthly earnings</span>
                <span className="stat-value">1200 MAD</span>
              </div>
              
              <div className="progress-divider"></div>

              <div className="stat-row">
                <span className="stat-label">Annual earnings</span>
                <span className="stat-value">14400 MAD</span>
              </div>
              
              <div className="progress-divider"></div>
            </div>

            <h2 className="eligibility-title">Eligibility</h2>
            
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
              <PurpleButtonLB60 
                text="Request Payout" 
                onClick={handleRequestPayout}
              />
            </div>
          </div>
        </div>
      </div>
    </ReferralProgramPageStyle>
  );
};

export default ReferralProgramPage;