import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface MobilePhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  country?: string;
  preferredCountries?: string[];
}

const MobilePhoneInput: React.FC<MobilePhoneInputProps> = ({
  value,
  onChange,
  label,
  error,
  required = false,
  disabled = false,
  className,
  id,
  country = 'fr',
  preferredCountries = ['fr', 'us', 'gb', 'de', 'es', 'it'],
}) => {
  return (
    <MobilePhoneInputContainer className={className}>
      {label && (
        <InputLabel>
          {label}
          {required && <RequiredAsterisk>*</RequiredAsterisk>}
        </InputLabel>
      )}
      <InputWrapper hasError={!!error}>
        <StyledPhoneInput
          country={country}
          value={value}
          onChange={onChange}
          disabled={disabled}
          preferredCountries={preferredCountries}
          inputProps={{
            id,
            required,
          }}
          containerClass="phone-input-container"
          inputClass="phone-input"
          buttonClass="phone-dropdown-button"
          dropdownClass="phone-dropdown"
        />
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </MobilePhoneInputContainer>
  );
};

const MobilePhoneInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.black};
  margin-bottom: 8px;
  padding-left: 5px;
  font-size: 14px;
`;

const RequiredAsterisk = styled.span`
  color: ${Theme.colors.error};
  margin-left: 2px;
`;

const InputWrapper = styled.div<{ hasError: boolean }>`
  width: 100%;
  position: relative;
  border-radius: ${Theme.borders.radius.extreme};
  overflow: hidden;
  transition: all 0.2s ease;
  
  .react-tel-input {
    font-family: inherit !important;
    
    .form-control {
      width: 100% !important;
      height: 48px !important;
      font-size: 15px !important;
      border-radius: ${Theme.borders.radius.extreme} !important;
      border: 1.5px solid ${props => props.hasError ? Theme.colors.error : Theme.colors.gray} !important;
      background-color: ${Theme.colors.white} !important;
      padding-left: 52px !important;
      transition: all 0.2s ease;
      
      &:focus {
        box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(255, 59, 48, 0.15)' : 'rgba(143, 39, 206, 0.15)'} !important;
        border-color: ${props => props.hasError ? Theme.colors.error : Theme.colors.secondary} !important;
      }
    }
    
    .flag-dropdown {
      background-color: ${Theme.colors.white} !important;
      border-radius: ${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme} !important;
      border: 1.5px solid ${props => props.hasError ? Theme.colors.error : Theme.colors.gray} !important;
      border-right: none !important;
      
      &.open {
        background-color: ${Theme.colors.white} !important;
        border-radius: ${Theme.borders.radius.extreme} 0 0 0 !important;
      }
      
      .selected-flag {
        padding: 0 10px 0 11px !important;
        border-radius: ${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme} !important;
        
        &:hover, &:focus {
          background-color: ${Theme.colors.white} !important;
        }
        
        .flag {
          transform: scale(1.1);
        }
      }
    }
    
    .country-list {
      margin: 0 !important;
      border-radius: 0 0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} !important;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15) !important;
      
      .country {
        padding: 10px !important;
        
        &:hover {
          background-color: ${Theme.colors.quaternary}10 !important;
        }
        
        &.highlight {
          background-color: ${Theme.colors.quaternary}20 !important;
        }
      }
    }
  }
`;

const StyledPhoneInput = styled(PhoneInput)`
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: ${Theme.colors.error};
  font-size: 12px;
  margin-top: 4px;
  padding-left: 5px;
`;

export default MobilePhoneInput; 