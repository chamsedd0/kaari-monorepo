import React, { useState } from 'react';
import styled from 'styled-components';
import UploadFieldModel from './upload-field-variant';
import { Theme } from '../../../../theme/theme';

const ExampleContainer = styled.div`
  padding: 24px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FilePreview = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${Theme.colors.fifth};
  
  h3 {
    font: ${Theme.typography.fonts.mediumB};
    margin-bottom: 8px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      font: ${Theme.typography.fonts.text14};
      padding: 8px;
      margin-bottom: 4px;
      border-radius: 4px;
      background-color: ${Theme.colors.white};
      display: flex;
      justify-content: space-between;
      
      .file-size {
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.smallM};
      }
    }
  }
`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const UploadFieldExample: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  
  const handleImageChange = (files: FileList | null) => {
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };
  
  const handleDocumentChange = (files: FileList | null) => {
    if (files) {
      setDocumentFiles(Array.from(files));
    }
  };
  
  return (
    <ExampleContainer>
      <h2>File Upload Examples</h2>
      
      <UploadFieldModel 
        title="Upload Images"
        placeholder="Drag and drop or click to select images"
        accept="image/*"
        multiple={true}
        onChange={handleImageChange}
      />
      
      {uploadedFiles.length > 0 && (
        <FilePreview>
          <h3>Selected Images ({uploadedFiles.length})</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <span>{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </FilePreview>
      )}
      
      <UploadFieldModel 
        title="Upload Document"
        placeholder="Select a PDF or DOC file"
        accept=".pdf,.doc,.docx"
        onChange={handleDocumentChange}
      />
      
      {documentFiles.length > 0 && (
        <FilePreview>
          <h3>Selected Document</h3>
          <ul>
            {documentFiles.map((file, index) => (
              <li key={index}>
                <span>{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </FilePreview>
      )}
    </ExampleContainer>
  );
};

export default UploadFieldExample; 