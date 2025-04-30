import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const ReservationStatusContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 360px;
  grid-gap: 32px;
  
  h1, h2, .back-button, .status-card, .payment-methods-section, .info-cards-section, 
  .rejection-info, .contact-cards, .suggestions-section {
    grid-column: 1 / 2;
  }
  
  .property-details-card {
    grid-column: 2 / 3;
    grid-row: 1 / span 6;
    position: sticky;
    top: 20px;
    align-self: start;
    border-radius: ${Theme.borders.radius.lg};
    overflow: hidden;
    background: white;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    
    h1, h2, .back-button, .status-card, .payment-methods-section, .info-cards-section,
    .rejection-info, .contact-cards, .suggestions-section, .property-details-card {
      grid-column: 1 / 2;
    }
    
    .property-details-card {
      grid-row: auto;
      position: relative;
      top: 0;
    }
  }
  
  h1 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
    

  }
  
  h2 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin: 2rem 0 1rem;
    position: relative;
    display: inline-block;
    

  }
  
  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.gray2};
    margin-bottom: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: fit-content;
    background: white;
    padding: 8px 16px;
    border-radius: 30px;
    box-shadow: none;
    
    &:hover {
      color: ${Theme.colors.secondary};
      transform: translateX(-5px);
    }
    
    svg {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: translateX(-3px);
    }
  }
  
  .status-card {
    border-radius: ${Theme.borders.radius.lg};
    overflow: hidden;
    margin-bottom: 2rem;
    border: ${Theme.borders.primary};
    
    .status-header {
      padding: 2rem;
      color: white;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      min-height: 200px;
      position: relative;
      
      &.pending {
        background: linear-gradient(90deg, ${Theme.colors.secondary} 0%, #9C4DF4 100%);
      }
      
      &.approved {
        background: linear-gradient(90deg, #00A6DB 0%, #00D072 100%);
      }
      
      &.rejected {
        background: linear-gradient(90deg, ${Theme.colors.secondary} 0%, #FF3B5C 100%);
      }
      
      &.paid, &.moved-in {
        background: linear-gradient(90deg, #00A6DB 0%, #00D072 100%);
      }
      
      &.payment-failed {
        background: linear-gradient(90deg, ${Theme.colors.secondary} 0%, #FF3B5C 100%);
      }
      
      &.refund-pending {
        background: linear-gradient(90deg, ${Theme.colors.secondary} 0%, #9C4DF4 100%);
      }
      
      &.refund-processed {
        background: linear-gradient(90deg, #00A6DB 0%, #00D072 100%);
      }
      
      .status-info {
        z-index: 1;
        
        .status-label {
          font: ${Theme.typography.fonts.smallB};
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        
        .status-title {
          font: ${Theme.typography.fonts.h2};
          margin-bottom: 1rem;
          max-width: 60%;
        }
        
        .status-description {
          font: ${Theme.typography.fonts.mediumM};
          max-width: 80%;
        }
      }
      
      .status-icon {
        z-index: 1;
        
        svg, img {
          width: 120px;
          height: 120px;
        }
      }
      
      .countdown {
        font: ${Theme.typography.fonts.h1};
        text-align: center;
        margin-top: 1rem;
        z-index: 1;
      }
    }
    
    .status-content {
      background-color: white;
      padding: 2rem;
      
      .action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        
        button {
          min-width: 120px;
        }
      }
      
      .information-section {
        margin-top: 2rem;
        
        h3 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 1rem;
        }
        
        .info-card {
          border: ${Theme.borders.primary};
          border-radius: ${Theme.borders.radius.md};
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          
          .info-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
            
            svg {
              width: 24px;
              height: 24px;
              color: ${Theme.colors.secondary};
            }
            
            h4 {
              font: ${Theme.typography.fonts.largeB};
              color: ${Theme.colors.black};
            }
          }
          
          p {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            margin-bottom: 0.5rem;
          }
        }
      }
      
      .payment-methods {
        margin-top: 2rem;
        
        h3 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 1rem;
        }
        
        .payment-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: ${Theme.borders.primary};
          border-radius: ${Theme.borders.radius.md};
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
          
          .card-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            
            img {
              width: 48px;
              height: 32px;
            }
            
            .card-details {
              .card-type {
                font: ${Theme.typography.fonts.mediumB};
                color: ${Theme.colors.black};
              }
              
              .card-expiry {
                font: ${Theme.typography.fonts.smallM};
                color: ${Theme.colors.gray2};
              }
            }
          }
        }
      }
      
      .property-section {
        margin-top: 2rem;
        
        h3 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 1rem;
        }
        
        .property-card {
          display: flex;
          gap: 1.5rem;
          border: ${Theme.borders.primary};
          border-radius: ${Theme.borders.radius.md};
          padding: 1.5rem;
          
          .property-image {
            width: 120px;
            height: 120px;
            border-radius: ${Theme.borders.radius.md};
            object-fit: cover;
          }
          
          .property-info {
            flex: 1;
            
            .property-title {
              font: ${Theme.typography.fonts.h4B};
              color: ${Theme.colors.black};
              margin-bottom: 0.5rem;
            }
            
            .property-address {
              font: ${Theme.typography.fonts.mediumM};
              color: ${Theme.colors.gray2};
              margin-bottom: 1rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .property-details {
              display: flex;
              gap: 2rem;
              margin-bottom: 1rem;
              
              .detail-item {
                .label {
                  font: ${Theme.typography.fonts.smallM};
                  color: ${Theme.colors.gray2};
                }
                
                .value {
                  font: ${Theme.typography.fonts.mediumB};
                  color: ${Theme.colors.black};
                }
              }
            }
          }
        }
      }
      
      .price-summary {
        border-top: 1px solid ${Theme.colors.gray2};
        margin-top: 2rem;
        padding-top: 1.5rem;
        
        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          
          .label {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
          }
          
          .value {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
          }
          
          &.total {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid ${Theme.colors.gray2};
            
            .label, .value {
              font: ${Theme.typography.fonts.largeB};
              color: ${Theme.colors.black};
            }
            
            .value {
              color: ${Theme.colors.secondary};
            }
          }
        }
      }
      
      .suggestions-section {
        margin-top: 2rem;
        
        h3 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 1rem;
        }
        
        .suggestions-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
      }
    }
  }
  
  .card-message {
    background-color: #F8F7FD;
    border-radius: ${Theme.borders.radius.md};
    border-left: 4px solid ${Theme.colors.secondary};
    padding: 1.5rem;
    margin: 1.5rem 0;
    
    h4 {
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.black};
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
    }
    
    &.warning {
      background-color: #FFF9F6;
      border-left: 4px solid ${Theme.colors.warning};
    }
    
    &.success {
      background-color: #F6FBF9;
      border-left: 4px solid ${Theme.colors.success};
    }
    
    &.error {
      background-color: #FEF4F4;
      border-left: 4px solid ${Theme.colors.error};
    }
  }
  
  .moved-in {
    .right-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .refund-timer {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        
        .timer-label {
          font: ${Theme.typography.fonts.mediumB};
          color: white;
          margin-bottom: 1rem;
        }
        
        .countdown-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          
          .countdown-segment {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            border-radius: ${Theme.borders.radius.sm};
            padding: 0.5rem;
            min-width: 60px;
            
            .count {
              font: ${Theme.typography.fonts.h3};
              color: white;
            }
            
            .label {
              font: ${Theme.typography.fonts.smallM};
              color: rgba(255, 255, 255, 0.8);
            }
          }
          
          .separator {
            font: ${Theme.typography.fonts.h3};
            color: white;
            margin-top: -0.5rem;
          }
        }
      }
      
      .refund-expired {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        .expired-message {
          font: ${Theme.typography.fonts.mediumB};
          color: white;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        img {
          max-width: 120px;
          height: auto;
        }
      }
    }
  }
`; 