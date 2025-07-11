import React, { useState } from "react";
import { CardBaseModelStyleYourReferralLink } from "../../styles/cards/card-base-model-style-your-referral-link";
import IconCopy from "../icons/Icon_Copy.svg";
import QR from "../../../assets/images/QR.svg";

const REFERRAL_LINK = "https://kaari-monorepo.vercel.app";

export const YourReferralLinkCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <CardBaseModelStyleYourReferralLink>
      <div className="left-container">
        <div className="title">Your Referral Link</div>
        <div className="input-Icon-container">
          <div className="referral-link-box">
            <div className="link-text">
              {REFERRAL_LINK}
            </div>
          </div>
          <div className="Icon-container" onClick={handleCopy} title="Copy link">
            <img src={IconCopy} alt="Copy" />
          </div>
        </div>
        <div className="text-14">
          Give tenants your unique promocode. They get 200 MAD off, and you earn a bonus! You can scan the QR code to use the referral link fast.
        </div>
        {copied && (
          <span style={{ color: "#9F32E1", fontSize: 14, marginTop: 4 }}>Copied!</span>
        )}
      </div>
      <div className="right-container">
        <img src={QR} alt="QR Code" />
      </div>
    </CardBaseModelStyleYourReferralLink>
  );
};

export default YourReferralLinkCard;
