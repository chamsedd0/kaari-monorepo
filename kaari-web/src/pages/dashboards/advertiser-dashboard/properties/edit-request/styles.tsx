import styled from 'styled-components';
import { Theme } from '../../../../../theme/theme';

export const PropertyEditRequestPageStyle = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 24px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    
    h1 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};
      margin: 0;
    }
    
    .back-button {
      display: flex;
      align-items: center;
      background: none;
      border: none;
      color: ${Theme.colors.secondary};
      font: ${Theme.typography.fonts.mediumM};
      cursor: pointer;
      padding: 8px 16px;
      margin-right: 16px;
      border-radius: 8px;
      
      &:hover {
        background-color: ${Theme.colors.fifth};
      }
      
      svg {
        margin-right: 8px;
      }
    }
  }
  
  .error-message {
    padding: 12px 16px;
    background-color: rgba(255, 99, 71, 0.1);
    border-left: 4px solid tomato;
    color: tomato;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  
  .loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: ${Theme.colors.gray2};
    font: ${Theme.typography.fonts.mediumM};
    
    &:before {
      content: '';
      width: 24px;
      height: 24px;
      border: 3px solid ${Theme.colors.fifth};
      border-top-color: ${Theme.colors.secondary};
      border-radius: 50%;
      animation: spinner 1s linear infinite;
      margin-right: 12px;
    }
    
    @keyframes spinner {
      to {
        transform: rotate(360deg);
      }
    }
  }
  
  .content {
    display: flex;
    gap: 32px;
    
    .form-container {
      flex: 1;
      background-color: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      
      .form-section {
        margin-bottom: 32px;
        
        h3 {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin-bottom: 20px;
        }
        
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px 24px;
          
          .checkbox-item {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            
            input[type="checkbox"] {
              position: absolute;
              opacity: 0;
              cursor: pointer;
              height: 0;
              width: 0;
            }
            
            .amenity-icon {
              width: 20px;
              height: 20px;
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${Theme.colors.secondary};
            }
            
            .checkbox-square {
              height: 18px;
              width: 18px;
              border: 1.5px solid ${Theme.colors.tertiary};
              border-radius: 4px;
              display: inline-block;
              position: relative;
              margin-right: 12px;
              flex-shrink: 0;
              
              &:after {
                content: "";
                position: absolute;
                display: none;
                left: 5px;
                top: 1px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
              }
            }
            
            input:checked ~ .checkbox-square {
              background-color: ${Theme.colors.secondary};
              border-color: ${Theme.colors.secondary};
              
              &:after {
                display: block;
              }
            }
            
            .amenity-text {
              font: ${Theme.typography.fonts.mediumM};
              color: ${Theme.colors.black};
            }
          }
        }
        
        textarea {
          width: 100%;
          padding: 16px;
          border: 1px solid ${Theme.colors.tertiary};
          border-radius: 8px;
          resize: vertical;
          font: ${Theme.typography.fonts.mediumM};
          min-height: 120px;
          
          &:focus {
            outline: none;
            border-color: ${Theme.colors.secondary};
          }
          
          &::placeholder {
            color: ${Theme.colors.gray};
          }
        }
      }
    }
    
    .property-info {
      flex: 0 0 300px;
      background-color: white;
      border-radius: 12px;
      padding: 24px;
      height: fit-content;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      
      .property-image {
        width: 100%;
        height: 180px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 16px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .property-title {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
        margin-bottom: 8px;
      }
      
      .property-location {
        font: ${Theme.typography.fonts.smallM};
        color: ${Theme.colors.gray2};
        margin-bottom: 16px;
      }
      
      .property-details {
        margin-bottom: 16px;
        
        .detail {
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
          margin-bottom: 8px;
        }
      }
      
      .need-help {
        background-color: white;
        border-radius: 12px;
        padding: 20px;
        margin-top: 16px;
        border: 1px solid ${Theme.colors.fifth};
        
        h4 {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
          margin-bottom: 16px;
        }
        
        .help-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid ${Theme.colors.fifth};
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.black};
          cursor: pointer;
          
          &:hover {
            color: ${Theme.colors.secondary};
          }
          
          svg {
            color: ${Theme.colors.gray};
          }
        }
      }
    }
  }
  
  .button-container {
    margin-top: 32px;
    
    .submit-button {
      min-width: 160px;
      height: 48px;
      font: ${Theme.typography.fonts.mediumB};
      border-radius: 24px;
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      padding: 12px 24px;
      cursor: pointer;
      
      &:disabled {
        background-color: ${Theme.colors.gray};
        cursor: not-allowed;
      }
    }
  }
`; 