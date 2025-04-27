import React from "react";
import { NeedHelpCard } from "../../styles/cards/card-base-model-style-need-help";
import { useTranslation } from "react-i18next";

interface NeedHelpCardProps {
  title?: string;
  faqItems?: Array<{
    question: string;
    onClick?: () => void;
  }>;
}

const NeedHelpCardComponent: React.FC<NeedHelpCardProps> = ({
  title,
  faqItems,
}) => {
  const { t } = useTranslation();
  
  // Default values with translations
  const defaultTitle = t('advertiser_dashboard.photoshoot.need_help_title', 'Need Help?');
  const defaultFaqItems = [
    {
      question: t('advertiser_dashboard.photoshoot.faq_payout_timing', 'When will I get my payout?'),
      onClick: () => {}
    },
    {
      question: t('advertiser_dashboard.photoshoot.faq_payout_process', 'How payouts work?'),
      onClick: () => {}
    },
    {
      question: t('advertiser_dashboard.photoshoot.faq_transaction_history', 'My Transaction history'),
      onClick: () => {}
    }
  ];
  
  // Use provided values or defaults
  const displayTitle = title || defaultTitle;
  const displayFaqItems = faqItems || defaultFaqItems;
  
  return (
    <NeedHelpCard>
        <h3>{displayTitle}</h3>
        {displayFaqItems.map((item, index) => (
            <div className="faq-item" key={index} onClick={item.onClick}>
                <span>{item.question}</span>
                <span className="arrow"></span>
            </div>
        ))}
    </NeedHelpCard>
  );
};

export default NeedHelpCardComponent; 