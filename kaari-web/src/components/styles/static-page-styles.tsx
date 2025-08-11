import styled from "styled-components";
import { Theme } from "../../theme/theme";

export const StaticPageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 120px auto 80px;
  padding: 0 20px;
  
  .page-header {
    margin-bottom: 40px;
    text-align: center;
    
    h1 {
      font: ${Theme.typography.fonts.h1};
      color: ${Theme.colors.black};
      margin-bottom: 20px;
    }
    
    .subtitle {
      font: ${Theme.typography.fonts.h4};
      color: ${Theme.colors.gray2};
      max-width: 800px;
      margin: 0 auto;
    }
  }
  
  .content-section {
    margin-bottom: 60px;
    
    h2 {
      font: ${Theme.typography.fonts.h2};
      color: ${Theme.colors.black};
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid ${Theme.colors.tertiary}50;
    }
    
    h3 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};
      margin: 30px 0 15px;
    }
    
    p {
      font: ${Theme.typography.fonts.text16};
      color: ${Theme.colors.gray2};
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    ul, ol {
      margin: 0 0 20px 20px;
      
      li {
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
        line-height: 1.6;
        margin-bottom: 10px;
      }
    }
    
    a {
      color: ${Theme.colors.secondary};
      text-decoration: none;
      transition: all 0.3s ease;
      
      &:hover {
        color: ${Theme.colors.primary};
        text-decoration: underline;
      }
    }
    
    .highlight {
      background-color: ${Theme.colors.tertiary}20;
      padding: 20px;
      border-radius: ${Theme.borders.radius.md};
      margin: 20px 0;
    }
    
    .image-container {
      width: 100%;
      margin: 30px 0;
      
      img {
        width: 100%;
        max-width: 100%;
        border-radius: ${Theme.borders.radius.md};
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      
      .caption {
        font: ${Theme.typography.fonts.smallM};
        color: ${Theme.colors.gray2};
        text-align: center;
        margin-top: 10px;
      }
    }
  }
  
  .cta-section {
    background-color: ${Theme.colors.tertiary}10;
    padding: 40px;
    border-radius: ${Theme.borders.radius.lg};
    text-align: center;
    margin: 40px 0;
    
    h3 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};
      margin-bottom: 20px;
    }
    
    p {
      font: ${Theme.typography.fonts.text16};
      color: ${Theme.colors.gray2};
      margin-bottom: 30px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .cta-button {
      display: inline-block;
      background-color: ${Theme.colors.primary};
      color: white;
      font: ${Theme.typography.fonts.largeB};
      padding: 12px 24px;
      border-radius: ${Theme.borders.radius.full};
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: ${Theme.colors.secondary};
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }
    }
  }
  
  @media (max-width: 768px) {
    margin: 100px auto 60px;
    
    .page-header {
      h1 {
        font: ${Theme.typography.fonts.h2};
      }
      
      .subtitle {
      font: ${Theme.typography.fonts.h4};
      }
    }
    
    .content-section {
      h2 {
        font: ${Theme.typography.fonts.h3};
      }
      
      h3 {
        font: ${Theme.typography.fonts.h4};
      }
    }
    
    .cta-section {
      padding: 30px 20px;
    }
  }
`; 