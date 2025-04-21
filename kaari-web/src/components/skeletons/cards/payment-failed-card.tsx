import React from 'react';
import { CardBaseModelStylePaymentFailed } from '../../styles/cards/card-base-model-style-payment-failed';
import sadFaceIcon from '../icons/Sad-Face.svg';
import atmImage from '../icons/paymet-failed.svg';

interface PaymentFailedCardProps {
  onRetry?: () => void;
}

const PaymentFailedCard: React.FC<PaymentFailedCardProps> = ({ onRetry }) => {
  return (
    <CardBaseModelStylePaymentFailed>
      <div className="left-container">
        <span className="confirmation-status-text">Confirmation Status</span>
        
        <div className="icon-h3-container">
          <img src={sadFaceIcon} alt="sad face" />
          <h3 className="h3-text">Your payment has failed</h3>
        </div>
        
        <p className="text16-text">
          It seems that the payment has failed for the following reason(s):
        </p>
        
        <div className="separator" />
        
        <p className="largeM-text">Your receipt was not valid.</p>
        <p className="largeM-text2">Please resubmit the receipt so we can continue the process.</p>
      </div>
      
      <div className="right-container">
        <img src={atmImage} alt="ATM with error" />
      </div>
    </CardBaseModelStylePaymentFailed>
  );
};

export default PaymentFailedCard;
