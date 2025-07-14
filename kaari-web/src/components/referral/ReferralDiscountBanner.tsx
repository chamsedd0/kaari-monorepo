import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { getReferralCode } from '../../utils/referral-utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useReferralSignup } from '../../hooks/useReferralSignup';

interface ReferralDiscountBannerProps {
  className?: string;
}

const ReferralDiscountBanner: React.FC<ReferralDiscountBannerProps> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { referralCode, discount, claimDiscount } = useReferralSignup();

  useEffect(() => {
    // Check if there's a referral code in the URL or localStorage
    const code = getReferralCode(window.location.href);
    setIsVisible(Boolean(code));
  }, []);

  const handleClaimDiscount = () => {
    // Navigate to the claim discount page
    navigate(`/referral/claim-discount?ref=${referralCode}`);
  };

  if (!isVisible || !referralCode) {
    return null;
  }

  return (
    <BannerContainer className={className}>
      <BannerContent>
        <DiscountText>
          <DiscountHeading>
            {t('referral.banner.heading', 'You\'ve got 200 MAD OFF')}
          </DiscountHeading>
          <DiscountSubheading>
            {t('referral.banner.subheading', 'your next booking on Kaari!')}
          </DiscountSubheading>
        </DiscountText>
        <ImportantInfo>
          <ImportantHeading>
            {t('referral.banner.important', 'Important!')}
          </ImportantHeading>
          <ImportantText>
            {t('referral.banner.validDays', 'Your discount is valid for 7 days.')}
            <br />
            {t('referral.banner.claimNow', 'Claim it now and use it on any property.')}
          </ImportantText>
        </ImportantInfo>
        <ClaimButton onClick={handleClaimDiscount}>
          {t('referral.banner.claimButton', 'Claim my Discount')}
        </ClaimButton>
      </BannerContent>
      <IllustrationContainer>
        <img src="/public/referral-illustration.svg" alt="Referral" />
      </IllustrationContainer>
    </BannerContainer>
  );
};

// Styled components
const BannerContainer = styled.div`
  background: linear-gradient(90deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%);
  border-radius: ${Theme.borders.radius.large};
  padding: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1;
  max-width: 60%;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const DiscountText = styled.div`
  display: flex;
  flex-direction: column;
`;

const DiscountHeading = styled.h1`
  font: ${Theme.typography.fonts.boldXL};
  margin: 0;
  font-size: 32px;
`;

const DiscountSubheading = styled.h2`
  font: ${Theme.typography.fonts.regularL};
  margin: 0;
  font-size: 24px;
`;

const ImportantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ImportantHeading = styled.h3`
  font: ${Theme.typography.fonts.boldM};
  margin: 0;
`;

const ImportantText = styled.p`
  font: ${Theme.typography.fonts.regularM};
  margin: 0;
  line-height: 1.5;
`;

const ClaimButton = styled.button`
  background-color: white;
  color: ${Theme.colors.secondary};
  border: none;
  border-radius: ${Theme.borders.radius.medium};
  padding: 12px 24px;
  font: ${Theme.typography.fonts.boldM};
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const IllustrationContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-height: 180px;
    width: auto;
  }
  
  @media (max-width: 768px) {
    img {
      max-height: 150px;
    }
  }
`;

export default ReferralDiscountBanner; 