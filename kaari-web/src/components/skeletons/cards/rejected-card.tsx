import React from 'react';
import { CardBaseModelStyleRejected } from '../../styles/cards/card-base-model-style-rejected';
import { WhiteButtonLB48 } from '../buttons/white_LB48';
import rejectedIcon from '../icons/Sad-Face.svg';
import rejectedImage from '../icons/rejected.svg';

const RejectedCard: React.FC = () => {
  return (
    <CardBaseModelStyleRejected>
      <div className="left-container">
        <span className="confirmation-status-text">Confirmation Status</span>
        <div className="text-icon-container">
          <h3 className="h3-text">Your Request has been rejected</h3>
          <img src={rejectedIcon} alt="Rejected" />
        </div>
        <p className="text16-text">
          We hate to inform you that your reservation request (ID 3082571) for the offer Apartment in Agadir has been rejected by the advertiser. We are truly sorry for that.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 
            text="Find other housing" 
          />
        </div>
      </div>
      <div className="right-container">
        <img src={rejectedImage} alt="Rejected Request" />
      </div>
    </CardBaseModelStyleRejected>
  );
};

export default RejectedCard;

