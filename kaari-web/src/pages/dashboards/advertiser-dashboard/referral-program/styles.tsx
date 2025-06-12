import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ReferralProgramPageStyle = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #252525;
      margin: 0;
    }
    
    .header-buttons {
      .my-performance-button {
        background-color: #8F27CE;
        color: white;
        border: none;
        border-radius: 100px;
        padding: 12px 20px 12px 24px;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        
        &:hover {
          background-color: #6A2AF4;
        }
        
        svg {
          margin-left: 4px;
          width: 16px;
          height: 16px;
          
          path {
            stroke: white;
          }
        }
      }
    }
  }
  
  .cards-layout {
    display: flex;
    gap: 24px;
    
    @media (max-width: 992px) {
      flex-direction: column;
    }
    
    .main-column {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 24px;
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
    background-color: white;
    border-radius: 16px;
    border: 1px solid #E0E0E0;
    overflow: hidden;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #252525;
      margin: 0 0 16px 0;
    }
    
    &.referral-code {
      padding: 24px;
      
      .referral-code-content {
        display: flex;
        
        @media (max-width: 768px) {
          flex-direction: column;
        }
        
        .code-section {
          flex: 1;
          margin-right: 20px;
          
          @media (max-width: 768px) {
            margin-right: 0;
            margin-bottom: 24px;
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
        margin-bottom: 16px;
        
        input {
          flex: 1;
          height: 48px;
          padding: 12px 16px;
          border: 1px solid #E0E0E0;
          border-right: none;
          border-radius: 8px 0 0 8px;
          font-size: 16px;
          color: #999999;
          outline: none;
          background-color: #F9F9F9;
        }
        
        .copy-button-wrapper {
          .copy-button {
            width: 48px;
            height: 48px;
            background-color: #8F27CE;
            border: none;
            border-radius: 0 8px 8px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition: background-color 0.2s ease;
            
            &:hover {
              background-color: #6A2AF4;
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
        color: #767676;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
      }
    }
    
    &.performance {
      padding: 24px;
      
      .bonus-text {
        font-size: 16px;
        color: #252525;
        margin-bottom: 8px;
      }
      
      .bonus-explainer {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #8F27CE;
        font-size: 14px;
        margin-bottom: 24px;
        
        svg {
          width: 20px;
          height: 20px;
        }
      }
      
      .progress-container {
        margin: 0 0 32px;
        
        .percentage-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #252525;
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
              background-color: #8F27CE;
            }
          }
        }
        
        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #767676;
          margin-top: 4px;
        }
      }
      
      .button-group {
        display: flex;
        gap: 16px;
        
        @media (max-width: 768px) {
          width: 100%;
        }
        
        .button-wrapper {
          flex: 1;
          max-width: 180px;
          
          @media (max-width: 768px) {
            max-width: none;
          }
          
          button {
            width: 100%;
            height: 48px;
            border-radius: 100px;
            font-size: 14px;
            padding: 0 !important;
            
            &:hover {
              transform: none;
            }
          }
          
          &:last-child button {
            border-width: 1px !important;
          }
        }
      }
    }
    
    &.progress-card {
      padding: 0;
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        
        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #252525;
        }
        
        .details-link {
          color: #8F27CE;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
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
        background-color: #EAEAEA;
        width: 100%;
      }
      
      .progress-stats {
        .stat-row {
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .stat-label {
            color: #767676;
            font-size: 16px;
            font-weight: 400;
          }
          
          .stat-value {
            font-size: 20px;
            font-weight: 600;
            color: #252525;
            display: flex;
            align-items: center;
            
            .trend-indicator {
              display: flex;
              margin-right: 6px;
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
        padding: 20px 24px 0;
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #252525;
      }
      
      .eligibility-status {
        padding: 16px 24px 0;
        display: flex;
        align-items: center;
        
        svg {
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }
        
        .status-text {
          font-size: 16px;
          font-weight: 500;
          color: #252525;
          flex: 1;
        }
        
        .info-icon-wrapper {
          svg {
            width: 20px;
            height: 20px;
            margin-right: 0;
          }
        }
      }
      
      .eligibility-note {
        padding: 8px 24px 24px 60px;
        margin: 0;
        font-size: 14px;
        color: #767676;
        line-height: 1.5;
      }
      
      .request-payout {
        padding: 0 24px 24px;
        
        button {
          width: 100%;
          height: 52px;
          border-radius: 100px;
          font-size: 16px;
          font-weight: 500;
          background-color: #8F27CE;
          color: white;
          border: none;
          transition: background-color 0.2s ease;
          
          &:hover {
            background-color: #6A2AF4;
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
        color: ${Theme.colors.grey};
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