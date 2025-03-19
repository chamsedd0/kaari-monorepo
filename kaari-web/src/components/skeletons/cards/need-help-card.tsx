import React from "react";
import { NeedHelpCard } from "../../styles/cards/card-base-model-style-need-help";

interface NeedHelpCardProps {
  title?: string;
  faqItems?: Array<{
    question: string;
    onClick?: () => void;
  }>;
}

const NeedHelpCardComponent: React.FC<NeedHelpCardProps> = ({
  title = "Need Help?",
  faqItems = [
    {
      question: "When will I get my payout?",
      onClick: () => {}
    },
    {
      question: "How payouts work?",
      onClick: () => {}
    },
    {
      question: "My Transaction history",
      onClick: () => {}
    }
  ],
}) => {
  return (
    <NeedHelpCard>
        <h3>{title}</h3>
        {faqItems.map((item, index) => (
            <div className="faq-item" key={index} onClick={item.onClick}>
                <span>{item.question}</span>
                <span className="arrow"></span>
            </div>
        ))}
    </NeedHelpCard>
  );
};

export default NeedHelpCardComponent; 