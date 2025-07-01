import React from 'react';
import { StatusCardStylePending } from '../../../styles/constructed/status-card/status-card-style-pending';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';
import refundProcessingImage from './icons/girl-refund.svg';

interface CancellationRefundBeingProcessedProps {
  onContactSupport?: () => void;
}

const CancellationRefundBeingProcessed: React.FC<CancellationRefundBeingProcessedProps> = ({
}) => {
  return (
    <StatusCardStylePending>
      <div className="left-container">
        <div className="text-container">
          <span className="confirmation-status-text">Cancellation Request</span>
          <h3 className="h3-text">The refund is being processed</h3>
        </div>
        <p className="text16-text">
          You'll receive the refund within 7 business days. We apologize once 
          again for any inconvenience caused. If you have any issues related to 
          your refund, please contact us at customercare@xian.mo or give us a 
          call at 0XXXXXXXX.
        </p>
        <div className="button-container">
          <WhiteButtonLB48 text="Contact Support" onClick={onContactSupport} />
        </div>
      </div>
      <div className="right-container">
        <img src={refundProcessingImage} alt="Refund processing" />
      </div>
    </StatusCardStylePending>
  );
};

export default CancellationRefundBeingProcessed;
