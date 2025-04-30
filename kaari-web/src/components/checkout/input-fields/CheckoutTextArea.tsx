import React from 'react';
import { CheckoutTextAreaContainer } from '../../styles/inputs/checkout/checkout-input-style';

interface CheckoutTextAreaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  rows?: number;
}

const CheckoutTextArea: React.FC<CheckoutTextAreaProps> = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 4
}) => {
  return (
    <CheckoutTextAreaContainer>
      <label htmlFor={name}>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
      />
      {error && <div className="error-text">{error}</div>}
    </CheckoutTextAreaContainer>
  );
};

export default CheckoutTextArea; 