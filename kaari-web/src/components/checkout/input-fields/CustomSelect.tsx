import React from 'react';
import { CustomSelectContainer } from '../../styles/inputs/checkout/custom-date-picker-style';
import { FiChevronDown } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
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
    <CustomSelectContainer>
      {label && (
        <label htmlFor={name}>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>
      )}
      <div className="select-wrapper">
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
        <div className="chevron-icon">
          <FiChevronDown />
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
    </CustomSelectContainer>
  );
};

export default CustomSelect; 