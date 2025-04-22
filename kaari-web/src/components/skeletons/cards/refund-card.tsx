import React from 'react';
import { CardBaseModelStyleRefund } from '../../styles/cards/card-base-model-style-refund';
import refundIcon from '../icons/refund-status.svg';
import loading from '../icons/loading.svg';
import { WhiteButtonLB48 } from '../buttons/white_LB48';


const RefundCard: React.FC = () => {
  return (
    <CardBaseModelStyleRefund>
      <div className="left-container">
        <p className="confirmation-status-text">Confirmation Status</p>
        <div className="icon-h3-container">
          <img src={loading} alt="Refund Icon" />
          <h3 className="h3-text">The refund is being processed</h3>
        </div>
        <p className="text16-text">
          You'll receive the refund within 7 business days. We apologize once again for any inconvenience caused. If you have any issues related to your refund, please contact us at customercare@kaari.me or give us a call at 0XXXXXXXX.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="Contact Support" />
        </div>
      </div>
      <div className="right-container">
        <img src={refundIcon} alt="Refund Illustration" />
      </div>
    </CardBaseModelStyleRefund>
  );
};

export default RefundCard;
