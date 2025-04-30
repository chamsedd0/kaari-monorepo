import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
  }
  
  .checkbox-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .checkbox-custom {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: 4px;
    background-color: white;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  
  .checkbox-input:checked ~ .checkbox-custom {
    background-color: ${Theme.colors.secondary};
    border-color: ${Theme.colors.secondary};
  }
  
  .checkbox-custom:after {
    content: "";
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  .checkbox-input:checked ~ .checkbox-custom:after {
    display: block;
  }
  
  .checkbox-input:focus ~ .checkbox-custom {
    box-shadow: 0 0 0 2px rgba(155, 81, 224, 0.2);
  }
`;

interface CustomCheckboxProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  name,
  required = false
}) => {
  return (
    <CheckboxContainer>
      <label>
        <input
          type="checkbox"
          className="checkbox-input"
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
        />
        <span className="checkbox-custom"></span>
        {label}
      </label>
    </CheckboxContainer>
  );
};

export default CustomCheckbox; 