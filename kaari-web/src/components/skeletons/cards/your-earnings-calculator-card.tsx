import React, { useState } from "react";
import { CardBaseModelStyleYourEarningsCalculator as RawCardBaseModelStyleYourEarningsCalculator } from "../../styles/cards/card-base-model-style-your-earnings-calculator";
import { PurpleButtonMB48 } from "../buttons/purple_MB48";

interface EarningsCalculatorProps {
  referralsThumbPos?: number;
  showReferralsValue?: boolean;
  referralsValue?: number;
  rentThumbPos?: number;
  showRentValue?: boolean;
  rentValue?: number;
}

const CardBaseModelStyleYourEarningsCalculator = RawCardBaseModelStyleYourEarningsCalculator as React.ComponentType<React.PropsWithChildren<EarningsCalculatorProps>>;

const MIN_REFERRALS = 0;
const MAX_REFERRALS = 50;
const MIN_RENT = 0;
const MAX_RENT = 500;

// Helper to calculate thumb position in percent
const getThumbPosition = (value: number, min: number, max: number) => ((value - min) / (max - min)) * 100;

export const YourEarningsCalculatorCard = () => {
  const [monthlyReferrals, setMonthlyReferrals] = useState(10);
  const [tenantRent, setTenantRent] = useState(300);
  const [showReferralsValue, setShowReferralsValue] = useState(false);
  const [showRentValue, setShowRentValue] = useState(false);

  // Example calculation logic (replace with real logic as needed)
  const firstRentBonus = 0.1; // 10%
  const successfulBookings = monthlyReferrals;
  const totalReferrals = monthlyReferrals;
  const monthlyEarnings = Math.round(monthlyReferrals * tenantRent * firstRentBonus);
  const annualEarnings = monthlyEarnings * 12;

  return (
    <CardBaseModelStyleYourEarningsCalculator
      referralsThumbPos={getThumbPosition(monthlyReferrals, MIN_REFERRALS, MAX_REFERRALS)}
      showReferralsValue={showReferralsValue}
      referralsValue={monthlyReferrals}
      rentThumbPos={getThumbPosition(tenantRent, MIN_RENT, MAX_RENT)}
      showRentValue={showRentValue}
      rentValue={tenantRent}
    >
      <div className="title">Your Earnings Calculator</div>
      <div className="right-left-container">
        {/* Left Container */}
        <div className="left-container">
          {/* Referrals Slider */}
          <div className="label-slider-container">
            <div className="label-text">Average Monthly Referrals</div>
            <div className="slider-wrapper">
              <span className="slider-thumb-value referrals-value">{monthlyReferrals}</span>
              <span>0</span>
              <input
                className="slider"
                type="range"
                min={MIN_REFERRALS}
                max={MAX_REFERRALS}
                value={monthlyReferrals}
                onChange={e => setMonthlyReferrals(Number(e.target.value))}
                onMouseDown={() => setShowReferralsValue(true)}
                onMouseUp={() => setShowReferralsValue(false)}
                onTouchStart={() => setShowReferralsValue(true)}
                onTouchEnd={() => setShowReferralsValue(false)}
                onBlur={() => setShowReferralsValue(false)}
                onFocus={() => setShowReferralsValue(true)}
                style={{
                  '--progress': `${((monthlyReferrals - MIN_REFERRALS) / (MAX_REFERRALS - MIN_REFERRALS)) * 100}%`
                } as React.CSSProperties}
              />
              <span>{MAX_REFERRALS}</span>
            </div>
          </div>
          {/* Rent Slider */}
          <div className="label-slider-container">
            <div className="label-text">Average Tenant Rent</div>
            <div className="slider-wrapper">
              <span className="slider-thumb-value rent-value">{tenantRent}</span>
              <span>0</span>
              <input
                className="slider"
                type="range"
                min={MIN_RENT}
                max={MAX_RENT}
                value={tenantRent}
                onChange={e => setTenantRent(Number(e.target.value))}
                onMouseDown={() => setShowRentValue(true)}
                onMouseUp={() => setShowRentValue(false)}
                onTouchStart={() => setShowRentValue(true)}
                onTouchEnd={() => setShowRentValue(false)}
                onBlur={() => setShowRentValue(false)}
                onFocus={() => setShowRentValue(true)}
                style={{
                  '--progress': `${((tenantRent - MIN_RENT) / (MAX_RENT - MIN_RENT)) * 100}%`
                } as React.CSSProperties}
              />
              <span>{MAX_RENT}</span>
            </div>
          </div>
          <div className="button-container">
            <PurpleButtonMB48 text="Book a Photoshoot" onClick={() => {}} />
          </div>
        </div>
        {/* Right Container */}
        <div className="right-container">
          <div className="text-container">
            <div className="gray-text">Monthly earnings</div>
            <div className="h2">{monthlyEarnings} MAD</div>
          </div>
          <div className="stats-grid">
            <div className="stat-block">
              <div className="stat-label">First rent's bonus</div>
              <div className="stat-value">{Math.round(firstRentBonus * 100)}%</div>
            </div>
            <div className="stat-block">
              <div className="stat-label">Successful Bookings</div>
              <div className="stat-value">{successfulBookings}</div>
            </div>
            <div className="stat-block">
              <div className="stat-label">Total Referrals</div>
              <div className="stat-value">{totalReferrals}</div>
            </div>
            <div className="stat-block">
              <div className="stat-label">Annual earnings</div>
              <div className="stat-value mad">{annualEarnings} MAD</div>
            </div>
          </div>
        </div>
      </div>
    </CardBaseModelStyleYourEarningsCalculator>
  );
};

export default YourEarningsCalculatorCard;
