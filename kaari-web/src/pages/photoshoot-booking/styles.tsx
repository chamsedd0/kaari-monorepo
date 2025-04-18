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
    }

  }
  
  .map-container {
    margin: 20px 0;
    width: 100%;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
        box-shadow: none;
      }
    }
    
    .dropdown-wrapper {
      position: relative;
      
      &:after {
        content: "";
        position: absolute;
        right: 8px;
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
  
  .required-fields-note {
    text-align: center;
    color: ${Theme.colors.gray2};
    font: ${Theme.typography.fonts.text14};
    margin-top: 20px;
  }
  
  .nav-controls {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 12px;
    
    button {
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.white};
      background: ${Theme.colors.primary};
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: ${Theme.colors.primary}DD;
      }
      
      &.back-button {
        background: transparent;
        color: ${Theme.colors.primary};
        border: 1px solid ${Theme.colors.primary};
        
        &:hover {
          background: ${Theme.colors.primary}10;
        }
      }
    }
  }
  
  .submit-button-container {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    margin-top: 40px;
    max-width: 260px;
  }
  
  .book-button {
    background-color: ${Theme.colors.primary};
    color: ${Theme.colors.white};
    font: ${Theme.typography.fonts.mediumB};
    padding: 14px 32px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${Theme.colors.primary}DD;
      transform: translateY(-2px);
    }
  }
  
  /* Modal styles */
  .success-modal, .error-modal {
    padding: 20px;
    text-align: center;
    
    p {
      font: ${Theme.typography.fonts.text16};
      margin-bottom: 16px;
      color: ${Theme.colors.black};
    }
    
    .booking-id {
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.primary};
      background-color: ${Theme.colors.primary}10;
      padding: 12px;
      border-radius: 8px;
      margin: 16px 0;
    }
    
    .auth-note {
      font: ${Theme.typography.fonts.text14};
      color: #FF9800;
      background-color: #FFF8E1;
      padding: 10px;
      border-radius: 6px;
      margin: 10px 0;
      border-left: 3px solid #FF9800;
    }
    
    .close-btn {
      background-color: ${Theme.colors.primary};
      color: ${Theme.colors.white};
      font: ${Theme.typography.fonts.mediumB};
      padding: 12px 32px;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 16px;
      
      &:hover {
        background-color: ${Theme.colors.primary}DD;
        transform: translateY(-2px);
      }
    }
  }
  
  .error-modal {
    p {
      &:first-child {
        color: #e53935;
        font: ${Theme.typography.fonts.mediumB};
      }
    }
  }
`;
6