import React from 'react';
import UploadFieldBaseModel from '../../../styles/inputs/upload-fields/upload-field-base-model-style';
import icon from '../../icons/Icon-Attach.svg';
import generativeObject from '../../icons/Generative-Object.svg';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

interface UploadFieldProps {
  label?: string;
  hlabel?: string;
  onClick?: () => void;
  onFileSelect?: (file: File) => void;
  showIllustration?: boolean;
}

const UploadFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .head-label {
    margin-bottom: 12px;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
  }

  .illustration {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    
    img {
      width: 120px;
      height: auto;
    }
  }
`;

const UploadFieldModel: React.FC<UploadFieldProps> = ({ 
  label, 
  hlabel, 
  onClick, 
  onFileSelect,
  showIllustration = false
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileSelect) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    document.getElementById('file-upload')?.click();
    if (onClick) onClick();
  };

  return (
    <UploadFieldContainer>
      {hlabel && <div className="head-label">{hlabel}</div>}
      {showIllustration && (
        <div className="illustration">
          <img src={generativeObject} alt="Upload illustration" />
        </div>
      )}
      <UploadFieldBaseModel onClick={handleClick}>
        <span>{label}</span>
        <img src={icon} alt="upload" />
        <input 
          type="file" 
          id="file-upload" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
      </UploadFieldBaseModel>
    </UploadFieldContainer>
  );
};

export default UploadFieldModel;
