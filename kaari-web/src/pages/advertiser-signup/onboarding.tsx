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

// Define a type for translation objects
type TranslationValue = string | Record<string, any>;
type TranslationRecord = Record<string, TranslationValue>;

// Hardcoded translations as fallback
const fallbackTranslations: Record<'fr' | 'en', TranslationRecord> = {
  fr: {
    welcome: "Bienvenue sur Kaari",
    subtitle: "Rejoignez notre communauté de propriétaires et atteignez des milliers de locataires potentiels. Nous rendons la gestion immobilière simple, sécurisée et rentable.",
    feature_integration: {
      title: "Intégration en 48h",
      description: "Publiez votre bien et soyez prêt à accueillir des locataires en seulement 48 heures grâce à notre processus simplifié."
    },
    feature_photography: {
      title: "Photographie Professionnelle",
      description: "Nos photographes professionnels mettront votre bien en valeur, totalement gratuitement."
    },
    feature_management: {
      title: "Gestion Intelligente",
      description: "Gérez les réservations, communiquez avec les locataires et suivez les paiements, le tout au même endroit."
    },
    cta: {
      button: "Commencer Maintenant"
    }
  },
  en: {
    welcome: "Welcome to Kaari",
    subtitle: "Join our community of landlords and reach thousands of potential tenants. We make property management simple, secure and profitable.",
    feature_integration: {
      title: "48-Hour Integration",
      description: "List your property and be ready to welcome tenants in just 48 hours with our streamlined process."
    },
    feature_photography: {
      title: "Professional Photography",
      description: "Our professional photographers will showcase your property at its best, completely free of charge."
    },
    feature_management: {
      title: "Intelligent Management",
      description: "Manage bookings, communicate with tenants, and track payments, all in one place."
    },
    cta: {
      button: "Start Now"
    }
  }
};

const AdvertiserOnboardingPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('translation', { useSuspense: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animatedItems, setAnimatedItems] = useState({
    welcome: false,
    features: false,
    cta: false
  });

  // Helper function to get translations with fallback
  const getTranslation = (key: string): string => {
    // Try to get translation from i18n first
    const translation = t(key);
    
    // If the key is returned as is, it means the translation is missing
    if (translation === key) {
      console.warn(`Missing translation for key: ${key}`);
      
      // Parse the key to get the nested properties
      const keyParts = key.split('.');
      
      // Remove the namespace (advertiser_onboarding)
      keyParts.shift();
      
      // Get the current language
      const lang = i18n.language && i18n.language.startsWith('fr') ? 'fr' : 'en';
      
      // Try to get from fallback translations
      let fallback: Record<string, any> = fallbackTranslations[lang as 'fr' | 'en'];
      
      // Navigate through the nested properties
      for (const part of keyParts) {
        if (fallback && typeof fallback === 'object' && part in fallback) {
          fallback = fallback[part] as Record<string, any>;
        } else {
          // If property doesn't exist, try the other language
          const otherLang = lang === 'fr' ? 'en' : 'fr';
          fallback = fallbackTranslations[otherLang];
          
          for (const p of keyParts) {
            if (fallback && typeof fallback === 'object' && p in fallback) {
              fallback = fallback[p] as Record<string, any>;
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
    
    // Set default language to French if not already set
    const currentLang = i18n.language;
    if (!currentLang || (!currentLang.startsWith('fr') && !currentLang.startsWith('en'))) {
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
      navigate("/advertiser-signup/form");
    }, 500);
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <Container isExiting={isExiting}>
      <LoadingOverlay isLoading={isLoading} />
      <GradientOverlay />
      
      <TopSection>
        <LogoWrapper>
          <Logo src={PurpleLogo} alt="Kaari Logo" />
        </LogoWrapper>
        <LanguageSwitcherWrapper>
          {isMobile ? <MobileLanguageSwitcher /> : <LanguageSwitcher />}
        </LanguageSwitcherWrapper>
      </TopSection>
      
      <ContentContainer>
        <MainContent>
          <WelcomeSection isVisible={animatedItems.welcome}>
            <WelcomeHeading>Bienvenue sur Kaari</WelcomeHeading>
            <Subheading>
              Rejoignez notre communauté de propriétaires et atteignez des milliers de locataires potentiels. 
              Nous rendons la gestion immobilière simple, sécurisée et rentable.
            </Subheading>
          </WelcomeSection>
          
          <FeatureList isVisible={animatedItems.features}>
            <FeatureItem>
              <FeatureIconWrapper>
                <MdHouse size={20} color="white" />
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle>Intégration en 48h</FeatureTitle>
                <FeatureDescription>
                  Publiez votre bien et soyez prêt à accueillir des locataires en seulement 48 heures grâce à notre processus simplifié.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIconWrapper>
                <MdCameraAlt size={20} color="white" />
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle>Photographie Professionnelle</FeatureTitle>
                <FeatureDescription>
                  Nos photographes professionnels mettront votre bien en valeur, totalement gratuitement.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIconWrapper>
                <MdHandshake size={20} color="white" />
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle>Gestion Intelligente</FeatureTitle>
                <FeatureDescription>
                  Gérez les réservations, communiquez avec les locataires et suivez les paiements, le tout au même endroit.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
          </FeatureList>
          
          <CTASection isVisible={animatedItems.cta}>
            <StartButton onClick={handleGetStarted}>
              Commencer Maintenant
              <FaArrowRight />
            </StartButton>
          </CTASection>
        </MainContent>
        
        <IllustrationContainer>
          <PlaceholderIllustration>
            <PlaceholderText>Illustration Placeholder</PlaceholderText>
          </PlaceholderIllustration>
        </IllustrationContainer>
      </ContentContainer>
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
  overflow-y: auto;
  animation: ${props => props.isExiting ? fadeOut : fadeIn} 0.5s ease-in-out;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem;
    height: 100%;
    min-height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    
    &::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
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

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  position: relative;
  z-index: 2;
  height: 60px;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
    height: 50px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
  filter: brightness(0) invert(1);
`;

const LanguageSwitcherWrapper = styled.div`
  z-index: 10;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  height: calc(100vh - 100px); /* Adjust for header height */
  align-items: center;
  
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
    gap: 1rem;
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

const PlaceholderIllustration = styled.div`
  width: 100%;
  max-height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
`;

const PlaceholderText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  opacity: 0.8;
  text-align: center;
`;

const WelcomeSection = styled.div<{ isVisible: boolean }>`
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
`;

const WelcomeHeading = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
  }
`;

const Subheading = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  max-width: 650px;
  margin: 0 0 1rem 0;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
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
`;

const FeatureItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
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
  
  svg {
    font-size: 20px;
    color: white;
  }
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.4rem 0;
  color: white;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
`;

const CTASection = styled.div<{ isVisible: boolean }>`
  margin-top: 1rem;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
`;

const StartButton = styled.button`
  background: white;
  color: ${Theme.colors.secondary};
  border: none;
  border-radius: 50px;
  padding: 0.9rem 2.5rem;
  font-size: 1.1rem;
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
  }
`;

export default AdvertiserOnboardingPage;