import React from 'react';
import { StatusCardStyleApproved } from '../../../styles/constructed/status-card/status-card-style-approved';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';

interface ConfirmationToYourLikingProps {
  onHaveIssue?: () => void;
}

const ConfirmationToYourLiking: React.FC<ConfirmationToYourLikingProps> = ({
}) => {
  return (
    <StatusCardStyleApproved>
      <div className="left-container">
        <div className="text-container">
          <span className="confirmation-status-text">Confirmation Status</span>
          <h3 className="h3-text">Everything is to your liking?</h3>
        </div>
        <p className="text16-text">
          If you have an issue, you can apply for a refund.<br />
          After first 24 hours the refund process will not be available.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="I have an issue" onClick={onHaveIssue} />
        </div>
      </div>
      <div className="right-container">
        {/* Time area left empty as requested */}
      </div>
    </StatusCardStyleApproved>
  );
};

export default ConfirmationToYourLiking;
