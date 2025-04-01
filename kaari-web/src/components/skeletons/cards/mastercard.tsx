import React from 'react';
import { CardBaseModelStyleMastercard } from '../../styles/cards/card-base-model-style-mastercard';
import MastercardLogo from '../../../assets/icons/image.svg';
import MoreIcon from '../../../components/skeletons/icons/Dot-Menu.svg';

interface MastercardProps {
  cardNumber: string;
  expirationDate: string;
  title?: string;
  onClick?: () => void;
}

const Mastercard: React.FC<MastercardProps> = ({
  cardNumber,
  expirationDate,
  title = 'Mastercard',
  onClick
}) => {
  // Format card number to show only last 4 digits
  const formattedCardNumber = `${cardNumber.slice(-4)}`;

  return (
    <CardBaseModelStyleMastercard onClick={onClick}>
      <div className="left-container">
        <img src={MastercardLogo} alt="Mastercard Logo" className="mastercard-logo" />
        <div className="mastercard-info">
          <div className="mastercard-title-number-container">
            <span className="mastercard-title">{title}</span>
            <span className="mastercard-number">{formattedCardNumber}</span>
          </div>
          <span className="mastercard-expiration-date">Expiration: {expirationDate}</span>
        </div>
      </div>
      <img src={MoreIcon} alt="More options" />
    </CardBaseModelStyleMastercard>
  );
};

export default Mastercard;
