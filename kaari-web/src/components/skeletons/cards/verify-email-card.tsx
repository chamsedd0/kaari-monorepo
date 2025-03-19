import React from 'react';
import { VerifyEmailCard } from '../../styles/cards/card-base-model-style-verify-emial';
import Picture from "../../../assets/images/Check-Icon.svg" ;

interface VerifyEmailCardProps {
  title?: string;
  infoText?: string;
  verifyEmailText?: string;
}

const VerifyEmailCardComponent: React.FC<VerifyEmailCardProps> = ({
  title = "Verify Email",
  infoText = "By taking this straightforward step, you will significantly enhance your chances of having your reservations accepted, ensuring a smoother experience for your upcoming plans.",
  verifyEmailText = "Your email is verified",
}) => {
  return (
    <VerifyEmailCard>
      <h2 className="title">{title}</h2>
      <p className="info-text">{infoText}</p>
      <div className="verify-email-container">
        <img src={Picture} alt="Verify Email" className="verify-email-icon" />
        <span className="verify-email-text">{verifyEmailText}</span>
      </div>
    </VerifyEmailCard>
  );
};

export default VerifyEmailCardComponent;
