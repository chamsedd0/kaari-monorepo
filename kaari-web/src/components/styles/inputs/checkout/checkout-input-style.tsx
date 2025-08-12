import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

export const CheckoutInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 100%;

  label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }

  input {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    transition: all 0.3s ease;

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

  .error-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.error};
    margin-top: 4px;
  }
`;

export const CheckoutSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 100%;

  label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }

  select {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    transition: all 0.3s ease;
    appearance: none; 
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239B51E0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 16px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: ${Theme.colors.secondary};
    }

    &:disabled {
      background-color: ${Theme.colors.gray};
      cursor: not-allowed;
    }
  }

  .error-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.error};
    margin-top: 4px;
  }
`;

export const CheckoutDatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 100%;

  label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }

  input[type="date"] {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    transition: all 0.3s ease;
    cursor: pointer;

    &::-webkit-calendar-picker-indicator {
      filter: invert(27%) sepia(51%) saturate(4238%) hue-rotate(270deg) brightness(60%) contrast(97%);
      cursor: pointer;
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

  .error-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.error};
    margin-top: 4px;
  }
`;

export const CheckoutCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  width: 100%;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    border: 1.5px solid ${Theme.colors.tertiary};
    border-radius: 4px;
    appearance: none;
    cursor: pointer;
    margin: 0;
    transition: all 0.2s;
    position: relative;
    
    &:checked {
      background-color: ${Theme.colors.secondary};
      border-color: ${Theme.colors.secondary};
      
      &:after {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        width: 10px;
        height: 10px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(143, 39, 206, 0.2);
    }
  }

  label {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.black};
    cursor: pointer;
  }
`;

export const CheckoutTextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 100%;

  label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }

  textarea {
    width: 100%;
    min-height: 120px;
    padding: 16px 20px;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.md};
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    resize: vertical;
    transition: all 0.3s ease;

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

  .error-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.error};
    margin-top: 4px;
  }
`;

export const CheckoutSummaryCard = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.md};
  border: 1px solid ${Theme.colors.tertiary};
  overflow: hidden;

  .card-header {
    background: linear-gradient(135deg, ${Theme.colors.primary}, ${Theme.colors.secondary});
    color: white;
    padding: 16px 20px;
    
    h3 {
      font: ${Theme.typography.fonts.largeB};
      margin: 0;
    }
  }

  .card-content {
    padding: 24px;
    
    .property-details {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid ${Theme.colors.tertiary};
      
      .property-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
      }
      
      .property-info {
        flex: 1;
        
        .property-title {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin: 0 0 8px 0;
        }
        
        .property-location {
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
          margin: 0 0 8px 0;
        }
        
        .property-date {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.secondary};
          margin: 0;
        }
      }
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .label {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
      }
      
      .value {
        font: ${Theme.typography.fonts.mediumB};
        color: ${Theme.colors.black};
      }
      
      &.total {
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid ${Theme.colors.tertiary};
        
        .label {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
        }
        
        .value {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.secondary};
        }
      }
    }
  }
`;

export const CheckoutButton = styled.button`
  padding: 16px 32px;
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  font: ${Theme.typography.fonts.mediumB};
  cursor: pointer;
  transition: all 0.3s ease;
  width: auto;
  
  &:hover {
    background-color: ${Theme.colors.primary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: ${Theme.colors.gray};
    cursor: not-allowed;
    transform: none;
  }
`; 