import React, { useState } from 'react';
import InputBaseModel2 from '../../../styles/inputs/input-fields/input-base-model-style-2';
import showIcon from '../../icons/Show-Icon.svg';
import hideIcon from '../../icons/Hide-Icon.svg';

interface InputBaseProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
}

const InputBaseModelWithIcon: React.FC<InputBaseProps> = ({ placeholder, value, onChange, title }) => {
  const [isHidden, setIsHidden] = useState(true);

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  return (
    <InputBaseModel2>
      <span>{title}</span>
        <div>
            <input 
              type={isHidden ? 'password' : 'text'} 
              placeholder={isHidden ? '************' : placeholder} 
              value={value} 
              onChange={onChange} 
            />
            <img 
              src={isHidden ? hideIcon : showIcon} 
              alt="view_or_hide" 
              onClick={toggleVisibility}
            />
        </div>
    </InputBaseModel2>
  );
};

export default InputBaseModelWithIcon; 