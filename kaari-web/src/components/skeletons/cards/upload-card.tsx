import React, { useRef, useState } from 'react';
import { UploadCardStyled } from '../../styles/cards/card-base-model-style-upload';
import { PurpleButtonLB40 } from '../../skeletons/buttons/purple_LB40';
import { useTranslation } from 'react-i18next';

interface UploadCardProps {
  title: string;
  description: string;
  acceptedFormats?: string;
  acceptedFileTypes?: string; // e.g., ".pdf,.png,.jpg,.jpeg,.doc,.docx"
  maxSizeMB?: number;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  uploadedFileName?: string;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  title,
  description,
  acceptedFormats = 'Accepted formats: pdf, png, jpg, jpeg, doc, docx',
  acceptedFileTypes = ".pdf,.png,.jpg,.jpeg,.doc,.docx",
  maxSizeMB = 7,
  onUpload,
  isUploading = false,
  uploadedFileName
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setError(null);
    onUpload(file);
  };

  const sizeText = `Maximum size: ${maxSizeMB} MB`;

  return (
    <UploadCardStyled>
      <div className="title-container">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
        {uploadedFileName && (
          <div className="uploaded-file">
            <span className="file-icon">📄</span>
            <span className="file-name">{uploadedFileName}</span>
          </div>
        )}
      </div>
      <div className="upload-container">
        <div className="text-container">
          <div className="size-text">{sizeText}</div>
          <div className="size-text">{acceptedFormats}</div>
          {error && <div className="error-text">{error}</div>}
        </div>
        <div className="upload-button">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
            accept={acceptedFileTypes}
          />
          <PurpleButtonLB40 
            text={isUploading ? t('common.uploading', 'Uploading...') : (uploadedFileName ? t('common.replace', 'Replace') : t('common.upload', 'Upload'))} 
            onClick={handleClick} 
            disabled={isUploading}
          />
        </div>
      </div>
    </UploadCardStyled>
  );
};
