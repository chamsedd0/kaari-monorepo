import React, { useState, useEffect } from 'react';
import { SupportingDocumentsPageStyle } from './styles';
import { UploadCard } from '../../../../../../components/skeletons/cards/upload-card';
import { useTranslation } from 'react-i18next';
import { uploadGovernmentID } from '../../../../../../backend/server-actions/UserServerActions';
import { updateUserDocument } from '../../../../../../backend/server-actions/UserDocumentsActions';
import { useStore } from '../../../../../../backend/store';
import { useToastService } from '../../../../../../services/ToastService';
import { secureUploadFile } from '../../../../../../backend/firebase/storage';

const SupportingDocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const toast = useToastService();
  
  // Upload states
  const [isUploadingIdFront, setIsUploadingIdFront] = useState(false);
  const [isUploadingIdBack, setIsUploadingIdBack] = useState(false);
  const [isUploadingRules, setIsUploadingRules] = useState(false);
  const [isUploadingOther, setIsUploadingOther] = useState(false);
  
  // Uploaded file names
  const [idFrontFileName, setIdFrontFileName] = useState<string | undefined>();
  const [idBackFileName, setIdBackFileName] = useState<string | undefined>();
  const [rulesFileName, setRulesFileName] = useState<string | undefined>();
  const [otherFileName, setOtherFileName] = useState<string | undefined>();

  // Load existing document info
  useEffect(() => {
    if (user?.identificationDocuments) {
      if (user.identificationDocuments.frontId) {
        const fileName = user.identificationDocuments.frontId.split('/').pop();
        setIdFrontFileName(fileName || t('advertiser_dashboard.profile.id_front_uploaded'));
      }
      
      if (user.identificationDocuments.backId) {
        const fileName = user.identificationDocuments.backId.split('/').pop();
        setIdBackFileName(fileName || t('advertiser_dashboard.profile.id_back_uploaded'));
      }
    }

    // Load rules document info if available
    if (user?.documents?.rules) {
      const fileName = user.documents.rules.split('/').pop();
      setRulesFileName(fileName || 'Rules document');
    }

    // Load other document info if available
    if (user?.documents?.other) {
      const fileName = user.documents.other.split('/').pop();
      setOtherFileName(fileName || 'Other document');
    }
  }, [user, t]);

  // Handle ID front upload
  const handleIdFrontUpload = async (file: File) => {
    if (!user) return;
    
    setIsUploadingIdFront(true);
    try {
      const result = await uploadGovernmentID(user.id, file);
      setIdFrontFileName(file.name);
      toast.profile.uploadDocumentSuccess();
    } catch (error) {
      console.error('Error uploading ID front:', error);
      toast.profile.documentUploadError(t('advertiser_dashboard.profile.document_upload_error'));
    } finally {
      setIsUploadingIdFront(false);
    }
  };

  // Handle ID back upload
  const handleIdBackUpload = async (file: File) => {
    if (!user || !user.identificationDocuments?.frontId) {
      toast.profile.documentUploadError(t('advertiser_dashboard.profile.upload_front_id_first'));
      return;
    }
    
    setIsUploadingIdBack(true);
    try {
      // For back ID, we need to get the front ID first and then upload both
      const frontIdResponse = await fetch(user.identificationDocuments.frontId);
      const frontIdBlob = await frontIdResponse.blob();
      const frontIdFile = new File([frontIdBlob], 'front-id', { type: frontIdBlob.type });
      
      await uploadGovernmentID(user.id, frontIdFile, file);
      setIdBackFileName(file.name);
      toast.profile.uploadDocumentSuccess();
    } catch (error) {
      console.error('Error uploading ID back:', error);
      toast.profile.documentUploadError(t('advertiser_dashboard.profile.document_upload_error'));
    } finally {
      setIsUploadingIdBack(false);
    }
  };

  // Handle rules document upload
  const handleRulesUpload = async (file: File) => {
    if (!user) return;
    
    setIsUploadingRules(true);
    try {
      const fileName = `rules_${Date.now()}_${file.name}`;
      const storagePath = `users/${user.id}/documents/${fileName}`;
      
      const fileUrl = await secureUploadFile(storagePath, file);
      
      // Update user document with rules document info
      const updatedUser = await updateUserDocument(user.id, 'rules', fileUrl);
      setUser(updatedUser);
      
      setRulesFileName(file.name);
      toast.profile.uploadDocumentSuccess();
    } catch (error) {
      console.error('Error uploading rules document:', error);
      toast.profile.documentUploadError(t('advertiser_dashboard.profile.document_upload_error'));
    } finally {
      setIsUploadingRules(false);
    }
  };

  // Handle other document upload
  const handleOtherUpload = async (file: File) => {
    if (!user) return;
    
    setIsUploadingOther(true);
    try {
      const fileName = `other_${Date.now()}_${file.name}`;
      const storagePath = `users/${user.id}/documents/${fileName}`;
      
      const fileUrl = await secureUploadFile(storagePath, file);
      
      // Update user document with other document info
      const updatedUser = await updateUserDocument(user.id, 'other', fileUrl);
      setUser(updatedUser);
      
      setOtherFileName(file.name);
      toast.profile.uploadDocumentSuccess();
    } catch (error) {
      console.error('Error uploading other document:', error);
      toast.profile.documentUploadError(t('advertiser_dashboard.profile.document_upload_error'));
    } finally {
      setIsUploadingOther(false);
    }
  };
  
  return (
    <SupportingDocumentsPageStyle>
      <div className="left">
        <h2 className="title">{t('advertiser_dashboard.profile.supporting_documents.title')}</h2>
        <div className="container">
          <UploadCard 
            title={t('advertiser_dashboard.profile.supporting_documents.national_id_title')} 
            description={t('advertiser_dashboard.profile.supporting_documents.national_id_description')} 
            onUpload={handleIdFrontUpload}
            isUploading={isUploadingIdFront}
            uploadedFileName={idFrontFileName}
          />
          <UploadCard 
            title={t('advertiser_dashboard.profile.back_of_id')} 
            description={t('advertiser_dashboard.profile.supporting_documents.national_id_description')}  
            onUpload={handleIdBackUpload}
            isUploading={isUploadingIdBack}
            uploadedFileName={idBackFileName}
          />
          <UploadCard 
            title={t('advertiser_dashboard.profile.supporting_documents.rules_title')} 
            description={t('advertiser_dashboard.profile.supporting_documents.rules_description')}  
            onUpload={handleRulesUpload}
            isUploading={isUploadingRules}
            uploadedFileName={rulesFileName}
          />
          <UploadCard 
            title={t('advertiser_dashboard.profile.supporting_documents.other_documents_title')} 
            description={t('advertiser_dashboard.profile.supporting_documents.other_documents_description')} 
            onUpload={handleOtherUpload}
            isUploading={isUploadingOther}
            uploadedFileName={otherFileName}
          />
        </div>
      </div>
    </SupportingDocumentsPageStyle>
  );
};

export default SupportingDocumentsPage;
