import React, { useState } from 'react';
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
  fileName?: string;
  isProfilePicture?: boolean;
}

const UploadFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .head-label {
    margin-bottom: 12px;
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
  }

  .illustration {
    display: flex;
    justify-content: center;
    
    img {
      width: 120px;
      height: auto;
    }
  }
  
  .file-name {
    margin-top: 8px;
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.secondary};
  }
  
  .profile-picture-link {
    color: ${Theme.colors.secondary};
    font: ${Theme.typography.fonts.link16};
    text-decoration: underline;
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
    
    &:active {
      opacity: 0.6;
    }
  }
`;

const UploadFieldModel: React.FC<UploadFieldProps> = ({ 
  label, 
  hlabel, 
  onClick, 
  onFileSelect,
  showIllustration = false,
  fileName,
  isProfilePicture = false
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(fileName);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileSelect) {
      const file = e.target.files[0];
      onFileSelect(file);
      setSelectedFileName(file.name);
    }
  };

  const handleClick = () => {
    document.getElementById(isProfilePicture ? 'profile-picture-upload' : 'file-upload')?.click();
    if (onClick) onClick();
  };

  if (isProfilePicture) {
    return (
      <div className="profile-picture-link" onClick={handleClick}>
        Edit Profile Picture
        <input 
          type="file" 
          id="profile-picture-upload" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    );
  }

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
      {selectedFileName && (
        <div className="file-name">
          Selected file: {selectedFileName}
        </div>
      )}
    </UploadFieldContainer>
  );
};

export default UploadFieldModel;
