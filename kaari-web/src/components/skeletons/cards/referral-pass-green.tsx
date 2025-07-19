import React from "react";
import { CardBaseModelStyleReferralPassGreen } from "../../styles/cards/card-base-model-style-referral-Pass-green";
import IconInfo1 from "../icons/Icon_Info.svg";
import SincePassCard from "./since-pass-card";
import YourPassIsActiveCard from "./your-pass-is-active-card";

interface ReferralPassGreenSkeletonProps {
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
}

const ReferralPassGreenSkeleton: React.FC<ReferralPassGreenSkeletonProps> = ({
  listingsCurrent,
  listingsTotal,
  bookingsCurrent,
  bookingsTotal,
  validUntil,
  passStatus,
  timeRemaining,
  isFoundingPartner
}) => {
  return (
    <CardBaseModelStyleReferralPassGreen>
      <div className="left-container">
        <div className="title-text">Referral Pass</div>
        <div className="time-container">
          {timeRemaining && (
            <div className="countdown-timer">
              <div className="timer-block days">
                <span className="time">{timeRemaining.days}</span>
                <span className="label">Days</span>
              </div>
              <span className="separator">·</span>
              <div className="timer-block hours">
                <span className="time">{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span className="label">Hours</span>
              </div>
              <span className="separator">·</span>
              <div className="timer-block minutes">
                <span className="time">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span className="label">Minutes</span>
              </div>
              <span className="separator">·</span>
              <div className="timer-block seconds">
                <span className="time">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                <span className="label">Seconds</span>
              </div>
            </div>
          )}
          <div className="time-text">Until Renewal</div>
        </div>
        <SincePassCard 
          listingsCurrent={listingsCurrent} 
          listingsTotal={listingsTotal} 
          bookingsCurrent={bookingsCurrent} 
          bookingsTotal={bookingsTotal} 
        />
      </div>
      <div className="right-container">
        <YourPassIsActiveCard validUntil={validUntil} passStatus={passStatus} />
        <div className="icon-text12-container">
          <img src={IconInfo1} alt="info" />
          <div className="text-12">
            {isFoundingPartner 
              ? "As a founding partner, your pass is active for 90 days with no conditions."
              : `List ${listingsTotal} properties or get ${bookingsTotal} bookings to keep your Pass!`
            }
          </div>
        </div>
      </div>
    </CardBaseModelStyleReferralPassGreen>
  );
};

export default ReferralPassGreenSkeleton;
