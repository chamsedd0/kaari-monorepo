import React, { useState, useEffect } from 'react';
import { SimulatorPageStyle } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PurpleButtonLB60 } from '../../../../../components/skeletons/buttons/purple_LB60';
import {BpurpleButtonLB40} from '../../../../../components/skeletons/buttons/border_purple_LB40'
import Iconinfo  from '../../../../../components/skeletons/icons/Icon_Info2.svg';
import {PurpleButtonMB48} from '../../../../../components/skeletons/buttons/purple_MB48'
import { useReferralProgram } from '../../../../../hooks/useReferralProgram';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#8F27CE" />
    <path d="M14 11H11V14H9V11H6V9H9V6H11V9H14V11Z" fill="white"/>
  </svg>
);

const MinusIcon = ({ disabled = false }) => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" 
    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
    <circle cx="10" cy="10" r="10" fill="#8F27CE"/>
    <path d="M14 11H6V9H14V11Z" fill="white"/>
  </svg>
);

// Estimation Tooltip Icon
const CommissionInfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9.5" stroke="#D1D1D1" />
    <path d="M10 6V7" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 10V14" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// SimulatorPage component
const SimulatorPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    referralData, 
    loading, 
    error, 
    calculateBonusRate
  } = useReferralProgram();
  
  const [numberOfListings, setNumberOfListings] = useState(1);
  const [monthlyReferrals, setMonthlyReferrals] = useState(10);
  const [tenantRent, setTenantRent] = useState(300);
  const [bonusRate, setBonusRate] = useState("5%");
  const [successfulBookings, setSuccessfulBookings] = useState(10);
  
  // Initialize simulator with actual data when available
  useEffect(() => {
    if (referralData) {
      // Set initial values based on real data if available
      setMonthlyReferrals(referralData.referralStats.totalReferrals || 10);
      setSuccessfulBookings(referralData.referralStats.successfulBookings || 10);
      setBonusRate(referralData.referralStats.firstRentBonus || "5%");
    }
  }, [referralData]);
  
  // Calculate results based on inputs
  useEffect(() => {
    // Update bonus rate based on number of listings
    const newBonusRate = calculateBonusRate(numberOfListings);
    setBonusRate(newBonusRate);
    
    // Set successful bookings based on monthly referrals
    // In a real app, this would be calculated with a conversion rate
    setSuccessfulBookings(monthlyReferrals);
  }, [numberOfListings, monthlyReferrals, calculateBonusRate]);
  
  // Calculate monthly and annual earnings
  const calculateEarnings = () => {
    const rate = parseInt(bonusRate, 10) / 100;
    const monthlyEarnings = successfulBookings * tenantRent * rate;
    const annualEarnings = monthlyEarnings * 12;
    
    return {
      monthly: monthlyEarnings,
      annual: annualEarnings
    };
  };
  
  const earnings = calculateEarnings();

  // Function to handle going back to the main referral program page
  const handleBackClick = () => {
    navigate('/dashboard/advertiser/referral-program');
  };
  
  // Function to handle incrementing and decrementing listings
  const incrementListings = () => {
    setNumberOfListings(prev => prev + 1);
  };
  
  const decrementListings = () => {
    if (numberOfListings > 1) {
      setNumberOfListings(prev => prev - 1);
    }
  };
  
  // Handle book photoshoot click
  const handleBookPhotoshoot = () => {
    navigate('/photoshoot-booking');
  };

  // Get the next bonus level message
  const getNextBonusMessage = () => {
    if (bonusRate === "5%") {
      return "List 1 more property to get 8% bonus";
    } else if (bonusRate === "8%") {
      return "List 3 more properties to get 10% bonus";
    } else {
      return "You've reached the maximum bonus level!";
    }
  };

  // Render loading state
  if (loading) {
    return (
      <SimulatorPageStyle>
        <div className="page-header">
          <div className="back-link" onClick={handleBackClick}>
            Back
          </div>
          <h1>Boost Your Referral Bonus</h1>
        </div>
        <div className="loading">Loading simulator data...</div>
      </SimulatorPageStyle>
    );
  }

  // Render error state
  if (error) {
    return (
      <SimulatorPageStyle>
        <div className="page-header">
          <div className="back-link" onClick={handleBackClick}>
            Back
          </div>
          <h1>Boost Your Referral Bonus</h1>
        </div>
        <div className="error">Error: {error}</div>
      </SimulatorPageStyle>
    );
  }

  return (
    <SimulatorPageStyle>
      <div className="page-header">
        <div className="back-link" onClick={handleBackClick}>
          Back
        </div>
        <h1>Boost Your Referral Bonus</h1>
      </div>

      <div className="simulator-layout">
        <div className="input-panel">
          <h2>Enter Listings</h2>
          
          <div className="listings-input">
           
              <div className="listing-controls">
                <div className="control-button" onClick={numberOfListings > 1 ? decrementListings : undefined}>
                  <MinusIcon disabled={numberOfListings <= 1} />
                </div>
                <input 
                  type="text" 
                  value={numberOfListings} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setNumberOfListings(value);
                    }
                  }} 
                />
                <div className="control-button" onClick={incrementListings}>
                  <PlusIcon />
                </div>
              </div>
       
            
            <div className="photoshoot-button-wrapper">
              <BpurpleButtonLB40 text="Book a Photoshoot" onClick={handleBookPhotoshoot}>
              </BpurpleButtonLB40>
            </div>
            <div className="info-text">
            <img src={Iconinfo} alt="Info" />
            <span>{getNextBonusMessage()}</span>
          </div>
          </div>
          
          
          
          <div className="bonus-progress">
            <div className="percentage-labels">
              <span>5%</span>
              <span>8%</span>
              <span>10%</span>
            </div>
            <div className="progress-bar">
              <div className={`segment ${bonusRate === "5%" ? "active" : ""}`}></div>
              <div className={`segment ${bonusRate === "8%" ? "active" : ""}`}></div>
              <div className={`segment ${bonusRate === "10%" ? "active" : ""}`}></div>
            </div>
            <div className="range-labels">
              <span>1-2 listings</span>
              <span>3-10 listings</span>
              <span>11+ listings</span>
            </div>
          </div>
          
          <div className="sliders">
            <div className="slider-section">
              <div className='label'>Average Monthly Referrals</div>
              <div className="slider-container">
                <span className="min-value">0</span>
                <div className="slider-track" style={{ "--slider-percent": monthlyReferrals * 2 } as React.CSSProperties}>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={monthlyReferrals} 
                    onChange={(e) => setMonthlyReferrals(parseInt(e.target.value))}
                  />
                  <div className="slider-bubble" style={{ left: `${monthlyReferrals * 2}%` }}>
                    {monthlyReferrals}
                  </div>
                </div>
                <span className="max-value">50</span>
              </div>
            </div>
            
            <div className="slider-section">
              <div className='label'>Average Tenant Rent</div>
              <div className="slider-container">
                <span className="min-value">0</span>
                <div className="slider-track" style={{ "--slider-percent": tenantRent / 5 } as React.CSSProperties}>
                  <input 
                    type="range" 
                    min="0" 
                    max="500" 
                    value={tenantRent} 
                    onChange={(e) => setTenantRent(parseInt(e.target.value))}
                  />
                  <div className="slider-bubble" style={{ left: `${tenantRent / 5}%` }}>
                    {tenantRent}
                  </div>
                </div>
                <span className="max-value">500</span>
              </div>
            </div>
          </div>
        </div>

        <div className="results-panel">
          <h2>Your Estimated Earnings</h2>

          <div className="annual-earnings">
            <div className="earnings-label">Annual earnings</div>
            <div className="earnings-value">{earnings.annual} MAD</div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">First rent's bonus</div>
              <div className="stat-value">{bonusRate}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Successful Bookings</div>
              <div className="stat-value">{successfulBookings}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Referrals</div>
              <div className="stat-value">{monthlyReferrals}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Monthly earnings</div>
              <div className="stat-value">{earnings.monthly} MAD</div>
            </div>
          </div>

          <div className="book-photoshoot-container">
            <PurpleButtonMB48 
              text="Book a Photoshoot" 
              onClick={handleBookPhotoshoot}
            />
          </div>

          <div className="commission-info">
          <img src={Iconinfo} alt="Info" />
            <span>Kaari's Commission Model</span>
          </div>
        </div>
      </div>
    </SimulatorPageStyle>
  );
};

export default SimulatorPage; 