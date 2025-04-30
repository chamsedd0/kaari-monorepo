import React from 'react';
import { CheckoutDatePickerContainer } from '../../styles/inputs/checkout/checkout-input-style';

interface CheckoutDatePickerProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

const CheckoutDatePicker: React.FC<CheckoutDatePickerProps> = ({
  label,
  value,
  onChange,
  name,
  required = false,
  error,
  disabled = false,
  min,
  max
}) => {
  return (
    <CheckoutDatePickerContainer>
      <label htmlFor={name}>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
      />
      {error && <div className="error-text">{error}</div>}
    </CheckoutDatePickerContainer>
  );
};

export default CheckoutDatePicker; 