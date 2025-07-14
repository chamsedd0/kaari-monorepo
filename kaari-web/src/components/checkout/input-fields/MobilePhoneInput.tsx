import React, { useEffect } from 'react';
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

  // Add a specific style for RTL mode to the document head
  useEffect(() => {
    if (isRTL) {
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        .rtl-phone-input .react-tel-input {
          direction: rtl !important;
        }
        .rtl-phone-input .react-tel-input .form-control {
          direction: ltr !important;
          text-align: right !important;
          padding-left: 12px !important;
          padding-right: 52px !important;
        }
        .rtl-phone-input .react-tel-input .flag-dropdown {
          left: auto !important;
          right: 0 !important;
        }
      `;
      styleEl.id = 'rtl-phone-input-style';
      
      if (!document.getElementById('rtl-phone-input-style')) {
        document.head.appendChild(styleEl);
      }
      
      return () => {
        const existingStyle = document.getElementById('rtl-phone-input-style');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [isRTL]);

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
          enableSearch={true}
          inputProps={{
            id,
            required,
            style: {
              // In RTL mode, align text right but keep direction LTR for phone numbers
              textAlign: isRTL ? 'right' : 'left',
              direction: 'ltr', // Always LTR for phone numbers
              paddingLeft: isRTL ? '12px' : '52px',
              paddingRight: isRTL ? '52px' : '12px'
            }
          }}
          containerClass={`phone-input-container ${isRTL ? 'rtl-phone-input' : ''}`}
          inputClass={`phone-input ${isRTL ? 'rtl-input' : ''}`}
          buttonClass={`phone-dropdown-button ${isRTL ? 'rtl-button' : ''}`}
          dropdownClass={`phone-dropdown ${isRTL ? 'rtl-dropdown' : ''}`}
          searchClass={`search-box ${isRTL ? 'rtl-search' : ''}`}
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
      transition: all 0.2s ease;
      /* Always use LTR for phone numbers to prevent reversal */
      direction: ltr !important;
      
      &:focus {
        box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(255, 59, 48, 0.15)' : 'rgba(143, 39, 206, 0.15)'} !important;
        border-color: ${props => props.hasError ? Theme.colors.error : Theme.colors.secondary} !important;
      }
      
      &.rtl-input {
        text-align: right;
      }
    }
    
    .flag-dropdown {
      background-color: ${Theme.colors.white} !important;
      border-radius: ${props => props.isRTL ? 
        `0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} 0` : 
        `${Theme.borders.radius.extreme} 0 0 ${Theme.borders.radius.extreme}`} !important;
      border: 1.5px solid ${props => props.hasError ? Theme.colors.error : Theme.colors.gray} !important;
      
      ${props => props.isRTL ? `
        border-left: none !important;
        border-right: 1.5px solid ${props.hasError ? Theme.colors.error : Theme.colors.gray} !important;
        left: auto !important;
        right: 0 !important;
      ` : `
      border-right: none !important;
        border-left: 1.5px solid ${props.hasError ? Theme.colors.error : Theme.colors.gray} !important;
        right: auto !important;
        left: 0 !important;
      `}
      
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
        
        .arrow {
          ${props => props.isRTL ? `
            left: -15px !important;
            right: auto !important;
          ` : ''}
        }
      }
    }
    
    .country-list {
      margin: 0 !important;
      border-radius: 0 0 ${Theme.borders.radius.extreme} ${Theme.borders.radius.extreme} !important;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15) !important;
      text-align: ${props => props.isRTL ? 'right' : 'left'};
      
      ${props => props.isRTL ? `
        right: 0 !important;
        left: auto !important;
      ` : ''}
      
      .search-box {
        margin: 0 auto !important;
        margin-top: 10px !important;
        margin-bottom: 10px !important;
        width: 90% !important;
        
        &.rtl-search {
          text-align: right;
          /* Keep input LTR for search box */
          input {
            direction: ltr !important;
            text-align: right;
          }
        }
      }
      
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
        
        ${props => props.isRTL ? `
          .country-name {
            margin-right: 6px;
            margin-left: 0;
          }
          
          .dial-code {
            margin-right: auto;
            margin-left: 6px;
          }
        ` : ''}
      }
    }
  }
  
  /* Additional RTL specific overrides */
  .rtl-phone-input {
    /* Reverse the component layout for RTL but keep input LTR */
    display: flex !important;
    flex-direction: row-reverse !important;
    
    .flag-dropdown {
      left: auto !important;
      right: 0 !important;
    }
    
    .form-control {
      text-align: right !important;
      padding-left: 12px !important;
      padding-right: 52px !important;
      direction: ltr !important; /* Critical: keep numbers LTR */
    }
    
    .selected-flag {
      .arrow {
        left: -15px !important;
        right: auto !important;
      }
    }
    
    .country-list {
      right: 0 !important;
      left: auto !important;
      
      .country {
        padding-right: 9px !important;
        padding-left: 9px !important;
        
        .country-name {
          margin-right: 6px;
          margin-left: 0;
        }
        
        .dial-code {
          margin-right: auto;
          margin-left: 6px;
          direction: ltr !important; /* Always LTR for dial codes */
        }
      }
    }
    
    /* Force LTR for input to prevent number reversal */
    input.form-control {
      direction: ltr !important;
      unicode-bidi: isolate !important;
    }
  }
`;

const StyledPhoneInput = styled(PhoneInput)`
  width: 100%;
  
  /* Additional styles for RTL layout */
  &.rtl-phone-input {
    .react-tel-input {
      display: flex !important;
      flex-direction: row-reverse !important;
      
      .flag-dropdown {
        left: auto !important;
        right: 0 !important;
      }
      
      .form-control {
        text-align: right !important;
        padding-left: 12px !important;
        padding-right: 52px !important;
        direction: ltr !important; /* Critical: keep numbers LTR */
      }
      
      .country-list {
        right: 0 !important;
        left: auto !important;
        
        .search-box {
          input {
            direction: ltr !important;
            text-align: right !important;
          }
        }
      }
    }
  }
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