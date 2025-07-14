import React, { useState } from 'react';
import { PerformancePageStyle } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dwonarrow from '../../../../../components/skeletons/icons/Icon_arrow_Down.svg'
import uparrow from '../../../../../components/skeletons/icons/Icon_arrow_Up.svg'
import IconVerified from '../../../../../components/skeletons/icons/Icon_Verified.svg'
import iconinfo from '../../../../../components/skeletons/icons/Icon_Info2.svg'
import { PurpleButtonMB48 } from "../../../../../components/skeletons/buttons/purple_MB48";
import { ReferralHistoryTable } from './styles';

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
          {data.history.map((item) => (
            <tr key={item.id}>
              <td>{item.tenant}</td>
              <td>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
              <td>{item.property}</td>
            </tr>
          ))}
        </tbody>
      </ReferralHistoryTable>
    </PerformancePageStyle>
  );
};

// Export the Performance component
export default PerformancePage; 