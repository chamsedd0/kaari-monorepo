import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

// Style for the language switcher
const LanguageSwitcherStyle = styled.div`
  display: flex;
  align-items: center;
  
  .language-toggle {
    display: flex;
    border: 1px solid ${Theme.colors.fifth};
    border-radius: 20px;
    overflow: hidden;
    height: 32px;
    position: relative;
    background: white;
    min-width: 80px; /* Ensure minimum width to prevent layout shift */
    
    button {
      background: none;
      border: none;
      padding: 0 12px;
      cursor: pointer;
      font-size: 14px;
      position: relative;
      z-index: 1;
      transition: color 0.3s ease;
      min-width: 40px; /* Ensure minimum width */
      
      &.active {
        color: white;
        font-weight: bold;
      }
      
      &:hover:not(.active) {
        color: ${Theme.colors.primary};
      }
    }
    
    .slider {
      position: absolute;
      height: 100%;
      width: 50%;
      background-color: ${Theme.colors.primary};
      transition: transform 0.3s ease;
      border-radius: 20px;
      
      &.fr {
        transform: translateX(100%);
      }
    }
  }
`;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  // Get current language - ensure it's normalized to 'en' or 'fr'
  const currentLanguage = i18n.language ? 
    (i18n.language.startsWith('fr') ? 'fr' : 'en') : 
    'en';
  
  // Log the current language for debugging
  useEffect(() => {
    console.log('Current language:', currentLanguage);
  }, [currentLanguage]);
  
  const toggleLanguage = (lang: string) => {
    console.log('Toggling language to:', lang);
    
    try {
      // Change language using i18next
      i18n.changeLanguage(lang);
      
      // Save language preference to localStorage directly
      localStorage.setItem('i18nextLng', lang);
      
      console.log('Language changed successfully to:', lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };
  
  return (
    <LanguageSwitcherStyle>
      <div className="language-toggle">
        <div className={`slider ${currentLanguage}`}></div>
        <button 
          className={currentLanguage === 'en' ? 'active' : ''}
          onClick={() => toggleLanguage('en')}
        >
          EN
        </button>
        <button 
          className={currentLanguage === 'fr' ? 'active' : ''}
          onClick={() => toggleLanguage('fr')}
        >
          FR
        </button>
      </div>
    </LanguageSwitcherStyle>
  );
};

export default LanguageSwitcher; 