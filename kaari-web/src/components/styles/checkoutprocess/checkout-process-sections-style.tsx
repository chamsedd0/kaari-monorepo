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
  width: 100%;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .error-message {
    background-color: #fff2f2;
    color: #e53935;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    border-left: 4px solid #e53935;
    font-size: 0.9rem;
  }

  .payment-methods-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #a0a0a0;
      background-color: #f9f9f9;
    }

    &.selected {
      border: 2px solid #6200ea;
      background-color: #f4f0ff;
    }
  }

  .card-icon {
    font-size: 1.5rem;
    color: #6200ea;
    margin-right: 1rem;
  }

  .card-details {
    flex: 1;
  }

  .card-number {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .card-info {
    display: flex;
    gap: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .default-badge {
    display: inline-flex;
    align-items: center;
    background-color: #e1f5fe;
    color: #0277bd;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .set-default-btn, .remove-btn {
    background: none;
    border: none;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      font-size: 0.9rem;
    }
  }

  .set-default-btn {
    color: #4caf50;
    &:hover {
      background-color: #e8f5e9;
    }
  }

  .remove-btn {
    color: #f44336;
    &:hover {
      background-color: #ffebee;
    }
  }

  .add-payment-method-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.9rem;
    margin-bottom: 1.5rem;
    background-color: #f5f5f5;
    border: 1px dashed #bdbdbd;
    border-radius: 8px;
    color: #6200ea;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #ede7f6;
      border-color: #6200ea;
    }

    svg {
      font-size: 1.1rem;
    }
  }

  .continue-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(to right, #6200ea, #9c27b0);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(to right, #5000c9, #8c239e);
      box-shadow: 0 4px 8px rgba(98, 0, 234, 0.2);
    }

    &:disabled {
      background: linear-gradient(to right, #9e9e9e, #bdbdbd);
      cursor: not-allowed;
      box-shadow: none;
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