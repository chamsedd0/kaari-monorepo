import React from "react";
import { CardBaseModelStyleReferralPassGreen } from "../../styles/cards/card-base-model-style-referral-Pass-green";
import IconInfo1 from "../icons/Icon_Info.svg";
import SincePassCard from "./since-pass-card";
import YourPassIsActiveCard from "./your-pass-is-active-card";

const ReferralPassGreenSkeleton: React.FC = () => {
  return (
    <CardBaseModelStyleReferralPassGreen>
      <div className="left-container">
        <div className="title-text">Referral Pass</div>
        <div className="time-container">
            {/* timer */}
          <div className="time-text">Until Renewal</div>
        </div>
        <SincePassCard 
          listingsCurrent={3} 
          listingsTotal={10} 
          bookingsCurrent={1} 
          bookingsTotal={3} 
        />

      </div>
      <div className="right-container">
      <YourPassIsActiveCard validUntil="06.07.2025" passStatus="Your Pass is Active!" />
        <div className="icon-text12-container">
          <img src={IconInfo1} alt="info" />
          <div className="text-12">List 10 properties or get 3 bookings to keep your Pass!</div>
        </div>
      </div>
    </CardBaseModelStyleReferralPassGreen>
  );
};

export default ReferralPassGreenSkeleton;
