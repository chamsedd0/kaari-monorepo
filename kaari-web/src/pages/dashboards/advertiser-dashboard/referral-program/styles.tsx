import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ReferralProgramPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;

    * {
      transition: all 0.2s ease;
    }

    button {
        border-radius: ${Theme.borders.radius.extreme} !important;
        height: 48px !important;
    }
   
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h1, h2 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};
    }

    .header-buttons{
      max-width: 200px;
    }
    
    .founding-partner-badge {
      background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
      color: #000;
      padding: 8px 16px;
      border-radius: ${Theme.borders.radius.md};
      font: ${Theme.typography.fonts.mediumB};
      position: relative;
      cursor: pointer;
      
      &:hover .tooltip {
        visibility: visible;
        opacity: 1;
      }
      
      .tooltip {
        visibility: hidden;
        width: 300px;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 10px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
        font: ${Theme.typography.fonts.smallM};
        
        &::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }
      }
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
    background: #FFFFFF;
    
    h2 {
      font: ${Theme.typography.fonts.extraLargeB};
      color: ${Theme.colors.black};
      margin-bottom: 20px;
    }
    
    &.referral-link-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;

      .referral-link-card-content {
        flex: 1;
      }

      .referral-link-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
      }

      .link-input-group {
        display: flex;
        
        .referral-link-input {
          flex: 1;
          height: 48px;
          padding: 0 15px;
          border: ${Theme.borders.primary};
          border-radius: ${Theme.borders.radius.extreme};
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
          background: #F9F9F9;
        }
      }
      
      .referral-actions {
        display: flex;
        margin-left: 10px;
        
        .share-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${Theme.colors.secondary};
          color: white;
          border: none;
          border-radius: ${Theme.borders.radius.extreme};
          padding: 10px 16px;
          font: ${Theme.typography.fonts.mediumB};
          cursor: pointer;
          transition: all 0.2s ease;
          
          svg {
            fill: white;
          }
          
          &:hover {
            background: ${Theme.colors.primary};
            transform: translateY(-2px);
          }
        }
      }
      
      .referral-info {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        
        p {
          margin: 0;
          max-width: 80%;
        }
      }
      
      .qr-code-container {
        display: flex;
        justify-content: center;
        padding: 4px;
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
      }
    }
    
    &.progress-card {
      background: #fff;
      border-radius: 16px;
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
        gap: 10px;
        margin-top: 20px;

        .request-payout-btn, .performance-details-btn {
          padding: 12px 15px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          &.loading {
            background-color: #f3eefb;
            color: ${Theme.colors.secondary};
            position: relative;
            
            &:after {
              content: '';
              position: absolute;
              width: 20px;
              height: 20px;
              top: 50%;
              right: 15px;
              margin-top: -10px;
              border: 2px solid transparent;
              border-top-color: ${Theme.colors.secondary};
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          }
        }

        .request-payout-btn {
          background-color: ${Theme.colors.primary};
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: ${Theme.colors.secondary};
          }
        }

        .performance-details-btn {
          background-color: transparent;
          color: ${Theme.colors.secondary};
          border: 1px solid ${Theme.colors.secondary};
          
          &:hover {
            background-color: #f3eefb;
          }
        }
      }
    }
    
    &.help-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .help-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${Theme.colors.secondary};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font: ${Theme.typography.fonts.mediumB};
        }
      }
      
      .help-links {
        display: flex;
        flex-direction: column;
        gap: 15px;
        
        .help-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-radius: ${Theme.borders.radius.sm};
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.black};
          cursor: pointer;
      
          &:hover {
            background: #F9F9F9;
          }
        }
      }
    }
  }
  
  .share-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .share-modal {
    background: white;
    border-radius: ${Theme.borders.radius.lg};
    width: 90%;
    max-width: 550px;
    overflow: hidden;
    
    .share-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;

      img {
        width: 24px;
        height: 24px;
      }

      h2 {
        font: ${Theme.typography.fonts.h4B};
      }
      
      .close-btn {
        background: none;
        border: none;
        font: ${Theme.typography.fonts.h3};
        cursor: pointer;
        color: ${Theme.colors.primary};
        
        &:hover {
          color: ${Theme.colors.black};
        }
      }
    }
    
    .share-modal-content {
      padding: 20px;
      
      .share-text {
        padding: 20px 12px;
        border-radius: ${Theme.borders.radius.md};
        border: ${Theme.borders.primary};
        margin-bottom: 20px;
        
        p {
          margin: 0 0 10px 0;
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
          
          &.share-link {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.secondary};
          }
        }
      }
      
      .share-options {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        
        .share-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: transform 0.2s ease;
          
          &:hover {
            transform: translateY(-3px);
          }
          
          .share-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          
          span {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.black};
          }
        }
      }
      
      .promo-code-banner {
        display: flex;
        align-items: center;
        gap: 15px;
        background: ${Theme.colors.secondary}20;
        padding: 15px;
        border-radius: ${Theme.borders.radius.md};
        margin-bottom: 20px;
        
        .promo-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${Theme.colors.secondary};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font: ${Theme.typography.fonts.mediumB};
        } 
        
        p {
          margin: 0;
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.secondary};
          
          strong {
            font: ${Theme.typography.fonts.mediumB};
          }
        }
      }
      
      .share-modal-buttons {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        
        button {
          flex: 1;
          padding: 12px;
          border-radius: ${Theme.borders.radius.md};
          font: ${Theme.typography.fonts.mediumB};
          cursor: pointer;
        }
        
        .copy-button {
          background: ${Theme.colors.secondary};
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          
          &:hover {
            background: ${Theme.colors.primary};
          }
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
      
      .sidebar {
        max-width: 100%;
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
    }
    
    .share-modal {
      .share-options {
        flex-wrap: wrap;
        gap: 15px;
        
        .share-option {
          width: 45%;
        }
      }
    }
  }
`; 