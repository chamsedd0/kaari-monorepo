import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { shouldShowArabicOption, getAvailableLanguages } from '../../../utils/language-utils';

// Style for the mobile language switcher
const MobileLanguageSwitcherStyle = styled.div`
  display: flex;
  align-items: center;
  
  .language-toggle {
    display: flex;
    border-radius: 20px;
    overflow: hidden;
    height: 36px;
    position: relative;
    background: rgba(233, 225, 240, 0.8);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 10px rgba(143, 39, 206, 0.1);
    padding: 3px;
    
    button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 13px;
      position: relative;
      z-index: 1;
      transition: all 0.3s ease;
      min-width: 36px;
      width: 36px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${Theme.colors.secondary};
      font-weight: 600;
      border-radius: 18px;
      
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
      width: 36px;
      background-color: ${Theme.colors.secondary};
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-radius: 18px;
      box-shadow: 0 2px 8px rgba(143, 39, 206, 0.3);
      
      &.fr {
        transform: translateX(36px);
      }
      
      &.ar {
        transform: translateX(72px);
      }
    }
    
    &.no-arabic {
      .slider {
        &.fr {
          transform: translateX(36px);
        }
      }
    }
  }
`;

interface MobileLanguageSwitcherProps {
  className?: string;
  darkMode?: boolean;
  lightBackground?: boolean;
}

const MobileLanguageSwitcher: React.FC<MobileLanguageSwitcherProps> = ({ 
  className,
  darkMode = false,
  lightBackground = false
}) => {
  const { i18n } = useTranslation();
  const [showArabic, setShowArabic] = useState(false);
  
  // Check if Arabic should be shown
  useEffect(() => {
    setShowArabic(shouldShowArabicOption());
    
    // Add event listener for route changes
    const handleRouteChange = () => {
      setShowArabic(shouldShowArabicOption());
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  // Get current language - ensure it's normalized
  const currentLanguage = i18n.language ? 
    (i18n.language.startsWith('fr') ? 'fr' : 
     i18n.language.startsWith('ar') ? 'ar' : 'en') : 
    'fr'; // Default to French
  
  const toggleLanguage = (lang: string) => {
    if (lang === currentLanguage) return;
    
    try {
      // Save language preference to localStorage directly
      localStorage.setItem('i18nextLng', lang);
      
      // Change language using i18next
      i18n.changeLanguage(lang).then(() => {
        // Force reload translations after language change
        i18n.reloadResources([lang]).then(() => {
          console.log(`Mobile switcher: Translations reloaded for ${lang}`);
          // No page refresh - let React handle the re-rendering
        });
      });
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };
  
  // Determine background and text colors based on props
  const getStyles = () => {
    if (darkMode) {
      return {
        background: 'rgba(40, 40, 40, 0.8)',
        sliderBg: Theme.colors.secondary,
        textColor: 'rgba(255, 255, 255, 0.8)'
      };
    } else if (lightBackground) {
      return {
        background: 'rgba(233, 225, 240, 0.8)',
        sliderBg: Theme.colors.secondary,
        textColor: Theme.colors.secondary
      };
    } else {
      return {
        background: 'rgba(233, 225, 240, 0.8)',
        sliderBg: Theme.colors.secondary,
        textColor: Theme.colors.secondary
      };
    }
  };
  
  const styles = getStyles();
  
  return (
    <MobileLanguageSwitcherStyle className={className}>
      <div className={`language-toggle ${!showArabic ? 'no-arabic' : ''}`} style={{ background: styles.background }}>
        <div 
          className={`slider ${currentLanguage}`} 
          style={{ backgroundColor: styles.sliderBg }}
        ></div>
        <button 
          className={currentLanguage === 'en' ? 'active' : ''}
          onClick={() => toggleLanguage('en')}
          aria-label="Switch to English"
          style={{ color: currentLanguage === 'en' ? 'white' : styles.textColor }}
        >
          EN
        </button>
        <button 
          className={currentLanguage === 'fr' ? 'active' : ''}
          onClick={() => toggleLanguage('fr')}
          aria-label="Switch to French"
          style={{ color: currentLanguage === 'fr' ? 'white' : styles.textColor }}
        >
          FR
        </button>
        {showArabic && (
          <button 
            className={currentLanguage === 'ar' ? 'active' : ''}
            onClick={() => toggleLanguage('ar')}
            aria-label="Switch to Arabic"
            style={{ color: currentLanguage === 'ar' ? 'white' : styles.textColor }}
          >
            AR
          </button>
        )}
      </div>
    </MobileLanguageSwitcherStyle>
  );
};

export default MobileLanguageSwitcher; 