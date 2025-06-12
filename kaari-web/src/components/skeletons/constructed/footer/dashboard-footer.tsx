import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import logo from '../../../../assets/images/purpleLogo.svg';

const DashboardFooterContainer = styled.footer`
  width: 100%;
  padding: 40px;
  background: white;
  border-top: ${Theme.borders.primary};
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const Logo = styled.div`
  font: ${Theme.typography.fonts.h4B};
  color: ${Theme.colors.secondary};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  
  a {
    color: ${Theme.colors.gray2};
    transition: color 0.2s ease;
    
    &:hover {
      color: ${Theme.colors.secondary};
    }
    
    svg {
      font-size: 20px;
    }
  }
`;

const MiddleSection = styled.div`
  display: flex;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const FooterLinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  h4 {
    font: ${Theme.typography.fonts.smallB};
    color: ${Theme.colors.black};
    margin-bottom: 4px;
  }
  
  a {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${Theme.colors.secondary};
      text-decoration: underline;
    }
  }
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid ${Theme.colors.gray}10;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Copyright = styled.div`
  font: ${Theme.typography.fonts.smallM};   
  color: ${Theme.colors.gray2};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 16px;
  
  a {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${Theme.colors.secondary};
      text-decoration: underline;
    }
  }
`;

const DashboardFooter: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <DashboardFooterContainer>
      <FooterContent>
        <TopSection>
          <Logo>
            <img src={logo} alt="Kaari" />
          </Logo>
          <SocialLinks>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </SocialLinks>
        </TopSection>
        
        <MiddleSection>
          <FooterLinkGroup>
            <h4>{t('footer.for_advertisers', 'For Advertisers')}</h4>
            <Link to="/dashboard/advertiser/properties">
              {t('footer.manage_properties', 'Manage Properties')}
            </Link>
            <Link to="/dashboard/advertiser/reservations">
              {t('footer.reservation_requests', 'Reservation Requests')}
            </Link>
            <Link to="/dashboard/advertiser/photoshoots">
              {t('footer.book_photoshoot', 'Book a Photoshoot')}
            </Link>
          </FooterLinkGroup>
          
          <FooterLinkGroup>
            <h4>{t('footer.resources', 'Resources')}</h4>
            <Link to="/help-center">
              {t('footer.help_center', 'Help Center')}
            </Link>
            <Link to="/dashboard/advertiser/support">
              {t('footer.contact_support', 'Contact Support')}
            </Link>
            <Link to="/blog">
              {t('footer.blog', 'Blog')}
            </Link>
          </FooterLinkGroup>
          
          <FooterLinkGroup>
            <h4>{t('footer.legal', 'Legal')}</h4>
            <Link to="/terms-of-service">
              {t('footer.terms', 'Terms of Service')}
            </Link>
            <Link to="/privacy-policy">
              {t('footer.privacy', 'Privacy Policy')}
            </Link>
            <Link to="/cookies">
              {t('footer.cookies', 'Cookies')}
            </Link>
          </FooterLinkGroup>
        </MiddleSection>
        
        <BottomSection>
          <Copyright>
            © {currentYear} Kaari. {t('footer.all_rights_reserved', 'All rights reserved.')}
          </Copyright>
          <FooterLinks>
            <Link to="/sitemap">
              {t('footer.sitemap', 'Sitemap')}
            </Link>
            <Link to="/accessibility">
              {t('footer.accessibility', 'Accessibility')}
            </Link>
          </FooterLinks>
        </BottomSection>
      </FooterContent>
    </DashboardFooterContainer>
  );
};

export default DashboardFooter; 