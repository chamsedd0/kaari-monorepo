import React from 'react';
import { UploadCard as UploadCardStyle } from '../../styles/cards/card-base-model-style-upload';
import { PurpleButtonLB40 } from '../../skeletons/buttons/purple_LB40';

interface UploadCardProps {
  title: string;
  description: string;
  acceptedFormats?: string;
  sizeText?: string;
  onUpload: () => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  title,
  description,
  acceptedFormats = 'Accepted formats: pdf, png, jpg, jpeg, doc, docx',
  sizeText = 'Maximum size: 7 MB',
  onUpload
}) => {
  return (
    <UploadCardStyle>
      <div className="title-container">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
      <div className="upload-container">
        <div className="text-container">
          <div className="size-text">{sizeText}</div>
          <div className="size-text">{acceptedFormats}</div>
        </div>
        <div className="upload-button">
          <PurpleButtonLB40 text="Upload" onClick={onUpload} />
        </div>
        
      </div>
    </UploadCardStyle>
  );
};
