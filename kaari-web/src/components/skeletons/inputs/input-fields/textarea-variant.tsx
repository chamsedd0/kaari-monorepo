import React from 'react';
import TextAreaBaseModel1 from '../../../styles/inputs/input-fields/textarea-base-model-style-1';

interface InputBaseProps {
  placeholder?: string;
  value?: string;
  title?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const TextAreaBaseModel: React.FC<InputBaseProps> = ({ placeholder, value, title, onChange, rows }) => {
  return (
    <TextAreaBaseModel1>
      <span>{title}</span>
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} />
    </TextAreaBaseModel1>
  );
};

export default TextAreaBaseModel; 