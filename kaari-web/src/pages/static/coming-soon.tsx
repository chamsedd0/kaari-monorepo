import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../theme/theme';
import { FaCalendarAlt, FaHome, FaArrowLeft } from 'react-icons/fa';
import LogoWhite from '../../components/skeletons/icons/LogoWhite.svg';

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  return (
    <ComingSoonContainer>
      <TopSection>
        <LogoContainer>
          <img src={LogoWhite} alt="Kaari Logo" height="40" />
        </LogoContainer>
      </TopSection>
      
      <ContentContainer>
        <CalendarIcon>
          <FaCalendarAlt />
        </CalendarIcon>
        
        <Title>Coming Soon!</Title>
        <Subtitle>
          This feature will be available starting August 1st
        </Subtitle>
        
        <MessageContainer>
          <MessageTitle>We're Getting Ready</MessageTitle>
          <MessageText>
            Thank you for your interest! We're currently preparing to launch our full platform on August 1st.
            At that time, you'll be able to access all features including photoshoot booking and the advertiser dashboard.
          </MessageText>
          <LaunchInfo>
            <strong>Official Launch Date: August 1st, 2023</strong>
          </LaunchInfo>
        </MessageContainer>
      </ContentContainer>
      
      <ButtonsContainer>
        <BackButton onClick={handleGoBack}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Go Back
        </BackButton>
        <HomeButton onClick={handleReturnHome}>
          <FaHome style={{ marginRight: '8px' }} />
          Return Home
        </HomeButton>
      </ButtonsContainer>
    </ComingSoonContainer>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const ComingSoonContainer = styled.div`
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

const CalendarIcon = styled.div`
  font-size: 100px;
  color: white;
  margin-bottom: 30px;
  filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.3));
  animation: ${float} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font: ${Theme.typography.fonts.h1};
  margin-bottom: 20px;
  color: white;
  text-align: center;
`;

const Subtitle = styled.p`
  font: ${Theme.typography.fonts.h3};
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  max-width: 700px;
  line-height: 1.5;
`;

const MessageContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${Theme.borders.radius.md};
  padding: 30px;
  text-align: center;
  max-width: 700px;
  width: 100%;
  backdrop-filter: blur(5px);
  animation: ${fadeIn} 0.8s ease-in-out;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const MessageTitle = styled.h2`
  font: ${Theme.typography.fonts.h3};
  color: white;
  margin-bottom: 15px;
  text-align: center;
`;

const MessageText = styled.p`
  font: ${Theme.typography.fonts.text16};
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
`;

const LaunchInfo = styled.div`
  font: ${Theme.typography.fonts.largeB};
  color: white;
  margin-top: 20px;
  padding: 10px;
  border-radius: ${Theme.borders.radius.md};
  background-color: rgba(255, 255, 255, 0.1);
  display: inline-block;
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

const BackButton = styled.button`
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

const HomeButton = styled.button`
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

export default ComingSoonPage; 