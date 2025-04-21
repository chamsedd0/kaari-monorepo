import React from 'react';
import { SuccessCard } from '../../styles/cards/card-base-model-style-success';
import { WhiteButtonLB48 } from '../buttons/white_LB48';
import { BwhiteButtonLB48 } from '../buttons/border_white_LB48';
import img from '../icons/success.svg';
interface SuccessCardProps {
  time: string;
}

const SuccessCardComponent: React.FC<SuccessCardProps> = ({
  time
}) => {
  return (
    <SuccessCard>
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">Congratulations, the place is Yours!</div>
        <div className="text16-text">You have 24 hours to confirm your reservation. Confirmation will result in your payment being processed. You can also cancel your reservation.</div>
        <div className="button-container">
            <div className="button">
              <WhiteButtonLB48 text="Confirm" />
            </div>
            <div className="button">
              <BwhiteButtonLB48 text="Cancel Reservation" />
            </div>
        </div>
      </div>
      <div className="right-container">
        <div className="time">{time}</div>
        <img src={img} alt="Success" />
      </div>
    </SuccessCard>
  );
};

export default SuccessCardComponent;
