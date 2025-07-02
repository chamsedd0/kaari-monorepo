import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Import the image shown in the design
import listingGuideImage from '../../../assets/images/explaining.svg';

const ListingGuideCardContainer = styled.div`
  border-radius: 16px;
  border: ${Theme.borders.primary};
  background: white;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.h2`
  font: ${Theme.typography.fonts.h3};
  color: ${Theme.colors.black};
  margin: 0 0 24px 0;
`;

const StepsList = styled.ol`
  padding-left: 20px;
  margin: 0 0 32px 0;
  
  li {
    font: ${Theme.typography.fonts.mediumM};    
    color: ${Theme.colors.gray2};
    margin-bottom: 12px;
    padding-left: 8px;
  }
`;

const BookButton = styled.button`
  background: ${Theme.colors.secondary};
  color: white;
  font: ${Theme.typography.fonts.smallB};
  border: none;
  border-radius: 50px;
  padding: 14px 32px;
  cursor: pointer;
  transition: background 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    background: ${Theme.colors.primary};
  }
`;

const ImageSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  

`;

interface ListingGuideCardProps {
  onBookPhotoshoot?: () => void;
}

const ListingGuideCard: React.FC<ListingGuideCardProps> = ({ onBookPhotoshoot }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleBookPhotoshoot = () => {
    if (onBookPhotoshoot) {
      onBookPhotoshoot();
    } else {
      navigate('/photoshoot-booking');
    }
  };
  
  return (
    <ListingGuideCardContainer>
      <ContentSection>
        <Title>{t('advertiser_dashboard.listing_guide.title', 'All you need to know to list')}</Title>
        <StepsList>
          <li>{t('advertiser_dashboard.listing_guide.step1', 'Book a photoshoot')}</li>
          <li>{t('advertiser_dashboard.listing_guide.step2', 'Wait for the agent\'s arrival')}</li>
          <li>{t('advertiser_dashboard.listing_guide.step3', 'Wait for the listing')}</li>
          <li>{t('advertiser_dashboard.listing_guide.step4', 'Get requests from tenants')}</li>
        </StepsList>
        <BookButton onClick={handleBookPhotoshoot}>
          {t('advertiser_dashboard.listing_guide.book_button', 'Book a Photoshoot')}
        </BookButton>
      </ContentSection>
      <ImageSection>
        <img src={listingGuideImage} alt={t('advertiser_dashboard.listing_guide.image_alt', 'Listing process illustration')} />
      </ImageSection>
    </ListingGuideCardContainer>
  );
};

export default ListingGuideCard; 