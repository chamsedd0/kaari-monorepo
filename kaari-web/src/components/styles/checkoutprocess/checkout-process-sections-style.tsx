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
  padding: 20px 0;

  h2 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
  }

  .subtitle {
    font: ${Theme.typography.fonts.largeM};
    color: ${Theme.colors.gray2};
  }

  .error-message {
    color: red;
    font: ${Theme.typography.fonts.text14};
    margin-bottom: 10px;
  }

  .payment-methods-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .card-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.md};
    cursor: pointer;
    transition: all 0.2s ease;

    &.selected {
      border-color: ${Theme.colors.secondary};
      background-color: ${Theme.colors.lightPurple};
    }

    &:hover {
      border-color: ${Theme.colors.secondary};
    }
  }

  .card-icon {
    font-size: 24px;
    margin-right: 16px;
    color: ${Theme.colors.gray2};
  }

  .card-details {
    flex: 1;
  }

  .card-number {
    font: ${Theme.typography.fonts.largeB};
    margin-bottom: 4px;
  }

  .card-info {
    display: flex;
    gap: 16px;
    font: ${Theme.typography.fonts.text14};
    color: ${Theme.colors.gray2};
  }

  .default-badge {
    background-color: ${Theme.colors.secondary};
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font: ${Theme.typography.fonts.smallB};
    margin-left: 12px;
  }

  .card-actions {
    display: flex;
    gap: 12px;
  }

  .set-default-btn, .remove-btn {
    background: none;
    border: none;
    font: ${Theme.typography.fonts.text14};
    color: ${Theme.colors.secondary};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  .remove-btn {
    color: ${Theme.colors.error};
  }

  .add-payment-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: start;
    justify-content: start;
    width: 100%;

    .title {
      font: ${Theme.typography.fonts.h4B};
      color: ${Theme.colors.black};
    }

    .subtitle {
      font: ${Theme.typography.fonts.largeM};
      color: ${Theme.colors.gray2};
    }

    .payment-info-saved {
      width: 100%;
      max-height: 90px;
    }
    
    .advanced-filtering-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: start;
      
      button {
        max-width: 200px;
      }
    }
  }
  
  .payment-form-container {
    width: 100%;
    padding: 20px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.md};
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