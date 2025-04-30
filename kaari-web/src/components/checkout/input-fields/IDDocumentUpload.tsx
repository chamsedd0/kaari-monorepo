import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { FiUpload, FiX, FiFile } from 'react-icons/fi';
import { UploadFieldContainer, UploadFieldTitle, UploadFieldBaseModel } from '../../styles/inputs/upload-fields/upload-field-base-model-style';

interface IDDocumentUploadProps {
  label: string;
  onChange: (files: FileList | null) => void;
  value: FileList | null;
  name?: string;
  required?: boolean;
  error?: string;
  accept?: string;
  multiple?: boolean;
}

const UploadError = styled.div`
  color: ${Theme.colors.error};
  font: ${Theme.typography.fonts.smallM};
  margin-top: 8px;
`;

const FilePreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  width: 100%;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${Theme.colors.quaternary};
  border-radius: 8px;
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .file-icon {
      color: ${Theme.colors.secondary};
    }
    
    .file-name {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.black};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 280px;
    }
  }
  
  .remove-button {
    background: none;
    border: none;
    color: ${Theme.colors.gray2};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${Theme.colors.tertiary};
      color: ${Theme.colors.error};
    }
  }
`;

const IDDocumentUpload: React.FC<IDDocumentUploadProps> = ({
  label,
  onChange,
  value,
  name,
  required = false,
  error,
  accept = "image/*, application/pdf",
  multiple = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onChange(files);
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(e.dataTransfer.files);
    }
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  const removeFile = (index: number) => {
    if (!value) return;
    
    const dt = new DataTransfer();
    Array.from(value).forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });
    
    onChange(dt.files.length > 0 ? dt.files : null);
  };
  
  const hasFiles = value && value.length > 0;
  
  return (
    <UploadFieldContainer>
      <UploadFieldTitle>
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </UploadFieldTitle>
      
      <UploadFieldBaseModel
        className={`${dragActive ? 'drag-active' : ''} ${hasFiles ? 'has-files' : ''} purple-icon`}
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <span className="file-text">
          {hasFiles 
            ? `${value!.length} file${value!.length > 1 ? 's' : ''} selected`
            : 'Click or drag files to upload'
          }
        </span>
        <FiUpload />
      </UploadFieldBaseModel>
      
      {hasFiles && (
        <FilePreview>
          {Array.from(value!).map((file, index) => (
            <FileItem key={`${file.name}-${index}`}>
              <div className="file-info">
                <FiFile className="file-icon" />
                <span className="file-name">{file.name}</span>
              </div>
              <button 
                type="button" 
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                aria-label="Remove file"
              >
                <FiX />
              </button>
            </FileItem>
          ))}
        </FilePreview>
      )}
      
      {error && <UploadError>{error}</UploadError>}
      
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        name={name}
        required={required}
      />
    </UploadFieldContainer>
  );
};

export default IDDocumentUpload; 