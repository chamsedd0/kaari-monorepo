import React from 'react';
import { VerifyEmailCard } from '../../styles/cards/card-base-model-style-verify-email';
import Picture from "../../../assets/images/Check-Icon.svg";
import { PurpleButtonMB48 } from '../../skeletons/buttons/purple_MB48';

interface VerifyEmailCardProps {
  title?: string;
  infoText?: string;
  verifyEmailText?: string;
  isVerified?: boolean;
  isLoading?: boolean;
  onSendVerification?: () => void;
}

const VerifyEmailCardComponent: React.FC<VerifyEmailCardProps> = ({
  title = "Verify Email",
  infoText = "By taking this straightforward step, you will significantly enhance your chances of having your reservations accepted, ensuring a smoother experience for your upcoming plans.",
  verifyEmailText = "Your email is verified",
  isVerified = false,
  isLoading = false,
  onSendVerification
}) => {
  return (
    <VerifyEmailCard>
      <h2 className="title">{title}</h2>
      <p className="info-text">{infoText}</p>
      <div className="verify-email-container">
        {isVerified ? (
          <>
            <img src={Picture} alt="Verify Email" className="verify-email-icon" />
            <span className="verify-email-text">{verifyEmailText}</span>
          </>
        ) : (
          <div className="verify-action">
            <p className="unverified-text">Your email is not verified</p>
            <PurpleButtonMB48 
              text={isLoading ? "Sending..." : "Send Verification Email"} 
              onClick={onSendVerification}
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </VerifyEmailCard>
  );
};

export default VerifyEmailCardComponent;
