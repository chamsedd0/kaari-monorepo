import React from 'react';
import { SupportingDocumentsPageStyle } from './styles';
import { UploadCard } from '../../../../../../components/skeletons/cards/upload-card';

const SupportingDocumentsPage: React.FC = () => {
  return (
    <SupportingDocumentsPageStyle>
      <div className="left">
        <h2 className="title">Supporting Documents</h2>
        <div className="container">
          <UploadCard title="Double-sided National Card" description="Upload a digital copy of your National ID Card" onUpload={() => {}} />
          <UploadCard title="Rules and Requirements" description="Upload the documents that inform your future tenants about the booking requirements and house rules"  onUpload={() => {}} />
          <UploadCard title="Other Documents" description="Upload other documents that relate to your account on Kaari" onUpload={() => {}} />

        </div>
      </div>

    </SupportingDocumentsPageStyle>
    
  );
};

export default SupportingDocumentsPage;
