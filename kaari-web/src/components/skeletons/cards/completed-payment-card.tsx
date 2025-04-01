import { CardBaseModelStyleCompletedPayment } from '../../styles/cards/card-base-model-style-completed-payment';
import { FC } from 'react';
import Property from '../../../assets/images/propertyExamplePic.png';
import ArrowIcon from '../../../components/skeletons/icons/Icon_Arrow_Right.svg';

interface CompletedPaymentCardProps {
  paymentDate: string;
  cardType: string;
  cardNumber: string;
  propertyLocation: string;
  moveInDate: string;
  PropertyImage?: string;
  onClick?: () => void;
}

export const CompletedPaymentCard: FC<CompletedPaymentCardProps> = ({
  paymentDate,
  cardType,
  cardNumber,
  propertyLocation,
  moveInDate,
  PropertyImage = Property,
  onClick
}) => {
  return (
    <CardBaseModelStyleCompletedPayment onClick={onClick}>
      <div className="left-container">
        <div className="image-container">
          <img src={PropertyImage} alt="Property" />
        </div>
        <div className="text-container">
          <div className="title-container">
            <span className="title">Paid</span>
            <span className="date">{paymentDate}</span>
          </div>
          <div className="mastercard-title-number-container">
            <span className="mastercard-title">{cardType}</span>
            <span className="mastercard-number">{cardNumber}</span>
          </div>
          <div className="property-info-container">
            <span className="property-name">{propertyLocation}</span>
            <span className="property-move-in-date">Move in date: {moveInDate}</span>
          </div>
        </div>
      </div>
      <div className="right-container">
        <span className="right-container-text">Details</span>
        <img src={ArrowIcon} alt="View details" className="arrow-icon" />
      </div>
    </CardBaseModelStyleCompletedPayment>
  );
};
