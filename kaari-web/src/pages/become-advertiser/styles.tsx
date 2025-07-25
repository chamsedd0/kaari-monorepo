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

const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export const AdvertiserRegistrationPageStyle = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
  
  .language-switcher-container {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    display: flex;
    justify-content: center;
    
    @media (max-width: 768px) {
      top: 15px;
      right: 15px;
    }
  }
  
  .page-title {
    font: ${Theme.typography.fonts.h3};
    margin-bottom: 20px;
    margin-top: 0;
    color: ${Theme.colors.primary};
    text-align: center;
    animation: ${fadeIn} 0.6s ease-out;
    
    @media (max-width: 768px) {
      font-size: 24px;
      margin-bottom: 15px;
      margin-top: 0;
    }
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
      left: calc(12.5% + 24px); /* Same as the background line */
      height: 2px;
      background-color: ${Theme.colors.success};
      z-index: 2;
      transition: width 0.5s ease;
    }
    
    /* Set width based on current step */
    &.step-1:before {
      width: 0;
    }
    
    &.step-2:before {
      width: calc(33.33% - 24px);
    }
    
    &.step-3:before {
      width: calc(66.66% - 24px);
    }
    
    &.step-4:before {
      width: calc(100% - 48px - 24px); /* Subtract extra 24px to stop before the last circle */
    }
    
    /* RTL Support for Arabic */
    html[dir="rtl"] & {
      flex-direction: row-reverse;
      
      &:before {
        left: auto;
        right: calc(12.5% + 24px);
        transform-origin: right;
      }
      
      &.step-1:before {
        width: 0;
      }
      
      &.step-2:before {
        width: calc(33.33% - 24px);
      }
      
      &.step-3:before {
        width: calc(66.66% - 24px);
      }
      
      &.step-4:before {
        width: calc(100% - 48px - 24px); /* Subtract extra 24px to stop before the last circle */
      }
    }
    
    .mobile-step-counter {
      width: 100%;
      padding: 0 16px;
      margin-top: 10px;
      margin-bottom: 20px;
      z-index: 2;
    }
    
    @media (max-width: 768px) {
      width: 100%;
      max-width: 400px;
      margin-bottom: 25px;
      
      &:after, &:before {
        display: none; /* Hide the horizontal lines for mobile */
      }
    }
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    width: 25%;
    animation: ${fadeIn} 0.6s ease-out;
    
    .step-number {
      width: 48px;
      height: 48px;
      border-radius: ${Theme.borders.radius.round};
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${Theme.colors.white};
      border: 2px solid ${Theme.colors.gray};
      color: ${Theme.colors.black};
      font: ${Theme.typography.fonts.largeB};
      margin-bottom: 10px;
      transition: all 0.4s ease;
      
      &.active {
        background-color: ${Theme.colors.secondary};
        border-color: ${Theme.colors.secondary};
        color: ${Theme.colors.white};
        transform: scale(1.1);
        box-shadow: 0 0 15px rgba(143, 39, 206, 0.3);
      }
      
      &.completed {
        background-color: ${Theme.colors.success};
        border-color: ${Theme.colors.success};
        color: ${Theme.colors.white};
      }
      
      @media (max-width: 768px) {
        width: 36px;
        height: 36px;
        font-size: 14px;
        margin-bottom: 6px;
      }
    }
    
    .step-label {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.black};
      text-align: center;
      transition: all 0.3s ease;
      
      &.active {
        color: ${Theme.colors.secondary};
        font: ${Theme.typography.fonts.mediumB};
        transform: scale(1.05);
      }
      
      &.completed {
        color: ${Theme.colors.success};
        font: ${Theme.typography.fonts.mediumB};
      }
      
      @media (max-width: 768px) {
        font-size: 11px;
        max-width: 70px;
        line-height: 1.2;
      }
    }
  }
  
  .form-container {
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    padding: 0px;
    width: 900px;
    margin: 0 auto;
    transition: all 0.3s ease;
    animation: ${scaleIn} 0.5s ease-out;
    position: relative;
    
    .step-content {
      animation: ${fadeIn} 0.4s ease-out;
      min-height: 300px;
      width: 100%;
      padding: 20px;
    }
    
    @media (max-width: 768px) {
      width: 100%;
      max-width: 90%;
      border-radius: ${Theme.borders.radius.md};
      padding: 0;
      margin-bottom: 20px;
      box-shadow: none;
      
      .step-content {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: auto;
      }
    }
  }
  
  .form-title {
    font: ${Theme.typography.fonts.h4DB};
    margin-bottom: 30px;
    color: ${Theme.colors.black};
    animation: ${fadeIn} 0.5s ease-out;
    
    @media (max-width: 768px) {
      font-size: 20px;
      margin-bottom: 20px;
      text-align: left;
      padding-left: 5px;
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
    
    /* Add styles for regular input elements */
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="number"],
    textarea,
    select {
      width: 100%;
      height: 65px;
      padding: 0 20px;
      font: ${Theme.typography.fonts.text16};
      color: ${Theme.colors.black};
      border: 1px solid #ccc;
      border-radius: ${Theme.borders.radius.extreme};
      background-color: ${Theme.colors.white};
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: ${Theme.colors.secondary};
        box-shadow: 0 0 0 2px rgba(143, 39, 206, 0.1);
      }
      
      &::placeholder {
        color: ${Theme.colors.gray};
      }
      
      /* RTL support */
      html[dir="rtl"] & {
        text-align: right;
        padding: 0 20px;
      }
    }
    
    textarea {
      padding: 15px 20px;
      min-height: 120px;
      resize: vertical;
      
      /* RTL support */
      html[dir="rtl"] & {
        text-align: right;
      }
    }
    
    .error-message {
      color: ${Theme.colors.error};
      font-size: 12px;
      margin-top: 5px;
      animation: ${fadeIn} 0.3s ease;
      
      /* RTL support */
      html[dir="rtl"] & {
        text-align: right;
      }
    }
    
    @media (max-width: 768px) {
      margin-bottom: 16px;
      
      label {
        font-size: 14px;
        margin-bottom: 8px;
        padding-left: 5px;
        
        /* RTL support */
        html[dir="rtl"] & {
          padding-left: 0;
          padding-right: 5px;
        }
      }
      
      input[type="text"],
      input[type="email"],
      input[type="password"],
      input[type="number"],
      textarea,
      select {
        height: 50px;
        font-size: 14px;
        padding: 0 15px;
      }
      
      textarea {
        padding: 12px 15px;
        min-height: 100px;
      }
    }
  }
  
  .form-step-content {
    padding: 0;
    margin-bottom: 30px;
  }
  
  .input-group {
    display: flex;
    gap: 10px;
    align-items: end;
    width: 100%;
    
    & > div:first-child {
      flex: 1;
    }
    
    &.mobile-input-group {
      margin-bottom: 8px;
    }
    
    &.otp-input-group {
      max-width: 450px;
    }

    @media (max-width: 576px) {
      flex-direction: column;
      align-items: stretch;
    }
  }
  
  /* Custom styles for react-phone-input-2 */
  .react-tel-input {
    font-family: inherit !important;
    
    .form-control {
      width: 100% !important;
      height: 65px !important;
      font-size: 16px !important;
      border-radius: ${Theme.borders.radius.extreme} !important;
      border: 1px solid #ccc !important;
      background-color: ${Theme.colors.white} !important;
      padding-left: 60px !important;
    }
    
    .flag-dropdown {
      background-color: #f8f8f8 !important;
      border-radius: ${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme} !important;
      border: 1px solid #ccc !important;
      border-right: none !important;
      
      &.open {
        background-color: #f0f0f0 !important;
        border-radius: ${Theme.borders.radius.extreme} 0 0 0 !important;
      }
      
      .selected-flag {
        padding: 0 16px 0 11px !important;
        border-radius: ${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme} !important;
        
        &:hover, &:focus {
          background-color: #f0f0f0 !important;
        }
        
        .flag {
          transform: scale(1.2);
        }
      }
    }
    
    .country-list {
      margin: 0 !important;
      border-radius: 0 0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} !important;
      max-height: 250px !important;
      
      .country {
        padding: 10px 9px !important;
        
        &.highlight, &:hover {
          background-color: rgba(143, 39, 206, 0.1) !important;
        }
        
        &.highlight {
          .dial-code {
            color: ${Theme.colors.secondary} !important;
          }
        }
      }
    }
    
    /* RTL specific styles */
    &.rtl-phone-container {
      direction: rtl;
      
      .form-control {
        text-align: right;
        padding-left: 12px !important;
        padding-right: 60px !important;
      }
      
      .flag-dropdown {
        left: auto !important;
        right: 0 !important;
        border-radius: 0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} 0 !important;
        border-left: none !important;
        border-right: 1px solid #ccc !important;
        
        &.open {
          border-radius: 0 ${Theme.borders.radius.extreme} 0 0 !important;
        }
        
        .selected-flag {
          padding: 0 11px 0 16px !important;
          border-radius: 0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} 0 !important;
          
          .arrow {
            left: 5px;
            right: auto;
          }
        }
      }
      
      .country-list {
        right: 0;
        left: auto;
        text-align: right;
        
        .search-box {
          text-align: right;
          direction: rtl;
        }
        
        .country {
          direction: rtl;
          
          .country-name {
            margin-right: 6px;
            margin-left: 0;
          }
          
          .dial-code {
            margin-right: auto;
            margin-left: 6px;
          }
        }
      }
    }
  }
  
  /* Phone input custom classes */
  .phone-input-container {
    width: 100% !important;
  }
  
  .phone-input {
    width: 100% !important;
    height: 65px !important;
    font-size: 16px !important;
    border-radius: ${Theme.borders.radius.extreme} !important;
    border: 1px solid #ccc !important;
    background-color: ${Theme.colors.white} !important;
    padding-left: 60px !important;
    font: ${Theme.typography.fonts.text16} !important;
    color: ${Theme.colors.black} !important;
    
    &:focus {
      border-color: ${Theme.colors.secondary} !important;
      box-shadow: 0 0 0 2px rgba(143, 39, 206, 0.1) !important;
    }
  }
  
  .phone-dropdown-button {
    background-color: #f8f8f8 !important;
    border-radius: ${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme} !important;
    border: 1px solid #ccc !important;
    border-right: none !important;
    
    &:hover, &:focus {
      background-color: #f0f0f0 !important;
    }
  }

  .send-otp-button {
    padding: 0 20px;
    border-radius: ${Theme.borders.radius.extreme};
    height: 65px;
    border: none;
    background-color: ${Theme.colors.secondary};
    color: white;
    font: ${Theme.typography.fonts.mediumB};
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 160px;
    
    &:hover {
      background-color: ${Theme.colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    
    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    @media (max-width: 576px) {
      width: 100%;
      min-width: unset;
    }
  }
  
  .location-input-wrapper {
    position: relative;
    width: 100%;
    
    .city-icon {
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      color: #767676;
      pointer-events: none;
      z-index: 1;
      margin-top: -1px;
    }
  }
  
  .location-group {
    margin-top: 32px;
  }
  
  .otp-group {
    margin-top: 0;
    padding-top: 0;
  }
  
  .otp-verification-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 30px;
    max-width: 500px;
    margin: 20px auto;
    text-align: center;
    background-color: #f9f9f9;
    border-radius: ${Theme.borders.radius.md};
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(143, 39, 206, 0.1);

    @media (max-width: 768px) {
      padding: 20px 15px;
      max-width: 100%;
      margin: 10px auto;
      
      .otp-title {
        font-size: 16px;
        margin-bottom: 8px;
      }
      
      .otp-subtitle {
        font-size: 13px;
        margin-bottom: 15px;
      }
      
      .verify-button {
        padding: 10px 30px;
        font-size: 14px;
      }
      
      .otp-resend {
        font-size: 12px;
      }
    }
  }
  
  .otp-title {
    font: ${Theme.typography.fonts.h4DB};
    color: ${Theme.colors.black};
    margin-bottom: 10px;
  }
  
  .otp-subtitle {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    margin-bottom: 20px;
  }
  
  .otp-resend {
    margin-top: 20px;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};

    .resend-link {
      background: none;
      border: none;
      color: ${Theme.colors.secondary};
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      padding: 0;
      margin-left: 5px;
      text-decoration: underline;
      transition: color 0.3s ease;

      &:hover {
        color: ${Theme.colors.primary};
      }

      &:disabled {
        color: ${Theme.colors.gray};
        cursor: not-allowed;
        text-decoration: none;
      }
    }
  }
  
  .verify-button {
    padding: 12px 40px;
    border-radius: 100px;
    border: none;
    background-color: ${Theme.colors.secondary};
    color: white;
    font: ${Theme.typography.fonts.mediumB};
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 15px;
    
    &:hover {
      background-color: ${Theme.colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    
    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
  
  .otp-help-text {
    font-size: 14px;
    color: ${Theme.colors.gray2};
    margin-top: 8px;
    
    .demo-note {
      margin-top: 4px;
      font-size: 12px;
      opacity: 0.8;
    }
  }
  
  .verified-badge {
    display: flex;
    align-items: center;
    color: ${Theme.colors.success};
    gap: 8px;
    font: ${Theme.typography.fonts.mediumB};
    margin-top: 8px;
    margin-bottom: 15px;
    animation: ${fadeIn} 0.5s ease-out;
  }
  
  .form-section {
    background-color: #fafafa;
    border-radius: ${Theme.borders.radius.md};
    padding: 24px;
    margin-bottom: 30px;
    animation: ${fadeIn} 0.5s ease-out;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    
    .section-title {
      display: flex;
      align-items: center;
      font: ${Theme.typography.fonts.largeB};
      margin-bottom: 20px;
      color: ${Theme.colors.secondary};
      
      .section-icon {
        margin-right: 10px;
        font-size: 18px;
      }
    }

    @media (max-width: 576px) {
      padding: 20px 15px;
    }
  }
  
  .radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
    
    @media (max-width: 768px) {
      gap: 12px;
      margin-bottom: 20px;
    }
    
    /* Card-like effect with modern styling */
    .radio-option {
      flex: 1;
      min-width: 220px;
      border: 2px solid ${Theme.colors.gray};
      border-radius: ${Theme.borders.radius.md};
      padding: 25px 70px 25px 25px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      position: relative;
      background: linear-gradient(to bottom right, ${Theme.colors.white}, #fafafa);
      overflow: hidden;
      
      /* Improve spacing and ensure consistent height */
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 130px;
      
      /* Add subtle inner shadow for depth */
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
      
      /* Make sure radio inputs align properly */
      input[type="radio"] {
        flex-shrink: 0;
      }
      
      .option-icon {
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 32px;
        color: ${Theme.colors.gray};
        opacity: 0.4;
        transition: all 0.4s ease;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
      
      .radio-title {
        font: ${Theme.typography.fonts.largeB};
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        transition: color 0.3s ease;
        
        input[type="radio"] {
          appearance: none;
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border: 2px solid ${Theme.colors.gray};
          border-radius: 50%;
          margin-right: 12px;
          margin-left: 12px;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
          background-color: white;
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(143, 39, 206, 0.2);
          }
          
          &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: white;
            transition: transform 0.3s ease;
          }
          
          &:checked {
            background-color: ${Theme.colors.secondary};
            border-color: ${Theme.colors.secondary};
            
            &:after {
              transform: translate(-50%, -50%) scale(1);
            }
          }
        }
        
        span {
          font: ${Theme.typography.fonts.largeB};
          transition: all 0.3s ease;
        }
      }
      
      .radio-description {
        font: ${Theme.typography.fonts.text14};
        color: ${Theme.colors.gray2};
        margin-left: 24px;
        opacity: 0.8;
        transition: all 0.3s ease;
        position: relative;
        padding-bottom: 8px;
        padding-right: 15px;
        
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: ${Theme.colors.secondary};
          transition: width 0.3s ease;
          opacity: 0.5;
        }
      }
      
      &.selected:after {
        opacity: 0.5;
      }
      
      &:hover {
        border-color: ${Theme.colors.secondary};
        background: linear-gradient(to bottom, rgba(143, 39, 206, 0.03), rgba(143, 39, 206, 0.06));
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
        
        &:before {
          width: 100%;
        }
        
        .radio-title span {
          color: ${Theme.colors.secondary};
        }
        
        .option-icon {
          transform: translateY(-50%) scale(1.2) rotate(5deg);
          opacity: 0.7;
          color: ${Theme.colors.secondary};
        }
      }
      
      &.selected {
        border-color: ${Theme.colors.secondary};
        background: linear-gradient(to bottom, rgba(143, 39, 206, 0.05), rgba(143, 39, 206, 0.1));
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(143, 39, 206, 0.15),
                    0 0 15px rgba(143, 39, 206, 0.1);
        
        &:before {
          width: 100%;
        }
        
        .radio-title {
          color: ${Theme.colors.secondary};
          
          input[type="radio"] {
            background-color: ${Theme.colors.secondary};
            border-color: ${Theme.colors.secondary};
            
            &:after {
              transform: translate(-50%, -50%) scale(1);
            }
          }
        }
        
        .option-icon {
          transform: translateY(-50%) scale(1.3);
          opacity: 1;
          color: ${Theme.colors.secondary};
        }
        
        .radio-description {
          opacity: 1;
          
          &:after {
            width: 40px;
            opacity: 0.8;
          }
        }
      }

      @media (max-width: 768px) {
        min-width: 100%;
        padding: 15px 50px 15px 15px;
        min-height: auto;
        border-width: 1px;
        margin-bottom: 0;
        
        .option-icon {
          right: 15px;
          font-size: 20px;
        }
        
        .radio-title {
          margin-bottom: 3px;
          
          input[type="radio"] {
            width: 10px;
            height: 10px;
            margin-right: 8px;
            border-width: 1px;
            
            &:after {
              width: 4px;
              height: 4px;
            }
          }
          
          span {
            font-size: 14px;
          }
        }
        
        .radio-description {
          font-size: 12px;
          margin-left: 18px;
          padding-bottom: 4px;
        }
        
        &.selected {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(143, 39, 206, 0.15);
        }
      }
    }
  }
  
  .chips-container {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    justify-content: start;
    gap: 12px;
    margin-top: 10px;
    
    .chip {
      padding: 10px 16px;
      border-radius: ${Theme.borders.radius.extreme};
      border: 1px solid ${Theme.colors.gray};
      background-color: ${Theme.colors.white};
      color: ${Theme.colors.gray2};
      font: ${Theme.typography.fonts.mediumM};
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: ${Theme.colors.secondary};
        color: ${Theme.colors.secondary};
        background-color: rgba(143, 39, 206, 0.05);
        transform: translateY(-2px);
      }
      
      &.selected {
        background-color: ${Theme.colors.secondary};
        color: ${Theme.colors.white};
        border-color: ${Theme.colors.secondary};
        box-shadow: 0 4px 8px rgba(143, 39, 206, 0.2);
      }
    }
    
    @media (max-width: 768px) {
      gap: 8px;
      justify-content: center;
      
      .chip {
        padding: 8px 12px;
        font-size: 12px;
        margin: 4px;
      }
    }
  }
  
  .conditional-fields {
    margin-top: 15px;
    padding-bottom: 10px;
    animation: ${fadeIn} 0.3s ease;
    transition: all 0.3s ease;
    max-height: 1000px; /* Large enough to contain content */
    opacity: 1;
    transform-origin: top;
    
    &.animating-out {
      max-height: 0;
      opacity: 0;
      margin-top: 0;
      padding-top: 0;
      padding-bottom: 0;
      transform: translateY(-10px);
    }
  }
  
  .form-row {
    display: flex;
    gap: 20px;
    
    .form-group {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 15px;
    }
  }
  
  .buttons-container {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    animation: ${fadeIn} 0.5s ease-out;
    
    button {
      min-width: 150px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      &:last-child {
        margin-left: auto;
        max-width: 200px;
      }
    }
    
    /* RTL support */
    html[dir="rtl"] & {
      flex-direction: row-reverse;
      
      button {
        &:last-child {
          margin-left: 0;
          margin-right: auto;
        }
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 12px;
      margin-top: 25px;
      
      button {
        width: 100%;
        margin: 0 !important;
        max-width: 100% !important;
        height: 46px !important;
        min-height: 46px !important;
        font-size: 14px !important;
        border-radius: 100px !important;
      }
      
      /* RTL support */
      html[dir="rtl"] & {
        flex-direction: column;
      }
    }
  }
  
  /* Override for PurpleButtonLB60 and WhiteButtonLB60 to ensure consistent height */
  .purple-button-lb60, .white-button-lb60 {
    display: flex;
    align-items: center;
    justify-content: center;
    
  }
  
  .terms-checkbox {
    display: flex;
    align-items: start;
    justify-content: start;
    margin-top: 30px;
    position: relative;
    
    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    label {
      font: ${Theme.typography.fonts.text14};
      cursor: pointer;
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 40px;
      line-height: 1.4;
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 18px;
        height: 18px;
        border: 1px solid ${Theme.colors.gray};
        background-color: white;
        border-radius: 2px;
        transition: all 0.2s ease;
      }
      
      &:after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        opacity: 0;
        transition: all 0.2s ease;
      }
      
      b {
        color: ${Theme.colors.secondary};
        text-decoration: none;
        font-weight: 600;
        margin: 0 1px;
        position: relative;
        transition: all 0.2s ease;
        
        &:hover {
          color: ${Theme.colors.primary};
        }
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: ${Theme.colors.secondary};
          transition: all 0.2s ease;
        }
        
        &:hover:after {
          background-color: ${Theme.colors.primary};
        }
      }
    }
    
    input:checked + label:before {
      background-color: ${Theme.colors.secondary};
      border-color: ${Theme.colors.secondary};
    }
    
    input:checked + label:after {
      opacity: 1;
    }
    
    input:focus + label:before {
      box-shadow: 0 0 0 3px rgba(143, 39, 206, 0.2);
    }
    
    &:hover label:before {
      border-color: ${Theme.colors.secondary};
    }
    
    @media (max-width: 768px) {
      margin-top: 20px;
      width: 100%;
      max-width: 280px;
      
      label {
        font-size: 12px;
        padding-left: 24px;
        line-height: 1.5;
        display: inline-block;
        
        &:before {
          width: 16px;
          height: 16px;
          top: 1px;
        }
        
        &:after {
          left: 5px;
          top: 3px;
          width: 3px;
          height: 7px;
        }
        
        a {
          display: inline-block;
          margin: 0 2px;
        }
      }
    }
  }
  
  .error-message {
    color: ${Theme.colors.error};
    font: ${Theme.typography.fonts.text14};
    animation: ${fadeIn} 0.3s ease-out;
    margin-top: 8px;
  }
  
  .phone-error {
    color: ${Theme.colors.error};
    font: ${Theme.typography.fonts.text14};
    margin-top: 8px;
    padding-left: 5px;
  }
  
  .separator {
    position: relative;
    text-align: center;
    margin: 25px 0;
    
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: ${Theme.colors.gray};
    }
    
    span {
      position: relative;
      background-color: ${Theme.colors.white};
      padding: 0 15px;
      color: ${Theme.colors.gray};
      font: ${Theme.typography.fonts.mediumM};
    }
  }
  
  .form-control {
    width: 100%;
    padding: 12px 16px;
    font: ${Theme.typography.fonts.text16};
    border: 1px solid ${Theme.colors.gray};
    border-radius: ${Theme.borders.radius.md};
    outline: none;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: ${Theme.colors.secondary};
    }
  }
  
  /* Mobile-specific styles */
  .mobile-radio-group {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 10px 15px 40px;
    margin-top: 40px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .form-container {
      padding: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .step-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .form-group {
      width: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      label {
        align-self: flex-start;
        max-width: 280px;
        width: 100%;
        
        /* RTL support for mobile */
        html[dir="rtl"] & {
          text-align: right;
        }
      }
      
      .error-message {
        align-self: flex-start;
        max-width: 280px;
        width: 100%;
        color: ${Theme.colors.error};
        font-size: 12px;
        margin-top: 5px;
        
        /* RTL support for mobile */
        html[dir="rtl"] & {
          text-align: right;
          align-self: flex-start;
        }
      }
    }
    
    .form-title {
      width: 100%;
      max-width: 280px;
      text-align: left;
      
      /* RTL support for mobile */
      html[dir="rtl"] & {
        text-align: right;
      }
    }
    
    .buttons-container {
      width: 100%;
      max-width: 280px;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      
      /* RTL support for mobile */
      html[dir="rtl"] & {
        flex-direction: row-reverse;
      }
    }
    
    .mobile-radio-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    
    .radio-option {
      max-width: 280px;
      width: 100%;
    }
    
    .chips-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 280px;
      
      .chip {
        margin: 5px;
      }
    }
    
    .terms-checkbox {
      max-width: 280px;
      width: 100%;
      display: flex;
      align-items: flex-start;
      
      input {
        margin-top: 3px;
        width: 14px;
        height: 14px;
        min-width: 14px;
      }
      
      label {
        font-size: 13px;
        margin-left: 8px;
        
        /* RTL support for mobile */
        html[dir="rtl"] & {
          margin-left: 0;
          margin-right: 8px;
          text-align: right;
        }
      }
    }
    
    .steps-container {
      margin-bottom: 25px;
      width: 100%;
      max-width: 90%;
      justify-content: center;
      
      .step {
        .step-number {
          width: 36px;
          height: 36px;
          
          &.active {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(143, 39, 206, 0.2);
          }
        }
      }
    }
    
    .mobile-step-counter {
      width: 100%;
      padding: 0;
      margin-bottom: 16px;
    }
    
    .buttons-container {
      width: 100%;
      max-width: 280px;
      margin: 20px auto 0;
      
      .back-button, .next-button {
        padding: 10px 20px;
        font-size: 14px;
      }
    }
    
    .verification-message {
      font-size: 13px;
      margin-bottom: 16px;
      
      /* RTL support for mobile */
      html[dir="rtl"] & {
        text-align: right;
      }
    }
    
    .resend-otp {
      font-size: 13px;
      margin-top: 12px;
    }
  }

  @media (max-width: 576px) {
    padding: 20px 10px 40px;
    
    .steps-container {
      &:after {
        top: 20px;
      }
    }
    
    .step .step-number {
      width: 36px;
      height: 36px;
      font-size: 12px;
    }
    
    .step .step-label {
      font-size: 10px;
    }
    
    .form-title {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }

  @media (max-width: 480px) {
    .steps-container {
      &:after {
        display: none;
      }
    }
  }

  .mobile-otp-input {
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }

  .verification-message {
    text-align: center;
    margin-bottom: 20px;
    font-size: 14px;
    color: ${Theme.colors.gray2};
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
  }

  .resend-otp {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    font-size: 14px;
    
    .resend-button {
      background: none;
      border: none;
      color: ${Theme.colors.secondary};
      font-weight: 500;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }
    
    .resend-timer {
      color: ${Theme.colors.gray2};
    }
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    
    .back-button, .next-button {
      padding: 12px 24px;
      border-radius: ${Theme.borders.radius.extreme};
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .back-button {
      background-color: white;
      color: ${Theme.colors.secondary};
      border: 1px solid ${Theme.colors.secondary};
      
      &:hover {
        background-color: ${Theme.colors.quaternary}10;
      }
    }
    
    .next-button {
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      
      &:hover {
        background-color: ${Theme.colors.quaternary};
      }
    }
  }

  .mobile-terms-checkbox {
    width: 100%;
    max-width: 280px;
    margin: 20px auto;
    
    .terms-checkbox {
      width: 100%;
      margin-top: 10px;
      
      label {
        font-size: 12px;
        line-height: 1.5;
        
        a {
          color: ${Theme.colors.secondary};
          text-decoration: none;
          font-weight: 500;
          position: relative;
          display: inline-block;
          border-bottom: 1px solid ${Theme.colors.secondary};
          padding-bottom: 0;
          margin-bottom: 0;
          margin: 0 2px;
          
          &:after {
            display: none;
          }
        }
      }
    }
    
    .error-message {
      text-align: center;
      margin-top: 8px;
      font-size: 11px;
    }
  }
`; 