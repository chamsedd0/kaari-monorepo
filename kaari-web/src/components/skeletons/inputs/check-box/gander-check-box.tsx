import React, { useState } from 'react';
import CheckBoxBaseModelStyle3 from '../../../styles/inputs/check-boxes/gender-check-box-base-model-style';

interface GenderCheckBoxProps {
  onChange?: (value: string) => void;
  defaultValue?: string;
}

const GenderCheckBox: React.FC<GenderCheckBoxProps> = ({ onChange, defaultValue = '' }) => {
  const [selectedGender, setSelectedGender] = useState<string>(defaultValue);

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
          id="male"
          name="gender"
          checked={selectedGender === 'male'}
          onChange={() => handleGenderChange('male')}
        />
        <label htmlFor="male">Male</label>
      </div>
      
      <div className="checkbox-option">
        <input
          type="radio"
          id="female"
          name="gender"
          checked={selectedGender === 'female'}
          onChange={() => handleGenderChange('female')}
        />
        <label htmlFor="female">Female</label>
      </div>
    </CheckBoxBaseModelStyle3>
  );
};

export default GenderCheckBox;
