import React, { useState, useRef, useEffect } from 'react';
import { 
  SelectContainer, 
  SelectHeader, 
  SelectDropdown, 
  Option,
  Label,
  ChevronIcon
} from '../../../styles/inputs/select-fields/select-field-base-model-style';
import chevronDown from '../../icons/arrow-down.svg';

interface SelectFieldProps {
  options: string[];
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SelectFieldBaseModel: React.FC<SelectFieldProps> = ({
  options,
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    onChange?.(option);
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
    <SelectContainer ref={containerRef} className={className}>
      {label && <Label>{label}</Label>}
      <SelectHeader onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedValue || placeholder}</span>
        <ChevronIcon isOpen={isOpen}><img src={chevronDown} alt="chevron_down" /></ChevronIcon>
      </SelectHeader>
      <SelectDropdown isOpen={isOpen}>
        {options.map((option, index) => (
          <Option 
            key={index}
            onClick={() => handleSelect(option)}
          >
            {option}
          </Option>
        ))}
      </SelectDropdown>
    </SelectContainer>
  );
};

export default SelectFieldBaseModel;
