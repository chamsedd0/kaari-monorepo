import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ModalOverlayStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  padding: 20px;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalStyle = styled.div`
  background-color: ${Theme.colors.white};
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 480px;
  position: relative;
  animation: slideIn 0.3s ease;
  overflow: hidden;

  @media (max-width: 700px) {
    max-width: 94vw;
    border-radius: 16px;
  }

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    position: relative;

    .logo {
      width: auto;
      height: 32px;
      margin: 0 auto;
    }

    .close-button {
      position: absolute;
      left: 20px;
      top: 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      color: ${Theme.colors.black};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: 24px;
      height: 24px;
      transition: color 0.2s;

      &:hover {
        color: ${Theme.colors.primary};
      }
    }
  }

  .modal-body {
    padding: 24px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  @media (max-width: 700px) {
    .modal-body { padding: 16px; max-height: calc(100vh - 140px); }
  }

  .modal-footer {
    padding: 20px 24px;
    border-top: 1px solid ${Theme.colors.fifth};
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    
    &::before, &::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: ${Theme.colors.fifth};
    }
    
    span {
      padding: 0 10px;
      color: ${Theme.colors.gray2};
      font-size: 14px;
    }
  }

  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${Theme.colors.black};
    }
    
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid ${Theme.colors.fifth};
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
      
      &:focus {
        outline: none;
        border-color: ${Theme.colors.primary};
      }
    }
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    input[type="checkbox"] {
      margin-right: 10px;
      width: 18px;
      height: 18px;
    }
    
    label {
      font-size: 14px;
      color: ${Theme.colors.gray2};
    }
  }

  .warning-message {
    display: flex;
    align-items: center;
    background-color: rgba(255, 99, 71, 0.1);
    border-radius: 8px;
    padding: 16px;
    margin: 20px 0;
    
    .icon {
      color: tomato;
      font-size: 24px;
      margin-right: 12px;
    }
    
    .message {
      font-size: 14px;
      color: ${Theme.colors.black};
    }
  }

  .button-container {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    button {
      width: 100%;
    }
  }

  .link-text {
    font-size: 14px;
    color: ${Theme.colors.primary};
    text-align: center;
    cursor: pointer;
    margin-top: 16px;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const AuthModalStyle = styled(ModalStyle)`
  padding: 24px;
  
  .modal-header {
    padding: 0;
    margin-bottom: 30px;
    
    .logo {
      display: block;
      margin: 0 auto;
    }
    
    .close-button {
      left: 0;
      top: 0;
    }
  }
  
  h2 {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: ${Theme.colors.black};
  }
  
  .error-message {
    background-color: #FFF0F0;
    color: #E53935;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .success-message {
    background-color: #F0FFF4;
    color: #2E7D32;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  form {
    .form-group {
      margin-bottom: 16px;
      
      label {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
        color: ${Theme.colors.gray2};
      }
      
      input {
        width: 100%;
        padding: 16px;
        border: 1px solid #E0E0E0;
        border-radius: 100px;
        font-size: 16px;
        
        &:focus {
          outline: none;
          border-color: ${Theme.colors.primary};
        }
        
        &::placeholder {
          color: #BDBDBD;
        }
      }
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 24px;
    
    .remember-me {
      display: flex;
      align-items: center;
      
      input[type="checkbox"] {
        margin-right: 8px;
        accent-color: ${Theme.colors.primary};
      }
      
      label {
        font-size: 14px;
        color: ${Theme.colors.gray2};
      }
    }
    
    .forgot-password {
      .forgot-link {
        color: ${Theme.colors.primary};
        font-size: 14px;
        cursor: pointer;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .separator {
    display: flex;
    align-items: center;
    margin: 24px 0;
    
    &::before, &::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: #E0E0E0;
    }
    
    span {
      padding: 0 16px;
      color: #757575;
      font-size: 14px;
    }
  }
  
  .google-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }
  
  .advertiser-link {
    text-align: center;
    margin-top: 24px;
    
    a {
      color: ${Theme.colors.primary};
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    .spinner {
      animation: spin 1s linear infinite;
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    }
  }
`;

export const ConfirmationModalStyle = styled(ModalStyle)`
  .icon-container {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .confirmation-title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 12px;
  }
  
  .confirmation-message {
    text-align: center;
    color: ${Theme.colors.gray2};
    margin-bottom: 24px;
  }
  
  .confirmation-actions {
    display: flex;
    gap: 16px;
    margin-top: 24px;
    
    button {
      flex: 1;
    }
  }
`;

export const CardDetailsModalStyle = styled(ModalStyle)`
  .card-logos {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    
    img {
      height: 30px;
    }
  }
  
  .card-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .payment-method-selector {
    margin-top: 24px;
    text-align: center;
    
    a {
      color: ${Theme.colors.primary};
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const SpokenLanguagesModalStyle = styled(ModalStyle)`
  max-width: 400px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  
  .modal-header {
    padding: 0;
    margin-bottom: 8px;
    text-align: center;
    
    .logo-container {
      width: 100%;
      h2 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }
    
    .close-button {
      position: absolute;
      right: 20px;
      top: 20px;
      left: auto;
      font-size: 18px;
    }
  }
  
  .languages-header {
    text-align: center;
    margin-bottom: 20px;
    
    p {
      color: #555;
      font-size: 14px;
      margin-top: 4px;
    }
  }
  
  .modal-body {
    padding: 0;
  }
  
  .languages-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 30px;
    margin-bottom: 24px;
    
    .language-checkbox {
      display: flex;
      align-items: center;
      padding: 4px 0;
      
      input {
        margin-right: 10px;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 1.5px solid #ccc;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:checked {
          background-color: #9333ea;
          border-color: #9333ea;
          
          &:after {
            content: '';
            position: absolute;
            top: 2px;
            left: 5px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        }
        
        &:hover {
          border-color: #9333ea;
        }
      }
      
      label {
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        color: #333;
        transition: color 0.2s ease;
        flex: 1;
      }
    }
  }
  
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 12px;
    
    button {
      width: 160px;
      padding: 10px 0;
      background-color: #9333ea;
      color: white;
      font-weight: 500;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: #8529d9;
      }
    }
  }
`;

export const MessagingModalStyle = styled(ModalStyle)`
  .messaging-header {
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 8px;
    }
    
    p {
      color: ${Theme.colors.gray2};
      font-size: 16px;
      text-align: center;
    }
  }
  
  .messaging-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
    
    .icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: ${Theme.colors.fifth};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: ${Theme.colors.gray2};
    }
    
    .arrow-icon {
      color: ${Theme.colors.gray2};
      font-size: 20px;
    }
    
    .check-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: ${Theme.colors.secondary}30;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: ${Theme.colors.primary};
    }
  }
`; 