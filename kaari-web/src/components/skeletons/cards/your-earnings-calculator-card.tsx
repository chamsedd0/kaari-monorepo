import React, { useState } from "react";
import { CardBaseModelStyleYourEarningsCalculator } from "../../styles/cards/card-base-model-style-your-earnings-calculator";
import { PurpleButtonMB48 } from "../buttons/purple_MB48";

const MIN_REFERRALS = 0;
const MAX_REFERRALS = 50;
const MIN_RENT = 0;
const MAX_RENT = 500;

export const YourEarningsCalculatorCard = () => {
  const [monthlyReferrals, setMonthlyReferrals] = useState(10);
  const [tenantRent, setTenantRent] = useState(300);

  // Example calculation logic (replace with real logic as needed)
  const firstRentBonus = 0.1; // 10%
  const successfulBookings = monthlyReferrals;
  const totalReferrals = monthlyReferrals;
  const monthlyEarnings = Math.round(monthlyReferrals * tenantRent * firstRentBonus);
  const annualEarnings = monthlyEarnings * 12;

  return (
    <CardBaseModelStyleYourEarningsCalculator>
      <div className="title">Your Earnings Calculator</div>
      <div className="right-left-container">
        {/* Left Container */}
        <div className="left-container">
          {/* Referrals Slider */}
          <div className="label-slider-container">
            <div className="label-text">Average Monthly Referrals</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <span>0</span>
              <input
                className="slider"
                type="range"
                min={MIN_REFERRALS}
                max={MAX_REFERRALS}
                value={monthlyReferrals}
                onChange={e => setMonthlyReferrals(Number(e.target.value))}
                style={{ margin: "0 12px", flex: 1 }}
              />
              <span>{MAX_REFERRALS}</span>
            </div>
            <div style={{ marginTop: -32, marginBottom: 8 }}>
              <span style={{
                background: "#fff",
                border: "1px solid #E0E0E0",
                borderRadius: 20,
                padding: "2px 18px",
                fontWeight: 500,
                fontSize: 18,
                position: "relative",
                top: 0,
                left: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>{monthlyReferrals}</span>
            </div>
          </div>
          {/* Rent Slider */}
          <div className="label-slider-container">
            <div className="label-text">Average Tenant Rent</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <span>0</span>
              <input
                className="slider"
                type="range"
                min={MIN_RENT}
                max={MAX_RENT}
                value={tenantRent}
                onChange={e => setTenantRent(Number(e.target.value))}
                style={{ margin: "0 12px", flex: 1 }}
              />
              <span>{MAX_RENT}</span>
            </div>
            <div style={{ marginTop: -32, marginBottom: 8 }}>
              <span style={{
                background: "#fff",
                border: "1px solid #E0E0E0",
                borderRadius: 20,
                padding: "2px 18px",
                fontWeight: 500,
                fontSize: 18,
                position: "relative",
                top: 0,
                left: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>{tenantRent}</span>
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
