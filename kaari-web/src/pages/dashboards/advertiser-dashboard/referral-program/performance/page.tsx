import React, { useState, useEffect } from 'react';
import { PerformancePageStyle } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dwonarrow from '../../../../../components/skeletons/icons/Icon_arrow_Down.svg'
import uparrow from '../../../../../components/skeletons/icons/Icon_arrow_Up.svg'
import IconVerified from '../../../../../components/skeletons/icons/Icon_Verified.svg'
import iconinfo from '../../../../../components/skeletons/icons/Icon_Info2.svg'
import { PurpleButtonMB48 } from "../../../../../components/skeletons/buttons/purple_MB48";
import { ReferralHistoryTable } from './styles';
import { useReferralProgram } from '../../../../../hooks/useReferralProgram';

// Icons
const CheckIcon = () => (
  <img src={IconVerified}/>
);

const InfoIcon = () => (
  <img src= {iconinfo}/>
);

// Up and Down arrow indicators
const UpArrowIndicator = () => (
  <img src={uparrow} />
);

const DownArrowIndicator = () => (
  <img src={dwonarrow}/>
);

const PerformancePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    referralData, 
    loading, 
    error, 
    requestPayout
  } = useReferralProgram();

  // Function to handle going back to the main referral program page
  const handleBackClick = () => {
    navigate('/dashboard/advertiser/referral-program');
  };

  // Function to handle payout request
  const handleRequestPayout = async () => {
    const success = await requestPayout();
    if (success) {
      // Show success message
      console.log('Payout requested successfully');
    }
  };

  

  // Render loading state
  if (loading) {
    return (
      <PerformancePageStyle>
        <div className="page-header">
          <div>
            <div className="back-link" onClick={handleBackClick}>
              Back
            </div>
            <h1>Your Referral Performance</h1>
          </div>
        </div>
        <div className="loading">Loading performance data...</div>
      </PerformancePageStyle>
    );
  }

  // Render error state
  if (error) {
    return (
      <PerformancePageStyle>
        <div className="page-header">
          <div>
            <div className="back-link" onClick={handleBackClick}>
              Back
            </div>
            <h1>Your Referral Performance</h1>
          </div>
        </div>
        <div className="error">Error: {error}</div>
      </PerformancePageStyle>
    );
  }

  // If no referral data, show a message
  if (!referralData) {
    return (
      <PerformancePageStyle>
        <div className="page-header">
          <div>
            <div className="back-link" onClick={handleBackClick}>
              Back
            </div>
            <h1>Your Referral Performance</h1>
          </div>
        </div>
        <div className="no-data">No performance data available.</div>
      </PerformancePageStyle>
    );
  }

  return (
    <PerformancePageStyle>
      <div className="page-header">
        <div>
        <div className="back-link" onClick={handleBackClick}>
          Back
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
                <span className="number">{referralData.referralStats.totalReferrals}</span>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-name">Bookings</div>
              <div className="metric-value">
                <DownArrowIndicator />
                <span className="number">{referralData.referralStats.successfulBookings}</span>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-name">Bonus</div>
              <div className="metric-value">
                <span className="number purple">{referralData.referralStats.firstRentBonus}</span>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-name">Monthly Earnings</div>
              <div className="metric-value">
                <span className="number purple">{referralData.referralStats.monthlyEarnings}</span>
                <span className="currency">MAD</span>
              </div>
            </div>
          </div>
          
          
          
          {/* Payout Request Button */}
          <div className="payout-button-container">
            <PurpleButtonMB48 
              text="Request Payout" 
              onClick={handleRequestPayout}
            />
          </div>
        </div>
      </div>
      <div className="RH-text">
        Referral History
      </div>
      <ReferralHistoryTable>
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Status</th>
            <th>Property</th>
          </tr>
        </thead>
        <tbody>
          {referralData.referralHistory.length > 0 ? (
            referralData.referralHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.tenantName}</td>
                <td>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
                <td>{item.propertyName || "Not assigned yet"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="no-history">No referral history yet</td>
            </tr>
          )}
        </tbody>
      </ReferralHistoryTable>
    </PerformancePageStyle>
  );
};

// Export the Performance component
export default PerformancePage; 