import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';


export const FooterWrapper = styled.footer`
  background-color: ${Theme.colors.secondary}; // Purple color from the image
  color: white;
  padding: 82px 20px;
  width: 100%;
  
  
  .footer-container {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
  
  .footer-brand {

    margin-right: 40px;
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      
      img {
        height: 50px;
      }
      
      h2 {
        font-size: 1.5rem;
        font-weight: bold;
      }
    }
    
    .description {
      font: ${Theme.typography.fonts.text16};
      line-height: 150%;
      margin-bottom: 2rem;
    }
  }
  
  .footer-section {
    h3 {
      font: ${Theme.typography.fonts.extraLargeB};
      margin-bottom: 1rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 0.75rem;
        
        a {
          color: white;
          text-decoration: none;
          font: ${Theme.typography.fonts.smallM};
          transition: opacity 0.2s;
          
          &:hover {
            opacity: 0.8;
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

        h1 {
            font: ${Theme.typography.fonts.extraLargeB};
        }


        .social-links {
            display: flex;
            gap: 1rem;
            

            
            
            a {
            background: white;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
            
            &:hover {
                transform: translateY(-2px);
            }
            
            svg {
                width: 20px;
                height: 20px;
                fill: #9333EA;
            }
        }
    }
  }
`;
