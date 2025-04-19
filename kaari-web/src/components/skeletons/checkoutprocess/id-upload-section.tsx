import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import UploadIDField from '../inputs/upload-fields/upload-id-field';

const UploadSectionContainer = styled.div`
  padding: 32px 0;
  width: 100%;
  max-width: 768px;
`;

const SectionTitle = styled.h2`
  font: ${Theme.typography.fonts.h4B};
  color: ${Theme.colors.black};
  margin-bottom: 24px;
`;

const UploadedIDInfo = styled.div`
  padding: 16px;
  background-color: ${Theme.colors.fifth};
  border-radius: 8px;
  margin-bottom: 24px;
  
  h4 {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
    margin-bottom: 8px;
  }
  
  p {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .file-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .id-type {
      background-color: ${Theme.colors.tertiary};
      color: ${Theme.colors.primary};
      padding: 4px 8px;
      border-radius: 4px;
      font: ${Theme.typography.fonts.smallB};
    }
  }
`;

interface IdUploadSectionProps {
  onComplete?: (files: FileList | null, idType: string) => void;
}

const IdUploadSection: React.FC<IdUploadSectionProps> = ({ onComplete }) => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedID, setUploadedID] = useState<{
    files: FileList | null;
    type: string;
  } | null>(null);
  
  const handleUploadComplete = (files: FileList | null, type: string) => {
    setUploadedID({ files, type });
    setUploadComplete(true);
    
    if (onComplete) {
      onComplete(files, type);
    }
  };
  
  return (
    <UploadSectionContainer>
      <SectionTitle>Verify Your Identity</SectionTitle>
      
      <UploadIDField onUploadComplete={handleUploadComplete} />
      
      {uploadComplete && uploadedID && uploadedID.files && (
        <UploadedIDInfo>
          <h4>Document Upload Complete</h4>
          <div className="file-info">
            <p>{uploadedID.files[0].name}</p>
            <span className="id-type">{uploadedID.type}</span>
          </div>
        </UploadedIDInfo>
      )}
    </UploadSectionContainer>
  );
};

export default IdUploadSection; 