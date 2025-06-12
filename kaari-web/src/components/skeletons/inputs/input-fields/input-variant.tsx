import React from 'react';
import InputBaseModel1 from '../../../styles/inputs/input-fields/input-base-model-style-1';

export interface InputBaseProps {
  type?: 'text' | 'number' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
  error?: string;
  className?: string;
}

const InputBaseModel: React.FC<InputBaseProps> = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  title,
  error,
  className
}) => {
  return (
    <InputBaseModel1 className={className}>
      <span>{title}</span>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className={error ? 'form-error' : ''}
      />
      {error && <div className="error-text">{error}</div>}
    </InputBaseModel1>
  );
};

export default InputBaseModel; 