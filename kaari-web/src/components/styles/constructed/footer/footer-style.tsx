import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const FooterWrapper = styled.footer`
  background: linear-gradient(135deg, ${Theme.colors.primary} 0%, #3a0d54 100%);
  color: white;
  padding: 80px 40px 60px;
  width: 100%;
  position: relative;
  overflow: hidden;
  

  
  .footer-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 3rem;
    position: relative;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
    }
    
    @media (max-width: 576px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
  
  .footer-brand {
    position: relative;
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      
      img {
        height: 60px;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
        }
      }
    }
    
    .description {
      font: ${Theme.typography.fonts.text16};
      line-height: 1.7;
      margin-bottom: 2.5rem;
      color: rgba(255, 255, 255, 0.9);
      max-width: 90%;
    }
  }
  
  .footer-section {
    h3 {
      font: ${Theme.typography.fonts.h4DB};
      margin-bottom: 1.5rem;
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 30px;
        height: 2px;
        background-color: ${Theme.colors.tertiary};
      }
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 1rem;
        transition: transform 0.2s ease;
        
        &:hover {
          transform: translateX(5px);
        }
        
        a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font: ${Theme.typography.fonts.text14};
          transition: color 0.2s ease;
          display: inline-block;
          position: relative;
          
          &:hover {
            color: white;
          }
          
          &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background-color: white;
            transition: width 0.3s ease;
          }
          
          &:hover::after {
            width: 100%;
          }
        }
      }
    }
  }
  
  .social-wrapper {
    display: flex;
    align-items: start;
    gap: 16px;
    flex-direction: column;
    margin-top: 10px;

    h1 {
      font: ${Theme.typography.fonts.h4DB};
      margin-bottom: 1rem;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 30px;
        height: 2px;
        background-color: ${Theme.colors.tertiary};
      }
    }

    .social-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      
      a {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 50%;
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
        
        &:hover {
          transform: translateY(-5px);
          background: white;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
          
          svg {
            fill: ${Theme.colors.primary};
          }
        }
        
        svg {
          width: 20px;
          height: 20px;
          fill: white;
          transition: fill 0.3s ease;
        }
      }
    }
  }
  
  .copyright {
    margin-top: 50px;
    text-align: center;
    font: ${Theme.typography.fonts.smallM};
    color: rgba(255, 255, 255, 0.7);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
    
    a {
      color: ${Theme.colors.tertiary};
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  /* Tablet footer <=1050px */
  @media (max-width: 1050px) {
    padding: 48px 4% 36px;

    .footer-container { 
      grid-template-columns: 1.2fr 1fr 1fr; 
      gap: 24px; 
      max-width: 100%; 
    }

    .footer-brand .logo img { height: 44px; }
    .footer-brand .description { font-size: 13px; line-height: 1.6; margin-bottom: 18px; max-width: 100%; }
    .footer-section h3 { font-size: 16px; margin-bottom: 12px; }
    .footer-section ul li { margin-bottom: 10px; }
    .footer-section ul li a { font-size: 12px; }
    .social-wrapper h1 { font-size: 16px; }
    .social-wrapper .social-links a { width: 36px; height: 36px; }
    .social-wrapper .social-links a svg { width: 18px; height: 18px; }
    .copyright { margin-top: 28px; font-size: 11px; padding-top: 14px; }
  }

  /* Mobile footer <=700px */
  @media (max-width: 700px) {
    padding: 32px 4% 28px;
    .footer-container { grid-template-columns: 1fr; gap: 18px; }
    .footer-brand .logo img { height: 32px; }
    .footer-brand .description { font-size: 12px; line-height: 1.5; margin-bottom: 12px; }

    /* Hide desktop sections and use collapsibles */
    .footer-section { display: none; }
    .footer-sections-mobile { display: block; width: 100%; }

    .footer-sections-mobile details { 
      border-top: 1px solid rgba(255,255,255,0.15);
    }
    .footer-sections-mobile details:last-child { border-bottom: 1px solid rgba(255,255,255,0.15); }

    .footer-sections-mobile summary {
      list-style: none;
      cursor: pointer;
      padding: 12px 0;
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .footer-sections-mobile summary::-webkit-details-marker { display: none; }
    .footer-sections-mobile summary::after {
      content: '+';
      font-size: 16px;
      transform: translateY(-1px);
      transition: transform 0.2s ease;
    }
    .footer-sections-mobile details[open] summary::after {
      content: '−';
    }

    .footer-sections-mobile ul {
      list-style: none;
      margin: 0 0 10px 0;
      padding: 0 0 10px 0;
    }
    .footer-sections-mobile li { margin: 6px 0; }
    .footer-sections-mobile a { font-size: 12px; color: rgba(255,255,255,0.9); text-decoration: none; }

    .social-wrapper { gap: 10px; }
    .social-wrapper h1 { font-size: 14px; margin-bottom: 6px; }
    .social-wrapper .social-links { gap: 10px; }
    .social-wrapper .social-links a { width: 30px; height: 30px; }
    .social-wrapper .social-links a svg { width: 14px; height: 14px; }

    .copyright { font-size: 10px; padding-top: 10px; margin-top: 20px; }
  }
`;
