import styled from "styled-components";
import { Theme } from "../../../../../theme/theme";

export const PerformancePageStyle = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  
  .page-header {
    margin-bottom: 32px;
    
    .back-button-wrapper {
      display: inline-block;
      margin-bottom: 16px;
      cursor: pointer;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #252525;
      margin: 0;
    }
  }
  
  .cards-row {
    display: flex;
    gap: 24px;
    
    @media (max-width: 992px) {
      flex-direction: column;
    }
  }
  
  .card {
    background-color: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #E0E0E0;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #252525;
      margin: 0 0 24px 0;
    }
    
    &.performance-card {
      flex: 2;
      
      .performance-metrics {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 40px;
        
        @media (max-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        @media (max-width: 480px) {
          grid-template-columns: 1fr;
        }
        
        .metric {
          .metric-name {
            font-size: 16px;
            color: #767676;
            margin-bottom: 8px;
          }
          
          .metric-value {
            display: flex;
            align-items: center;
            
            svg {
              margin-right: 8px;
              width: 16px;
              height: 16px;
            }
            
            .number {
              font-size: 40px;
              font-weight: 600;
              color: #58256D;
              line-height: 1;
              
              &.purple {
                color: #8F27CE;
              }
            }
            
            .currency {
              font-size: 18px;
              color: #8F27CE;
              margin-left: 4px;
              font-weight: 600;
            }
          }
        }
      }
      
      .progress-container {
        padding: 0;
        margin-top: 10px;
        
        .percentage-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #252525;
        }
        
        .progress-bar {
          display: flex;
          height: 8px;
          gap: 3px;
          margin-bottom: 8px;
          
          .segment {
            flex: 1;
            height: 100%;
            border-radius: 100px;
            background-color: #E0E0E0;
            
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
    }
    
    &.eligibility-card {
      flex: 1;
      max-width: 360px;
      display: flex;
      flex-direction: column;
      
      @media (max-width: 992px) {
        max-width: 100%;
      }
      
      h2 {
        margin-bottom: 20px;
      }
      
      .eligibility-status {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        
        svg {
          width: 24px;
          height: 24px;
          margin-right: 10px;
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
        color: #767676;
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 auto 0;
        padding: 0 0 0 34px;
      }
      
      .request-payout {
        margin-top: 24px;
        
        button {
          width: 100%;
          height: 48px;
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
  
  @media (max-width: 768px) {
    padding: 16px;
    
    .card {
      padding: 16px;
    }
  }
`; 