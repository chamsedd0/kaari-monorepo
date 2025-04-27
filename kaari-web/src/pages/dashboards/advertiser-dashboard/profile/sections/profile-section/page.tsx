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

const ProfileSection: React.FC = () => {
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    
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
    const [idFront, setIdFront] = useState<File | null>(null);
    const [idBack, setIdBack] = useState<File | null>(null);
    
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
        }
    }, [user]);
    
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
                aboutMe,
                profilePicture
            });
            
            // Upload ID documents if provided
            if (idFront) {
                await uploadGovernmentID(user.id, idFront, idBack || undefined);
            }
            
            // Update user in global store
            setUser(updatedUser);
            setSuccess(true);
            
            // Show success message briefly
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle profile picture change
    const handleProfilePictureChange = (file: File) => {
        setProfilePicture(file);
    };
    
    return (
        <ProfileSectionStyle>
            <h1 className="section-title">Your Profile</h1>
            <div className="profile-image-container">
                <div className="profile-image">
                    <img src={user?.profilePicture || Picture} alt="Profile" />
                </div>
                <UploadFieldModel
                    label="Change Profile Picture"
                    onFileSelect={handleProfilePictureChange}
                    isProfilePicture
                />
            </div>
            <div className="profile-grid">
                <InputVariant 
                    title="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <InputVariant 
                    title="Your Surname" 
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <InputVariant 
                    title="Phone Number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <SelectFieldDatePicker 
                    initialDate={parsedDate}
                    onChange={(date) => {
                        // Convert date object to string format (YYYY-MM-DD)
                        if (date.year && date.month && date.day) {
                            setDateOfBirth(`${date.year}-${date.month}-${date.day}`);
                        }
                    }}
                /> 
                <UploadFieldModel 
                    label="Passport or Front of ID" 
                    hlabel="Government ID"
                    onFileSelect={(file) => setIdFront(file)}
                    fileName={user?.identificationDocuments?.frontId ? "ID Front uploaded" : ""}
                />
                <UploadFieldModel 
                    label="Back of ID" 
                    onFileSelect={(file) => setIdBack(file)}
                    fileName={user?.identificationDocuments?.backId ? "ID Back uploaded" : ""}
                />
               
                <div className="profile-inbut-label">Gender</div>
                <div className="profile-inbut-label">Languages</div>
                <GenderCheckBox 
                    defaultValue={gender}
                    onChange={(value) => setGender(value)}
                />
                <div className="text-button">Add A Language+</div>
            </div>
           
            <SelectFieldBaseModel 
                label="Nationality"
                options={['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Russian', 'Arabic', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Other']} 
                value={nationality}
                onChange={(value) => setNationality(value)}
            />  
           
            <TextareaVariant 
                title="About Me" 
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
                    Profile updated successfully!
                </div>
            )}
            
            <div className="profile-actions">
                <PurpleButtonMB48 
                    text={loading ? "Saving..." : "Save Data"} 
                    onClick={handleSaveProfile}
                    disabled={loading}
                />
            </div>
        </ProfileSectionStyle>
    );
};

export default ProfileSection;
