import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import cameraGirlImage from '../../../assets/icons/camera-girl.svg';

interface FreePhotoshootBannerProps {
  onClose?: () => void;
}

const BannerContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: linear-gradient(90deg, #8F27CE 0%, #9747FF 100%);
  border-radius: 16px;
  padding: clamp(20px, 6vw, 55px) clamp(16px, 5vw, 48px);
  width: 100%;
  color: white;
  position: relative;
  overflow: hidden;
  max-height: 320px;
  
  @media (max-width: 768px) {
    padding: 24px;
    flex-direction: column;
    max-height: none;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: clamp(12px, 5vw, 40px);
  
  img {
    height: 110%;
    object-fit: contain;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 24px;
    
    img {
      width: 140px;
      height: 158px;
    }
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  z-index: 2;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h2`
  font-size: clamp(18px, 4.2vw, 24px);
  font-weight: 400;
  margin: 0;
  line-height: 1.2;
  text-align: left;
`;

const Highlight = styled.span`
  font-size: clamp(28px, 8vw, 48px);
  font-weight: 900;
  display: block;
  margin-top: 8px;
  margin-bottom: 24px;
`;

const Description = styled.p`
  font-size: clamp(13px, 3.6vw, 16px);
  font-weight: 400;
  margin: 0;
  line-height: 1.5;
  opacity: 0.95;
  text-align: left;
  margin-bottom: 24px;
`;

const BookButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #8F27CE;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: clamp(14px, 3.6vw, 18px);
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 260px;
  width: 100%;
  
  svg {
    margin-right: 12px;
    width: 20px;
    height: 20px;
  }
  
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

const FreePhotoshootBanner: React.FC<FreePhotoshootBannerProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleBookClick = () => {
    navigate('/photoshoot-booking');
  };
  
  return (
    <BannerContainer>
      <ImageContainer>
        <img src={cameraGirlImage} alt="Photographer" />
      </ImageContainer>
      
      <ContentSection>
        <Title>
          {t('advertiser_dashboard.free_photoshoot_banner.title', 'List your property with our')}
          <Highlight>{t('advertiser_dashboard.free_photoshoot_banner.highlight', 'Free Photoshoot!')}</Highlight>
        </Title>
        <Description>
          {t('advertiser_dashboard.free_photoshoot_banner.description', 'We collect a commission after your flat is rented. We provide a free photoshoot and ensure your property is verified.')}
        </Description>
        <BookButton onClick={handleBookClick}>
          <SearchIcon />
          {t('advertiser_dashboard.free_photoshoot_banner.book_button', 'Book a Photoshoot')}
        </BookButton>
      </ContentSection>
      
      
    </BannerContainer>
  );
};

export default FreePhotoshootBanner; 