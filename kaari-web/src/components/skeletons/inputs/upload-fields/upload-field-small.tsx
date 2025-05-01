import React, { useState } from 'react';
import { UploadFieldsmallModel, UploadFieldContainersmall } from '../../../styles/inputs/upload-fields/upload-field-small-model-style';
import icon from '../../icons/Icon-Attach-small.svg';
import generativeObject from '../../icons/Generative-Object.svg';


interface UploadFieldProps {
  label?: string;
  hlabel?: string;
  onClick?: () => void;
  onFileSelect?: (file: File) => void;
  showIllustration?: boolean;
  fileName?: string;
  isProfilePicture?: boolean;
}



const UploadFieldSmall: React.FC<UploadFieldProps> = ({ 
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
    <UploadFieldContainersmall>
      {hlabel && <div className="head-label">{hlabel}</div>}
      {showIllustration && (
        <div className="illustration">
          <img src={generativeObject} alt="Upload illustration" />
        </div>
      )}
      <UploadFieldsmallModel onClick={handleClick}>
        <span>{label}</span>
        <img src={icon} alt="upload" />
        <input 
          type="file" 
          id="file-upload" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
      </UploadFieldsmallModel>
      {selectedFileName && (
        <div className="file-name">
          Selected file: {selectedFileName}
        </div>
      )}
    </UploadFieldContainersmall>
  );
};

export default UploadFieldSmall;
