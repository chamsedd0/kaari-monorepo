import React, { useState, useEffect } from 'react';
import { ProfileSectionStyle } from './styles';
import { useStore } from '../../../../../../backend/store';
import Picture from "../../../../../../assets/images/ProfilePicture.png";
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import InputVariant from '../../../../../../components/skeletons/inputs/input-fields/input-variant';
import SelectFieldDatePicker from '../../../../../../components/skeletons/inputs/select-fields/select-field-date-picker';
import UploadFieldModel from '../../../../../../components/skeletons/inputs/upload-fields/upload-field-variant';
import TextareaVariant from '../../../../../../components/skeletons/inputs/input-fields/textarea-variant';
import GenderCheckBox from '../../../../../../components/skeletons/inputs/check-box/gander-check-box';
import SelectFieldBaseModel from '../../../../../../components/skeletons/inputs/select-fields/select-field-base-model';
import { updateUserProfile, uploadGovernmentID } from '../../../../../../backend/server-actions/UserServerActions';
import { useToastService } from '../../../../../../services/ToastService';
import { useTranslation } from 'react-i18next';
import SpokenLanguagesModal from '../../../../../../components/skeletons/constructed/modals/spoken-languages-modal';

const ProfileSection: React.FC = () => {
    const { t } = useTranslation();
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const toast = useToastService();
    
    // Form state
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [parsedDate, setParsedDate] = useState({ day: '', month: '', year: '' });
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [idFront, setIdFront] = useState<File | null>(null);
    const [idBack, setIdBack] = useState<File | null>(null);
    const [languages, setLanguages] = useState<string[]>([]);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    
    // UI states
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Parse date of birth into parts
    const parseDateOfBirth = (dateString: string) => {
        if (!dateString) return { day: '', month: '', year: '' };
        
        try {
            // Handle different date formats (YYYY-MM-DD or MM/DD/YYYY, etc.)
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                // If date is invalid, try to parse from string format
                const parts = dateString.split(/[-\/]/);
                
                if (parts.length === 3) {
                    // Assume YYYY-MM-DD or MM/DD/YYYY
                    if (parts[0].length === 4) {
                        // YYYY-MM-DD
                        return {
                            day: parts[2].padStart(2, '0'),
                            month: parts[1].padStart(2, '0'),
                            year: parts[0]
                        };
                    } else {
                        // MM/DD/YYYY
                        return {
                            day: parts[1].padStart(2, '0'),
                            month: parts[0].padStart(2, '0'),
                            year: parts[2]
                        };
                    }
                }
                return { day: '', month: '', year: '' };
            }
            
            return {
                day: date.getDate().toString().padStart(2, '0'),
                month: (date.getMonth() + 1).toString().padStart(2, '0'),
                year: date.getFullYear().toString()
            };
        } catch (e) {
            console.error('Error parsing date:', e);
            return { day: '', month: '', year: '' };
        }
    };
    
    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setSurname(user.surname || '');
            setPhoneNumber(user.phoneNumber || '');
            setDateOfBirth(user.dateOfBirth || '');
            setParsedDate(parseDateOfBirth(user.dateOfBirth || ''));
            
            // Normalize gender value
            const normalizedGender = user.gender ? 
                user.gender.toLowerCase() === 'male' || user.gender.toLowerCase() === 'm' ? 'male' : 
                user.gender.toLowerCase() === 'female' || user.gender.toLowerCase() === 'f' ? 'female' : 
                user.gender : '';
            setGender(normalizedGender);
            
            setNationality(user.nationality || '');
            setAboutMe(user.aboutMe || '');
            setLanguages(user.languages || []);
        }
    }, [user]);
    
    // Handle language selection
    const handleSaveLanguages = (selectedLanguages: string[]) => {
        setLanguages(selectedLanguages);
        toast.app.actionSuccess(t('advertiser_dashboard.profile.languages_updated'));
    };
    
    // Handle profile update
    const handleSaveProfile = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            // Update profile data
            const updatedUser = await updateUserProfile(user.id, {
                name,
                surname,
                phoneNumber,
                dateOfBirth,
                gender,
                nationality,
                languages,
                aboutMe,
                profilePicture
            });
            
            // Upload ID documents if provided
            if (idFront) {
                try {
                    // Only pass idBack if it exists
                    if (idBack) {
                        await uploadGovernmentID(user.id, idFront, idBack);
                    } else {
                        await uploadGovernmentID(user.id, idFront);
                    }
                    // Show document upload success toast
                    toast.profile.uploadDocumentSuccess();
                } catch (idError) {
                    console.error('Error uploading government ID:', idError);
                    toast.profile.documentUploadError(t('advertiser_dashboard.profile.document_upload_error'));
                    // Continue with the profile update even if ID upload fails
                }
            }
            
            // Update user in global store
            setUser(updatedUser);
            setSuccess(true);
            
            // Show success toast
            toast.profile.updateSuccess();
            
            // Reset file inputs after successful upload
            setProfilePicture(null);
            setProfilePicturePreview(null);
            setIdFront(null);
            setIdBack(null);
            
            // Show success message briefly
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(t('advertiser_dashboard.profile.error_message'));
            
            // Show error toast
            toast.profile.updateError(t('advertiser_dashboard.profile.error_message'));
        } finally {
            setLoading(false);
        }
    };
    
    // Handle profile picture change
    const handleProfilePictureChange = (file: File) => {
        setProfilePicture(file);
        
        // Create a preview of the uploaded image
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicturePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // Show success toast for profile picture upload
        toast.profile.uploadPhotoSuccess();
    };
    
    return (
        <ProfileSectionStyle>
            <h1 className="section-title">{t('advertiser_dashboard.profile.section_title')}</h1>
            <div className="profile-image-container">
                <div className="profile-image">
                    <img 
                        src={profilePicturePreview || user?.profilePicture || Picture} 
                        alt={t('advertiser_dashboard.profile.profile_image_alt', 'Profile')} 
                    />
                </div>
                <UploadFieldModel
                    label={t('advertiser_dashboard.profile.change_profile_picture')}
                    onFileSelect={handleProfilePictureChange}
                    isProfilePicture
                />
            </div>
            <div className="profile-grid">
                <InputVariant 
                    title={t('advertiser_dashboard.profile.full_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <InputVariant 
                    title={t('advertiser_dashboard.profile.your_surname')}
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <InputVariant 
                    title={t('advertiser_dashboard.profile.phone_number')}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <SelectFieldDatePicker 
                    label={t('advertiser_dashboard.profile.date_of_birth', 'Date of Birth')}
                    initialDate={parsedDate}
                    onChange={(date) => {
                        // Convert date object to string format (YYYY-MM-DD)
                        if (date.year && date.month && date.day) {
                            setDateOfBirth(`${date.year}-${date.month}-${date.day}`);
                        }
                    }}
                /> 
                <UploadFieldModel 
                    label={t('advertiser_dashboard.profile.passport_front_id')}
                    hlabel={t('advertiser_dashboard.profile.government_id')}
                    onFileSelect={(file) => setIdFront(file)}
                    fileName={idFront?.name || (user?.identificationDocuments?.frontId ? t('advertiser_dashboard.profile.id_front_uploaded') : "")}
                />
                <UploadFieldModel 
                    label={t('advertiser_dashboard.profile.back_of_id')}
                    onFileSelect={(file) => setIdBack(file)}
                    fileName={idBack?.name || (user?.identificationDocuments?.backId ? t('advertiser_dashboard.profile.id_back_uploaded') : "")}
                />
               
                <div className="profile-inbut-label">{t('advertiser_dashboard.profile.gender')}</div>
                <div className="profile-inbut-label">{t('advertiser_dashboard.profile.languages')}</div>
                <GenderCheckBox 
                    defaultValue={gender}
                    onChange={(value) => setGender(value)}
                />
                <div className="languages-container">
                    {languages.length > 0 ? (
                        <div className="selected-languages">
                            {languages.length > 0 && (
                                <div className="language-badge" style={{
                                    backgroundColor: '#f3e8ff',
                                    color: '#9333ea',
                                    borderColor: '#f3e8ff',
                                    padding: '5px 12px'
                                }}>
                                    {languages[0]}
                                </div>
                            )}
                            <div className="text-button" onClick={() => setIsLanguageModalOpen(true)} style={{ marginLeft: '4px' }}>
                                {t('advertiser_dashboard.profile.edit_languages')}
                            </div>
                        </div>
                    ) : (
                        <div className="text-button" onClick={() => setIsLanguageModalOpen(true)}>
                            {t('advertiser_dashboard.profile.add_language')}
                        </div>
                    )}
                </div>
            </div>
           
            <SelectFieldBaseModel 
                label={t('advertiser_dashboard.profile.nationality')}
                options={['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Russian', 'Arabic', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Other']} 
                value={nationality}
                onChange={(value) => setNationality(value)}
            />  
           
            <TextareaVariant 
                title={t('advertiser_dashboard.profile.about_me')}
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
            />
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="success-message">
                    {t('advertiser_dashboard.profile.success_message')}
                </div>
            )}
            
            <div className="profile-actions">
                <PurpleButtonMB48 
                    text={loading ? t('advertiser_dashboard.profile.saving') : t('advertiser_dashboard.profile.save_data')} 
                    onClick={handleSaveProfile}
                    disabled={loading}
                />
            </div>

            <SpokenLanguagesModal
                isOpen={isLanguageModalOpen}
                onClose={() => setIsLanguageModalOpen(false)}
                onSave={handleSaveLanguages}
                initialSelectedLanguages={languages}
            />
        </ProfileSectionStyle>
    );
};

export default ProfileSection;
