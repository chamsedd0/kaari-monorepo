import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Theme } from '../../theme/theme';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRightRTL = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInLeftRTL = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const AdvertiserRegistrationPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
  
  .steps-container {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 30px;
    margin-top: 10px;
    width: 100%;
    
    &:after {
      content: '';
      position: absolute;
      top: 25px;
      left: calc(12.5% + 24px); /* Position from the center of first circle: 25%/2 = 12.5% + half circle width */
      right: calc(12.5% + 24px); /* Position from the center of last circle: 25%/2 = 12.5% + half circle width */
      height: 2px;
      background-color: ${Theme.colors.gray};
      z-index: 1;
    }
    
    /* Progress line for completed steps */
    &:before {
      content: '';
      position: absolute;
      top: 25px;
      left: calc(12.5% + 24px); /* Same as above */
      height: 2px;
      background-color: ${Theme.colors.success};
      z-index: 2;
      transition: width 0.5s ease;
    }
    
    /* RTL support for progress lines */
    html[dir="rtl"] & {
      &:after {
        left: calc(12.5% + 24px);
        right: calc(12.5% + 24px);
      }
      
      &:before {
        left: auto;
        right: calc(12.5% + 24px);
      }
    }
    
    /* Step 1: Line width 0% */
    &.step-1:before {
      width: 0%;
    }
    
    /* Step 2: Line width 33% */
    &.step-2:before {
      width: 33%;
    }
    
    /* Step 3: Line width 66% */
    &.step-3:before {
      width: 66%;
    }
    
    /* Step 4: Line width 100% */
    &.step-4:before {
      width: 100%;
    }
    
    /* RTL support for step progress */
    html[dir="rtl"] & {
      &.step-1:before {
        width: 0%;
      }
      
      &.step-2:before {
        width: 33%;
      }
      
      &.step-3:before {
        width: 66%;
      }
      
      &.step-4:before {
        width: 100%;
      }
    }
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
    position: relative;
    z-index: 3;
    
    &.active .step-number {
      background-color: ${Theme.colors.secondary};
      color: white;
      border-color: ${Theme.colors.secondary};
    }
    
    &.completed .step-number {
      background-color: ${Theme.colors.success};
      color: white;
      border-color: ${Theme.colors.success};
    }
  }
  
  .step-number {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: white;
    border: 2px solid ${Theme.colors.gray};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 600;
    color: ${Theme.colors.gray2};
    margin-bottom: 10px;
    transition: all 0.3s ease;
    
    &.active {
      background-color: ${Theme.colors.secondary};
      color: white;
      border-color: ${Theme.colors.secondary};
    }
    
    &.completed {
      background-color: ${Theme.colors.success};
      color: white;
      border-color: ${Theme.colors.success};
    }
  }
  
  .step-label {
    font-size: 14px;
    text-align: center;
    color: ${Theme.colors.secondary};
    font-weight: 500;
    transition: all 0.3s ease;
    
    &.active {
      color: ${Theme.colors.secondary};
      font-weight: 600;
    }
    
    &.completed {
      color: ${Theme.colors.success};
      font-weight: 600;
    }
  }
  
  .mobile-step-counter {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .form-container {
    width: 100%;
    background-color: white;
    border-radius: ${Theme.borders.radius.md};
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    @media (max-width: 768px) {
      padding: 20px 15px;
    }
  }
  
  .form-title {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 30px;
    text-align: center;
    
    @media (max-width: 768px) {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
  
  .form-group {
    margin-bottom: 24px;
    animation: ${fadeIn} 0.5s ease-out;
    transition: all 0.3s ease;
    
    label {
      display: flex;
      align-items: center;
      font: ${Theme.typography.fonts.largeM};
      margin-bottom: 12px;
      color: ${Theme.colors.black};
      transition: color 0.3s ease;
      
      .label-icon {
        margin-right: 8px;
        color: ${Theme.colors.secondary};
        font-size: 18px;
      }
      
      /* RTL support */
      html[dir="rtl"] & {
        .label-icon {
          margin-right: 0;
          margin-left: 8px;
        }
      }
    }
    
    &.required label:after {
      content: ' *';
      color: ${Theme.colors.error};
    }
    
    /* Add styles for RTL inputs */
    html[dir="rtl"] & {
      input, select, textarea {
        text-align: right;
      }
    }
  }
  
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .radio-option {
    display: flex;
    flex-direction: column;
    padding: 16px;
    border: 1px solid ${Theme.colors.gray};
    border-radius: ${Theme.borders.radius.md};
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      border-color: ${Theme.colors.secondary};
      background-color: rgba(143, 39, 206, 0.05);
    }
    
    &.selected {
      border-color: ${Theme.colors.secondary};
      background-color: rgba(143, 39, 206, 0.05);
      
      .radio-title {
        color: ${Theme.colors.secondary};
      }
    }
    
    .radio-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      margin-bottom: 8px;
      
      input {
        margin-right: 10px;
      }
      
      /* RTL support */
      html[dir="rtl"] & {
        input {
          margin-right: 0;
          margin-left: 10px;
        }
      }
    }
    
    .radio-description {
      color: ${Theme.colors.gray2};
      font-size: 14px;
      padding-left: 24px;
      
      /* RTL support */
      html[dir="rtl"] & {
        padding-left: 0;
        padding-right: 24px;
      }
    }
    
    .option-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      color: ${Theme.colors.gray};
      font-size: 20px;
      
      /* RTL support */
      html[dir="rtl"] & {
        right: auto;
        left: 16px;
      }
    }
  }
  
  .conditional-fields {
    animation: ${slideInRight} 0.5s ease-out;
    
    &.animating-out {
      animation: ${slideInLeft} 0.3s ease-out reverse;
    }
    
    /* RTL support */
    html[dir="rtl"] & {
      animation: ${slideInRightRTL} 0.5s ease-out;
      
      &.animating-out {
        animation: ${slideInLeftRTL} 0.3s ease-out reverse;
      }
    }
  }
  
  .location-group {
    .city-input-container {
      position: relative;
    }
  }
  
  .chips-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
  }
  
  .chip {
    padding: 8px 16px;
    border-radius: ${Theme.borders.radius.extreme};
    border: 1px solid ${Theme.colors.gray};
    color: ${Theme.colors.gray2};
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    
    &:hover {
      border-color: ${Theme.colors.secondary};
      color: ${Theme.colors.secondary};
    }
    
    &.selected {
      background-color: ${Theme.colors.secondary};
      border-color: ${Theme.colors.secondary};
      color: white;
    }
  }
  
  .terms-checkbox {
    display: flex;
    align-items: flex-start;
    margin-top: 16px;
    
    input {
      margin-right: 10px;
      margin-top: 4px;
    }
    
    label {
      font-size: 14px;
      color: ${Theme.colors.gray2};
      
      a {
        color: ${Theme.colors.secondary};
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    /* RTL support */
    html[dir="rtl"] & {
      input {
        margin-right: 0;
        margin-left: 10px;
      }
    }
  }
  
  .buttons-container {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    
    @media (max-width: 768px) {
      margin-top: 30px;
    }
  }
  
  .error-message {
    color: ${Theme.colors.error};
    font-size: 12px;
    margin-top: 4px;
    animation: ${fadeIn} 0.3s ease-out;
  }
  
  .phone-input-container {
    .react-tel-input {
      .form-control {
        width: 100%;
        height: 48px;
        border: 1px solid ${Theme.colors.gray};
        border-radius: ${Theme.borders.radius.md};
        font-size: 16px;
        transition: all 0.3s ease;
        
        &:focus {
          border-color: ${Theme.colors.secondary};
          box-shadow: 0 0 0 2px rgba(143, 39, 206, 0.2);
        }
      }
      
      .flag-dropdown {
        border-color: ${Theme.colors.gray};
        background-color: white;
        border-radius: ${Theme.borders.radius.md} 0 0 ${Theme.borders.radius.md};
        
        &.open {
          background-color: white;
        }
        
        .selected-flag {
          border-radius: ${Theme.borders.radius.md} 0 0 ${Theme.borders.radius.md};
          
          &:hover, &:focus {
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
      }
      
      /* RTL support */
      html[dir="rtl"] & {
        .flag-dropdown {
          border-radius: 0 ${Theme.borders.radius.md} ${Theme.borders.radius.md} 0;
          
          .selected-flag {
            border-radius: 0 ${Theme.borders.radius.md} ${Theme.borders.radius.md} 0;
          }
        }
        
        .form-control {
          padding-left: 48px;
          padding-right: 16px;
          text-align: right;
        }
      }
    }
  }
  
  .otp-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    
    .otp-input-group {
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
    }
    
    .resend-otp {
      margin-top: 16px;
      text-align: center;
      
      .resend-button {
        background: none;
        border: none;
        color: ${Theme.colors.secondary};
        cursor: pointer;
        font-size: 14px;
        text-decoration: underline;
        
        &:hover {
          color: ${Theme.colors.primary};
        }
      }
      
      .resend-timer {
        color: ${Theme.colors.gray2};
        font-size: 14px;
      }
    }
  }
  
  .verification-message {
    text-align: center;
    margin-bottom: 20px;
    color: ${Theme.colors.gray2};
  }
  
  /* Mobile-specific styles */
  @media (max-width: 768px) {
    .mobile-radio-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .mobile-terms-checkbox {
      margin-top: 20px;
      
      .terms-checkbox {
        margin-top: 0;
      }
    }
    
    .buttons-container {
      button {
        flex: 1;
        padding: 12px;
        border-radius: ${Theme.borders.radius.md};
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &.back-button {
          background-color: white;
          border: 1px solid ${Theme.colors.gray};
          color: ${Theme.colors.gray2};
          margin-right: 12px;
          
          &:hover {
            background-color: ${Theme.colors.gray};
            color: ${Theme.colors.black};
          }
        }
        
        &.next-button {
          background-color: ${Theme.colors.secondary};
          color: white;
          
          &:hover {
            background-color: ${Theme.colors.primary};
          }
          
          &:disabled {
            background-color: ${Theme.colors.gray};
            cursor: not-allowed;
          }
        }
        
        /* RTL support */
        html[dir="rtl"] & {
          &.back-button {
            margin-right: 0;
            margin-left: 12px;
          }
        }
      }
    }
  }
`; 