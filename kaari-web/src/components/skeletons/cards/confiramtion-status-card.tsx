import React from 'react';
import { CardBaseModelStyleConfirmationStatus } from '../../styles/cards/card-base-model-style-confirmation-status';
import img from '../../icons/Group.svg'
import { BwhiteButtonLB48 } from '../buttons/border_white_LB48';
const ConfirmationStatusCard: React.FC = () => {
  return (
    <CardBaseModelStyleConfirmationStatus>
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">Your Reservation Request has been sent!</div>
        <div className="text16-text">We will keep you updated on your request. Make sure to check emails regularly.</div>
        <div className="button-container">
          <BwhiteButtonLB48 text="Cancel without charge" />
        </div>
      </div>
      <div className="right-container">
        <img src={img}  />
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

export default ConfirmationStatusCard;

