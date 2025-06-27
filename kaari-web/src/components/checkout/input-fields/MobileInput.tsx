import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

interface MobileInputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  name?: string;
  autoComplete?: string;
  className?: string;
  id?: string;
}

const MobileInput: React.FC<MobileInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  maxLength,
  name,
  autoComplete,
  className,
  id,
}) => {
  return (
    <MobileInputContainer className={className}>
      {label && (
        <InputLabel>
          {label}
          {required && <RequiredAsterisk>*</RequiredAsterisk>}
        </InputLabel>
      )}
      <InputWrapper hasError={!!error}>
        <StyledInput
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          name={name}
          autoComplete={autoComplete}
          id={id}
        />
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </MobileInputContainer>
  );
};

const MobileInputContainer = styled.div`
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
  border: 1.5px solid ${props => props.hasError ? Theme.colors.error : Theme.colors.gray};
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: ${props => props.hasError ? Theme.colors.error : Theme.colors.secondary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(255, 59, 48, 0.15)' : 'rgba(143, 39, 206, 0.15)'};
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  border: none;
  outline: none;
  background-color: ${Theme.colors.white};
  color: ${Theme.colors.black};
  
  &::placeholder {
    color: ${Theme.colors.gray2};
    opacity: 0.7;
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

export default MobileInput; 