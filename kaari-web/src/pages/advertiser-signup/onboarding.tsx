// Advertiser Onboarding Page
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaArrowRight, FaCamera, FaShieldAlt, FaCheckCircle, FaMoneyBillWave, FaPercentage, FaGift, FaStar, FaHandshake } from 'react-icons/fa';
import LanguageSwitcher from '../../components/skeletons/language-switcher/language-switcher';
import { useTranslation } from 'react-i18next';

// Onboarding slide interface
interface Slide {
  key: string;
  benefits: { title: string; description: string; icon?: React.ReactNode }[];
  isWhite?: boolean;
}

const AdvertiserOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Onboarding state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [animatingSlide, setAnimatingSlide] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Onboarding slides content
  const slides: Slide[] = [
    {
      key: "slide1",
      isWhite: true,
      benefits: [
        {
          title: t('advertiser_onboarding.slide1.benefit1_title'),
          description: t('advertiser_onboarding.slide1.benefit1_description'),
          icon: <FaCamera />
        },
        {
          title: t('advertiser_onboarding.slide1.benefit2_title'),
          description: t('advertiser_onboarding.slide1.benefit2_description'),
          icon: <FaShieldAlt />
        },
        {
          title: t('advertiser_onboarding.slide1.benefit3_title'),
          description: t('advertiser_onboarding.slide1.benefit3_description'),
          icon: <FaCheckCircle />
        },
        {
          title: t('advertiser_onboarding.slide1.benefit4_title'),
          description: t('advertiser_onboarding.slide1.benefit4_description'),
          icon: <FaMoneyBillWave />
        }
      ]
    },
    {
      key: "slide2",
      benefits: [
        {
          title: t('advertiser_onboarding.slide2.benefit1_title'),
          description: t('advertiser_onboarding.slide2.benefit1_description'),
          icon: <FaPercentage />
        },
        {
          title: t('advertiser_onboarding.slide2.benefit2_title'),
          description: t('advertiser_onboarding.slide2.benefit2_description'),
          icon: <FaGift />
        },
        {
          title: t('advertiser_onboarding.slide2.benefit3_title'),
          description: t('advertiser_onboarding.slide2.benefit3_description'),
          icon: <FaStar />
        }
      ]
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
        return prev + 1; // Increased from 0.5 to 1 for faster progress
      });
    }, 30); // Reduced from 50 to 30 for smoother animation
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentSlide]);
  
  // Pre-load next slide content and manage animations
  const [nextSlideReady, setNextSlideReady] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  
  // Handle next slide
  const handleNextSlide = () => {
    if (animatingSlide || !nextSlideReady) return; // Prevent multiple clicks during animation
    
    if (currentSlide < slides.length - 1) {
      // Set direction for animation
      setSlideDirection('next');
      
      // Animate slide transition
      setAnimatingSlide(true);
      setNextSlideReady(false);
      
      // Prepare next slide content with minimal delay
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setNextSlideReady(true);
        
        // End animation immediately after content is loaded
        setTimeout(() => {
          setAnimatingSlide(false);
        }, 50);
      }, 50);
    } else {
      // Last slide, proceed to signup with fade out animation
      setExiting(true);
      setTimeout(() => {
        navigate('/advertiser-signup/form');
      }, 200);
    }
  };
  
  // Handle previous slide
  const handlePrevSlide = () => {
    if (animatingSlide || !nextSlideReady || currentSlide === 0) return;
    
    // Set direction for animation
    setSlideDirection('prev');
    
    // Animate slide transition
    setAnimatingSlide(true);
    setNextSlideReady(false);
    
    setTimeout(() => {
      setCurrentSlide(currentSlide - 1);
      setNextSlideReady(true);
      
      setTimeout(() => {
        setAnimatingSlide(false);
      }, 50);
    }, 50);
  };
  
  // Handle skip onboarding
  const handleSkipOnboarding = () => {
    // Redirect to the signup page
    setExiting(true);
    setTimeout(() => {
      navigate('/advertiser-signup/form');
    }, 300);
  };

  const currentSlideData = slides[currentSlide];
  const isWhiteTheme = currentSlideData.isWhite;
  
  // Auto-rotate benefits on mobile
  useEffect(() => {
    if (isMobile && currentSlideData.benefits.length > 1) {
      const interval = setInterval(() => {
        setActiveBenefit(prev => (prev + 1) % currentSlideData.benefits.length);
      }, 3000); // Change every 3 seconds (reduced from 4)
      
      return () => clearInterval(interval);
    }
  }, [isMobile, currentSlideData.benefits.length]);
  
  // Reset active benefit when slide changes
  useEffect(() => {
    setActiveBenefit(0);
  }, [currentSlide]);
  
  // Handle touch gestures for benefit swiper
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && activeBenefit < currentSlideData.benefits.length - 1) {
      setActiveBenefit(activeBenefit + 1);
    }
    if (isRightSwipe && activeBenefit > 0) {
      setActiveBenefit(activeBenefit - 1);
    }
  };
  
  return (
    <OnboardingContainer className={exiting ? 'exiting' : ''} $isWhite={isWhiteTheme}>
      <BackgroundDecoration $isWhite={isWhiteTheme} />
      
      <TopSection>
        <LogoContainer>
          {isWhiteTheme ? (
            <LogoImage src="/src/assets/images/purpleLogo.svg" alt="Kaari" />
          ) : (
            <LogoImage src="/src/assets/images/purpleLogo.svg" alt="Kaari" $isWhite />
          )}
        </LogoContainer>
        <LanguageSwitcherContainer>
          <LanguageSwitcher />
        </LanguageSwitcherContainer>
      </TopSection>
      
      <ProgressContainer>
        {slides.map((_, index) => (
          <ProgressBar 
            key={index} 
            $active={index === currentSlide}
            $completed={index < currentSlide}
            $isWhite={isWhiteTheme}
            onClick={() => !animatingSlide && setCurrentSlide(index)}
          >
            {index === currentSlide && <ProgressFill $isWhite={isWhiteTheme} style={{ width: `${progress}%` }} />}
          </ProgressBar>
        ))}
      </ProgressContainer>
      
      <ContentContainer>
        <SlideWrapper $animating={animatingSlide} $direction={slideDirection}>
          {currentSlide === 0 && (
            <SlideContent>
              <ContentDecoration1 $isWhite={isWhiteTheme} />
              <ContentDecoration2 $isWhite={isWhiteTheme} />
              
              <SlideTitle $isWhite={isWhiteTheme}>{t('advertiser_onboarding.slide1.title')}</SlideTitle>
              <SlideSubtitle $isWhite={isWhiteTheme}>
                {t('advertiser_onboarding.slide1.subtitle')}
              </SlideSubtitle>
              
              <BenefitsHeader $isWhite={isWhiteTheme}>{t('advertiser_onboarding.slide1.benefits_header')}</BenefitsHeader>
              {isMobile ? (
                <>
                  <MobileBenefitContainer
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <BenefitItem $delay={0} $isWhite={isWhiteTheme} $isMobile>
                      {currentSlideData.benefits[activeBenefit].icon && (
                        <BenefitIconWrapper $isWhite={isWhiteTheme}>
                          {currentSlideData.benefits[activeBenefit].icon}
                        </BenefitIconWrapper>
                      )}
                      <BenefitContent>
                        <BenefitTitle $isWhite={isWhiteTheme}>{currentSlideData.benefits[activeBenefit].title}</BenefitTitle>
                        <BenefitDescription $isWhite={isWhiteTheme}>{currentSlideData.benefits[activeBenefit].description}</BenefitDescription>
                      </BenefitContent>
                    </BenefitItem>
                    <MobileBenefitDots>
                      {currentSlideData.benefits.map((_, index) => (
                        <BenefitDot 
                          key={index} 
                          $active={index === activeBenefit}
                          $isWhite={isWhiteTheme}
                          onClick={() => setActiveBenefit(index)}
                        />
                      ))}
                    </MobileBenefitDots>
                  </MobileBenefitContainer>
                </>
              ) : (
                <BenefitsList>
                  {currentSlideData.benefits.map((benefit, index) => (
                    <BenefitItem key={index} $delay={index * 0.1} $isWhite={isWhiteTheme}>
                      {benefit.icon && (
                        <BenefitIconWrapper $isWhite={isWhiteTheme}>
                          {benefit.icon}
                        </BenefitIconWrapper>
                      )}
                      <BenefitContent>
                        <BenefitTitle $isWhite={isWhiteTheme}>{benefit.title}</BenefitTitle>
                        <BenefitDescription $isWhite={isWhiteTheme}>{benefit.description}</BenefitDescription>
                      </BenefitContent>
                    </BenefitItem>
                  ))}
                </BenefitsList>
              )}
              
              <ClosingText $isWhite={isWhiteTheme}>
                {t('advertiser_onboarding.slide1.closing_text1')}
                <br />
                {t('advertiser_onboarding.slide1.closing_text2')}
              </ClosingText>
            </SlideContent>
          )}
          
          {currentSlide === 1 && (
            <SlideContent>
              <ContentDecoration1 $isWhite={isWhiteTheme} />
              <ContentDecoration2 $isWhite={isWhiteTheme} />
              
              <SlideTitle $isWhite={isWhiteTheme}>{t('advertiser_onboarding.slide2.title')}</SlideTitle>
              <SlideSubtitle $isWhite={isWhiteTheme}>
                {t('advertiser_onboarding.slide2.subtitle')}
              </SlideSubtitle>
              
              <BenefitsHeader $isWhite={isWhiteTheme}>{t('advertiser_onboarding.slide2.benefits_header')}</BenefitsHeader>
              {isMobile ? (
                <>
                  <MobileBenefitContainer
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <BenefitItem $delay={0} $isWhite={isWhiteTheme} $isMobile>
                      {currentSlideData.benefits[activeBenefit].icon && (
                        <BenefitIconWrapper $isWhite={isWhiteTheme}>
                          {currentSlideData.benefits[activeBenefit].icon}
                        </BenefitIconWrapper>
                      )}
                      <BenefitContent>
                        <BenefitTitle $isWhite={isWhiteTheme}>{currentSlideData.benefits[activeBenefit].title}</BenefitTitle>
                        <BenefitDescription $isWhite={isWhiteTheme}>{currentSlideData.benefits[activeBenefit].description}</BenefitDescription>
                      </BenefitContent>
                    </BenefitItem>
                    <MobileBenefitDots>
                      {currentSlideData.benefits.map((_, index) => (
                        <BenefitDot 
                          key={index} 
                          $active={index === activeBenefit}
                          $isWhite={isWhiteTheme}
                          onClick={() => setActiveBenefit(index)}
                        />
                      ))}
                    </MobileBenefitDots>
                  </MobileBenefitContainer>
                </>
              ) : (
                <BenefitsList>
                  {currentSlideData.benefits.map((benefit, index) => (
                    <BenefitItem key={index} $delay={index * 0.1} $isWhite={isWhiteTheme}>
                      {benefit.icon && (
                        <BenefitIconWrapper $isWhite={isWhiteTheme}>
                          {benefit.icon}
                        </BenefitIconWrapper>
                      )}
                      <BenefitContent>
                        <BenefitTitle $isWhite={isWhiteTheme}>{benefit.title}</BenefitTitle>
                        <BenefitDescription $isWhite={isWhiteTheme}>{benefit.description}</BenefitDescription>
                      </BenefitContent>
                    </BenefitItem>
                  ))}
                </BenefitsList>
              )}
              
              <ClosingText $isWhite={isWhiteTheme}>
                {t('advertiser_onboarding.slide2.closing_text1')}
                <br />
                {t('advertiser_onboarding.slide2.closing_text2')}
                <br />
                {t('advertiser_onboarding.slide2.closing_text3')}
              </ClosingText>
            </SlideContent>
          )}
        </SlideWrapper>
      </ContentContainer>
      
      <ButtonsContainer>
        <SkipButton $isWhite={isWhiteTheme} onClick={handleSkipOnboarding} disabled={animatingSlide}>
          {t('common.skip')}
        </SkipButton>
        <NavigationButtons>
          {currentSlide > 0 && (
            <NavButton $isWhite={isWhiteTheme} $isPrev onClick={handlePrevSlide} disabled={animatingSlide}>
              <FaArrowRight style={{ transform: 'rotate(180deg)' }} />
            </NavButton>
          )}
          <NextButton 
            $isWhite={isWhiteTheme} 
            onClick={handleNextSlide}
            disabled={animatingSlide}
            $isLast={currentSlide === slides.length - 1}
          >
            {currentSlide === slides.length - 1 ? t('advertiser_onboarding.sign_up_now') : t('common.next')}
            <FaArrowRight style={{ marginLeft: '8px' }} />
          </NextButton>
        </NavigationButtons>
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

const slideInNext = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInPrev = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideOutNext = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-30px); }
`;

const slideOutPrev = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(30px); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 0.6; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components for onboarding
const OnboardingContainer = styled.div<{ $isWhite?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile browsers */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${props => props.$isWhite 
    ? 'white' 
    : `linear-gradient(135deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%)`};
  background-size: 200% 200%;
  color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  padding: 12px;
  box-sizing: border-box;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-in-out, ${props => props.$isWhite ? 'none' : gradientMove} 15s ease infinite;
  transition: background 0.2s ease-in-out;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
  
  @media (min-width: 1024px) {
    padding: 40px 60px;
  }
  
  &.exiting {
    animation: ${fadeOut} 0.2s ease-in-out forwards;
  }
`;

const BackgroundDecoration = styled.div<{ $isWhite?: boolean }>`
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${props => props.$isWhite 
    ? `radial-gradient(circle, ${Theme.colors.primary}20 0%, transparent 70%)`
    : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'};
  z-index: 0;
  animation: ${float} 6s ease-in-out infinite;
  
  &:before {
    content: '';
    position: absolute;
    bottom: -250px;
    left: -400px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: ${props => props.$isWhite 
      ? `radial-gradient(circle, ${Theme.colors.secondary}20 0%, transparent 70%)`
      : 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)'};
    animation: ${float} 8s ease-in-out infinite reverse;
  }
`;

const ContentDecoration1 = styled.div<{ $isWhite?: boolean }>`
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 30px;
  transform: rotate(45deg);
  background: ${props => props.$isWhite 
    ? `linear-gradient(135deg, ${Theme.colors.primary}10 0%, ${Theme.colors.secondary}15 100%)`
    : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)'};
  z-index: -1;
  animation: ${float} 7s ease-in-out infinite;
  opacity: 0.5;
  display: none;
  
  @media (min-width: 768px) {
    display: block;
    width: 120px;
    height: 120px;
    top: -40px;
    right: -40px;
    opacity: 0.7;
  }
  
  @media (min-width: 1024px) {
    width: 150px;
    height: 150px;
    top: -50px;
    right: -50px;
    opacity: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    border-radius: inherit;
    background: ${props => props.$isWhite 
      ? `radial-gradient(circle, ${Theme.colors.primary}15 0%, transparent 70%)`
      : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'};
    animation: ${pulse} 4s ease-in-out infinite;
  }
`;

const ContentDecoration2 = styled.div<{ $isWhite?: boolean }>`
  position: absolute;
  bottom: -10px;
  left: -20px;
  width: 60px;
  height: 60px;
  border-radius: 20px;
  transform: rotate(30deg);
  background: ${props => props.$isWhite 
    ? `linear-gradient(135deg, ${Theme.colors.secondary}10 0%, ${Theme.colors.primary}15 100%)`
    : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'};
  z-index: -1;
  animation: ${float} 9s ease-in-out infinite reverse;
  opacity: 0.5;
  display: none;
  
  @media (min-width: 768px) {
    display: block;
    width: 100px;
    height: 100px;
    bottom: -20px;
    left: -40px;
    opacity: 0.7;
  }
  
  @media (min-width: 1024px) {
    width: 120px;
    height: 120px;
    bottom: -30px;
    left: -60px;
    opacity: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    border-radius: inherit;
    background: ${props => props.$isWhite 
      ? `radial-gradient(circle, ${Theme.colors.secondary}10 0%, transparent 70%)`
      : 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)'};
    animation: ${pulse} 5s ease-in-out infinite;
  }
`;

const LogoContainer = styled.div`
  padding: 5px;
  position: relative;
  z-index: 10;
  
  @media (min-width: 768px) {
    padding: 15px;
  }
  
  @media (min-width: 1024px) {
    padding: 20px;
  }
`;

const LogoImage = styled.img<{ $isWhite?: boolean }>`
  width: 80px;
  height: auto;
  filter: ${props => props.$isWhite ? 'brightness(0) invert(1)' : 'none'};
  transition: filter 0.3s ease-in-out;
  
  @media (min-width: 768px) {
    width: 100px;
  }
  
  @media (min-width: 1024px) {
    width: 120px;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 5px;
  position: relative;
  z-index: 10;
  max-width: 180px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: 768px) {
    margin-top: 15px;
    gap: 8px;
    max-width: 200px;
  }
`;

const ProgressBar = styled.div<{ $active: boolean; $completed: boolean; $isWhite?: boolean }>`
  height: 4px;
  flex: 1;
  background-color: ${props => props.$isWhite 
    ? 'rgba(0, 0, 0, 0.1)' 
    : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s ease;
  
  @media (min-width: 768px) {
    height: 6px;
  }
  
  ${props => props.$completed && `
    background-color: ${props.$isWhite 
      ? Theme.colors.primary 
      : 'rgba(255, 255, 255, 0.9)'};
  `}
  
  &:hover {
    transform: ${props => props.$active ? 'none' : 'scaleY(1.5)'};
  }
`;

const ProgressFill = styled.div<{ $isWhite?: boolean }>`
  height: 100%;
  background-color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  transition: width 0.03s linear;
`;

const ContentContainer = styled.div`
  border-radius: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  max-width: 900px;
  margin: -50px auto;
  width: 100%;
  position: relative;
  z-index: 10;
  min-height: 0; /* Important for flex children */
  
  @media (max-width: 767px) {
    max-height: calc(100vh - 180px); /* Account for header, progress, and buttons */
  }
  
  @media (min-width: 768px) {
    padding: 10px 20px;
  }
  
  @media (min-width: 1024px) {
    padding: 20px 20px;
  }
`;

const SlideWrapper = styled.div<{ $animating: boolean; $direction: 'next' | 'prev' }>`
  position: relative;
  width: 100%;
  height: 100%;
  animation: ${props => {
    if (props.$animating) {
      return props.$direction === 'next' 
        ? css`${slideInNext} 0.15s ease-out forwards`
        : css`${slideInPrev} 0.15s ease-out forwards`;
    }
    return 'none';
  }};
`;

const SlideContent = styled.div`
  opacity: 1;
  text-align: left;
  position: relative;
`;

const SlideTitle = styled.h1<{ $isWhite?: boolean }>`
  font-size: clamp(20px, 5vw, 42px);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: clamp(6px, 1.5vw, 16px);
  color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  text-align: left;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: ${props => props.$isWhite ? Theme.colors.secondary : 'rgba(255,255,255,0.6)'};
    border-radius: 2px;
  }
`;

const SlideSubtitle = styled.h2<{ $isWhite?: boolean }>`
  font-size: clamp(13px, 3.5vw, 20px);
  font-weight: 400;
  line-height: 1.4;
  margin-bottom: clamp(12px, 3vw, 32px);
  color: ${props => props.$isWhite 
    ? Theme.colors.secondary 
    : 'rgba(255, 255, 255, 0.9)'};
  text-align: left;
`;

const BenefitsHeader = styled.h3<{ $isWhite?: boolean }>`
  font-size: clamp(14px, 3.5vw, 22px);
  font-weight: 600;
  margin-bottom: clamp(8px, 2vw, 20px);
  color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  text-align: left;
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  position: relative;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  @media (min-width: 1024px) {
    gap: 20px;
  }
`;

const BenefitItem = styled.div<{ $delay: number; $isWhite?: boolean; $isMobile?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.$isMobile ? '8px' : '10px'};
  opacity: 0;
  animation: ${slideIn} 0.3s ease-out forwards;
  animation-delay: ${props => props.$delay * 0.05}s;
  background: ${props => props.$isWhite 
    ? 'rgba(0, 0, 0, 0.02)'
    : 'rgba(255, 255, 255, 0.05)'};
  border-radius: ${props => props.$isMobile ? '10px' : '12px'};
  padding: ${props => props.$isMobile ? '10px' : '12px'};
  transition: all 0.2s ease;
  border: 1px solid ${props => props.$isWhite 
    ? 'rgba(0, 0, 0, 0.08)'
    : 'rgba(255, 255, 255, 0.1)'};
  width: ${props => props.$isMobile ? '100%' : 'auto'};
  
  @media (min-width: 768px) {
    padding: 16px;
    gap: 12px;
    border-radius: 16px;
  }
  
  @media (min-width: 1024px) {
    padding: 20px;
    gap: 16px;
  }
  
  &:hover {
    transform: ${props => props.$isMobile ? 'none' : 'translateY(-4px)'};
    box-shadow: ${props => props.$isMobile ? 'none' : `0 10px 30px ${props.$isWhite 
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(0, 0, 0, 0.2)'}`};
    border-color: ${props => props.$isWhite 
      ? Theme.colors.primary + '30'
      : 'rgba(255, 255, 255, 0.2)'};
    background: ${props => props.$isWhite 
      ? 'rgba(0, 0, 0, 0.04)'
      : 'rgba(255, 255, 255, 0.08)'};
  }
`;

const BenefitIconWrapper = styled.div<{ $isWhite?: boolean }>`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: ${props => props.$isWhite 
    ? `linear-gradient(135deg, ${Theme.colors.primary}15 0%, ${Theme.colors.secondary}20 100%)`
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  transition: all 0.15s ease;
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 20px;
    border-radius: 12px;
  }
  
  @media (min-width: 1024px) {
    width: 48px;
    height: 48px;
    min-width: 48px;
    font-size: 24px;
  }
  
  ${BenefitItem}:hover & {
    transform: scale(1.1) rotate(5deg);
    background: ${props => props.$isWhite 
      ? `linear-gradient(135deg, ${Theme.colors.primary}25 0%, ${Theme.colors.secondary}30 100%)`
      : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const BenefitContent = styled.div`
  flex: 1;
  text-align: left;
  position: relative;
`;

const BenefitTitle = styled.h3<{ $isWhite?: boolean }>`
  font-size: clamp(13px, 3.5vw, 18px);
  font-weight: 600;
  margin-bottom: 4px;
  color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  position: relative;
  line-height: 1.2;
`;

const BenefitDescription = styled.p<{ $isWhite?: boolean }>`
  font-size: clamp(11px, 3vw, 15px);
  color: ${props => props.$isWhite 
    ? 'rgba(0, 0, 0, 0.7)' 
    : 'rgba(255, 255, 255, 0.8)'};
  line-height: 1.3;
`;

const ClosingText = styled.p<{ $isWhite?: boolean }>`
  font-size: clamp(13px, 3vw, 20px);
  font-weight: 600;
  margin-top: clamp(12px, 3vw, 32px);
  text-align: left;
  color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  line-height: 1.4;
  opacity: 0;
  animation: ${slideIn} 0.3s ease-out forwards;
  animation-delay: 0.2s;
  
  @media (max-width: 767px) {
    display: none; /* Hide closing text on mobile to save space */
  }
  
  @media (min-width: 768px) {
    display: block;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  position: relative;
  z-index: 10;
  flex-wrap: wrap;
  gap: 8px;
  
  @media (min-width: 768px) {
    padding: 16px 0;
    flex-wrap: nowrap;
    gap: 12px;
  }
  
  @media (min-width: 1024px) {
    padding: 20px 0;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SkipButton = styled.button<{ $isWhite?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$isWhite 
    ? 'rgba(0, 0, 0, 0.5)' 
    : 'rgba(255, 255, 255, 0.7)'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.15s ease;
  position: relative;
  
  @media (min-width: 768px) {
    font-size: 16px;
    padding: 8px 16px;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
    transition: all 0.2s ease;
    transform: translateX(-50%);
  }
  
  &:hover {
    color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
    
    &:after {
      width: 50%;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NavButton = styled.button<{ $isWhite?: boolean; $isPrev?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isWhite 
    ? 'rgba(0, 0, 0, 0.05)' 
    : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background-color: ${props => props.$isWhite 
      ? 'rgba(0, 0, 0, 0.1)' 
      : 'rgba(255, 255, 255, 0.3)'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NextButton = styled.button<{ $isWhite?: boolean; $isLast?: boolean }>`
  background-color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
  color: ${props => props.$isWhite ? 'white' : Theme.colors.secondary};
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding: 12px 24px;
    font-size: 16px;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0;
  position: relative;
  z-index: 10;
  
  @media (min-width: 768px) {
    padding: 0 20px;
  }
`;

const LanguageSwitcherContainer = styled.div`
  z-index: 10;
`;

const MobileBenefitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  touch-action: pan-y;
  position: relative;
`;

const MobileBenefitDots = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;
`;

const BenefitDot = styled.div<{ $active: boolean; $isWhite?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => props.$active 
    ? (props.$isWhite ? Theme.colors.primary : 'white') 
    : (props.$isWhite ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)')};
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background-color: ${props => props.$isWhite ? Theme.colors.primary : 'white'};
    transform: scale(1.2);
  }
`;

export default AdvertiserOnboardingPage; 