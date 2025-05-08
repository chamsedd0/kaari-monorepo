import React from 'react';
import styled from 'styled-components';
import { StatusCardStyleApproved } from '../../../../components/styles/constructed/status-card/status-card-style-approved';
import { WhiteButtonLB48 } from '../../../../components/skeletons/buttons/white_LB48';
import { BwhiteButtonLB48 } from '../../../../components/skeletons/buttons/border_white_LB48';
import TimerComponent from '../../../../components/skeletons/constructed/status-cards/TimerComponent';

interface ApprovedReservationWithTimerProps {
  onConfirmPayment?: () => void;
  onCancelReservation?: () => void;
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

// This is a direct copy of the ConfirmationRequestApproved component but with the timer added
const ApprovedReservationWithTimer: React.FC<ApprovedReservationWithTimerProps> = ({
  onConfirmPayment,
  onCancelReservation,
  expiryTime
}) => {
  return (
    <StyledStatusCard>
      <div className="left-container">
        <div className="text-container">
          <span className="confirmation-status-text">Confirmation Status</span>
          <h3 className="h3-text">Your request is approved!</h3>
        </div>
        <p className="text16-text">
          You have 24 hours to confirm your reservation.
          Confirmation will result in your payment being processed.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="Confirm Payment" onClick={onConfirmPayment} />
          <BwhiteButtonLB48 text="Cancel Reservation" onClick={onCancelReservation} />
        </div>
      </div>
      <div className="right-container">
        {expiryTime && <TimerComponent expiryTime={expiryTime} />}
      </div>
    </StyledStatusCard>
  );
};

export default ApprovedReservationWithTimer; 