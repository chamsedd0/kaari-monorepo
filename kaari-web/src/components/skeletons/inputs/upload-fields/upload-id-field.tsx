import React, { useState, useRef, ChangeEvent } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaPaperclip } from 'react-icons/fa';

const IDUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 16px;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UploadButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 20px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 100px;
  background-color: ${Theme.colors.white};
  transition: all 0.2s ease;
  color: ${Theme.colors.gray2};
  cursor: pointer;
  font: ${Theme.typography.fonts.mediumM};
  
  &:hover {
    border-color: ${Theme.colors.secondary};
  }
  
  &.has-files {
    border-color: ${Theme.colors.secondary};
    color: ${Theme.colors.black};
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${Theme.colors.secondary};
  }
`;

const SelectField = styled.div`
  width: 100%;
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 100px;
  background-color: ${Theme.colors.white};
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.black};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239B51E0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const IdTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  h3 {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
  }
`;

const UploadStatusText = styled.div`
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.gray2};
  margin-top: 8px;
`;

interface UploadIDFieldProps {
  onUploadComplete?: (files: FileList | null, type: string) => void;
}

const UploadIDField: React.FC<UploadIDFieldProps> = ({ onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [idType, setIdType] = useState<string>('Passport');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);
    if (onUploadComplete) {
      onUploadComplete(files, idType);
    }
  };

  const handleIdTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setIdType(e.target.value);
    if (selectedFiles && onUploadComplete) {
      onUploadComplete(selectedFiles, e.target.value);
    }
  };

  const getFileText = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return 'Select file';
    }
    
    return selectedFiles[0].name;
  };

  return (
    <IDUploadContainer>
      <IdTitleRow>
        <h3>Government ID</h3>
        {selectedFiles && <UploadStatusText>1 file selected</UploadStatusText>}
      </IdTitleRow>
      
      <FieldRow>
        <SelectField>
          <SelectInput 
            value={idType}
            onChange={handleIdTypeChange}
          >
            <option value="Passport">Passport</option>
            <option value="Driver's License">Driver's License</option>
            <option value="National ID">National ID</option>
            <option value="Residence Permit">Residence Permit</option>
          </SelectInput>
        </SelectField>
        
        <UploadButton 
          onClick={handleClick}
          className={selectedFiles && selectedFiles.length > 0 ? 'has-files' : ''}
        >
          <span>{getFileText()}</span>
          <FaPaperclip />
        </UploadButton>
      </FieldRow>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf"
      />
    </IDUploadContainer>
  );
};

export default UploadIDField; 