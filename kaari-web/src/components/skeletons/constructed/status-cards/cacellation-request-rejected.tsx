import React from 'react';
import { StatusCardStyleRejected } from '../../../styles/constructed/status-card/status-card-style-rejected';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';
import rejectedImage from './icons/girl-rejecting.svg';

interface CancellationRequestRejectedProps {
  onResubmit?: () => void;
}

const CancellationRequestRejected: React.FC<CancellationRequestRejectedProps> = ({
}) => {
  return (
    <StatusCardStyleRejected>
      <div className="left-container">
        <div className="text-container">
          <span className="confirmation-status-text">Cancellation Request</span>
          <h3 className="h3-text">Your cancel request was declined</h3>
        </div>
        <p className="text16-text">
          Unfortunately, we could not accept your cancel request due to lack of
          evidence or non-truthful proof you provided.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="Resubmit request" onClick={onResubmit} />
        </div>
      </div>
      <div className="right-container">
        <img src={rejectedImage} alt="Cancellation rejected" />
      </div>
    </StatusCardStyleRejected>
  );
};

export default CancellationRequestRejected;
