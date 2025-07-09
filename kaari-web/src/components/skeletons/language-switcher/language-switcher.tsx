import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

// Style for the language switcher
const LanguageSwitcherStyle = styled.div`
  display: flex;
  align-items: center;
  
  .language-toggle {
    display: flex;
    border-radius: 20px;
    overflow: hidden;
    height: 36px;
    position: relative;
    background: ${Theme.colors.quaternary}50;
    min-width: 80px; /* Ensure minimum width to prevent layout shift */
    
    @media (max-width: 768px) {
      border-radius: 16px;
      height: 32px;
      min-width: 70px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    button {
      background: none;
      border: none;
      padding: 0 13px;
      cursor: pointer;
      font-size: 14px;
      position: relative;
      z-index: 1;
      transition: color 0.3s ease;
      min-width: 41px; /* Ensure minimum width */
      color: ${Theme.colors.white};
      font-weight: bold;
      
      @media (max-width: 768px) {
        padding: 0 10px;
        font-size: 12px;
        min-width: 35px;
        opacity: 0.8;
      }
      
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
      background-color: ${Theme.colors.quaternary}50;
      transition: transform 0.3s ease;
      border-radius: 20px;
      
      @media (max-width: 768px) {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 16px;
      }
      
      &.fr {
        transform: translateX(100%);
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
  
  // Get current language - ensure it's normalized to 'en' or 'fr'
  const currentLanguage = i18n.language ? 
    (i18n.language.startsWith('fr') ? 'fr' : 'en') : 
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
      <div className="language-toggle">
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
      </div>
    </LanguageSwitcherStyle>
  );
};

export default LanguageSwitcher; 