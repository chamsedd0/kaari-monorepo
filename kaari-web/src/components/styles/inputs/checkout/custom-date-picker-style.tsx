import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

export const CustomDatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  
  label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }
  
  .date-input-container {
    position: relative;
    width: 100%;
  }
  
  input {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
    
    &::placeholder {
      color: ${Theme.colors.tertiary};
    }
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.secondary};
    }
    
    &:disabled {
      background-color: ${Theme.colors.gray};
      cursor: not-allowed;
    }
  }
  
  .chevron-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: ${Theme.colors.secondary};
  }
  
  .error-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.error};
    margin-top: 4px;
  }
`;

export const CustomSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  
  label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }
  
  .select-wrapper {
    position: relative;
    width: 100%;
  }
  
  select {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.secondary};
    }
    
    &:disabled {
      background-color: ${Theme.colors.gray};
      cursor: not-allowed;
    }
  }
  
  .chevron-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: ${Theme.colors.secondary};
  }
  
  .error-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.error};
    margin-top: 4px;
  }
`; 