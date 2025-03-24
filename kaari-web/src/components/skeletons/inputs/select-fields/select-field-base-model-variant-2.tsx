import React, { useState, useRef, useEffect } from 'react';
import { 
  SelectContainer1, 
  SelectHeader1, 
  SelectDropdown1, 
  Option1,
  Label1,
  ChevronIcon1
} from '../../../styles/inputs/select-fields/select-field-base-model-style-2';
import chevronDown from '../../icons/arrow-down.svg';

interface SelectFieldProps {
  options: string[];
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SelectFieldBaseModelVariant2: React.FC<SelectFieldProps> = ({
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
    <SelectContainer1 ref={containerRef} className={className}>
      {label && <Label1>{label}</Label1>}
      <SelectHeader1 onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedValue || placeholder}</span>
        <ChevronIcon1 isOpen={isOpen}><img src={chevronDown} alt="chevron_down" /></ChevronIcon1>
      </SelectHeader1>
      <SelectDropdown1 isOpen={isOpen}>
        {options.map((option, index) => (
          <Option1 
            key={index}
            onClick={() => handleSelect(option)}
          >
            {option}
          </Option1>
        ))}
      </SelectDropdown1>
    </SelectContainer1>
  );
};

export default SelectFieldBaseModelVariant2;
