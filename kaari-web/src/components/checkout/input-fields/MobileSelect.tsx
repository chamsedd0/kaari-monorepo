import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { FaChevronDown } from 'react-icons/fa';

interface MobileSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  error?: string;
  required?: boolean;
}

const MobileSelect: React.FC<MobileSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SelectContainer>
      {label && (
        <Label>
          {label}
          {required && <span className="required">*</span>}
        </Label>
      )}
      <SelectWrapper ref={dropdownRef} isOpen={isOpen}>
        <SelectButton onClick={toggleDropdown} hasValue={!!value}>
          <span>{value || placeholder}</span>
          <FaChevronDown className={`icon ${isOpen ? 'open' : ''}`} />
        </SelectButton>
        {isOpen && (
          <OptionsContainer>
            {options.map((option, index) => (
              <Option
                key={index}
                onClick={() => handleSelect(option)}
                isSelected={option === value}
              >
                {option}
              </Option>
            ))}
          </OptionsContainer>
        )}
      </SelectWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectContainer>
  );
};

const SelectContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.black};
  margin-bottom: 8px;
  padding-left: 5px;
  font-size: 14px;
  display: block;
  
  .required {
    color: ${Theme.colors.error};
    margin-left: 2px;
  }
`;

const SelectWrapper = styled.div<{ isOpen: boolean }>`
  position: relative;
  width: 100%;
  z-index: ${props => props.isOpen ? 10 : 1};
`;

const SelectButton = styled.div<{ hasValue: boolean }>`
  width: 100%;
  height: 50px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: ${Theme.borders.radius.extreme};
  background-color: ${Theme.colors.white};
  font-size: 14px;
  cursor: pointer;
  color: ${props => props.hasValue ? Theme.colors.black : Theme.colors.gray};
  
  .icon {
    color: ${Theme.colors.secondary};
    transition: transform 0.3s ease;
    
    &.open {
      transform: rotate(180deg);
    }
  }
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: ${Theme.borders.radius.md};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const Option = styled.div<{ isSelected: boolean }>`
  padding: 12px 15px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${props => props.isSelected ? 'rgba(143, 39, 206, 0.1)' : 'transparent'};
  color: ${props => props.isSelected ? Theme.colors.secondary : Theme.colors.black};
  
  &:hover {
    background-color: rgba(143, 39, 206, 0.05);
  }
`;

const ErrorMessage = styled.div`
  color: ${Theme.colors.error};
  font-size: 12px;
  margin-top: 4px;
  padding-left: 5px;
`;

export default MobileSelect; 