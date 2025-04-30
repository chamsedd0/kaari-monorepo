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
  }

  .card-number {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
  }

  .card-info {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
  }

  .card-actions {
    display: flex;
    gap: 8px;
  }

  .options-button {
    background: none;
    border: none;
    color: ${Theme.colors.gray2};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      background-color: ${Theme.colors.tertiary};
    }
  }

  .add-new-button {
    background: none;
    border: none;
    color: ${Theme.colors.secondary};
    font: ${Theme.typography.fonts.mediumB};
    cursor: pointer;
    padding: 8px 0;
    text-align: left;
    margin-bottom: 16px;

    &:hover {
      text-decoration: underline;
    }
  }

  .actions-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid ${Theme.colors.tertiary};
    width: 100%;

    .back-button {
      background-color: white;
      color: ${Theme.colors.gray2};
      border: 1px solid ${Theme.colors.tertiary};
      padding: 14px 32px;
      border-radius: 100px;
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      transition: all 0.3s ease;
      width: 140px;
      
      &:hover {
        border-color: ${Theme.colors.gray2};
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

    .proceed-button {
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      padding: 14px 32px;
      border-radius: 100px;
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      transition: all 0.3s ease;
      width: 140px;
      
      &:hover {
        background-color: ${Theme.colors.primary};
      }
      
      &:disabled {
        background-color: ${Theme.colors.tertiary};
        cursor: not-allowed;
      }
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    border-radius: ${Theme.borders.radius.md};
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 24px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      font: ${Theme.typography.fonts.h4B};
      color: ${Theme.colors.black};
      margin: 0;
    }
    
    .close-button {
      background: none;
      border: none;
      color: ${Theme.colors.gray2};
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        color: ${Theme.colors.black};
      }
    }
  }

  .modal-body {
    margin-bottom: 16px;
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