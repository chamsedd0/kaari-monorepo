import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface ReferralDiscountExpiryWarningProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
  onBrowseProperties?: () => void;
}

const ReferralDiscountExpiryWarning: React.FC<ReferralDiscountExpiryWarningProps> = ({ 
  timeLeft,
  onBrowseProperties
}) => {
  const { t } = useTranslation();
  
  // Only show warning if less than 24 hours left
  const isExpiringSoon = timeLeft.days === 0 && timeLeft.hours < 24;
  
  if (!isExpiringSoon) return null;

  return (
    <WarningContainer>
      <WarningIcon>
        <FaClock />
      </WarningIcon>
      <WarningContent>
        <WarningText>
          {t('referral.discount.expiring_soon', 'Your discount is expiring soon! Only {{hours}}h {{minutes}}m left.', { 
            hours: timeLeft.hours, 
            minutes: timeLeft.minutes 
          })}
        </WarningText>
        {onBrowseProperties && (
          <BrowseButton onClick={onBrowseProperties}>
            {t('referral.discount.browse_now', 'Browse properties now')}
          </BrowseButton>
        )}
      </WarningContent>
    </WarningContainer>
  );
};

const WarningContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${Theme.colors.warning}15;
  border-radius: ${Theme.borders.radius.md};
  padding: 12px 16px;
  width: 100%;
  border: 1px solid ${Theme.colors.warning}30;
  margin-bottom: 16px;
`;

const WarningIcon = styled.div`
  color: ${Theme.colors.warning};
  font-size: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const WarningText = styled.div`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.warning};
  margin-bottom: 4px;
`;

const BrowseButton = styled.button`
  background: none;
  border: none;
  color: ${Theme.colors.primary};
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  padding: 0;
  text-align: left;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default ReferralDiscountExpiryWarning; 