import React from 'react';
import { CheckoutSelectContainer } from '../../styles/inputs/checkout/checkout-input-style';

interface Option {
  value: string;
  label: string;
}

interface CheckoutSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

const CheckoutSelect: React.FC<CheckoutSelectProps> = ({
  label,
  options,
  value,
  onChange,
  name,
  required = false,
  error,
  disabled = false,
  placeholder
}) => {
  return (
    <CheckoutSelectContainer>
      <label htmlFor={name}>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-text">{error}</div>}
    </CheckoutSelectContainer>
  );
};

export default CheckoutSelect; 