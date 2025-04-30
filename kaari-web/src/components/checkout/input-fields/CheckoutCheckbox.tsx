import React from 'react';
import { CheckoutCheckboxContainer } from '../../styles/inputs/checkout/checkout-input-style';

interface CheckoutCheckboxProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

const CheckoutCheckbox: React.FC<CheckoutCheckboxProps> = ({
  label,
  checked,
  onChange,
  name,
  required = false,
  disabled = false
}) => {
  return (
    <CheckoutCheckboxContainer>
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      <label htmlFor={name}>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>
    </CheckoutCheckboxContainer>
  );
};

export default CheckoutCheckbox; 