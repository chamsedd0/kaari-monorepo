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
      max-width: 325px;
      
      
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
    

    
    &.progress-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 24px 20px 20px 20px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      min-width: 240px;
      max-width: 320px;
      margin: 0 auto;
      margin-bottom: 24px;

      .card-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0;
        margin-bottom: 12px;

        h2 {
          margin: 0;
          font: ${Theme.typography.fonts.extraLargeB};
          color: ${Theme.colors.black};
        }
      }

      .progress-divider {
        height: 1px;
        border: none;
        background: #F0E6FA;
        margin: 12px 0;
        width: 100%;
      }

      .progress-stats-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        gap: 12px;
        
        .stat-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;

          .stat-label {
            color: ${Theme.colors.gray2};
            font: ${Theme.typography.fonts.mediumM};
            margin-bottom: 2px;
          }
          .stat-value {
            font: ${Theme.typography.fonts.extraLargeB};
            display: flex;
            align-items: center;
            gap: 4px;
            color: ${Theme.colors.black};
            &.positive .trend-indicator {
              color: #4CAF50;
            }
            &.negative .trend-indicator {
              color: #F44336;
            }
          }
        }
      }

      .earnings-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        gap: 12px;
        .earning-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .stat-label {
            color: ${Theme.colors.gray2};
            font: ${Theme.typography.fonts.mediumM};
            margin-bottom: 2px;
          }
          .stat-value {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
          }
        }
      }

      .progress-card-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
        align-items: center;
        .button-wrapper {
          width: 100%;
          max-width: 250px;
          display: flex;
          justify-content: center;
          button {
            width: 100%;
            max-width: 250px;
          }
        }
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
          color: ${Theme.colors.success};
          margin-right: 4px;
        }
        
        &.negative .trend-indicator {
          color: ${Theme.colors.error};
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