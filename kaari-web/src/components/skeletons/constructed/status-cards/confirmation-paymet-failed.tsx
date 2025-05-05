import React from 'react';
import { StatusCardStyleRejected } from '../../../styles/constructed/status-card/status-card-style-rejected';
import paymentFailedImage from './icons/girl-payment-failed.svg';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';

interface ConfirmationPaymentFailedProps {
  onRetryPayment?: () => void;
}

const ConfirmationPaymentFailed: React.FC<ConfirmationPaymentFailedProps> = ({
  onRetryPayment = () => console.log("Retry payment clicked")
}) => {
  return (
    <StatusCardStyleRejected>
      <div className="left-container">
        <div className="text-container">
          <div className="confirmation-status-text">Confirmation Status</div>
          <div className="h3-text">Your payment has failed</div>
        </div>
        <div className="text16-text">
          Your payment method was not valid or the bank declined the
          transaction. Make sure your payment method is right and try again.
        </div>
        <div className="button-container">
          <WhiteButtonLB48   
            text="Retry Payment" 
            onClick={onRetryPayment} 
          />
        </div>
      </div>
      <div className="right-container">
        <img src={paymentFailedImage} alt="Payment failed illustration" />
      </div>
    </StatusCardStyleRejected>
  );
};

export default ConfirmationPaymentFailed;
