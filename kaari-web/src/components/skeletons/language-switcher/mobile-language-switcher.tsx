import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

// Style for the mobile language switcher
const MobileLanguageSwitcherStyle = styled.div`
  display: flex;
  align-items: center;
  
  .language-toggle {
    display: flex;
    border-radius: 16px;
    overflow: hidden;
    height: 32px;
    position: relative;
    background: rgba(255, 255, 255, 0.2);
    min-width: 70px;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    
    button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      z-index: 1;
      transition: color 0.3s ease;
      min-width: 35px;
      width: 35px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${Theme.colors.white};
      font-weight: bold;
      opacity: 0.8;
      padding-bottom: 14px;
      
      &.active {
        color: white;
        opacity: 1;
      }
      
      &:hover:not(.active) {
        color: ${Theme.colors.white};
      }
    }
    
    .slider {
      position: absolute;
      height: 100%;
      width: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      transition: transform 0.3s ease;
      border-radius: 16px;
      
      &.fr {
        transform: translateX(100%);
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
  
  // Get current language - ensure it's normalized to 'en' or 'fr'
  const currentLanguage = i18n.language ? 
    (i18n.language.startsWith('fr') ? 'fr' : 'en') : 
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
        background: 'rgba(0, 0, 0, 0.2)',
        sliderBg: 'rgba(0, 0, 0, 0.3)',
        textColor: Theme.colors.quaternary
      };
    } else if (lightBackground) {
      return {
        background: 'rgba(143, 39, 206, 0.1)',
        sliderBg: 'rgba(143, 39, 206, 0.2)',
        textColor: Theme.colors.secondary
      };
    } else {
      return {
        background: 'rgba(255, 255, 255, 0.2)',
        sliderBg: 'rgba(255, 255, 255, 0.3)',
        textColor: Theme.colors.white
      };
    }
  };
  
  const styles = getStyles();
  
  return (
    <MobileLanguageSwitcherStyle className={className}>
      <div className="language-toggle" style={{ background: styles.background }}>
        <div 
          className={`slider ${currentLanguage}`} 
          style={{ backgroundColor: styles.sliderBg }}
        ></div>
        <button 
          className={currentLanguage === 'en' ? 'active' : ''}
          onClick={() => toggleLanguage('en')}
          aria-label="Switch to English"
          style={{ color: styles.textColor }}
        >
          EN
        </button>
        <button 
          className={currentLanguage === 'fr' ? 'active' : ''}
          onClick={() => toggleLanguage('fr')}
          aria-label="Switch to French"
          style={{ color: styles.textColor }}
        >
          FR
        </button>
      </div>
    </MobileLanguageSwitcherStyle>
  );
};

export default MobileLanguageSwitcher; 