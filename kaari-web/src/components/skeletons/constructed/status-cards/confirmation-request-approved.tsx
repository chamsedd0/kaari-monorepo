import React from "react";
import { StatusCardStyleApproved } from "../../../styles/constructed/status-card/status-card-style-approved";
import { WhiteButtonLB48 } from "../../buttons/white_LB48";
import { BwhiteButtonLB48 } from "../../buttons/border_white_LB48";
interface ConfirmationRequestApprovedProps {
  onConfirmPayment?: () => void;
  onCancelReservation?: () => void;
}

const ConfirmationRequestApproved: React.FC<ConfirmationRequestApprovedProps> = ({
  onConfirmPayment,
  onCancelReservation
}) => {
  return (
    <StatusCardStyleApproved>
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
        {/* Timer will be added later */}
      </div>
    </StatusCardStyleApproved>
    
  );
};

export default ConfirmationRequestApproved;
