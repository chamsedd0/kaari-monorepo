import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { IoMdNotifications } from 'react-icons/io';
import { MdOutlineTrackChanges } from 'react-icons/md';

const InfoCardsContainer = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  font: ${Theme.typography.fonts.h5B};
  color: ${Theme.colors.black};
  margin-bottom: 1.5rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  border: ${Theme.borders.primary};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconContainer = styled.div`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${Theme.colors.primary};
  }
`;

const CardTitle = styled.h4`
  font: ${Theme.typography.fonts.mediumB};
  color: ${Theme.colors.black};
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.gray2};
  line-height: 1.5;
`;

const InfoCardsSection: React.FC = () => {
  return (
    <InfoCardsContainer>
      <Title>Some important information for you</Title>
      <CardsGrid>
        <InfoCard>
          <IconContainer>
            <MdOutlineTrackChanges />
          </IconContainer>
          <CardTitle>Application Tracking</CardTitle>
          <CardDescription>
            Access your profile to monitor the progress of your request in real-time. 
            The landlord has 24 hours to approve your reservation request.
          </CardDescription>
        </InfoCard>
        
        <InfoCard>
          <IconContainer>
            <HiOutlineMailOpen />
          </IconContainer>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            You will receive an email to keep you informed of the current status of your
            request, allowing you to stay updated at each step.
          </CardDescription>
        </InfoCard>
        
        <InfoCard>
          <IconContainer>
            <IoMdNotifications />
          </IconContainer>
          <CardTitle>Alerts via the App</CardTitle>
          <CardDescription>
            If you have our app, instant notifications will be sent to you as 
            soon as the status of your request is updated, ensuring uninterrupted tracking.
          </CardDescription>
        </InfoCard>
      </CardsGrid>
    </InfoCardsContainer>
  );
};

export default InfoCardsSection; 