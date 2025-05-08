import React, { useState, useEffect } from 'react';
import { ProfilePageStyle } from './styles';
import { useStore } from '../../../../backend/store';
import Picture from "../../../../assets/images/ProfilePicture.png";
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
                    toast.profile.documentUploadError('Failed to upload identification documents.');
                    // Continue with the profile update even if ID upload fails
                }
            }
            
            // Update user in global store
            setUser(updatedUser);
            setSuccess(true);
            
            // Show profile update success toast
            toast.profile.updateSuccess();
            
            // Reset file inputs after successful upload
            setProfilePicture(null);
            setIdFront(null);
            setIdBack(null);
            
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
            
            // Show error toast
            toast.profile.updateError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle connecting with Google
    const handleConnectGoogle = async () => {
        if (!user) return;
        
        // This would typically trigger a Google OAuth flow
        // For now, we just simulate it
        try {
            const googleData = {
                googleId: 'google-id-placeholder',
                googleEmail: `${user.email.split('@')[0]}@gmail.com` // Simulated Google email
            };
            
            const updatedUser = await connectWithGoogle(user.id, googleData);
            setUser(updatedUser);
            
            // Show success toast
            toast.app.actionSuccess('Google account connection');
        } catch (err) {
            console.error('Error connecting with Google:', err);
            setError('Failed to connect with Google. Please try again.');
            
            // Show error toast
            toast.app.actionError('Google account connection', 'Failed to connect with Google. Please try again.');
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
        
        // Show success toast
        toast.profile.uploadPhotoSuccess();
    };
    
    return (
        <ProfilePageStyle>
            <div className="left">
                <h1 className="section-title">Your Profile</h1>
                <div className="profile-image-container">
                    <div className="profile-image">
                        <img 
                            src={profilePicturePreview || user?.profilePicture || Picture} 
                            alt="Profile" 
                        />
                    </div>
                    <UploadFieldModel 
                        isProfilePicture={true}
                        onFileSelect={handleProfilePictureChange}
                    />
                </div>
                <div className="profile-grid">
                    <InputBaseModel 
                        title="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <InputBaseModel 
                        title="Your Surname" 
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                    <InputBaseModel 
                        title="Phone Number" 
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
