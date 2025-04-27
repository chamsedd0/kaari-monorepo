import React from 'react';
import { SupportingDocumentsPageStyle } from './styles';
import { UploadCard } from '../../../../../../components/skeletons/cards/upload-card';
import { useTranslation } from 'react-i18next';

const SupportingDocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <SupportingDocumentsPageStyle>
      <div className="left">
        <h2 className="title">{t('advertiser_dashboard.profile.supporting_documents.title')}</h2>
        <div className="container">
          <UploadCard 
            title={t('advertiser_dashboard.profile.supporting_documents.national_id_title')} 
            description={t('advertiser_dashboard.profile.supporting_documents.national_id_description')} 
            onUpload={() => {}} 
          />
          <UploadCard 
            title={t('advertiser_dashboard.profile.supporting_documents.rules_title')} 
            description={t('advertiser_dashboard.profile.supporting_documents.rules_description')}  
            onUpload={() => {}} 
          />
          <UploadCard 
            title={t('advertiser_dashboard.profile.supporting_documents.other_documents_title')} 
            description={t('advertiser_dashboard.profile.supporting_documents.other_documents_description')} 
            onUpload={() => {}} 
          />
        </div>
      </div>
    </SupportingDocumentsPageStyle>
  );
};

export default SupportingDocumentsPage;
