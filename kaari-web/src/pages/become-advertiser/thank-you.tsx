import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../theme/theme';
import { FaArrowRight, FaHome, FaCalendarAlt } from 'react-icons/fa';
import LogoWhite from '../../components/skeletons/icons/LogoWhite.svg';
import { clearSignupProgress, completeSignup } from '../../utils/advertiser-signup';

const AdvertiserThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Clear signup progress on page load
  useEffect(() => {
    // Mark the signup as completed and clear progress
    completeSignup();
  }, []);
  
  const handleGoToDashboard = () => {
    navigate('/dashboards/advertiser-dashboard/overview');
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  return (
    <ThankYouContainer>
      <TopSection>
        <LogoContainer>
          <img src={LogoWhite} alt="Kaari Logo" height="40" />
        </LogoContainer>
      </TopSection>
      
      <ContentContainer>
        <SuccessIcon>
          <FaCalendarAlt />
        </SuccessIcon>
        
        <SlideTitle>{t('advertiser_thank_you.title')}</SlideTitle>
        <SlideSubtitle>{t('advertiser_thank_you.main_message')}</SlideSubtitle>
        
        <LaunchDateContainer>
          <LaunchDateTitle>Photoshoots launching August 1st!</LaunchDateTitle>
          <LaunchDateDescription>
            Once approved, your properties will be visible to all users searching in your area. 
            We'll notify you when you're live!
          </LaunchDateDescription>
        </LaunchDateContainer>
      </ContentContainer>
      
      <ButtonsContainer>
        <HomeButton onClick={handleReturnHome}>
          <FaHome style={{ marginRight: '8px' }} />
          {t('common.return_home')}
        </HomeButton>
        <DashboardButton onClick={handleGoToDashboard}>
          {t('advertiser_thank_you.preview_dashboard')}
          <FaArrowRight style={{ marginLeft: '8px' }} />
        </DashboardButton>
      </ButtonsContainer>
    </ThankYouContainer>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const ThankYouContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%);
  color: white;
  padding: 20px;
  box-sizing: border-box;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease-in-out;
  overflow: hidden;
`;

const TopSection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const LogoContainer = styled.div`
  padding: 10px 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-in-out;
`;

const SuccessIcon = styled.div`
  font-size: 80px;
  color: white;
  margin-bottom: 30px;
  filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.3));
`;

const SlideTitle = styled.h1`
  font: ${Theme.typography.fonts.h2};
  margin-bottom: 20px;
  color: white;
  text-align: center;
`;

const SlideSubtitle = styled.p`
  font: ${Theme.typography.fonts.text16};
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  max-width: 700px;
  line-height: 1.5;
`;

const LaunchDateContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${Theme.borders.radius.md};
  padding: 30px;
  text-align: center;
  max-width: 600px;
  width: 100%;
  backdrop-filter: blur(5px);
  animation: ${fadeIn} 0.8s ease-in-out;
  transition: transform 0.3s ease, background-color 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const LaunchDateTitle = styled.h2`
  font: ${Theme.typography.fonts.h3};
  color: white;
  margin-bottom: 15px;
  text-align: center;
`;

const LaunchDateDescription = styled.p`
  font: ${Theme.typography.fonts.text16};
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 40px 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const HomeButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: ${Theme.borders.radius.extreme};
  padding: 10px 20px;
  font: ${Theme.typography.fonts.largeB};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
`;

const DashboardButton = styled.button`
  background-color: white;
  color: ${Theme.colors.secondary};
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  padding: 10px 20px;
  font: ${Theme.typography.fonts.largeB};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
`;

export default AdvertiserThankYouPage;