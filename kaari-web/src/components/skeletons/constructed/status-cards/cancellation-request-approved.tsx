import React from 'react';
import { StatusCardStyleApproved } from '../../../styles/constructed/status-card/status-card-style-approved';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';
import cancelledImage from './icons/girl-thumps-up.svg';

interface CancellationRequestApprovedProps {
  onGoBack?: () => void;
}

const CancellationRequestApproved: React.FC<CancellationRequestApprovedProps> = ({
  onGoBack = () => console.log("Go Back clicked")
}) => {
  return (
    <StatusCardStyleApproved>
      <div className="left-container">
        <div className="text-container">
          <span className="confirmation-status-text">Cancellation Request</span>
          <h3 className="h3-text">Your reservation is cancelled</h3>
        </div>
        <p className="text16-text">
          Your reservation was cancelled successfully!<br />
          We sent your refund to the payment method you provided.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="Go Back" onClick={onGoBack} />
        </div>
      </div>
      <div className="right-container">
        <img src={cancelledImage} alt="Cancellation approved" />
      </div>
    </StatusCardStyleApproved>
  );
};

export default CancellationRequestApproved;
