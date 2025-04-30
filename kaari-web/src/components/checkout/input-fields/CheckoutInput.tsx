import React from 'react';
import { CheckoutInputContainer } from '../../styles/inputs/checkout/checkout-input-style';

interface CheckoutInputProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const CheckoutInput: React.FC<CheckoutInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  error,
  disabled = false
}) => {
  return (
    <CheckoutInputContainer>
      <label htmlFor={name}>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      {error && <div className="error-text">{error}</div>}
    </CheckoutInputContainer>
  );
};

export default CheckoutInput; 