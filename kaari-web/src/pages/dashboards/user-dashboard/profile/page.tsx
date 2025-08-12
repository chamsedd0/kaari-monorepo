import React, { useState, useEffect } from 'react';
import { ProfilePageStyle } from './styles';
import { useStore } from '../../../../backend/store';
import UserAvatar from "../../../../components/UserAvatar";
import VerifyEmailCardComponent from '../../../../components/skeletons/cards/verify-email-card';
import { GoogleCard } from '../../../../components/skeletons/cards/google-card';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import InputBaseModel from '../../../../components/skeletons/inputs/input-fields/input-variant';
import SelectFieldDatePicker from '../../../../components/skeletons/inputs/select-fields/select-field-date-picker';
import UploadFieldModel from '../../../../components/skeletons/inputs/upload-fields/upload-field-variant';
import TextAreaBaseModel from '../../../../components/skeletons/inputs/input-fields/textarea-variant';
import GenderCheckBox from '../../../../components/skeletons/inputs/check-box/gander-check-box';
import SelectFieldBaseModel from '../../../../components/skeletons/inputs/select-fields/select-field-base-model';
import { updateUserProfile, uploadGovernmentID, connectWithGoogle } from '../../../../backend/server-actions/UserServerActions';
import { useToastService } from '../../../../services/ToastService';

const ProfilePage: React.FC = () => {
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const toast = useToastService();
    
    // Form state
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
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
            
            if (idFront) {
                try {
                    if (idBack) {
                        await uploadGovernmentID(user.id, idFront, idBack);
                    } else {
                        await uploadGovernmentID(user.id, idFront);
                    }
                    toast.profile.uploadDocumentSuccess();
                } catch (idError) {
                    console.error('Error uploading government ID:', idError);
                    toast.profile.uploadDocumentError('Failed to upload identification documents.');
                }
            }
            
            setUser(updatedUser);
            setSuccess(true);
            toast.profile.updateSuccess();
            setProfilePicture(null);
            setIdFront(null);
            setIdBack(null);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
            toast.profile.updateError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleConnectGoogle = async () => {
        if (!user) return;
        try {
            const googleData = {
                googleId: 'google-id-placeholder',
                googleEmail: `${user.email.split('@')[0]}@gmail.com`
            };
            const updatedUser = await connectWithGoogle(user.id, googleData);
            setUser(updatedUser);
            toast.app.actionSuccess('Google account connection');
        } catch (err) {
            console.error('Error connecting with Google:', err);
            setError('Failed to connect with Google. Please try again.');
            toast.app.actionError('Google account connection', 'Failed to connect with Google. Please try again.');
        }
    };
    
    const handleProfilePictureChange = (file: File) => {
        setProfilePicture(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicturePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        toast.profile.uploadPhotoSuccess();
    };
    
    return (
        <ProfilePageStyle>
            <div className="left">
                <h1 className="section-title">Your Profile</h1>
                <div className="profile-image-container">
                    <div className="profile-image">
                        <UserAvatar 
                            name={name || user?.name || "User"}
                            profileImage={profilePicturePreview || user?.profilePicture}
                            size={120}
                        />
                        <button className="edit-button" title="Change photo" onClick={() => {}}>
                            ✎
                        </button>
                    </div>
                    <UploadFieldModel 
                        isProfilePicture={true}
                        onFileSelect={handleProfilePictureChange}
                    />
                </div>
                <div className="profile-grid">
                    <InputBaseModel 
                        title="Full Name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <InputBaseModel 
                        title="Your Surname"
                        placeholder="Enter your surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                    <InputBaseModel 
                        title="Phone Number"
                        placeholder="06 XX XX XX XX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <SelectFieldDatePicker 
                        label="Date of Birth"
                        onChange={(value) => setDateOfBirth(`${value.year}-${value.month}-${value.day}`)}
                    />
                    <UploadFieldModel 
                        label="Passport or Front of ID" 
                        hlabel="Government ID"
                        onFileSelect={(file) => setIdFront(file)}
                    />
                    <UploadFieldModel 
                        label="Back of ID" 
                        onFileSelect={(file) => setIdBack(file)}
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
                
                <TextAreaBaseModel 
                    title="About Me"
                    placeholder="Tell us a bit about yourself (studies, work, hobbies...)"
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
                        style={{ borderRadius: 100 }}
                    />
                </div>
            </div>
            <div className="right">
                <VerifyEmailCardComponent 
                    title="Verify Email"
                    infoText="By taking this straightforward step, you will significantly enhance your chances of having your reservations accepted, ensuring a smoother experience for your upcoming plans."
                    verifyEmailText={user?.emailVerified ? "Your email is verified" : "Please verify your email"}
                />
                <GoogleCard 
                    title="Connect to Google" 
                    description="Connect your Google account to your Kaari account to easily sign in and access your reservations." 
                    onConnect={handleConnectGoogle}
                    isConnected={user?.googleConnected}
                />
                <NeedHelpCardComponent 
                    title="Need Help?" 
                    faqItems={[
                        {
                            question: "How do I change my password?",
                            onClick: () => {}
                        },
                        {
                            question: "Why haven't I received my verification email?",
                            onClick: () => {}
                        },
                        {
                            question: "How do I connect my Google account?",
                            onClick: () => {}
                        }
                    ]} 
                />
            </div>
        </ProfilePageStyle>
    );
};

export default ProfilePage;
