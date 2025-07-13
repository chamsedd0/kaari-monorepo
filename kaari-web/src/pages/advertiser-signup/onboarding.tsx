import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import PurpleLogo from "../../assets/images/purpleLogo.svg";
import { Theme } from "../../theme/theme";
import { FaHome, FaCamera, FaCog, FaArrowRight, FaTimes } from "react-icons/fa";
import { LanguageSwitcher, MobileLanguageSwitcher } from "../../components/skeletons/language-switcher";
import { hideHeadersAndFooters } from '../../utils/advertiser-signup';
import { MdHouse, MdCameraAlt, MdHandshake, MdVerified, MdAttachMoney, MdSupportAgent } from "react-icons/md";
import OnboardingIllustration from "../../assets/images/onBoardingIllustration.svg";

// Remove unused translation types
const AdvertiserOnboardingPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animatedItems, setAnimatedItems] = useState({
    welcome: false,
    features: false,
    cta: false
  });

  // Hardcoded translations as fallback
  const fallbackTranslations = {
    fr: {
      welcome: "Bienvenue sur Kaari",
      subtitle: "Louez votre propriété sans lever le petit doigt.",
      feature_photos: {
        title: "Photos + Annonce Gratuites",
        description: "Nous visitons votre propriété, prenons des photos, rédigeons l'annonce et la publions."
      },
      feature_tenants: {
        title: "Locataires Vérifiés, Sans Visites",
        description: "Nous filtrons les locataires pour que vous ne receviez que des demandes sérieuses."
      },
      feature_approval: {
        title: "Vous Approuvez, Nous Faisons le Reste",
        description: "Paiements, coordination, assistance aux locataires — tout est géré par nous."
      }
    },
    en: {
      welcome: "Welcome to Kaari",
      subtitle: "Rent out your property without lifting a finger.",
      feature_photos: {
        title: "Free Photos + Listing",
        description: "We visit your property, take photos, write the listing, and publish it."
      },
      feature_tenants: {
        title: "Verified Tenants, No Visits",
        description: "We screen tenants so you only get serious requests."
      },
      feature_approval: {
        title: "You Approve, We Do the Rest",
        description: "Payments, coordination, tenant support — all handled by us."
      }
    }
  };

  // Helper function to get translations with fallback
  const getTranslation = (key: string): string => {
    const fullKey = `advertiser_onboarding.${key}`;
    // Try to get translation from i18n first
    const translation = t(fullKey);
    
    // If the key is returned as is, it means the translation is missing
    if (translation === fullKey) {
      console.warn(`Missing translation for key: ${fullKey}`);
      
      // Parse the key to get the nested properties
      const keyParts = key.split('.');
      
      // Get the current language - respect Arabic as well
      const lang = i18n.language && i18n.language.startsWith('ar') ? 'en' : 
                  (i18n.language && i18n.language.startsWith('fr') ? 'fr' : 'en');
      
      // Try to get from fallback translations
      let fallback = fallbackTranslations[lang as 'fr' | 'en'];
      
      // Navigate through the nested properties
      for (const part of keyParts) {
        if (fallback && typeof fallback === 'object' && part in fallback) {
          fallback = fallback[part] as any;
        } else {
          // If property doesn't exist, try the other language
          const otherLang = lang === 'fr' ? 'en' : 'fr';
          fallback = fallbackTranslations[otherLang];
          
          for (const p of keyParts) {
            if (fallback && typeof fallback === 'object' && p in fallback) {
              fallback = fallback[p] as any;
            } else {
              return key; // Return the key if all else fails
            }
          }
          
          break;
        }
      }
      
      return typeof fallback === 'string' ? fallback : key;
    }
    
    return translation;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Don't override the language if it's already set
    const currentLang = i18n.language;
    if (!currentLang) {
      i18n.changeLanguage('fr');
      localStorage.setItem('i18nextLng', 'fr');
    }
    
    // Force reload translations to ensure they're available
    i18n.reloadResources().then(() => {
      console.log('Translations reloaded');
    });
    
    // Simulate loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Trigger animations in sequence
      setTimeout(() => setAnimatedItems(prev => ({ ...prev, welcome: true })), 100);
      setTimeout(() => setAnimatedItems(prev => ({ ...prev, features: true })), 300);
      setTimeout(() => setAnimatedItems(prev => ({ ...prev, cta: true })), 500);
    }, 500);
    
    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
    };
  }, [i18n]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Ensure headers and footers are hidden
  useEffect(() => {
    // Hide headers and footers
    const cleanupHeadersFooters = hideHeadersAndFooters();
    
    // Cleanup function
    return () => {
      cleanupHeadersFooters();
    };
  }, []);

  const handleGetStarted = () => {
    setIsExiting(true);
    setTimeout(() => {
      // Navigate to the founding partners page instead of directly to the form
      navigate("/advertiser-signup/founding-partners");
    }, 500);
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <Container isExiting={isExiting}>
      <LoadingOverlay isLoading={isLoading} />
      <GradientOverlay />
      
      <TopSection isMobile={isMobile}>
        {isMobile ? (
          <CenteredLogoWrapper>
            <Logo src={PurpleLogo} alt={t('common.kaari_logo')} isMobile={isMobile} />
          </CenteredLogoWrapper>
        ) : (
          <>
            <LogoWrapper>
              <Logo src={PurpleLogo} alt={t('common.kaari_logo')} isMobile={isMobile} />
            </LogoWrapper>
            <LanguageSwitcherWrapper>
              <LanguageSwitcher />
            </LanguageSwitcherWrapper>
            <CloseButton onClick={handleClose}>
              <FaTimes />
            </CloseButton>
          </>
        )}
      </TopSection>
      
      <ContentContainer isMobile={isMobile}>
        <MainContent>
          <WelcomeSection isVisible={animatedItems.welcome}>
            <WelcomeHeading isMobile={isMobile}>{getTranslation('welcome')}</WelcomeHeading>
            <Subheading isMobile={isMobile}>
              {getTranslation('subtitle')}
            </Subheading>
          </WelcomeSection>
          
          <FeatureList isVisible={animatedItems.features}>
            <FeatureItem isMobile={isMobile}>
              <FeatureIconWrapper>
                <MdHouse size={isMobile ? 16 : 20} color="white" />
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle isMobile={isMobile}>{getTranslation('feature_photos.title')}</FeatureTitle>
                <FeatureDescription isMobile={isMobile}>
                  {getTranslation('feature_photos.description')}
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
            
            <FeatureItem isMobile={isMobile}>
              <FeatureIconWrapper>
                <MdCameraAlt size={isMobile ? 16 : 20} color="white" />
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle isMobile={isMobile}>{getTranslation('feature_tenants.title')}</FeatureTitle>
                <FeatureDescription isMobile={isMobile}>
                  {getTranslation('feature_tenants.description')}
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
            
            <FeatureItem isMobile={isMobile}>
              <FeatureIconWrapper>
                <MdHandshake size={isMobile ? 16 : 20} color="white" />
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle isMobile={isMobile}>{getTranslation('feature_approval.title')}</FeatureTitle>
                <FeatureDescription isMobile={isMobile}>
                  {getTranslation('feature_approval.description')}
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
          </FeatureList>
          
          <CTASection isVisible={animatedItems.cta}>
            <StartButton onClick={handleGetStarted} isMobile={isMobile}>
              {t('common.get_started')}
              <FaArrowRight />
            </StartButton>
          </CTASection>
        </MainContent>
        
        {!isMobile && (
          <IllustrationContainer>
            <img src={OnboardingIllustration} alt="Onboarding Illustration" />
          </IllustrationContainer>
        )}
      </ContentContainer>
      
      {isMobile && (
        <BottomLanguageSwitcher>
          <MobileLanguageSwitcher />
        </BottomLanguageSwitcher>
      )}
    </Container>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled Components
const Container = styled.div<{ isExiting: boolean }>`
  width: 100vw;
  min-height: 100vh;
  height: 100vh;
  background: #6a1b9a; /* Back to the previous purple color */
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
  overflow: hidden;
  animation: ${props => props.isExiting ? fadeOut : fadeIn} 0.5s ease-in-out;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem;
    height: 100%;
    min-height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
      background: transparent;
    }
  }
`;

const LoadingOverlay = styled.div<{ isLoading: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${Theme.colors.primary};
  z-index: 100;
  opacity: ${props => props.isLoading ? 1 : 0};
  visibility: ${props => props.isLoading ? 'visible' : 'hidden'};
  transition: opacity 0.5s ease, visibility 0.5s ease;
`;

const GradientOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.1), transparent 70%);
  z-index: 1;
  pointer-events: none;
`;

const TopSection = styled.div<{ isMobile: boolean }>`
  display: flex;
  justify-content: ${props => props.isMobile ? 'center' : 'space-between'};
  align-items: center;
  margin-bottom: 0;
  position: relative;
  z-index: 2;
  height: ${props => props.isMobile ? '50px' : '60px'};
  
  @media (max-width: 768px) {
    margin-bottom: 0;
    height: 50px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CenteredLogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Logo = styled.img<{ isMobile: boolean }>`
  height: ${props => props.isMobile ? '30px' : '40px'};
  filter: brightness(0) invert(1);
`;

const LanguageSwitcherWrapper = styled.div`
  z-index: 10;
`;

const BottomLanguageSwitcher = styled.div`
  position: fixed;
  top: 15px;
  right:  15px;
  z-index: 1000;
  
  /* Ensure visibility with background and shadow */
  padding: 8px;
  border-radius: 20px;
  background-color: rgba(76, 27, 97, 0.2);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
  display: none;
`;

const ContentContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: ${props => props.isMobile ? 'column' : 'row'};
  gap: ${props => props.isMobile ? '1.5rem' : '4rem'};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  height: ${props => props.isMobile ? 'auto' : 'calc(100vh - 100px)'};
  align-items: center;
  padding: ${props => props.isMobile ? '1rem 0' : '0'};
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    background: transparent;
  }
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 2rem;
    height: auto;
    min-height: calc(100vh - 100px);
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    justify-content: start;
    gap: 1rem;
    width: 100%;
  }
`;

const IllustrationContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;


const WelcomeSection = styled.div<{ isVisible: boolean }>`
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  text-align: center;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const WelcomeHeading = styled.h1<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '2rem' : '3.2rem'};
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
  }
`;

const Subheading = styled.p<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '0.9rem' : '1.1rem'};
  line-height: 1.5;
  max-width: 650px;
  margin: 0 0 0.6rem 0;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeatureList = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  width: 100%;
  max-width: 600px;

  
  @media (max-width: 768px) {
    margin: 0 auto;
    gap: 0.8rem;
  }
`;

const FeatureItem = styled.div<{ isMobile: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.isMobile ? '12px' : '16px'};
  min-height: ${props => props.isMobile ? '30%' : 'unset'};
  padding: ${props => props.isMobile ? '1.5rem' : '1.2rem'};
  display: flex;
  align-items: center;
  gap: ${props => props.isMobile ? '0.8rem' : '1rem'};
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
`;

const FeatureIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
  
  svg {
    font-size: 20px;
    color: white;
    
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FeatureTitle = styled.h3<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '1rem' : '1.2rem'};
  font-weight: 600;
  margin: 0 0 0.4rem 0;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 0.2rem 0;
  }
`;

const FeatureDescription = styled.p<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '0.85rem' : '0.95rem'};
  line-height: 1.5;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const CTASection = styled.div<{ isVisible: boolean }>`
  margin-top: 0.2rem;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StartButton = styled.button<{ isMobile: boolean }>`
  background: white;
  color: ${Theme.colors.secondary};
  border: none;
  border-radius: 50px;
  padding: ${props => props.isMobile ? '0.8rem 2rem' : '0.9rem 2.5rem'};
  font-size: ${props => props.isMobile ? '1rem' : '1.1rem'};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  
  svg {
    font-size: 0.9rem;
    
    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 768px) {
    width: 80%;
    justify-content: center;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    margin-bottom: 50px;
  }
`;

export default AdvertiserOnboardingPage;