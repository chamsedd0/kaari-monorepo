import React from 'react';
import { StatusCardStyleRejected } from '../../../styles/constructed/status-card/status-card-style-rejected';
import rejectedImage from './icons/girl-rejecting.svg';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';

interface ConfirmationRequestRejectedProps {
  requestId?: string;
  location?: string;
  onFindAlternative?: () => void;
}

const ConfirmationRequestRejected: React.FC<ConfirmationRequestRejectedProps> = ({
  requestId = "2068291",
  location = "Apgar",
}) => {
  return (
    <StatusCardStyleRejected>
      <div className="left-container">
        <div className="text-container">
          <div className="confirmation-status-text">Confirmation Status</div>
          <div className="h3-text">Your request is rejected</div>
        </div>
        <div className="text16-text">
          We have to inform you that your reservation request ID {requestId} for the
          offer Apartment in {location} has been rejected by the advertiser. We are
          truly sorry for that.
        </div>
        <div className="button-container">
          <WhiteButtonLB48 
            text="Find other housing" 
            onClick={onFindAlternative} 
          />
        </div>
      </div>
      <div className="right-container">
        <img src={rejectedImage} alt="Request rejected illustration" />
      </div>
    </StatusCardStyleRejected>
  );
};

export default ConfirmationRequestRejected;
