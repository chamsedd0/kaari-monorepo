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
  // Check if the current language direction is RTL
  const isRTL = document.documentElement.dir === 'rtl';

  return (
    <MobilePhoneInputContainer className={className} isRTL={isRTL}>
      {label && (
        <InputLabel isRTL={isRTL}>
          {label}
          {required && <RequiredAsterisk isRTL={isRTL}>*</RequiredAsterisk>}
        </InputLabel>
      )}
      <InputWrapper hasError={!!error} isRTL={isRTL}>
        <StyledPhoneInput
          country={country}
          value={value}
          onChange={onChange}
          disabled={disabled}
          preferredCountries={preferredCountries}
          inputProps={{
            id,
            required,
            style: isRTL ? { textAlign: 'right', direction: 'rtl' } : {}
          }}
          containerClass={`phone-input-container ${isRTL ? 'rtl-phone-input' : ''}`}
          inputClass="phone-input"
          buttonClass="phone-dropdown-button"
          dropdownClass="phone-dropdown"
          enableSearch={true}
        />
      </InputWrapper>
      {error && <ErrorMessage isRTL={isRTL}>{error}</ErrorMessage>}
    </MobilePhoneInputContainer>
  );
};

const MobilePhoneInputContainer = styled.div<{ isRTL: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const InputLabel = styled.label<{ isRTL: boolean }>`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.black};
  margin-bottom: 8px;
  padding-left: ${props => props.isRTL ? '0' : '5px'};
  padding-right: ${props => props.isRTL ? '5px' : '0'};
  font-size: 14px;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const RequiredAsterisk = styled.span<{ isRTL: boolean }>`
  color: ${Theme.colors.error};
  margin-left: ${props => props.isRTL ? '0' : '2px'};
  margin-right: ${props => props.isRTL ? '2px' : '0'};
`;

const InputWrapper = styled.div<{ hasError: boolean; isRTL: boolean }>`
  width: 100%;
  position: relative;
  border-radius: ${Theme.borders.radius.extreme};
  overflow: hidden;
  transition: all 0.2s ease;
  
  .react-tel-input {
    font-family: inherit !important;
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
    
    .form-control {
      width: 100% !important;
      height: 48px !important;
      font-size: 15px !important;
      border-radius: ${Theme.borders.radius.extreme} !important;
      border: 1.5px solid ${props => props.hasError ? Theme.colors.error : Theme.colors.gray} !important;
      background-color: ${Theme.colors.white} !important;
      padding-left: ${props => props.isRTL ? '12px' : '52px'} !important;
      padding-right: ${props => props.isRTL ? '52px' : '12px'} !important;
      transition: all 0.2s ease;
      text-align: ${props => props.isRTL ? 'right' : 'left'};
      
      &:focus {
        box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(255, 59, 48, 0.15)' : 'rgba(143, 39, 206, 0.15)'} !important;
        border-color: ${props => props.hasError ? Theme.colors.error : Theme.colors.secondary} !important;
      }
    }
    
    .flag-dropdown {
      background-color: ${Theme.colors.white} !important;
      border-radius: ${props => props.isRTL ? 
        `0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} 0` : 
        `${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme}`} !important;
      border: 1.5px solid ${props => props.hasError ? Theme.colors.error : Theme.colors.gray} !important;
      border-left: ${props => props.isRTL ? 'none' : ''} !important;
      border-right: ${props => props.isRTL ? '' : 'none'} !important;
      left: ${props => props.isRTL ? 'auto' : '0'};
      right: ${props => props.isRTL ? '0' : 'auto'};
      
      &.open {
        background-color: ${Theme.colors.white} !important;
        border-radius: ${props => props.isRTL ? 
          `0 ${Theme.borders.radius.extreme} 0 0` : 
          `${Theme.borders.radius.extreme} 0 0 0`} !important;
      }
      
      .selected-flag {
        padding: ${props => props.isRTL ? '0 11px 0 10px' : '0 10px 0 11px'} !important;
        border-radius: ${props => props.isRTL ? 
          `0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} 0` : 
          `${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme}`} !important;
        
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
      text-align: ${props => props.isRTL ? 'right' : 'left'};
      
      .country {
        padding: 10px !important;
        direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
        
        .dial-code {
          direction: ltr; /* Always keep dial codes in LTR */
        }
        
        &:hover {
          background-color: ${Theme.colors.quaternary}10 !important;
        }
        
        &.highlight {
          background-color: ${Theme.colors.quaternary}20 !important;
        }
      }
    }
  }
  
  /* Additional RTL specific overrides */
  .rtl-phone-input {
    .selected-flag {
      .arrow {
        left: auto;
        right: 20px;
      }
    }
  }
`;

const StyledPhoneInput = styled(PhoneInput)`
  width: 100%;
`;

const ErrorMessage = styled.div<{ isRTL: boolean }>`
  color: ${Theme.colors.error};
  font-size: 12px;
  margin-top: 4px;
  padding-left: ${props => props.isRTL ? '0' : '5px'};
  padding-right: ${props => props.isRTL ? '5px' : '0'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

export default MobilePhoneInput; 