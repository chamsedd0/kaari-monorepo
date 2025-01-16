import React from 'react';
import TextAreaBaseModel1 from '../../../styles/inputs/input-fields/textarea-base-model-style-1';

interface InputBaseProps {
  placeholder?: string;
  value?: string;
  title?: string;
}

const TextAreaBaseModel: React.FC<InputBaseProps> = ({ placeholder, value, title }) => {
  return (
    <TextAreaBaseModel1>
      <span>{title}</span>
      <textarea placeholder={placeholder} value={value} />
    </TextAreaBaseModel1>
  );
};

export default TextAreaBaseModel; 