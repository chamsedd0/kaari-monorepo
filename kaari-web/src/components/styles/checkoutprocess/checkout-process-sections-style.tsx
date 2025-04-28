import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  
  .form-group {
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: 100%;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .date-of-birth-container {
    margin-bottom: 16px;
    width: 100%;
  }
  
  .text-area-container {
    flex-direction: column;
  }
  
  .checkbox-container {
    display: flex;
    align-items: center;
    margin-top: 16px;
    
    input[type="checkbox"] {
      margin-right: 8px;
    }
    
    label {
      font-size: 14px;
      color: #555;
    }
  }

  .next-button-container {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const PropertyImageContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
  
  .property-image {
    width: 100%;
    height: 240px;
    border-radius: ${Theme.borders.radius.lg};
    object-fit: cover;
  }
  
  .property-details {
    margin-top: 16px;
    
    h3 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};
      margin-bottom: 8px;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
    }
  }
`;

export const PaymentMethodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 0;
  position: relative;

  .back-button-container {
    margin-bottom: 20px;
    position: relative;

    .back-button {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${Theme.colors.secondary};
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 8px 16px;
      padding-left: 12px;
      border-radius: 20px;
      position: relative;
      z-index: 5;
      
      span {
        position: relative;
        z-index: 2;
      }

      svg {
        font-size: 16px;
        position: relative;
        z-index: 2;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${Theme.colors.secondary};
        border-radius: 20px;
        opacity: 0.5;
        transition: all 0.3s ease;
        z-index: 1;
      }

      &:hover {
        color: ${Theme.colors.primary};
        
        &::before {
          opacity: 0.8;
        }
      }
      
      &.highlight {
        animation: pulse 1.5s ease-in-out;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(143, 39, 206, 0.2);
        }
        
        70% {
          transform: scale(1.05);
          box-shadow: 0 0 0 10px rgba(143, 39, 206, 0);
        }
        
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(143, 39, 206, 0);
        }
      }
    }
  }

  h2 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 24px;
  }

  .payment-section {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .section-title {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
    margin-bottom: 16px;
  }

  .error-message {
    color: ${Theme.colors.error};
    font: ${Theme.typography.fonts.text14};
    margin-bottom: 16px;
    padding: 10px;
    background-color: rgba(231, 76, 60, 0.1);
    border-radius: ${Theme.borders.radius.md};
  }

  .payment-methods-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    margin-bottom: 24px;
  }

  .card-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.md};
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &.selected {
      border-color: ${Theme.colors.secondary};
    }

    &:hover {
      border-color: ${Theme.colors.secondary};
    }
  }

  .card-icon {
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    .card-brand-icon {
      width: 40px;
      height: 24px;
      object-fit: contain;
    }
  }

  .card-details {
    flex: 1;
  }

  .card-title {
    font: ${Theme.typography.fonts.largeB};
    margin-bottom: 4px;
    color: ${Theme.colors.black};

    .card-number {
      font: ${Theme.typography.fonts.largeM};
    }
  }

  .card-info {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
  }

  .card-actions {
    display: flex;
    align-items: center;
    
    .options-button {
      background: none;
      border: none;
      color: ${Theme.colors.gray2};
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      
      &:hover {
        background-color: ${Theme.colors.tertiary};
      }
    }
  }

  .add-card-button {
    background: none;
    border: none;
    color: ${Theme.colors.secondary};
    text-align: center;
    cursor: pointer;
    font: ${Theme.typography.fonts.largeM};
    margin: 0;
    padding: 8px 0;
    width: fit-content;
    margin-bottom: 32px;

    &:hover {
      text-decoration: underline;
    }
  }

  .add-card-button-link {
    background: none;
    border: none;
    color: ${Theme.colors.secondary};
    text-align: center;
    cursor: pointer;
    font: ${Theme.typography.fonts.largeM};
    margin: 0;
    padding: 8px 0;
    width: fit-content;
    margin-bottom: 32px;
    transition: all 0.2s ease;
    
    &:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-start;
    margin-top: 12px;

    .proceed-button {
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: ${Theme.borders.radius.md};
      font: ${Theme.typography.fonts.largeB};
      cursor: pointer;
      transition: all 0.2s;
      min-width: 120px;

      &:hover {
        background-color: ${Theme.colors.primary};
      }

      &:disabled {
        background-color: ${Theme.colors.tertiary};
        color: ${Theme.colors.gray2};
        cursor: not-allowed;
      }
    }
  }

  /* Payment Method Popup Styles */
  .payment-method-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(3px);
  }

  .payment-method-popup {
    background-color: white;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    position: relative;
    padding: 28px;
    z-index: 10000;
    animation: popupFadeIn 0.3s ease-out;
    
    /* Step indicator styles */
    .step-indicator {
      margin-bottom: 28px;
      
      .step-circles {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        
        .step-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: ${Theme.colors.tertiary};
          display: flex;
          align-items: center;
          justify-content: center;
          font: ${Theme.typography.fonts.smallB};
          color: ${Theme.colors.gray2};
          
          &.active {
            background-color: ${Theme.colors.secondary};
            color: white;
          }
        }
        
        .step-line {
          height: 2px;
          width: 40px;
          background-color: ${Theme.colors.tertiary};
          
          &.active {
            background-color: ${Theme.colors.secondary};
          }
        }
      }
      
      .step-labels {
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
        
        .step-label {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.gray2};
          flex: 1;
          text-align: center;
          max-width: 33.33%;
          
          &.active {
            color: ${Theme.colors.secondary};
            font: ${Theme.typography.fonts.smallB};
          }
        }
      }
    }

    @keyframes popupFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .popup-close {
      position: absolute;
      left: 20px;
      top: 20px;
      background: none;
      border: none;
      cursor: pointer;
      color: ${Theme.colors.black};
      padding: 8px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      z-index: 11;
      
      &:hover {
        background-color: ${Theme.colors.tertiary};
      }
    }
  }

  .payment-method-popup-header {
    margin-bottom: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }
  
  .popup-header {
    margin-bottom: 24px;
    text-align: center;
    
    h2 {
      font: ${Theme.typography.fonts.h4B};
      margin: 0;
      color: ${Theme.colors.black};
    }
  }

  .card-brands {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
    justify-content: center;
    
    .card-brand-icon {
      height: 28px;
      width: auto;
    }
  }

  .form-group {
    margin-bottom: 16px;

    input {
      width: 100%;
      padding: 14px 18px;
      border: 1px solid ${Theme.colors.tertiary};
      border-radius: 32px;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.black};
      transition: all 0.2s;
      background-color: white;
      height: 52px;

      &:focus {
        border-color: ${Theme.colors.secondary};
        outline: none;
        box-shadow: 0 0 0 2px rgba(143, 39, 206, 0.2);
      }

      &.error {
        border-color: ${Theme.colors.error};
        box-shadow: 0 0 0 1px rgba(231, 76, 60, 0.1);
      }

      &::placeholder {
        color: ${Theme.colors.gray2};
      }
    }

    .select-wrapper {
      position: relative;
      
      .select-input {
        appearance: none;
        padding-right: 32px;
        cursor: pointer;
      }
      
      .select-arrow {
        position: absolute;
        right: 18px;
        top: 50%;
        transform: translateY(-50%);
        color: ${Theme.colors.gray2};
        pointer-events: none;
      }
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .payment-method-link {
    margin-top: 16px;
    margin-bottom: 24px;
    text-align: center;
    
    .link-button {
      background: none;
      border: none;
      color: ${Theme.colors.secondary};
      font: ${Theme.typography.fonts.smallB};
      cursor: pointer;
      padding: 0;
      transition: all 0.2s;
      
      &:hover {
        text-decoration: underline;
        opacity: 0.9;
      }
    }
  }

  .remember-details {
    margin-bottom: 28px;
    
    label {
      display: flex;
      align-items: center;
      gap: 10px;
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray2};
      cursor: pointer;
      
      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        border: 1.5px solid ${Theme.colors.tertiary};
        border-radius: 4px;
        appearance: none;
        cursor: pointer;
        margin: 0;
        transition: all 0.2s;
        
        &:checked {
          background-color: ${Theme.colors.secondary};
          border-color: ${Theme.colors.secondary};
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            top: 2.5px;
            left: 6px;
            width: 5px;
            height: 9px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        }

        &:hover {
          border-color: ${Theme.colors.secondary};
        }
      }
    }
  }

  .popup-actions {
    display: flex;
    justify-content: space-between;
    gap: 16px;

    button {
      padding: 14px 0;
      border-radius: 32px;
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      transition: all 0.2s;
      height: 52px;
    }

    .cancel-button {
      background-color: transparent;
      border: none;
      color: ${Theme.colors.gray2};
      flex: 1;
      transition: all 0.2s;

      &:hover {
        color: ${Theme.colors.black};
      }
    }

    .add-card-button {
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      flex: 2;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background-color: ${Theme.colors.primary};
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(143, 39, 206, 0.2);
      }

      &:active {
        transform: translateY(0);
        box-shadow: none;
      }
    }
  }
`;

export const CardDetailsForm = styled.div`
  width: 100%;
  
  .card-fields-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .card-number-field {
    grid-column: 1 / -1;
  }
`;

export const SummaryContainer = styled.div`
  width: 100%;
  
  .summary-section {
    border: 1px solid ${Theme.colors.gray};
    border-radius: ${Theme.borders.radius.lg};
    padding: 24px;
    margin-bottom: 24px;
    
    h4 {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 16px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      
      .label {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
      }
      
      .value {
        font: ${Theme.typography.fonts.mediumB};
        color: ${Theme.colors.black};
      }
    }
    
    .total {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid ${Theme.colors.gray};
    }
  }
`;

export const ConfirmationContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  
  .confirmation-header {
    text-align: center;
    margin-bottom: 32px;
    
    h2 {
      font: ${Theme.typography.fonts.h2};
      color: ${Theme.colors.black};
      margin-bottom: 16px;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
    }
  }
`;

export const ConfirmationSummary = styled.div`
  h3 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 24px;
  }
  
  .summary-section {
    margin-bottom: 24px;
    
    h4 {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 16px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      
      .label {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
      }
      
      .value {
        font: ${Theme.typography.fonts.mediumB};
        color: ${Theme.colors.black};
      }
    }
  }
  
  .terms-container {
    margin-top: 24px;
    
    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 12px;
      
      input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: ${Theme.colors.secondary};
      }
      
      label {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.black};
        cursor: pointer;
      }
    }
  }
`;

export const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  .success-icon {
    margin-bottom: 24px;
  }
  
  h3 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 16px;
  }
  
  p {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    margin-bottom: 32px;
    max-width: 500px;
  }
  
  .booking-details {
    width: 100%;
    max-width: 500px;
    margin-bottom: 32px;
    padding: 24px;
    background-color: ${Theme.colors.gray};
    border-radius: ${Theme.borders.radius.lg};
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      
      .label {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
      }
      
      .value {
        font: ${Theme.typography.fonts.mediumB};
        color: ${Theme.colors.black};
      }
    }
  }
  
  .next-steps {
    width: 100%;
    max-width: 500px;
    text-align: left;
    
    h4 {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 16px;
    }
    
    ul {
      list-style-type: none;
      padding: 0;
      
      li {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        margin-bottom: 12px;
        padding-left: 24px;
        position: relative;
        
        &:before {
          content: "•";
          position: absolute;
          left: 0;
          color: ${Theme.colors.secondary};
        }
      }
    }
  }
`; 