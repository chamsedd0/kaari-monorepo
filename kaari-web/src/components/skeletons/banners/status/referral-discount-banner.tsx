import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaGift, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface ReferralDiscountBannerProps {
  amount: number;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
  code?: string;
}

const ReferralDiscountBanner: React.FC<ReferralDiscountBannerProps> = ({ 
  amount,
  timeLeft,
  code = 'KAARI'
}) => {
  const { t } = useTranslation();

  return (
    <BannerContainer>
      <DiscountIcon>
        <FaGift />
      </DiscountIcon>
      <BannerContent>
        <BannerText>
          {t('referral.discount.banner', 'Promo code {{code}} applied - {{amount}} MAD discount!', { amount, code })}
        </BannerText>
        <ExpirationTimer>
          <FaClock />
          <span>
            {t('referral.discount.expires_in', 'Expires in: {{days}}d {{hours}}h {{minutes}}m', {
              days: timeLeft.days,
              hours: timeLeft.hours,
              minutes: timeLeft.minutes
            })}
          </span>
        </ExpirationTimer>
      </BannerContent>
    </BannerContainer>
  );
};

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${Theme.colors.primary}15;
  border-radius: ${Theme.borders.radius.md};
  padding: 12px 16px;
  width: 100%;
  border: ${Theme.borders.primary};
`;

const DiscountIcon = styled.div`
  color: ${Theme.colors.secondary};
  font-size: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BannerText = styled.div`
  font: ${Theme.typography.fonts.mediumB};
  color: ${Theme.colors.secondary};
  margin-bottom: 4px;
`;

const ExpirationTimer = styled.div`
  display: flex;
  align-items: center;
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.gray2};
  
  svg {
    margin-right: 6px;
    font-size: 12px;
  }
`;

export default ReferralDiscountBanner; 