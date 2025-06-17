import styled from "styled-components";
import { Theme } from "../../../../../theme/theme";

export const PerformancePageStyle = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  
  .page-header {
    margin-bottom: 32px;
    
    .back-link {
      color:${Theme.colors.secondary};
          text-decoration: none;
          font: ${Theme.typography.fonts.mediumM};
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          margin-bottom: 16px;
          
          &:hover {
            text-decoration: underline;
          }
    }
    
    h1 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};

    }
  }
  
  .cards-row {
    display: flex;
    gap: 20px;
    
    @media (max-width: 992px) {
      flex-direction: column;
    }
  }
  
  .card {
    border-radius: ${Theme.borders.radius.lg};
    padding: 20px;
    border: ${Theme.borders.primary};
    
    h2 {
      font: ${Theme.typography.fonts.extraLargeB};
      color: ${Theme.colors.black};
      margin: 0 0 24px 0;
    }
    
    &.performance-card {
      flex: 2;
      
      .performance-metrics {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        margin-bottom: 32px;
        margin-top: 8px;

        
        @media (max-width: 757px) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        @media (max-width: 321px) {
          grid-template-columns: 1fr;
        }
        
        .metric {
          .metric-name {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.gray2};
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
              font: ${Theme.typography.fonts.h2};
              color: ${Theme.colors.primary};
              

            }
            
            .currency {
              font: ${Theme.typography.fonts.h4B};
              color: ${Theme.colors.primary};
              margin-left: 4px;
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
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
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
            background-color: ${Theme.colors.sixth};
            
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
    }
    
    &.eligibility-card {
      flex: 1;
      max-width: 321px;
      display: flex;
      flex-direction: column;
      
      @media (max-width: 992px) {
        max-width: 100%;
      }
      
      h2 {

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
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          flex: 1;
        }
        
        .info-icon-wrapper {
          svg {
            width: 24px;
            height: 24px;
            margin-right: 0;
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
  
  @media (max-width: 768px) {
    padding: 16px;
    
    .card {
      padding: 16px;
    }
  }
`; 