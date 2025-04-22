import React from 'react';
import { DeadlineTooSoonCardStyle } from '../../styles/cards/card-base-model-style-deadline-too-soon';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import deadlineImage from '../icons/Supportp.svg';

interface DeadlineTooSoonCardProps {
  onContactClick?: () => void;
}

const DeadlineTooSoonCard: React.FC<DeadlineTooSoonCardProps> = ({ onContactClick }) => {
  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      window.location.href = 'mailto:customercare@kaari.com';
    }
  };

  return (
    <DeadlineTooSoonCardStyle>
      <div className="text-container">
        <div className="title">Deadline is too Soon?</div>
        <div className="description">
          To extend the 24-hour deadline, please email Kaari's Customer Care 
          at customercare@kaari.com or call 05XXXXX. Customer care is 
          available daily from 9 AM to 8 PM, excluding holidays.
        </div>
      </div>
      <div className="img-button-container">
        <img src={deadlineImage} alt="Deadline icon" />
        <div className="button-container">
          <PurpleButtonMB48 
            text="Contact" 
            onClick={handleContactClick} 
          />
        </div>
      </div>
    </DeadlineTooSoonCardStyle>
  );
};

export default DeadlineTooSoonCard;
