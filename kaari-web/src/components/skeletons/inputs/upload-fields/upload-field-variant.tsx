import React, { useState, useRef, ChangeEvent } from 'react';
import { UploadFieldContainer, UploadFieldTitle, UploadFieldBaseModel } from '../../../styles/inputs/upload-fields/upload-field-base-model-style';
import { FaPaperclip } from 'react-icons/fa';

interface UploadFieldProps {
  title?: string;
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileList | null) => void;
  purpleIcon?: boolean;
}

const UploadFieldModel: React.FC<UploadFieldProps> = ({ 
  title,
  placeholder = "Select file",
  accept = "*/*",
  multiple = false,
  onChange,
  purpleIcon = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);
    if (onChange) {
      onChange(files);
    }
  };

  const getFileText = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return placeholder;
    }
    
    return selectedFiles[0].name;
  };

  return (
    <UploadFieldContainer>
      {title && <UploadFieldTitle>{title}</UploadFieldTitle>}
      <UploadFieldBaseModel 
        onClick={handleClick}
        className={`${selectedFiles && selectedFiles.length > 0 ? 'has-files' : ''} ${purpleIcon ? 'purple-icon' : ''}`}
      >
        <span className="file-text">{getFileText()}</span>
        <FaPaperclip />
      </UploadFieldBaseModel>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
      />
    </UploadFieldContainer>
  );
};

export default UploadFieldModel;
