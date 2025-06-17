import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface PhotoshootBannerProps {
  onClose?: () => void;
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
  gap: 24px;
  max-width: 100%;
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

const BookButton = styled.button`
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

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PhotoshootBanner: React.FC<PhotoshootBannerProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleBookClick = () => {
    navigate('/photoshoot-booking');
  };
  
  return (
    <BannerContainer>
      <ContentSection>
        <BookButton onClick={handleBookClick}>
          {t('advertiser_dashboard.photoshoot_banner.book_button', 'Book Now')}
        </BookButton>
        <TextContent>
          <Title>{t('advertiser_dashboard.photoshoot_banner.title', 'Book a Professional Photoshoot')}</Title>
          <Description>
            {t('advertiser_dashboard.photoshoot_banner.description', 'Professional photos can help showcase your property to potential tenants. Book a photoshoot session with our photographers.')}
          </Description>
        </TextContent>
      </ContentSection>
      
      {onClose && (
        <CloseButton onClick={onClose} aria-label={t('common.close', 'Close')}>
          ✕
        </CloseButton>
      )}
    </BannerContainer>
  );
};

export default PhotoshootBanner; 