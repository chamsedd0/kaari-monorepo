import React from "react";
import { CardBaseModelStyleReferralPassred } from "../../styles/cards/card-base-model-style-referral-pass-red";
import IconInfo1 from "../icons/Icon_Info.svg";
import SincePassCard from "./since-pass-card";
import YourPassIsActiveCard from "./your-pass-is-active-card";

interface ReferralPassRedSkeletonProps {
  listingsCurrent: number;
  listingsTotal: number;
  bookingsCurrent: number;
  bookingsTotal: number;
  validUntil: string;
  passStatus: string;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
  isFoundingPartner: boolean;
  isOnboarding?: boolean;
}

const ReferralPassRedSkeleton: React.FC<ReferralPassRedSkeletonProps> = ({
  listingsCurrent,
  listingsTotal,
  bookingsCurrent,
  bookingsTotal,
  validUntil,
  passStatus,
  timeRemaining,
  isFoundingPartner,
  isOnboarding = false
}) => {
  return (
    <CardBaseModelStyleReferralPassred>
      <div className="left-container">
        <div className="title-text">Referral Pass</div>
        <div className="time-container">
          {timeRemaining && !isOnboarding && (
            <div className="countdown-timer">
              <div className="timer-block days">
                <span className="time">{timeRemaining.days}</span>
                <span className="label">Days</span>
              </div>
              <span className="separator">:</span>
              <div className="timer-block hours">
                <span className="time">{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span className="label">Hours</span>
              </div>
              <span className="separator">:</span>
              <div className="timer-block minutes">
                <span className="time">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span className="label">Minutes</span>
              </div>
              <span className="separator">:</span>
              <div className="timer-block seconds">
                <span className="time">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                <span className="label">Seconds</span>
              </div>
            </div>
          )}
          {!isOnboarding && <div className="time-text">Until Renewal</div>}
        </div>
        <SincePassCard 
          listingsCurrent={listingsCurrent} 
          listingsTotal={listingsTotal} 
          bookingsCurrent={bookingsCurrent} 
          bookingsTotal={bookingsTotal} 
          listingsLabel={isOnboarding ? "Listings Required" : "Listings Since Pass"}
          bookingsLabel={isOnboarding ? "Bookings Required" : "Bookings Since Pass"}
        />
      </div>
      <div className="right-container">
        {isOnboarding ? (
          <div className="welcome-message">
            <h3>{passStatus}</h3>
            <p>To get access to your Referral Link, You need to fit the requirements shown below.</p>
          </div>
        ) : (
          <YourPassIsActiveCard validUntil={validUntil} passStatus={passStatus} />
        )}
        <div className="icon-text12-container">
          <img src={IconInfo1} alt="info" />
          <div className="text-12">
            {isOnboarding 
              ? `List ${listingsTotal} properties or get ${bookingsTotal} bookings to keep your Pass!`
              : `List ${listingsTotal} properties or get ${bookingsTotal} bookings to keep your Pass!`
            }
          </div>
        </div>
      </div>
    </CardBaseModelStyleReferralPassred>
  );
};

export default ReferralPassRedSkeleton;

