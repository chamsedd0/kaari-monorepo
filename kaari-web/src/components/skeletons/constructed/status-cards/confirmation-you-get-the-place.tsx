import React from 'react';
import { StatusCardStyleApproved } from '../../../styles/constructed/status-card/status-card-style-approved';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';
import { BwhiteButtonLB48 } from '../../buttons/border_white_LB48';
import girlSuccessImage from './icons/girl-thumps-up.svg';

interface ConfirmationYouGetThePlaceProps {
  onMovedIn?: () => void;
  onHaveIssue?: () => void;
}

const ConfirmationYouGetThePlace: React.FC<ConfirmationYouGetThePlaceProps> = ({
}) => {
  return (
    <StatusCardStyleApproved>
      <div className="left-container">
        <div className="text-container">
          <span className="confirmation-status-text">Confirmation Status</span>
          <h3 className="h3-text">Congratulations, you got the place!</h3>
        </div>
        <p className="text16-text">
          Congratulations! Now the place is yours!<br />
          Please make sure you notify your move-in to us.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="I moved in" onClick={onMovedIn} />
          <BwhiteButtonLB48 text="I have an issue" onClick={onHaveIssue} />
        </div>
      </div>
      <div className="right-container">
        <img src={girlSuccessImage} alt="Success illustration" />
      </div>
    </StatusCardStyleApproved>
  );
};

export default ConfirmationYouGetThePlace;
