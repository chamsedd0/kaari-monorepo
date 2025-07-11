import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Theme } from '../../theme/theme';
import PurpleLogo from '../../assets/images/purpleLogo.svg';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import { LanguageSwitcher, MobileLanguageSwitcher } from '../../components/skeletons/language-switcher';
import { hideHeadersAndFooters } from '../../utils/advertiser-signup';
import ConfettiSVG from '../../assets/images/confetti_foundingPartners.svg';
import { useTranslation } from 'react-i18next';
import eventBus, { EventType } from '../../utils/event-bus';
// Import better icons from react-icons
import { FaShieldAlt, FaHandshake, FaHeadset } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';

// Define types for the translations
interface BenefitType {
  highlight: string;
  subtitle: string;
  description: string;
  alt: string;
  [key: string]: string;
}

interface CTAType {
  description: string;
  button: string;
  [key: string]: string;
}

interface TranslationType {
  be_part_first: string;
  title: string;
  description: string;
  benefits_duration: string;
  benefits_heading: string;
  tagline: string;
  benefit_commission: BenefitType;
  benefit_referral: BenefitType;
  benefit_support: BenefitType;
  cta: CTAType;
  [key: string]: string | BenefitType | CTAType;
}

interface FallbackTranslationsType {
  fr: TranslationType;
  en: TranslationType;
  [key: string]: TranslationType;
}

const FoundingPartnersPage: React.FC = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // Hardcoded translations as fallback
  const fallbackTranslations: FallbackTranslationsType = {
    fr: {
      be_part_first: "Faites partie des premiers",
      title: "Partenaires Fondateurs",
      description: "...et accédez en avant-première à notre offre de lancement la plus exclusive.",
      benefits_duration: "Ces avantages durent seulement 3 mois",
      benefits_heading: "Profitez au maximum de votre statut de Partenaire Fondateur.",
      tagline: "Gagnez plus. Faites moins. Soyez payé plus vite.",
      benefit_commission: {
        highlight: "0%",
        subtitle: "Offre Annonceur",
        description: "Touchez 100% du loyer sur vos 3 premières réservations — zéro commission prélevée.",
        alt: "0% de Commission"
      },
      benefit_referral: {
        highlight: "Gagnez en Recommandant",
        subtitle: "Parrainage Locataire",
        description: "Touchez 10% du loyer + 200 MAD de remise pour chaque réservation parrainée.",
        alt: "Gains de Parrainage"
      },
      benefit_support: {
        highlight: "Support VIP Dédié",
        subtitle: "Accompagnement Personnalisé",
        description: "Profitez d'un suivi proactif à chaque étape, avec une équipe disponible et réactive.",
        alt: "Support VIP"
      },
      cta: {
        description: "Faites partie de la toute première vague qui façonne l'avenir de Kaari.",
        button: "S'inscrire maintenant"
      }
    },
    en: {
      be_part_first: "Be part of the first",
      title: "Founding Partners",
      description: "...and get early access to our most exclusive launch offer yet.",
      benefits_duration: "These benefits last 3 months only",
      benefits_heading: "Make the most of your Founding Partner status.",
      tagline: "Earn more. Do less. Get paid faster.",
      benefit_commission: {
        highlight: "🛡 0%",
        subtitle: "Advertiser Commission",
        description: "Keep 100% of the rent on your first 3 bookings — zero commission taken.",
        alt: "0% Commission"
      },
      benefit_referral: {
        highlight: "💸 Earn by Referring",
        subtitle: "Tenant Referrals",
        description: "Earn 10% of the rent + 200 MAD discount for each referred booking.",
        alt: "Referral Earnings"
      },
      benefit_support: {
        highlight: "🤝 Dedicated VIP Support",
        subtitle: "Personalized Guidance",
        description: "Enjoy proactive support at every step, with a responsive and available team.",
        alt: "VIP Support"
      },
      cta: {
        description: "Be part of the very first wave shaping Kaari's future.",
        button: "Sign Up Now"
      }
    }
  };

  // Helper function to get translations with fallback
  const getTranslation = (key: string): string => {
    const fullKey = `advertiser_onboarding.founding_partner.${key}`;
    // Try to get translation from i18n first
    const translation = t(fullKey);
    
    // If the key is returned as is, it means the translation is missing
    if (translation === fullKey) {
      console.warn(`Missing translation for key: ${fullKey}`);
      
      // Parse the key to get the nested properties
      const keyParts = key.split('.');
      
      // Get the current language
      const lang = i18n.language && i18n.language.startsWith('fr') ? 'fr' : 'en';
      
      try {
        // Try to get from fallback translations
        let fallback: Record<string, any> = fallbackTranslations[lang];
        
        // Navigate through the nested properties
        for (const part of keyParts) {
          if (fallback && typeof fallback === 'object' && part in fallback) {
            fallback = fallback[part as keyof typeof fallback];
          } else {
            // If property doesn't exist, try the other language
            const otherLang = lang === 'fr' ? 'en' : 'fr';
            fallback = fallbackTranslations[otherLang] as Record<string, any>;
            
            for (const p of keyParts) {
              if (fallback && typeof fallback === 'object' && p in fallback) {
                fallback = fallback[p as keyof typeof fallback];
              } else {
                return key; // Return the key if all else fails
              }
            }
            
            break;
          }
        }
        
        return typeof fallback === 'string' ? fallback : key;
      } catch (error) {
        console.error('Error retrieving translation:', error);
        return key;
      }
    }
    
    return translation;
  };

  // Helper function for CTA section translations
  const getCTATranslation = (key: string): string => {
    const fullKey = `advertiser_onboarding.cta.${key}`;
    // Try to get translation from i18n first
    const translation = t(fullKey);
    
    // If the key is returned as is, it means the translation is missing
    if (translation === fullKey) {
      console.warn(`Missing translation for key: ${fullKey}`);
      
      // Get the current language
      const lang = i18n.language && i18n.language.startsWith('fr') ? 'fr' : 'en';
      
      // Use fallback
      try {
        const ctaFallback = fallbackTranslations[lang].cta as Record<string, string>;
        return key in ctaFallback ? ctaFallback[key as keyof typeof ctaFallback] : key;
      } catch (error) {
        console.error('Error retrieving CTA translation:', error);
        return key;
      }
    }
    
    return translation;
  };

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

  // Ensure headers and footers are hidden and set default language to French
  useEffect(() => {
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
    
    // Add special class to body for CSS targeting
    document.body.classList.add('kaari-signup-flow');
    document.body.classList.add('kaari-founding-partners');
    
    // Apply direct styles to ensure headers are hidden
    const style = document.createElement('style');
    style.textContent = `
      header, [class*="header"], [id*="header"], [class*="Header"], [id*="Header"],
      footer, [class*="footer"], [id*="footer"], [class*="Footer"], [id*="Footer"],
      nav, [class*="nav"], [id*="nav"], [class*="Nav"], [id*="Nav"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        z-index: -9999 !important;
      }
      
      body.kaari-signup-flow {
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(style);
    
    // Hide headers and footers - initial call
    const cleanupHeadersFooters = hideHeadersAndFooters();
    
    // Hide headers again after a short delay to catch any late-rendered components
    const timeoutId = setTimeout(() => {
      hideHeadersAndFooters();
    }, 100);
    
    // Set up an interval to keep hiding elements (some frameworks might re-render)
    const intervalId = setInterval(() => {
      hideHeadersAndFooters();
    }, 500);
    
    // Emit route change event to trigger App.tsx header hiding logic
    eventBus.emit(EventType.NAV_ROUTE_CHANGED, {
      path: window.location.pathname,
      params: Object.fromEntries(new URLSearchParams(window.location.search))
    });
    
    // Simulate loading animation
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Cleanup function
    return () => {
      cleanupHeadersFooters();
      clearTimeout(timeoutId);
      clearTimeout(loadingTimer);
      clearInterval(intervalId);
      document.body.classList.remove('kaari-signup-flow');
      document.body.classList.remove('kaari-founding-partners');
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [i18n]);

  // Add a new effect to respond to language changes
  useEffect(() => {
    // This effect will run whenever the language changes
    console.log('Language changed in founding-partners page:', i18n.language);
    // Force component update when language changes
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [i18n.language]);

  // Additional effect to handle DOM mutations that might add headers
  useEffect(() => {
    // Set up a MutationObserver to detect and hide dynamically added headers
    const observer = new MutationObserver(() => {
      // Call hideHeadersAndFooters when DOM changes
      hideHeadersAndFooters();
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Return cleanup function
    return () => {
      observer.disconnect();
    };
  }, []);

  // Ensure the page is scrolled to the top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Restore body scrolling on unmount
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSignUpNow = () => {
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
      
      {/* Confetti Decorations */}
      <ConfettiLeft src={ConfettiSVG} alt={t('common.confetti_decoration')} />
      <ConfettiRight src={ConfettiSVG} alt={t('common.confetti_decoration')} />
      
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
      
      <ContentWrapper isMobile={isMobile}>
        <MainContent isMobile={isMobile}>
          <HeadingSection>
            <Heading isMobile={isMobile}>{getTranslation('be_part_first')}</Heading>
            <LargeNumber isMobile={isMobile}>100</LargeNumber>
            <SubHeading isMobile={isMobile}>{getTranslation('title')}</SubHeading>
            <Description isMobile={isMobile}>{getTranslation('description')}</Description>
          </HeadingSection>
          
          <Divider />
          
          <BenefitsSection>
            <BenefitsIntro>
              <BenefitsDuration isMobile={isMobile}>{getTranslation('benefits_duration')}</BenefitsDuration>
              <BenefitsHeading isMobile={isMobile}>{getTranslation('benefits_heading')}</BenefitsHeading>
            </BenefitsIntro>
            
            <BenefitsGrid isMobile={isMobile}>
              <BenefitCard isMobile={isMobile}>
                  <BenefitIconWrapper>
                    <IconWrapper>
                      <FaShieldAlt size={isMobile ? 28 : 32} color={Theme.colors.secondary} />
                    </IconWrapper>
                  </BenefitIconWrapper>
                <BenefitHeader>
                  <BenefitTitle>
                    <BenefitHighlight isMobile={isMobile}>{getTranslation('benefit_commission.highlight')}</BenefitHighlight>
                    <BenefitSubtitle isMobile={isMobile}>{getTranslation('benefit_commission.subtitle')}</BenefitSubtitle>
                  </BenefitTitle>
                <BenefitDescription isMobile={isMobile}>
                  {getTranslation('benefit_commission.description')}
                </BenefitDescription>
                </BenefitHeader>
              </BenefitCard>
              
              <BenefitCard isMobile={isMobile}>
                  <BenefitIconWrapper>
                    <IconWrapper>
                      <FaHandshake size={isMobile ? 28 : 32} color={Theme.colors.secondary} />
                    </IconWrapper>
                  </BenefitIconWrapper>
                <BenefitHeader>
                  <BenefitTitle>
                    <BenefitHighlight isMobile={isMobile}>{getTranslation('benefit_referral.highlight')}</BenefitHighlight>
                    <BenefitSubtitle isMobile={isMobile}>{getTranslation('benefit_referral.subtitle')}</BenefitSubtitle>
                  </BenefitTitle>
                <BenefitDescription isMobile={isMobile}>
                  {getTranslation('benefit_referral.description')}
                </BenefitDescription>
                </BenefitHeader>
              </BenefitCard>
              
              <BenefitCard isMobile={isMobile}>
                  <BenefitIconWrapper>
                    <IconWrapper>
                      <FaHeadset size={isMobile ? 28 : 32} color={Theme.colors.secondary} />
                    </IconWrapper>
                  </BenefitIconWrapper>
                <BenefitHeader>
                  <BenefitTitle>
                    <BenefitHighlight isMobile={isMobile}>{getTranslation('benefit_support.highlight')}</BenefitHighlight>
                    <BenefitSubtitle isMobile={isMobile}>{getTranslation('benefit_support.subtitle')}</BenefitSubtitle>
                  </BenefitTitle>
                <BenefitDescription isMobile={isMobile}>
                  {getTranslation('benefit_support.description')}
                </BenefitDescription>
                </BenefitHeader>
              </BenefitCard>
            </BenefitsGrid>
          </BenefitsSection>
          
          <Divider />
          
          <FooterSection>
            <FooterText isMobile={isMobile}>
              {getCTATranslation('description')}
              <br />
              <FooterTagline isMobile={isMobile}>{getTranslation('tagline')}</FooterTagline>
            </FooterText>
            
            <SignUpButton onClick={handleSignUpNow} isMobile={isMobile}>
              {getCTATranslation('button')}
            </SignUpButton>
          </FooterSection>
        </MainContent>
      </ContentWrapper>
      
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

const float = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(5px, -5px); }
  100% { transform: translate(0, 0); }
`;

// Styled Components
const Container = styled.div<{ isExiting: boolean }>`
  width: 100vw;
  min-height: 100vh;
  height: 100vh;
  color: ${Theme.colors.secondary};
  z-index: 9999 !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
  overflow: hidden;
  animation: ${props => props.isExiting ? fadeOut : fadeIn} 0.5s ease-in-out;
  background-color: white;
  
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
  z-index: 100;
  opacity: ${props => props.isLoading ? 1 : 0};
  visibility: ${props => props.isLoading ? 'visible' : 'hidden'};
  transition: opacity 0.5s ease, visibility 0.5s ease;
`;

// Confetti styled components
const ConfettiLeft = styled.img`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  max-width: 300px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    max-width: 150px;
  }
`;

const ConfettiRight = styled.img`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 0;
  max-width: 300px;
  transform: scaleX(-1);
  pointer-events: none;
  
  @media (max-width: 768px) {
    max-width: 150px;
  }
`;

const TopSection = styled.div<{ isMobile: boolean }>`
  display: flex;
  justify-content: ${props => props.isMobile ? 'center' : 'space-between'};
  align-items: center;
  margin-bottom: 0;
  position: relative;
  z-index: 1000; /* Above confetti */
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
`;

const LanguageSwitcherWrapper = styled.div`
  z-index: 10;
`;

// Fix the mobile language switcher visibility
const BottomLanguageSwitcher = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
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

const ContentWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: ${props => props.isMobile ? 'flex-start' : 'center'};
  padding: ${props => props.isMobile ? '1rem 0' : '2rem 0'};
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  
  
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    background: transparent;
  }
`;

const MainContent = styled.div<{ isMobile: boolean }>`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.isMobile ? '1rem' : '1.5rem'};
  padding: ${props => props.isMobile ? '0' : '1.5rem'};
  position: relative;
  z-index: 2;
  margin-top: ${props => props.isMobile ? '40px' : '60px'};
  background-color: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(2px);
  border-radius: 1rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const HeadingSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Heading = styled.h1<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '1.5rem' : '2rem'};
  font-weight: 600;
  margin: 0;
  color: ${Theme.colors.black};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LargeNumber = styled.div<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '5rem' : '6rem'};
  font-weight: 900;
  line-height: 1;
  color: ${Theme.colors.secondary};
  
  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const SubHeading = styled.h2<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '1.8rem' : '2.5rem'};
  font-weight: 900;
  margin: 0;
  color: ${Theme.colors.black};
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Description = styled.p<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '0.9rem' : '1.1rem'};
  color: ${Theme.colors.gray2};
  margin: 0.5rem 0 0 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #eee;
  margin: 0;
`;

const BenefitsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const BenefitsIntro = styled.div`
  text-align: center;
`;

const BenefitsDuration = styled.p<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '0.9rem' : '1rem'};
  color: ${Theme.colors.black};
  margin: 0 0 0.5rem 0;
`;

const BenefitsHeading = styled.h3<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '1.5rem' : '1.8rem'};
  font-weight: 600;
  margin: 0;
  color: ${Theme.colors.black};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BenefitsGrid = styled.div<{ isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.isMobile ? '1fr' : 'repeat(3, 1fr)'};
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const BenefitCard = styled.div<{ isMobile: boolean }>`
  background-color: #ebd8f6;
  border: 1px solid #CFABE5;
  box-shadow: 1px 4px 8px #CFABE550;
  border-radius: ${props => props.isMobile ? '0.8rem' : '1rem'};
  padding: ${props => props.isMobile ? '0.8rem' : '1rem'};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${props => props.isMobile ? '0.8rem' : '1rem'};
  height: ${props => props.isMobile ? 'auto' : '120px'};
`;

const BenefitHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  
  @media (max-width: 768px) {
    gap: 0.3rem;
  }
`;

const BenefitIconWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 1rem;
  
  @media (max-width: 768px) {
    padding-right: 0.8rem;
  }
`;

// BenefitIconImg removed as we're now using React Icons

const BenefitTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.3rem;
`;

const BenefitHighlight = styled.span<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '1.1rem' : '1.3rem'};
  font-weight: 700;
  color: ${Theme.colors.secondary} !important;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const BenefitSubtitle = styled.span<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '0.8rem' : '0.9rem'};
  font-weight: 700;
  color: ${Theme.colors.black};
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const BenefitDescription = styled.p<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '0.75rem' : '0.8rem'};
  color: ${Theme.colors.gray2};
  margin: 0;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const FooterText = styled.p<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '1.1rem' : '1.2rem'};
  margin: 0;
  line-height: 1.5;
  color: ${Theme.colors.black};
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FooterTagline = styled.span<{ isMobile: boolean }>`
  font-size: ${props => props.isMobile ? '1.3rem' : '1.5rem'};
  font-weight: 600;
  color: ${Theme.colors.black};
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SignUpButton = styled.button<{ isMobile: boolean }>`
  background: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 50px;
  padding: ${props => props.isMobile ? '0.7rem 2rem' : '0.8rem 2.5rem'};
  font-size: ${props => props.isMobile ? '1rem' : '1.1rem'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: ${props => props.isMobile ? '60px' : '40px'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    width: 80%;
    padding: 0.7rem 2rem;
    font-size: 1rem;
  }
`;

// Add a new styled component for the icons
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export default FoundingPartnersPage; 