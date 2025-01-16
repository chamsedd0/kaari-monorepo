import React, { useState, useRef, useEffect } from 'react';
import { 
  SelectContainer2, 
  SelectHeader2, 
  SelectDropdown2, 
  Option2,
  Label2,
  ChevronIcon2
} from '../../../styles/inputs/select-fields/select-field-base-model-style-1';
import chevronDown from '../../icons/arrow-down.svg';

interface SelectFieldProps {
  options: string[];
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SelectFieldBaseModelVariant1: React.FC<SelectFieldProps> = ({
  options,
  label,
  placeholder = '',
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
    <SelectContainer2 ref={containerRef} className={className}>
      {label && <Label2>{label}</Label2>}
      <SelectHeader2 onClick={() => setIsOpen(!isOpen)}>
        <span style={{marginRight: '10px'}}>{selectedValue || placeholder}</span>
        <ChevronIcon2 isOpen={isOpen}><img src={chevronDown} alt="chevron_down" /></ChevronIcon2>
      </SelectHeader2>
      <SelectDropdown2 isOpen={isOpen}>
        {options.map((option, index) => (
          <Option2 
            key={index}
            onClick={() => handleSelect(option)}
          >
            {option}
          </Option2>
        ))}
      </SelectDropdown2>
    </SelectContainer2>
  );
};

export default SelectFieldBaseModelVariant1;
