import styled, { keyframes } from 'styled-components';
import { Theme } from '../../theme/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const PhotoshootBookingPageStyle = styled.div`
  max-width: 1200px;
  margin: 60px auto;
  padding: 100px 20px 60px;
  
  .back-button-container {
    position: absolute;
    top: 100px;
    left: 20px;
    z-index: 10;
  }
  
  .page-title {
    font: ${Theme.typography.fonts.h2};
    color: ${Theme.colors.black};
    text-align: center;
    margin-bottom: 32px;
  }
  
  .section-title {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};

    margin-bottom: 40px;
    
  }
  
  .form-section {
    margin-bottom: 48px;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .form-row {
    display: flex;
    gap: 20px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .form-group {
    flex: 1;
    margin-bottom: 20px;
    
    label {
      display: block;
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.black};
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      
      .input-icon {
        margin-right: 8px;
        color: ${Theme.colors.primary};
      }
    }
    
    .field-description {
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray2};
      margin-top: 6px;
      margin-bottom: 0;
    }
    
    .address-search-wrapper {
      width: 100%;
    }
    
    .address-search-input {
      width: 100%;
      
      input {
        width: 100%;
        padding: 22px 24px;
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.extreme};
        font: ${Theme.typography.fonts.largeM};
        color: ${Theme.colors.primary};
        background-color: ${Theme.colors.white};
        transition: all 0.3s ease;
        
        &::placeholder {
          color: ${Theme.colors.tertiary};
        }
        
        &:focus {
          outline: none;
          border-color: ${Theme.colors.primary};
        }
      }
    }
  }
  
  /* Map section styles */
  .map-section {
    margin-top: 30px;
    width: 100%;
  }

  .map-title {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
    margin-bottom: 10px;
  }

  .map-description {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    margin-bottom: 20px;
  }

  .search-box-container {
    margin-bottom: 15px;
    width: 100%;
  }

  .search-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 15px;
    color: ${Theme.colors.primary};
    font-size: 16px;
    z-index: 1;
  }

  .map-search-input {
    width: 100%;
    padding: 22px 24px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.largeM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    transition: all 0.3s ease;

    &::placeholder {
      color: ${Theme.colors.tertiary};
    }

    &:focus {
      outline: none;
      border-color: ${Theme.colors.primary};
    }
  }

  .map-container {
    margin: 20px 0;
    width: 100%;
    height: 350px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Improve visibility of Google marker */
    .gm-style-iw + div {
      border: 3px solid ${Theme.colors.primary};
    }
    
    /* Make sure markers are visible */
    .gmnoprint img, .gm-style img {
      max-width: none !important;
      z-index: 1000 !important;
    }
  }

  .map-hint {
    display: flex;
    align-items: center;
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
    margin: 10px 0 20px;

    .map-hint-icon {
      color: ${Theme.colors.primary};
      margin-right: 8px;
      font-size: 14px;
    }
  }

  .map-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 350px;
    border: ${Theme.borders.primary};
    border-radius: 12px;
    background-color: ${Theme.colors.gray}30;

    .spinner {
      animation: ${spin} 1s linear infinite;
      color: ${Theme.colors.primary};
      font-size: 24px;
      margin-bottom: 12px;
    }

    p {
      color: ${Theme.colors.gray2};
      font: ${Theme.typography.fonts.mediumM};
    }
  }
  
  .dropdown-select {
    position: relative;
    cursor: pointer;
    
    select {
      appearance: none;
      cursor: pointer;
      padding-right: 36px;
    }
    
    &:after {
      content: "";
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid ${Theme.colors.primary};
      pointer-events: none;
    }
  }
  
  .appointment-section {
    margin-bottom: 48px;
  }
  
  .date-picker-container {
    display: flex;
    gap: 40px;
    margin-bottom: 20px;
    align-items: flex-start;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .calendar-wrapper {
    flex:1;
    border: ${Theme.borders.primary};
    border-radius: 12px;
    padding: 0;
    background: ${Theme.colors.white};
    overflow: hidden;
  }
  
  .date-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .nav-button {
    background-color: ${Theme.colors.primary}20;
    color: ${Theme.colors.primary};
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${Theme.colors.primary}40;
    }

    &:disabled {
      background-color: ${Theme.colors.gray}30;
      color: ${Theme.colors.gray};
      cursor: not-allowed;
    }
  }
  
  .selected-date {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
    text-align: center;
  }
  
  .time-picker {
    flex: 1;
    
    .time-slots-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      
      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }
    
    .time-slot {
      background-color: ${Theme.colors.secondary};
      color: ${Theme.colors.white};
      font: ${Theme.typography.fonts.mediumB};
      padding: 20px 24px;
      max-height: 60px;
      border-radius: 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: ${Theme.colors.secondary}DD;
        transform: translateY(-2px);
      }
      
      &.selected {
        background-color: ${Theme.colors.secondary}CC;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
    
    .loading-slots {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      
      .spinner {
        animation: ${spin} 1s linear infinite;
        color: ${Theme.colors.primary};
        font-size: 24px;
        margin-bottom: 12px;
      }
      
      p {
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.mediumM};
      }
    }
    
    .no-slots-message {
      border: 1px dashed ${Theme.colors.gray};
      border-radius: 8px;
      padding: 24px;
      margin: 20px 0;
      text-align: center;
      background-color: #f9f9f9;
      
      p {
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.mediumM};
      }
    }
  }
  
  .timezone-selector {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    
    .timezone-icon {
      color: ${Theme.colors.primary};
      display: flex;
      align-items: center;
    }
    
    select {
      border: none;
      color: ${Theme.colors.primary};
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      padding: 4px 24px 4px 8px;
      appearance: none;
      background: transparent;
      
      &:focus {
        outline: none;
      }
    }
    
    .dropdown-wrapper {
      position: relative;
      
      &:after {
        content: "";
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid ${Theme.colors.primary};
        pointer-events: none;
      }
    }
  }
  
  .comments-section {
    margin-bottom: 48px;
  }
  
  .submit-section {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 20px;
  }
  
  /* Make the property-price-label class visible on the map */
  :global(.property-price-label) {
    background-color: white;
    padding: 4px 8px;
    border-radius: 16px;
    border: 1px solid ${Theme.colors.primary};
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
    
    &.selected {
      background-color: ${Theme.colors.primary};
      color: white;
    }
  }

  .contact-section {
    margin-bottom: 48px;
    
    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 10px;
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
      }
      
      .form-group {
        flex: 1;
      }
    }
    
    .field-description {
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray2};
      margin-top: 6px;
      margin-bottom: 0;
    }
  }

  /* Custom fallback marker for maps */
  .custom-map-marker {
    position: absolute;
    width: 30px;
    height: 42px;
    top: 0;
    left: 0;
    transform: translate(-50%, -100%);
    z-index: 10000;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
      background-color: ${Theme.colors.primary};
      border-radius: 50% 50% 0 50%;
      transform: rotate(45deg);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      left: 10px;
      width: 10px;
      height: 10px;
      background-color: white;
      border-radius: 50%;
    }
  }
`;