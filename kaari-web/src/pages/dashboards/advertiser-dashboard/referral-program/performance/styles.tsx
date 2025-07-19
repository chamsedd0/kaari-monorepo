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
      
      .payout-button-container {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        max-width: 450px;
        
        > * {
          flex: 1;
          max-width: none !important;
          width: 100% !important;
        }
        
        @media (max-width: 600px) {
          flex-direction: column;
          gap: 16px;
          max-width: 250px;
          
          > * {
            flex: none;
            max-width: 250px !important;
          }
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

  .RH-text{
    margin-top: 20px;
    font: ${Theme.typography.fonts.extraLargeB};
    color: ${Theme.colors.black};
  }
`; 

export const ReferralHistoryTable = styled.table`
  width: 100%;
  margin-top: 24px;
  border-radius: ${Theme.borders.radius.lg};
  border: ${Theme.borders.primary};
  background: #fff;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  font: ${Theme.typography.fonts.mediumM};

  th, td {
    padding: 22px 20px;
    text-align: left;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
  }

  th {
    background: #fff;
    color: ${Theme.colors.black};
    font: ${Theme.typography.fonts.mediumB};
    border-bottom: none;
  }

  thead tr {
    position: relative;
  }
  thead tr::after {
    content: '';
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 0;
    border: ${Theme.borders.primary};
    background: ${Theme.colors.sixth};
    pointer-events: none;
    z-index: 1;
  }

  tr:not(:last-child) td {
    position: relative;
    border-bottom: none;
  }

  tr:not(:last-child) {
    position: relative;
  }
  tr:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 0;
    border: ${Theme.borders.primary};
    background: ${Theme.colors.sixth};
    pointer-events: none;
    z-index: 1;
  }

  td {
    background: #fff;
  }

  @media (max-width: 600px) {
    th, td {
      padding: 12px 8px;
      font-size: 13px;
    }
  }
`; 