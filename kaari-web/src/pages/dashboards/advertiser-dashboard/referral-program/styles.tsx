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
    
    h1, h2 {
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
    background: #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    
    h2 {
      font: ${Theme.typography.fonts.extraLargeB};
      color: ${Theme.colors.black};
      margin-bottom: 20px;
    }
    
    &.referral-pass-card {
      padding: 0;
      overflow: hidden;
      
      .card-header {
        padding: 20px 20px 0;
      }
      
      .referral-pass-content {
        padding: 0 20px 20px;
      }
      
      &.active {
        .countdown-timer {
          background: linear-gradient(90deg, #00C2FF 0%, #00E15B 100%);
        }
        
        .pass-status {
          background: linear-gradient(90deg, #00C2FF 0%, #00E15B 100%);
        }
      }
      
      &.expired {
        .countdown-timer {
          background: linear-gradient(90deg, #FF5733 0%, #C70039 100%);
        }
        
        .pass-status {
          background: linear-gradient(90deg, #FF5733 0%, #C70039 100%);
        }
      }
      
      &.onboarding {
        .welcome-message {
          background: linear-gradient(90deg, #8F27CE 0%, #C427CE 100%);
          color: white;
          padding: 20px;
          border-radius: ${Theme.borders.radius.md};
          margin-bottom: 20px;
          
          h3 {
            font: ${Theme.typography.fonts.largeB};
            margin: 0 0 10px 0;
          }
          
          p {
            font: ${Theme.typography.fonts.mediumM};
            margin: 0;
          }
        }
        
        .progress-metrics {
          background: linear-gradient(90deg, #8F27CE20 0%, #C427CE20 100%);
        }
        
        .onboarding-illustration {
          display: flex;
          justify-content: center;
          margin: 20px 0;
          
          img {
            max-width: 200px;
            height: auto;
          }
        }
      }
      
      .countdown-timer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        color: white;
        
        &.expired {
          opacity: 0.8;
        }
        
        .timer-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          padding: 10px;
          border-radius: ${Theme.borders.radius.md};
          min-width: 60px;
          
          .time {
            font: ${Theme.typography.fonts.extraLargeB};
            font-size: 32px;
          }
          
          .label {
            font: ${Theme.typography.fonts.mediumM};
            opacity: 0.9;
          }
        }
        
        .separator {
          font: ${Theme.typography.fonts.extraLargeB};
          font-size: 32px;
          margin: 0 5px;
        }
      }
      
      .until-renewal {
        text-align: center;
        margin: 10px 0;
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
      }
      
      .pass-status {
        display: flex;
        align-items: center;
        padding: 20px;
        color: white;
        border-radius: ${Theme.borders.radius.md};
        margin: 20px 0;
        
        .lock-icon {
          margin-right: 15px;
        }
        
        .status-text {
          h3 {
            font: ${Theme.typography.fonts.largeB};
            margin: 0 0 5px 0;
          }
          
          p {
            font: ${Theme.typography.fonts.mediumM};
            margin: 0;
            opacity: 0.9;
          }
        }
      }
      
      .progress-metrics {
        display: flex;
        justify-content: space-between;
        background: #F9F9F9;
        padding: 15px;
        border-radius: ${Theme.borders.radius.md};
        margin: 20px 0;
        
        &.onboarding {
          background: linear-gradient(90deg, #8F27CE20 0%, #C427CE20 100%);
        }
        
        .metric-box {
          flex: 1;
          text-align: center;
          
          h4 {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            margin: 0 0 5px 0;
          }
          
          .metric-value {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
          }
        }
      }
      
      .pass-info {
        display: flex;
        align-items: center;
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        
        svg {
          margin-right: 10px;
        }
      }
    }
    
    &.referral-link-card {
      .referral-link-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .link-input-group {
        display: flex;
        
        .referral-link-input {
          flex: 1;
          height: 48px;
          padding: 0 15px;
          border: 1px solid #E0E0E0;
          border-right: none;
          border-radius: ${Theme.borders.radius.md} 0 0 ${Theme.borders.radius.md};
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
          background: #F9F9F9;
        }
        
        .copy-icon {
            width: 48px;
            height: 48px;
          background: ${Theme.colors.secondary};
            border: none;
          border-radius: 0 ${Theme.borders.radius.md} ${Theme.borders.radius.md} 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          
          &:hover {
            background: ${Theme.colors.primary};
          }
        }
      }
      
      .referral-actions {
        display: flex;
        margin-top: 16px;
        
        .share-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${Theme.colors.secondary};
          color: white;
          border: none;
          border-radius: ${Theme.borders.radius.md};
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
        margin-top: 16px;
        
        p {
          margin: 0;
        }
      }
      
      .qr-code-container {
        display: flex;
        justify-content: center;
        margin: 10px 0;
      }
    }
    
    &.photoshoot-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: linear-gradient(90deg, #8F27CE 0%, #C427CE 100%);
      color: white;
      
      .photoshoot-content {
        display: flex;
        flex-direction: column;
        gap: 15px;
        
        .photoshoot-text {
          h3 {
            font: ${Theme.typography.fonts.largeB};
            margin: 0;
          }
          
          h2 {
            font: ${Theme.typography.fonts.extraLargeB};
            margin: 5px 0 0 0;
            color: white;
          }
        }
      }
      
      .book-photoshoot-btn {
        background: white;
        color: ${Theme.colors.secondary};
        border: none;
        border-radius: ${Theme.borders.radius.md};
        padding: 10px 20px;
        font: ${Theme.typography.fonts.mediumB};
        cursor: pointer;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      }
      
      .photoshoot-image {
        max-width: 120px;
        
        img {
          width: 100%;
          height: auto;
        }
      }
    }
    
    &.earnings-calculator {
      .calculator-content {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        
        .sliders {
          flex: 1;
          min-width: 280px;
          
          .slider-group {
            margin-bottom: 20px;
            
            .slider-label {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font: ${Theme.typography.fonts.mediumM};
              color: ${Theme.colors.black};
              
              .slider-value {
                background: #F0E6FA;
                padding: 2px 10px;
                border-radius: ${Theme.borders.radius.sm};
              }
            }
            
            .slider-container {
              display: flex;
              align-items: center;
              gap: 10px;
              
              .min-value, .max-value {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
              }
              
              .slider {
                flex: 1;
                -webkit-appearance: none;
                height: 6px;
                background: #F0E6FA;
                border-radius: 3px;
                
                &::-webkit-slider-thumb {
                  -webkit-appearance: none;
              width: 20px;
              height: 20px;
                  border-radius: 50%;
                  background: ${Theme.colors.secondary};
                  cursor: pointer;
                }
              }
            }
          }
        }
        
        .calculator-results {
          flex: 1;
          min-width: 280px;
          
          .monthly-earnings {
            background: #F9F9F9;
            padding: 20px;
            border-radius: ${Theme.borders.radius.md};
            
            h3 {
              font: ${Theme.typography.fonts.mediumM};
              color: ${Theme.colors.gray2};
              margin: 0 0 10px 0;
            }
            
            .earnings-amount {
              font: ${Theme.typography.fonts.extraLargeB};
              color: ${Theme.colors.black};
              margin-bottom: 20px;
            }
            
            .earnings-details {
              .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
                
                &:last-child {
                  margin-top: 15px;
                  padding-top: 15px;
                  border-top: 1px solid #E0E0E0;
                  font: ${Theme.typography.fonts.mediumB};
                  color: ${Theme.colors.black};
                }
              }
            }
          }
        }
      }
      
      .calculator-footer {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        
        .book-photoshoot-btn {
          background: ${Theme.colors.secondary};
          color: white;
          border: none;
          border-radius: ${Theme.borders.radius.md};
          padding: 12px 24px;
          font: ${Theme.typography.fonts.mediumB};
          cursor: pointer;
          
          &:hover {
            background: ${Theme.colors.primary};
          }
        }
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
        
        .request-payout-btn {
          width: 100%;
          max-width: 250px;
          padding: 12px;
          background: ${Theme.colors.secondary};
          color: white;
          border: none;
          border-radius: ${Theme.borders.radius.md};
          font: ${Theme.typography.fonts.mediumB};
          cursor: pointer;
          
          &:hover {
            background: ${Theme.colors.primary};
          }
        }
        
        .performance-details-btn {
            width: 100%;
            max-width: 250px;
          padding: 12px;
          background: transparent;
          color: ${Theme.colors.secondary};
          border: 1px solid ${Theme.colors.secondary};
          border-radius: ${Theme.borders.radius.md};
            font: ${Theme.typography.fonts.mediumB};
          cursor: pointer;
          
          &:hover {
            background: ${Theme.colors.secondary}10;
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
    max-width: 500px;
    overflow: hidden;
    
    .share-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #E0E0E0;
      
      h2 {
        margin: 0;
        font: ${Theme.typography.fonts.largeB};
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: ${Theme.colors.gray2};
        
        &:hover {
          color: ${Theme.colors.black};
        }
      }
    }
    
    .share-modal-content {
      padding: 20px;
      
      .share-text {
        background: #F9F9F9;
        padding: 20px;
        border-radius: ${Theme.borders.radius.md};
        margin-bottom: 20px;
        
        p {
          margin: 0 0 10px 0;
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.black};
          
          &.share-link {
            font: ${Theme.typography.fonts.mediumM};
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
            font: ${Theme.typography.fonts.largeB};
            color: white;
            
            &.facebook {
              background: #3b5998;
            }
            
            &.whatsapp {
              background: #25D366;
            }
            
            &.instagram {
              background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            }
            
            &.twitter {
              background: #000000;
            }
          }
          
          span {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
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
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.black};
          
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
        
        .close-button {
          background: transparent;
          border: 1px solid ${Theme.colors.gray2};
          color: ${Theme.colors.gray2};
          
          &:hover {
            border-color: ${Theme.colors.black};
            color: ${Theme.colors.black};
          }
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
      
      &.referral-pass-card {
        .countdown-timer {
          .timer-block {
            min-width: 40px;
            padding: 5px;
            
            .time {
              font-size: 24px;
            }
          }
        }
      }
      
      &.photoshoot-banner {
        flex-direction: column;
        
        .photoshoot-image {
          margin-top: 15px;
        }
      }
      
      &.earnings-calculator {
        .calculator-content {
          flex-direction: column;
        }
      }
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