import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

interface MobileOtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  isNumberInput?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
}

const MobileOtpInput: React.FC<MobileOtpInputProps> = ({
  length = 6,
  value = '',
  onChange,
  autoFocus = true,
  isNumberInput = true,
  disabled = false,
  placeholder = '',
  label,
  error,
}) => {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Split the value into an array
  const getOtpValue = () => {
    const valueArray = value.split('');
    const items: Array<string> = [];

    for (let i = 0; i < length; i++) {
      const char = valueArray[i] || '';
      items.push(char);
    }

    return items;
  };

  // Focus on a specific input field
  const focusInput = (inputIndex: number) => {
    const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
    inputRefs.current[selectedIndex]?.focus();
    setActiveInput(selectedIndex);
  };

  // Focus on the next input field
  const focusNextInput = () => {
    focusInput(activeInput + 1);
  };

  // Focus on the previous input field
  const focusPrevInput = () => {
    focusInput(activeInput - 1);
  };

  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (value[activeInput]) {
          // If current input has a value, clear it
          const newValue = value.substring(0, activeInput) + '' + value.substring(activeInput + 1);
          onChange(newValue);
        } else {
          // Otherwise focus on the previous input
          focusPrevInput();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusPrevInput();
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusNextInput();
        break;
      case 'Delete':
        e.preventDefault();
        const newValue = value.substring(0, activeInput) + '' + value.substring(activeInput + 1);
        onChange(newValue);
        break;
      default:
        break;
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Don't allow non-numeric inputs if isNumberInput is true
    if (isNumberInput && isNaN(Number(val))) {
      return;
    }

    // Take only the last character if multiple characters are pasted
    const lastChar = val.charAt(val.length - 1);
    
    // Update the value
    const newValue = value.substring(0, activeInput) + lastChar + value.substring(activeInput + 1);
    onChange(newValue);
    
    // Move to next input if a value was entered
    if (lastChar) {
      focusNextInput();
    }
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only process if the pasted data is valid
    if (isNumberInput && isNaN(Number(pastedData))) {
      return;
    }
    
    // Take only the first 'length' characters
    const pastedText = isNumberInput
      ? pastedData.replace(/[^0-9]/g, '').substring(0, length)
      : pastedData.substring(0, length);
    
    // Pad with empty strings if shorter than length
    const newValue = pastedText.padEnd(length, '');
    
    // Update the entire value at once
    onChange(pastedText);
    
    // Focus on the next empty input or the last input
    const nextInputIndex = Math.min(pastedText.length, length - 1);
    focusInput(nextInputIndex);
  };

  // Handle click events
  const handleClick = (inputIndex: number) => {
    setActiveInput(inputIndex);
    inputRefs.current[inputIndex]?.select();
  };

  // Handle focus events
  const handleFocus = (inputIndex: number) => {
    setActiveInput(inputIndex);
  };

  // Auto-focus on the first input when the component mounts
  useEffect(() => {
    if (autoFocus && !disabled) {
      focusInput(0);
    }
  }, [autoFocus, disabled]);

  // Focus on the next empty input when the value changes
  useEffect(() => {
    const valueArray = getOtpValue();
    const emptyInputIndex = valueArray.findIndex(val => val === '');
    
    if (emptyInputIndex !== -1) {
      focusInput(emptyInputIndex);
    } else {
      focusInput(length - 1);
    }
  }, [value]);

  // Set a default value of "000000" when in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !value) {
      onChange('000000');
    }
  }, []);

  return (
    <MobileOtpContainer>
      {label && (
        <InputLabel>
          {label}
        </InputLabel>
      )}
      <OtpContainer>
        {Array.from({ length }, (_, index) => {
          const digit = getOtpValue()[index] || '';
          return (
            <OtpDigit
              key={index}
              type={isNumberInput ? 'tel' : 'text'}
              maxLength={1}
              ref={el => (inputRefs.current[index] = el)}
              value={digit}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onClick={() => handleClick(index)}
              onFocus={() => handleFocus(index)}
              disabled={disabled}
              placeholder={placeholder}
              autoComplete="off"
              aria-label={`digit ${index + 1}`}
              hasError={!!error}
            />
          );
        })}
      </OtpContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </MobileOtpContainer>
  );
};

const MobileOtpContainer = styled.div`
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

const OtpContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const OtpDigit = styled.input<{ hasError?: boolean }>`
  width: 36px;
  height: 46px;
  border: 1.5px solid ${props => props.hasError ? Theme.colors.error : Theme.colors.gray};
  border-radius: ${Theme.borders.radius.md};
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: ${Theme.colors.black};
  background-color: ${Theme.colors.white};
  transition: all 0.2s ease;
  padding: 0;
  flex: 1;
  
  &:focus {
    border-color: ${props => props.hasError ? Theme.colors.error : Theme.colors.secondary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(255, 59, 48, 0.15)' : 'rgba(143, 39, 206, 0.15)'};
    outline: none;
  }
  
  &:disabled {
    background-color: ${Theme.colors.gray};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${Theme.colors.error};
  font-size: 12px;
  margin-top: 4px;
  padding-left: 5px;
`;

export default MobileOtpInput; 