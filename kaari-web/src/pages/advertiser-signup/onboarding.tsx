import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import LanguageSwitcher from '../../components/skeletons/language-switcher/language-switcher';

// Onboarding slide interface
interface Slide {
  key: string;
  benefits: string[];
}

const AdvertiserOnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Onboarding state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exiting, setExiting] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Onboarding slides
  const slides: Slide[] = [
    {
      key: "slide1",
      benefits: ["benefit1", "benefit2"]
    },
    {
      key: "slide2",
      benefits: ["benefit1", "benefit2"]
    },
    {
      key: "slide3",
      benefits: ["benefit1", "benefit2"]
    }
  ];

  // Progress bar animation
  useEffect(() => {
    // Start progress animation
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    setProgress(0);
    
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentSlide]);
  
  // Handle next slide
  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      // Just move to the next slide without fading
      setCurrentSlide(currentSlide + 1);
      setProgress(0);
    } else {
      // Last slide, proceed to signup with fade out animation
      setExiting(true);
      setTimeout(() => {
        navigate('/advertiser-signup/form');
      }, 500);
    }
  };
  
  // Handle skip onboarding
  const handleSkipOnboarding = () => {
    // Redirect to the signup page
    setExiting(true);
    setTimeout(() => {
      navigate('/advertiser-signup/form');
    }, 500);
  };

  const currentSlideKey = slides[currentSlide].key;
  
  return (
    <OnboardingContainer className={exiting ? 'exiting' : ''}>
      <TopSection>
        <LogoContainer>
          <LogoText aria-label={t('common.kaari_logo')}>Kaari</LogoText>
        </LogoContainer>
        <LanguageSwitcherContainer>
          <LanguageSwitcher />
        </LanguageSwitcherContainer>
      </TopSection>
      
      <ProgressContainer>
        {slides.map((_, index) => (
          <ProgressBar 
            key={index} 
            active={index === currentSlide}
            completed={index < currentSlide}
            onClick={() => setCurrentSlide(index)}
          >
            {index === currentSlide && <ProgressFill style={{ width: `${progress}%` }} />}
          </ProgressBar>
        ))}
      </ProgressContainer>
      
      <ContentContainer>
        <SlideTitle>{t(`become_advertiser.onboarding.${currentSlideKey}.title`)}</SlideTitle>
        <SlideSubtitle>{t(`become_advertiser.onboarding.${currentSlideKey}.subtitle`)}</SlideSubtitle>
        
        <BenefitsList>
          {slides[currentSlide].benefits.map((benefitKey, index) => (
            <BenefitItem key={index}>
              <CheckIcon>
                <FaCheck />
              </CheckIcon>
              <BenefitContent>
                <BenefitTitle>
                  {t(`become_advertiser.onboarding.${currentSlideKey}.${benefitKey}.title`)}
                </BenefitTitle>
                <BenefitDescription>
                  {t(`become_advertiser.onboarding.${currentSlideKey}.${benefitKey}.description`)}
                </BenefitDescription>
              </BenefitContent>
            </BenefitItem>
          ))}
        </BenefitsList>
      </ContentContainer>
      
      <ButtonsContainer>
        <SkipButton onClick={handleSkipOnboarding}>
          {t('common.skip')}
        </SkipButton>
        <NextButton onClick={handleNextSlide}>
          {currentSlide === slides.length - 1 ? t('common.get_started') : t('common.next')}
          <FaArrowRight style={{ marginLeft: '8px' }} />
        </NextButton>
      </ButtonsContainer>
    </OnboardingContainer>
  );
};

// Animations for onboarding
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// Styled components for onboarding
const OnboardingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%);
  color: white;
  padding: 40px 20px;
  box-sizing: border-box;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease-in-out;
  
  &.exiting {
    animation: ${fadeOut} 0.5s ease-in-out forwards;
  }
`;

const LogoContainer = styled.div`
  padding: 20px;
`;

const LogoText = styled.h1`
  font: ${Theme.typography.fonts.h3};
  color: white;
  margin: 0;
  letter-spacing: 1px;
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;

const ProgressBar = styled.div<{ active: boolean; completed: boolean }>`
  height: 4px;
  flex: 1;
  max-width: 100px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.completed && `
    background-color: rgba(255, 255, 255, 0.9);
  `}
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: white;
  transition: width 0.05s linear;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 20px;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
`;

const SlideTitle = styled.h1`
  font: ${Theme.typography.fonts.h2};
  margin-bottom: 16px;
  color: white;
`;

const SlideSubtitle = styled.h2`
  font: ${Theme.typography.fonts.text16};
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.9);
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const CheckIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
  color: ${Theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h3`
  font: ${Theme.typography.fonts.largeB};
  margin-bottom: 8px;
  color: white;
`;

const BenefitDescription = styled.p`
  font: ${Theme.typography.fonts.text14};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font: ${Theme.typography.fonts.largeM};
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const NextButton = styled.button`
  background-color: white;
  color: ${Theme.colors.secondary};
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  padding: 12px 24px;
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
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;

const LanguageSwitcherContainer = styled.div`
  z-index: 10;
`;

export default AdvertiserOnboardingPage; 