import React, { useState } from 'react';
import { ReferralProgramPageStyle } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PurpleButtonSM32 } from '../../../../components/skeletons/buttons/purple_SM32';
import { BpurpleButtonMB48 } from '../../../../components/skeletons/buttons/border_purple_MB48'
import { PurpleButtonMB48 } from "../../../../components/skeletons/buttons/purple_MB48";
import arowdown from '../../../../components/skeletons/icons/Icon_arrow_Down.svg'
import arowup from '../../../../components/skeletons/icons/Icon_arrow_Up.svg'
import IconVerified from '../../../../components/skeletons/icons/Icon_Verified.svg'
import ReferralPassGreenSkeleton from '../../../../components/skeletons/cards/referral-pass-green';
import YourReferralLinkCard from '../../../../components/skeletons/cards/your-referral-link';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import YourEarningsCalculatorCard from '../../../../components/skeletons/cards/your-earnings-calculator-card';

// Mock data for the referral program (replace with actual API calls later)
const mockReferralData = {
  code: "ABC1234",
  totalReferrals: 10,
  successfulBookings: 7,
  monthlyEarnings: 1200,
  annualEarnings: 14400,
  currentBonus: "5%",
  nextBonus: "8%",
  nextBonusRequirement: "List 1 more property"
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
  <img src={IconVerified} alt="Verified" />
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
  <img src={arowup} alt="Down Arrow"  />
);

const DownArrowIndicator = () => (
  <img src={arowdown} alt="Down Arrow"  />
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
      </div>

      <div className="cards-layout">
        <div className="main-column">
        <ReferralPassGreenSkeleton />
        <YourReferralLinkCard />

          {/* Current Performance Card */}
          <YourEarningsCalculatorCard />
        </div>

        <div className="sidebar">
          {/* Your Progress Card */}
          <div className="card progress-card">
            <div className="card-header">
              <h2>Your Progress</h2>
            </div>

            <div className="progress-divider"></div>

            <div className="progress-stats-row">
              <div className="stat-col">
                <span className="stat-label">Total Referrals</span>
                <span className="stat-value positive">
                  <span className="trend-indicator up">
                    <UpArrowIndicator />
                  </span>
                  10
                </span>
              </div>
              <div className="stat-col">
                <span className="stat-label">Successful Bookings</span>
                <span className="stat-value negative">
                  <span className="trend-indicator down">
                    <DownArrowIndicator />
                  </span>
                  7
                </span>
              </div>
            </div>

            <div className="earnings-row">
              <div className="earning-col">
                <span className="stat-label">Monthly earnings</span>
                <span className="stat-value">1200 MAD</span>
              </div>
              <div className="earning-col">
                <span className="stat-label">Annual earnings</span>
                <span className="stat-value">14400 MAD</span>
              </div>
            </div>

            <div className="progress-card-buttons">
              <div className="button-wrapper">
                <PurpleButtonMB48 
                  text="Request Payout" 
                  onClick={handleRequestPayout}
                />
              </div>
              <div className="button-wrapper">
                <BpurpleButtonMB48 
                  text="Performance Details" 
                  onClick={handleViewPerformance}
                />
              </div>
            </div>
          </div>
          <NeedHelpCardComponent />
        </div>
      </div>
    </ReferralProgramPageStyle>
  );
};

export default ReferralProgramPage;