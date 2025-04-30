import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { FiChevronDown } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
}

interface EnhancedCustomSelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement> | string) => void;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  font-family: inherit;
  
  label {
    display: block;
    margin-bottom: 8px;
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }
  
  .error-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.error};
    margin-top: 4px;
  }
`;

const SelectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: ${Theme.colors.white};
  border: 1px solid ${Theme.colors.tertiary};
  border-radius: ${Theme.borders.radius.extreme};
  cursor: pointer;
  transition: all 0.3s ease;
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.primary};
  
  &:hover {
    border-color: ${Theme.colors.secondary};
  }
  
  &:focus, &.active {
    border-color: ${Theme.colors.secondary};
    outline: none;
  }
  
  .placeholder {
    color: ${Theme.colors.gray2};
  }
`;

const SelectDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: ${Theme.colors.white};
  border: 1px solid ${Theme.colors.tertiary};
  border-radius: ${Theme.borders.radius.sm};
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const Option = styled.div<{ selected?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.selected ? Theme.colors.quaternary : 'transparent'};
  font: ${Theme.typography.fonts.mediumM};
  
  &:hover {
    background: ${Theme.colors.quaternary};
  }
`;

const ChevronIcon = styled.div<{ isOpen: boolean }>`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
  color: ${Theme.colors.secondary};
`;

const EnhancedCustomSelect: React.FC<EnhancedCustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  name,
  required = false,
  error,
  disabled = false,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  
  const handleSelect = (optionValue: string) => {
    // Create a synthetic event to mimic a select change
    if (typeof onChange === 'function') {
      // If onChange accepts a string directly
      if (onChange.length === 1) {
        onChange(optionValue);
      } else {
        // Create a synthetic change event
        const syntheticEvent = {
          target: {
            name,
            value: optionValue
          }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    }
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <SelectContainer ref={containerRef}>
      {label && (
        <label htmlFor={name}>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>
      )}
      
      <SelectHeader 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={isOpen ? 'active' : ''}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        {selectedOption ? (
          <span>{selectedOption.label}</span>
        ) : (
          <span className="placeholder">{placeholder || 'Select an option'}</span>
        )}
        <ChevronIcon isOpen={isOpen}>
          <FiChevronDown />
        </ChevronIcon>
      </SelectHeader>
      
      <SelectDropdown isOpen={isOpen}>
        {options.map((option) => (
          <Option 
            key={option.value}
            selected={option.value === value}
            onClick={() => handleSelect(option.value)}
            role="option"
            aria-selected={option.value === value}
          >
            {option.label}
          </Option>
        ))}
      </SelectDropdown>
      
      {error && <div className="error-text">{error}</div>}
      
      {/* Hidden native select for form submission */}
      <select 
        name={name}
        value={value}
        onChange={(e) => handleSelect(e.target.value)}
        required={required}
        disabled={disabled}
        style={{ display: 'none' }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SelectContainer>
  );
};

export default EnhancedCustomSelect; 