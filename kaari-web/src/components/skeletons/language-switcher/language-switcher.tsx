import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../../theme/theme';
import { shouldShowArabicOption, getAvailableLanguages } from '../../../utils/language-utils';

// Style for the language switcher
const LanguageSwitcherStyle = styled.div`
  display: flex;
  align-items: center;
  
  .language-toggle {
    display: flex;
    border-radius: 24px;
    overflow: hidden;
    height: 40px;
    position: relative;
    background: rgba(233, 225, 240, 0.8);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 10px rgba(143, 39, 206, 0.1);
    padding: 3px;
    
    @media (max-width: 768px) {
      border-radius: 20px;
      height: 36px;
      background: rgba(233, 225, 240, 0.8);
      backdrop-filter: blur(4px);
    }
    
    button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 14px;
      position: relative;
      z-index: 1;
      transition: all 0.3s ease;
      min-width: 40px;
      width: 40px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${Theme.colors.secondary};
      font-weight: 600;
      border-radius: 20px;
      
      @media (max-width: 768px) {
        font-size: 13px;
        min-width: 36px;
        width: 36px;
      }
      
      &.active {
        color: white;
      }
      
      &:hover:not(.active) {
        color: ${Theme.colors.secondary};
        background-color: rgba(143, 39, 206, 0.05);
      }
    }
    
    .slider {
      position: absolute;
      top: 3px;
      bottom: 3px;
      width: 40px;
      background-color: ${Theme.colors.secondary};
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(143, 39, 206, 0.3);
      
      @media (max-width: 768px) {
        width: 36px;
      }
      
      &.fr {
        transform: translateX(40px);
        
        @media (max-width: 768px) {
          transform: translateX(36px);
        }
      }
      
      &.ar {
        transform: translateX(80px);
        
        @media (max-width: 768px) {
          transform: translateX(72px);
        }
      }
    }
    
    &.no-arabic {
      .slider {
        &.fr {
          transform: translateX(40px);
          
          @media (max-width: 768px) {
            transform: translateX(36px);
          }
        }
      }
    }
  }
`;

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [showArabic, setShowArabic] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['en', 'fr']);
  
  // Check if device is mobile and if Arabic should be shown
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Check if Arabic should be shown
    setShowArabic(shouldShowArabicOption());
    setAvailableLanguages(getAvailableLanguages());
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Add event listener for route changes
    const handleRouteChange = () => {
      setShowArabic(shouldShowArabicOption());
      setAvailableLanguages(getAvailableLanguages());
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  // Get current language - ensure it's normalized
  const currentLanguage = i18n.language ? 
    (i18n.language.startsWith('fr') ? 'fr' : 
     i18n.language.startsWith('ar') ? 'ar' : 'en') : 
    'fr'; // Default to French
  
  // Log the current language for debugging
  useEffect(() => {
    console.log('Language switcher - Current language:', currentLanguage);
  }, [currentLanguage]);
  
  const toggleLanguage = (lang: string) => {
    if (lang === currentLanguage) return;
    
    console.log('Toggling language to:', lang);
    
    try {
      // Save language preference to localStorage directly
      localStorage.setItem('i18nextLng', lang);
      
      // Change language using i18next
      i18n.changeLanguage(lang).then(() => {
        // Force reload translations after language change
        i18n.reloadResources([lang]).then(() => {
          console.log(`Translations reloaded for ${lang}`);
          // No page refresh - let React handle the re-rendering
        });
      });
      
      console.log('Language changed successfully to:', lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };
  
  return (
    <LanguageSwitcherStyle className={`${className || ''} ${isMobile ? 'mobile' : ''}`}>
      <div className={`language-toggle ${!showArabic ? 'no-arabic' : ''}`}>
        <div className={`slider ${currentLanguage}`}></div>
        <button 
          className={currentLanguage === 'en' ? 'active' : ''}
          onClick={() => toggleLanguage('en')}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button 
          className={currentLanguage === 'fr' ? 'active' : ''}
          onClick={() => toggleLanguage('fr')}
          aria-label="Switch to French"
        >
          FR
        </button>
        {showArabic && (
          <button 
            className={currentLanguage === 'ar' ? 'active' : ''}
            onClick={() => toggleLanguage('ar')}
            aria-label="Switch to Arabic"
          >
            AR
          </button>
        )}
      </div>
    </LanguageSwitcherStyle>
  );
};

export default LanguageSwitcher; 