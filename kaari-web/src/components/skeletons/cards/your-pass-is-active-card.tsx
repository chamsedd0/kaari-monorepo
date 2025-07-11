import React from "react";
import { CardBaseModelStyleYourPassIsActive } from "../../styles/cards/card-base-model-style-your-pass-is-active";
import LockIcon from "../icons/lock.svg";

interface YourPassIsActiveCardProps {
  validUntil: string; 
  passStatus: string;
}

const YourPassIsActiveCard: React.FC<YourPassIsActiveCardProps> = ({ validUntil, passStatus }) => {
  return (
    <CardBaseModelStyleYourPassIsActive>
      <img src={LockIcon} alt="Lock and key" />
      <div className="text-container">
        <span className="title-text">{passStatus}</span>
        <span className="text-12">Valid until: {validUntil}</span>
      </div>
    </CardBaseModelStyleYourPassIsActive>
  );
};

export default YourPassIsActiveCard;
