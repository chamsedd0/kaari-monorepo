import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import PurpleLogo from "../../assets/images/purpleLogo.svg";
import { Theme } from "../../theme/theme";
import { MdCameraAlt, MdVerified, MdHandshake, MdHouse, MdAttachMoney, MdSupportAgent } from "react-icons/md";
import LanguageSwitcher from "../../components/skeletons/language-switcher/language-switcher";

// Define a type for translation objects
type TranslationValue = string | Record<string, any>;
type TranslationRecord = Record<string, TranslationValue>;

// Hardcoded translations as fallback
const fallbackTranslations: Record<'fr' | 'en', TranslationRecord> = {
  fr: {
    welcome: "Bienvenue sur Kaari",
    subtitle: "Louez sans effort.",
    feature_photos: {
      title: "Photos + Annonce Gratuites",
      description: "Nous prenons des photos et créons votre annonce."
    },
    feature_tenants: {
      title: "Locataires Vérifiés",
      description: "Filtrage pour des demandes sérieuses uniquement."
    },
    feature_approval: {
      title: "Vous Approuvez, On Gère",
      description: "Paiements et assistance gérés par nous."
    },
    founding_partner: {
      title: "Programme Partenaire Fondateur",
      description: "Avantages exclusifs pour nos 100 premiers annonceurs.",
      benefit_commission: {
        highlight: "0% Commission (3 Mois)",
        text: "– 100% du loyer pour vous."
      },
      benefit_referral: {
        highlight: "Programme de Parrainage",
        text: "– 10% pour chaque locataire parrainé."
      },
      benefit_support: {
        highlight: "Support VIP",
        text: "– Aide personnalisée pour vos revenus."
      }
    },
    cta: {
      spots_available: "100 Places Disponibles",
      description: "Rejoignez la première vague Kaari.",
      button: "S'inscrire"
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
    },
    founding_partner: {
      title: "Founding Partner Program",
      description: "Unlock exclusive perks – only for our first 100 advertisers.",
      benefit_commission: {
        highlight: "0% Commission (3 Months)",
        text: "– Keep 100% of your rent."
      },
      benefit_referral: {
        highlight: "Referral Program",
        text: "– Earn 10% for every tenant you refer."
      },
      benefit_support: {
        highlight: "VIP Support",
        text: "– Personalized help to boost your earnings."
      }
    },
    cta: {
      spots_available: "Only 100 Spots Available",
      description: "Be part of the very first wave shaping Kaari's future.",
      button: "Sign Up Now"
    }
  }
};

const AdvertiserOnboardingPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('translation', { useSuspense: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [animatedItems, setAnimatedItems] = useState({
    welcome: false,
    features: false,
    foundingPartner: false,
    cta: false
  });

  // Debug translations
  console.log("Current language:", i18n.language);
  console.log("Translation for welcome:", t('advertiser_onboarding.welcome'));
  console.log("Available languages:", i18n.languages);
  console.log("Translation resources:", i18n.options.resources);

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
      console.log("After reload - Translation for welcome:", t('advertiser_onboarding.welcome'));
    });
    
    // Simulate loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Trigger animations in sequence
      setTimeout(() => setAnimatedItems(prev => ({ ...prev, welcome: true })), 100);
      setTimeout(() => setAnimatedItems(prev => ({ ...prev, features: true })), 300);
      setTimeout(() => setAnimatedItems(prev => ({ ...prev, foundingPartner: true })), 500);
      setTimeout(() => setAnimatedItems(prev => ({ ...prev, cta: true })), 700);
    }, 500);
    
    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
    };
  }, [i18n, t]);

  const handleGetStarted = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/advertiser-signup/form");
    }, 500);
  };
  
  // Also apply to body and html elements when on mobile
  useEffect(() => {
    const applyMobileStyles = () => {
      if (window.innerWidth <= 768) {
        // Create a style element to add CSS rules
        const style = document.createElement('style');
        style.textContent = `
          html, body, #root {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            overflow-y: auto;
          }
          
          html::-webkit-scrollbar, 
          body::-webkit-scrollbar, 
          #root::-webkit-scrollbar,
          div::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
          }
        `;
        document.head.appendChild(style);
        
        return () => {
          document.head.removeChild(style);
        };
      }
      return undefined;
    };
    
    const cleanup = applyMobileStyles();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <Container isExiting={isExiting}>
      <LoadingOverlay isLoading={isLoading} />
      <GradientOverlay />
      
      <TopSection>
        <LogoWrapper>
          <Logo src={PurpleLogo} alt="Kaari Logo" />
        </LogoWrapper>
        <LanguageSwitcherWrapper>
          <LanguageSwitcher />
        </LanguageSwitcherWrapper>
      </TopSection>
      
      <ContentContainer>
        <LeftColumn>
          <LeftColumnContent>
            <WelcomeSection isVisible={animatedItems.welcome}>
              <WelcomeHeading>{getTranslation('advertiser_onboarding.welcome')}</WelcomeHeading>
              <Subheading>{getTranslation('advertiser_onboarding.subtitle')}</Subheading>
            </WelcomeSection>
            
            <FeatureList isVisible={animatedItems.features}>
              <FeatureItem>
                <FeatureIconWrapper>
                  <MdCameraAlt size={20} color={Theme.colors.secondary} />
                </FeatureIconWrapper>
                <FeatureContent>
                  <FeatureTitle>{getTranslation('advertiser_onboarding.feature_photos.title')}</FeatureTitle>
                  <FeatureDescription>{getTranslation('advertiser_onboarding.feature_photos.description')}</FeatureDescription>
                </FeatureContent>
              </FeatureItem>
              
              <FeatureItem>
                <FeatureIconWrapper>
                  <MdVerified size={20} color={Theme.colors.secondary} />
                </FeatureIconWrapper>
                <FeatureContent>
                  <FeatureTitle>{getTranslation('advertiser_onboarding.feature_tenants.title')}</FeatureTitle>
                  <FeatureDescription>{getTranslation('advertiser_onboarding.feature_tenants.description')}</FeatureDescription>
                </FeatureContent>
              </FeatureItem>
              
              <FeatureItem>
                <FeatureIconWrapper>
                  <MdHandshake size={20} color={Theme.colors.secondary} />
                </FeatureIconWrapper>
                <FeatureContent>
                  <FeatureTitle>{getTranslation('advertiser_onboarding.feature_approval.title')}</FeatureTitle>
                  <FeatureDescription>{getTranslation('advertiser_onboarding.feature_approval.description')}</FeatureDescription>
                </FeatureContent>
              </FeatureItem>
            </FeatureList>
            
            <FoundingPartnerCard isVisible={animatedItems.foundingPartner}>
              <FoundingPartnerHeader>
                <FoundingPartnerDot />
                <FoundingPartnerTitle>{getTranslation('advertiser_onboarding.founding_partner.title')}</FoundingPartnerTitle>
              </FoundingPartnerHeader>
              <FoundingPartnerDescription>
                {getTranslation('advertiser_onboarding.founding_partner.description')}
              </FoundingPartnerDescription>
              
              <BenefitsList>
                <BenefitItem>
                  <BenefitIconWrapper>
                    <MdAttachMoney size={16} color={Theme.colors.secondary} />
                  </BenefitIconWrapper>
                  <BenefitText>
                    <BenefitHighlight>{getTranslation('advertiser_onboarding.founding_partner.benefit_commission.highlight')}</BenefitHighlight>
                    {getTranslation('advertiser_onboarding.founding_partner.benefit_commission.text')}
                  </BenefitText>
                </BenefitItem>
                
                <BenefitItem>
                  <BenefitIconWrapper>
                    <MdHouse size={16} color={Theme.colors.secondary} />
                  </BenefitIconWrapper>
                  <BenefitText>
                    <BenefitHighlight>{getTranslation('advertiser_onboarding.founding_partner.benefit_referral.highlight')}</BenefitHighlight>
                    {getTranslation('advertiser_onboarding.founding_partner.benefit_referral.text')}
                  </BenefitText>
                </BenefitItem>
                
                <BenefitItem>
                  <BenefitIconWrapper>
                    <MdSupportAgent size={16} color={Theme.colors.secondary} />
                  </BenefitIconWrapper>
                  <BenefitText>
                    <BenefitHighlight>{getTranslation('advertiser_onboarding.founding_partner.benefit_support.highlight')}</BenefitHighlight>
                    {getTranslation('advertiser_onboarding.founding_partner.benefit_support.text')}
                  </BenefitText>
                </BenefitItem>
              </BenefitsList>
            </FoundingPartnerCard>
          </LeftColumnContent>
        </LeftColumn>
        
        <Divider />
        
        <RightColumn>
          <RightColumnContent>
            <CTALogo src={PurpleLogo} alt="Kaari Logo" isVisible={animatedItems.cta} />
            
            <CTACard isVisible={animatedItems.cta}>
              <CTABadge>
                {getTranslation('advertiser_onboarding.cta.spots_available')}
              </CTABadge>
              
              <CTADescription>
                {getTranslation('advertiser_onboarding.cta.description')}
              </CTADescription>
              
              <SignUpButton onClick={handleGetStarted}>
                {getTranslation('advertiser_onboarding.cta.button')}
              </SignUpButton>
            </CTACard>
          </RightColumnContent>
        </RightColumn>
      </ContentContainer>
    </Container>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const Container = styled.div<{ isExiting: boolean }>`
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background: linear-gradient(135deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem;
  box-sizing: border-box;
  overflow-y: auto;
  animation: ${props => props.isExiting ? fadeOut : fadeIn} 0.5s ease-in-out;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    height: auto;
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

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
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

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
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
  gap: 2rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 968px) {
    flex-direction: column;
    overflow-y: auto;
    padding-bottom: 2rem;
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

const LeftColumn = styled.div`
  flex: 0.65;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 968px) {
    flex: 1;
    margin-bottom: 2rem;
  }
`;

const LeftColumnContent = styled.div`
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const WelcomeSection = styled.div<{ isVisible: boolean }>`
  margin-bottom: 2.5rem;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeHeading = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(to right, #ffffff, #e0e0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subheading = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FeatureList = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  width: 100%;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
  
  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FeatureIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(5deg);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.4;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const FoundingPartnerCard = styled.div<{ isVisible: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.75rem;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  width: 100%;
  text-align: center;
  
  &:before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const FoundingPartnerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: center;
`;

const FoundingPartnerDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  margin-right: 1rem;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const FoundingPartnerTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(to right, #ffffff, #e0e0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const FoundingPartnerDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin: 0 0 1.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem;
  }
`;

const BenefitIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const BenefitDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a36fe6;
  margin-top: 0.5rem;
  flex-shrink: 0;
`;

const BenefitText = styled.p`
  font-size: 0.95rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const BenefitHighlight = styled.span`
  font-weight: 600;
  color: white;
`;

const Divider = styled.div`
  width: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const RightColumn = styled.div`
  flex: 0.35;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 968px) {
    flex: 1;
    margin-top: 1.5rem;
    padding-bottom: 3rem;
  }
`;

const RightColumnContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const CTALogo = styled.img<{ isVisible: boolean }>`
  height: 60px;
  filter: brightness(0) invert(1);
  margin-bottom: 2rem;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  
  @media (max-width: 768px) {
    height: 50px;
    margin-bottom: 1.5rem;
  }
`;

const CTACard = styled.div<{ isVisible: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 1.75rem;
    border-radius: 20px;
  }
`;

const CTABadge = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 5s infinite;
    opacity: 0.5;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.6rem 1.25rem;
    margin-bottom: 1.5rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 2.5rem 0;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }
`;

const SignUpButton = styled.button`
  background: white;
  color: ${Theme.colors.secondary};
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20%;
    height: 200%;
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(30deg);
    transition: all 0.6s ease;
  }
  
  &:hover:after {
    left: 120%;
  }
  
  @media (max-width: 768px) {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
`;

export default AdvertiserOnboardingPage;