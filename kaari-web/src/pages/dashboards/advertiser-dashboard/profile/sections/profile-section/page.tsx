import React, { useState, useEffect } from 'react';
import { ProfileSectionStyle } from './styles';
import { useStore } from '../../../../../../backend/store';
import Picture from "../../../../../../assets/images/ProfilePicture.png";
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import InputVariant from '../../../../../../components/skeletons/inputs/input-fields/input-variant';
import SelectFieldDatePicker from '../../../../../../components/skeletons/inputs/select-fields/select-field-date-picker';
import UploadFieldVariant from '../../../../../../components/skeletons/inputs/upload-fields/upload-field-variant';
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
    
    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setSurname(user.surname || '');
            setPhoneNumber(user.phoneNumber || '');
            setDateOfBirth(user.dateOfBirth || '');
            setGender(user.gender || '');
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
                <div className="text-button">Edit Profile Picture</div>
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
                    value={dateOfBirth}
                    onChange={(value) => setDateOfBirth(value)}
                /> 
                <UploadFieldVariant 
                    label="Passport or Front of ID" 
                    hlabel="Government ID"
                    onFileSelect={(file) => setIdFront(file)}
                    showIllustration={true}
                />
                <UploadFieldVariant 
                    label="Back of ID" 
                    onFileSelect={(file) => setIdBack(file)}
                />
                <div className="profile-inbut-group">
                    <div className="profile-inbut-label">Gender</div>
                    <GenderCheckBox 
                        selectedValue={gender}
                        onChange={(value) => setGender(value)}
                    />
                </div>
                <div className="profile-inbut-group">
                    <div className="profile-inbut-label">Languages</div>
                    <div className="text-button">Add A Language+</div>
                </div>
            </div>
            <div className="profile-inbut-group">
                <div className="profile-inbut-label">Nationality</div>
                <SelectFieldBaseModel 
                    options={['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Russian', 'Arabic', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Other']} 
                    value={nationality}
                    onChange={(value) => setNationality(value)}
                />  
            </div>
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
