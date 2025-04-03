import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderLandingPageStyle } from '../../../styles/constructed/headers/header-landing-page-style';
import Logo from '../../icons/LogoWhite.svg';

interface HeaderLandingPageProps {
  onLanguageChange?: (lang: string) => void;
}

export const HeaderLandingPage: React.FC<HeaderLandingPageProps> = ({ onLanguageChange }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLandlordClick = () => {
    navigate('/for-advertisers');
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  const handleLanguageChange = () => {
    if (onLanguageChange) {
      onLanguageChange('ENG');
    }
  };

  return (
    <HeaderLandingPageStyle scrolled={scrolled}>
      <div className="wrapper">
        <div className="logo">
          <img src={Logo} alt="Kaari Logo" />
        </div>
        
        <div className="nav-links">
          <div className="link" onClick={handleLandlordClick}>
            Are you a landlord?
          </div>
          
          <div className="language-container" onClick={handleLanguageChange}>
            ENG
          </div>
          
          <div className="heart-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white" />
            </svg>
          </div>
          
          <div className="link" onClick={handleHelpClick}>
            Help
          </div>
          
          <div className="sign-in" onClick={handleSignIn}>
            Sign in
          </div>
        </div>
      </div>
    </HeaderLandingPageStyle>
  );
};

export default HeaderLandingPage; 