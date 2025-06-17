import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ReferralProgramPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h1 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};
    }

    .header-buttons{
      max-width: 200px;
    }
  }
  
  .cards-layout {
    display: flex;
    gap: 40px;
    
    @media (max-width: 300px) {
      flex-direction: column;
    }
    
    .main-column {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .sidebar {
      flex: 1;
      max-width: 360px;
      
      @media (max-width: 992px) {
        max-width: 100%;
      }
    }
  }
  
  .card {
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.lg};
    padding: 20px;
    
    h2 {
      font: ${Theme.typography.fonts.extraLargeB};
      color: ${Theme.colors.black};
      margin-bottom: 20px;
    }
    
    &.referral-code {
      padding: 20px;
      
      .referral-code-content {
        display: flex;
        
        @media (max-width: 768px) {
          flex-direction: column;
        }
        
        .code-section {
          flex: 1;
          margin-right: 23px;
          width: 70%;
          
          @media (max-width: 768px) {
            margin-right: 0;
          }
        }
        
        .illustration {
          max-width: 200px;
          align-self: center;
          
          img {
            width: 100%;
            height: auto;
          }
          
          @media (max-width: 768px) {
            max-width: 180px;
            margin: 0 auto;
          }
        }
      }
      
      .code-container {
        display: flex;
        margin-bottom: 20px;

        
        input {
          flex: 1;
          height: 48px;
          max-width: 400px;
          padding: 17px 20px;
          border-radius: ${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme};
          border: ${Theme.borders.primary};

          font-size: 16px;
          color: #999999;
          outline: none;
          background-color: #F9F9F9;
        }
        
        .copy-button-wrapper {
          .copy-button {
            width: 48px;
            height: 48px;
            background-color: ${Theme.colors.secondary};
            border: none;
            border-radius: 0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition: background-color 0.2s ease;
            
            &:hover {
              background-color: ${Theme.colors.primary};
            }
            
            svg {
              width: 20px;
              height: 20px;
            }
            
            .tooltip {
              position: absolute;
              top: -40px;
              right: 0;
              background-color: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              
              &:after {
                content: '';
                position: absolute;
                bottom: -8px;
                right: 16px;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid rgba(0, 0, 0, 0.8);
              }
            }
          }
        }
      }
      
      .info-text {
        font: ${Theme.typography.fonts.text14};
        color: ${Theme.colors.gray2};
      }
    }
    
    &.performance {
      padding: 20px;
      
      .bonus-text {
        font: ${Theme.typography.fonts.largeM};
        color: ${Theme.colors.black};
        margin-top: 24px;
        margin-bottom: 12px;
      }
      
      .bonus-explainer {
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.text14};
        margin-bottom: 27px;
      }
      
      .progress-container {
        margin: 0 0 24px;
        
        .percentage-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
        }
        
        .progress-bar {
          display: flex;
          height: 8px;
          gap: 3px;
          margin-bottom: 4px;
          
          .segment {
            flex: 1;
            height: 100%;
            border-radius: 100px;
            background-color: ${Theme.colors.tertiary};
            
            &.active {
              background-color: ${Theme.colors.secondary};
            }
          }
        }
        
        .range-labels {
          display: flex;
          justify-content: space-between;
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.black};
          margin-top: 4px;
        }
      }
      
      .button-group {
        display: flex;
        gap: 12px;
        max-width: 390;
      }
    }
    
    &.progress-card {
      margin: 0;
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;

        
        h2 {
          margin: 0;
        }
        
        .details-link {
          color:${Theme.colors.secondary};
          text-decoration: none;
          font: ${Theme.typography.fonts.mediumM};
          display: flex;
          align-items: center;
          gap: 4px;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      .progress-divider {
        height: 1px;
        border: ${Theme.borders.primary};
        width: 100%;
      }
      
      .progress-stats {
        margin: 0;
        .stat-row {
          padding: 16px 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0;
          
          .stat-label {
            color: ${Theme.colors.gray2};
            font: ${Theme.typography.fonts.mediumM};
          }
          
          .stat-value {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};

            
            .trend-indicator {
              display: flex;
              align-items: center;
              justify-content: center;

              &.up svg {
                transform: rotate(45deg);
              }
              
              &.down svg {
                transform: rotate(135deg);
              }
            }
          }
        }
      }
      
      .eligibility-title {
        padding: 15px 0px;
        margin: 0;
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
      }
      
      .eligibility-status {
        display: flex;
        align-items: center;
        gap: 4px;
        
        svg {
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }
        
        .status-text {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          flex: 1;
        }
        
        .info-icon-wrapper {
          svg {
            width: 24px;
            height: 24px;
          }
        }
      }
      
      .eligibility-note {
        padding: 10px 30px 0 ;
        margin-bottom: 15px;
        font: ${Theme.typography.fonts.text12};
        color: ${Theme.colors.gray2};
      }
      
      .request-payout {
        justify-items: center;
        align-items: center;
      }
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .details-link {
      color: ${Theme.colors.primary};
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .progress-stats {
    margin-top: 24px;
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .stat-label {
        color: ${Theme.colors.gray};
        font-size: 14px;
      }
      
      .stat-value {
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        
        &.positive .trend-indicator {
          color: #4CAF50;
          margin-right: 4px;
        }
        
        &.negative .trend-indicator {
          color: #F44336;
          margin-right: 4px;
        }
      }
    }
  }
  
  @media (max-width: 1024px) {
    .cards-layout {
      flex-direction: column;
      
      .main-column, .sidebar {
        flex: none;
        width: 100%;
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      .header-buttons {
        width: 100%;
      }
    }
    
    .card {
      padding: 16px;
      
      &.performance {
        .button-group {
          flex-direction: column;
        }
      }
    }
  }
`; 