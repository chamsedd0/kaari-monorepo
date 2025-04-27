import React from 'react';
import TextAreaBaseModel1 from '../../../styles/inputs/input-fields/textarea-base-model-style-1';

interface InputBaseProps {
  placeholder?: string;
  value?: string;
  title?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
}

const TextAreaBaseModel: React.FC<InputBaseProps> = ({ placeholder, value, title, onChange, rows, error }) => {
  return (
    <TextAreaBaseModel1>
      <span>{title}</span>
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} className={error ? 'form-error' : ''} />
      {error && <div className="error-text">{error}</div>}
    </TextAreaBaseModel1>
  );
};

export default TextAreaBaseModel; 