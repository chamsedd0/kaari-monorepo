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

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalStyle = styled.div`
  background-color: ${Theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  position: relative;
  animation: slideIn 0.3s ease;
  overflow: hidden;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid ${Theme.colors.fifth};

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      position: relative;

      img {
        height: 36px;
      }
    }

    .close-button {
      position: absolute;
      right: 20px;
      top: 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      color: ${Theme.colors.gray2};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: 24px;
      height: 24px;
      transition: color 0.2s;

      &:hover {
        color: ${Theme.colors.black};
      }
    }
  }

  .modal-body {
    padding: 24px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
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
  .auth-header {
    text-align: center;
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
      color: ${Theme.colors.black};
    }
    
    p {
      color: ${Theme.colors.gray2};
      font-size: 16px;
    }
  }

  .social-login-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 12px;
    background-color: ${Theme.colors.white};
    border: 1px solid ${Theme.colors.fifth};
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s;
    gap: 12px;
    margin-bottom: 16px;
    
    svg {
      font-size: 20px;
    }
    
    &:hover {
      background-color: ${Theme.colors.fifth}50;
    }
  }
`;

export const ConfirmationModalStyle = styled(ModalStyle)`
  .icon-container {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    
    .warning-icon {
      background-color: ${Theme.colors.secondary}20;
      color: ${Theme.colors.primary};
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
    }
  }
  
  .confirmation-title {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 16px;
    color: ${Theme.colors.black};
  }
  
  .confirmation-message {
    text-align: center;
    color: ${Theme.colors.gray2};
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 24px;
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
  max-width: 500px;
  
  .languages-header {
    text-align: center;
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    p {
      color: ${Theme.colors.gray2};
      font-size: 16px;
    }
  }
  
  .languages-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 30px;
    margin-bottom: 30px;
    
    .language-checkbox {
      display: flex;
      align-items: center;
      
      input {
        margin-right: 10px;
      }
      
      label {
        font-size: 16px;
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