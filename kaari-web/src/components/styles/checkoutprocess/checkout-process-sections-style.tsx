import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .form-group {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    width: 100%;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 12px;
    }
  }
  
  .date-of-birth-container,
  .government-id-container {
    margin-bottom: 16px;
    width: 100%;
  }

  textarea {
    margin-bottom: 24px;
    width: 100%;
  }

  .text-area-container {
    margin-bottom: 24px;
    width: 100%;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 0;
    margin-bottom: 24px;
    
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
  
  .button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    margin-top: 24px;
    width: 100%;

  }

  // Payment Method Styles
  .saved-cards {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
  }

  .add-payment-method {
    width: 100%;
    margin-top: 8px;
    margin-bottom: 24px;

    .add-payment-button {
      width: 100%;
      padding: 16px;
      background-color: transparent;
      border: 2px dashed ${Theme.colors.secondary};
      border-radius: ${Theme.borders.radius.lg};
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.secondary};
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: ${Theme.colors.primary};
        background-color: ${Theme.colors.tertiary};
      }
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