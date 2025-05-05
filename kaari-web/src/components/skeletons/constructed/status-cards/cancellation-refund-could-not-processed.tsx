import React from 'react';
import { StatusCardStyleRejected } from '../../../styles/constructed/status-card/status-card-style-rejected';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';
import refundFailedImage from './icons/girl-payment-failed.svg';

interface CancellationRefundCouldNotProcessedProps {
  onTryAgain?: () => void;
}

const CancellationRefundCouldNotProcessed: React.FC<CancellationRefundCouldNotProcessedProps> = ({
  onTryAgain = () => console.log("Try again clicked")
}) => {
  return (
    <StatusCardStyleRejected>
      <div className="left-container">
        <div className="text-container">
          <span className="confirmation-status-text">Cancellation Request</span>
          <h3 className="h3-text">The refund could not be processed</h3>
        </div>
        <p className="text16-text">
          Your payment method was not valid or the bank declined the 
          transaction. Make sure your payment method is right and try again.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="Try Again" onClick={onTryAgain} />
        </div>
      </div>
      <div className="right-container">
        <img src={refundFailedImage} alt="Refund failed" />
      </div>
    </StatusCardStyleRejected>
  );
};

export default CancellationRefundCouldNotProcessed;
