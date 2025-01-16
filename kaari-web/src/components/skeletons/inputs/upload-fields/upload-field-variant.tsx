import React from 'react';
import UploadFieldBaseModel from '../../../styles/inputs/upload-fields/upload-field-base-model-style';
import icon from '../../icons/Icon-Attach.svg';

interface UploadFieldProps {
  label?: string;
  onClick?: () => void;
}

const UploadFieldModel: React.FC<UploadFieldProps> = ({label, onClick }) => {
  return (
    <UploadFieldBaseModel onClick={onClick}>
      <span>{label}</span>
      <img src={icon} alt="upload" />
    </UploadFieldBaseModel>
  );
};

export default UploadFieldModel;
