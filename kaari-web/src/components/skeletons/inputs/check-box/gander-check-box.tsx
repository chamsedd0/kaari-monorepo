import React, { useState, useEffect, useId } from 'react';
import CheckBoxBaseModelStyle3 from '../../../styles/inputs/check-boxes/gender-check-box-base-model-style';

interface GenderCheckBoxProps {
  onChange?: (value: string) => void;
  defaultValue?: string;
  name?: string;
}

// Helper function to normalize gender value
const normalizeGender = (gender: string): string => {
  if (!gender) return '';
  
  const lowerCaseGender = gender.toLowerCase().trim();
  if (lowerCaseGender === 'male' || lowerCaseGender === 'm') {
    return 'male';
  } else if (lowerCaseGender === 'female' || lowerCaseGender === 'f') {
    return 'female';
  }
  return '';
};

const GenderCheckBox: React.FC<GenderCheckBoxProps> = ({ 
  onChange, 
  defaultValue = '',
  name
}) => {
  // Generate unique IDs for the radio inputs
  const uniqueId = useId();
  const maleId = `male-${uniqueId}`;
  const femaleId = `female-${uniqueId}`;
  const radioGroupName = name || `gender-${uniqueId}`;
  
  const normalizedDefaultValue = normalizeGender(defaultValue);
  const [selectedGender, setSelectedGender] = useState<string>(normalizedDefaultValue);

  // Update selected gender when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      const normalized = normalizeGender(defaultValue);
      setSelectedGender(normalized);
    }
  }, [defaultValue]);

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    if (onChange) {
      onChange(gender);
    }
  };

  return (
    <CheckBoxBaseModelStyle3>
      <div className="checkbox-option">
        <input
          type="radio"
          id={maleId}
          name={radioGroupName}
          checked={selectedGender === 'male'}
          onChange={() => handleGenderChange('male')}
        />
        <label htmlFor={maleId}>Male</label>
      </div>
      
      <div className="checkbox-option">
        <input
          type="radio"
          id={femaleId}
          name={radioGroupName}
          checked={selectedGender === 'female'}
          onChange={() => handleGenderChange('female')}
        />
        <label htmlFor={femaleId}>Female</label>
      </div>
    </CheckBoxBaseModelStyle3>
  );
};

export default GenderCheckBox;
