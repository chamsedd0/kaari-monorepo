import React from 'react';
import { StatusCardStylePending } from '../../../styles/constructed/status-card/status-card-style-pending';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';
import girlThinkingImage from './icons/girl-review.svg';
interface CancellationRequestUnderReviewProps {
  onContactSupport?: () => void;
}

const CancellationRequestUnderReview: React.FC<CancellationRequestUnderReviewProps> = ({
  onContactSupport = () => console.log("Contact support clicked")
}) => {
  return (
    <StatusCardStylePending>
      <div className="left-container">
        <div className="text-container">
          <span className="confirmation-status-text">Cancellation Status</span>
          <h3 className="h3-text">Your request is under review</h3>
        </div>
        <p className="text16-text">
          We are currently reviewing your cancellation request.<br />
          Our team will process it as soon as possible.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="Contact Support" onClick={onContactSupport} />
        </div>
      </div>
      <div className="right-container">
        <img src={girlThinkingImage} alt="Girl thinking" />
      </div>
    </StatusCardStylePending>
  );
};

export default CancellationRequestUnderReview;
