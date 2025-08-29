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
  border-radius: 16px;
  padding: 20px;
  margin: 0;
  width: 100%;
  color: white;
  position: relative;
  
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
  font-size: clamp(16px, 3.2vw, 20px);
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const Description = styled.p`
  font-size: clamp(11px, 2.6vw, 12px);
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
`;

const LearnMoreButton = styled.button`
  background-color: white;
  color: #8F27CE;
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  height: clamp(40px, 8vw, 48px);
  min-width: 140px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
  }
`;

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#8F27CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="#8F27CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


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
          <SearchIcon />
          Learn More
        </LearnMoreButton>
      </ContentSection>
    </BannerContainer>
  );
};

export default ReferralBanner; 