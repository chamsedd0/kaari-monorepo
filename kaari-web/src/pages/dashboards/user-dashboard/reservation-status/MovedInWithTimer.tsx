import React from 'react';
import styled from 'styled-components';
import { StatusCardStyleApproved } from '../../../../components/styles/constructed/status-card/status-card-style-approved';
import { WhiteButtonLB48 } from '../../../../components/skeletons/buttons/white_LB48';
import TimerComponent from '../../../../components/skeletons/constructed/status-cards/TimerComponent';

interface MovedInWithTimerProps {
  onHaveIssue?: () => void;
  expiryTime: Date | null;
}

// Style the right container to better position the timer
const StyledStatusCard = styled(StatusCardStyleApproved)`
  & .right-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
`;

// This is a direct copy of the ConfirmationToYourLiking component but with the timer added
const MovedInWithTimer: React.FC<MovedInWithTimerProps> = ({
  onHaveIssue,
  expiryTime
}) => {
  return (
    <StyledStatusCard>
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
        {expiryTime && <TimerComponent expiryTime={expiryTime} />}
      </div>
    </StyledStatusCard>
  );
};

export default MovedInWithTimer; 