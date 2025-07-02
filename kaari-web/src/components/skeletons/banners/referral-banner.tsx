import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface ReferralBannerProps {
}

const BannerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #8F27CE 0%, #713EB5 100%);
  border-radius: 8px;
  padding: 16px 24px;
  margin: 0;
  width: 100%;
  margin-bottom: 16px;
  color: white;
  position: relative;
  box-shadow: 0 4px 12px rgba(143, 39, 206, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }
`;

const ContentSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 2;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const Description = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
`;

const LearnMoreButton = styled.button`
  background-color: white;
  color: #8F27CE;
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
  }
`;

const ReferralBanner: React.FC<ReferralBannerProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleLearnMoreClick = () => {
    navigate('/dashboard/advertiser/referral-program');
  };
  
  return (
    <BannerContainer>
      <ContentSection>
        <TextContent>
          <Title>Earn up to 100 000 MAD a month with Kaari Referrals</Title>
          <Description>
            List 10 active properties —or complete 3 bookings—to unlock a 10 % reward on every tenant you refer.
          </Description>
        </TextContent>
        <LearnMoreButton onClick={handleLearnMoreClick}>
          Learn More
        </LearnMoreButton>
      </ContentSection>
    </BannerContainer>
  );
};

export default ReferralBanner; 