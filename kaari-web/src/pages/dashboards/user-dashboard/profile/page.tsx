import React from 'react';
import { ProfilePageStyle } from './styles';
import Picture from "../../../../assets/images/ProfilePicture.png" ;
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

const ProfilePage: React.FC = () => {
    return (
        <ProfilePageStyle>
            <div className="left">
                <h1 className="section-title">Your Profile</h1>
                <div className="profile-image-container">
                    <div className="profile-image">
                        <img src={Picture} alt="Profile" />
                    </div>
                    <div className="text-button">Edit Profile Picture</div>
                </div>
                    <div className="profile-grid">
                        <InputBaseModel title="Full Name" />
                        <InputBaseModel title="Your Surname" />
                        <InputBaseModel title="Phone Number" />
                        <SelectFieldDatePicker /> 
                        <div className="profile-inbut-group">
                            <div className="profile-inbut-label">Government ID</div>
                            <UploadFieldModel label="Passport or Front of ID" />
                        </div>
                        <UploadFieldModel label="Back of ID" />
                        <div className="profile-inbut-group">
                            <div className="profile-inbut-label">Gender</div>
                            <GenderCheckBox />
                            
                        </div>
                        <div className="profile-inbut-group">
                            <div className="profile-inbut-label">Languages</div>
                            <div className="text-button">Add A Language+</div>
                        </div>
                    </div>
                    <div className="profile-inbut-group">
                    <div className="profile-inbut-label">Nationality</div>
                   <SelectFieldBaseModel options={['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Russian', 'Arabic', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Other']} />  
                   </div>
                    <TextAreaBaseModel title="About Me" />
                    <div className="profile-actions">
                        <PurpleButtonMB48 text="Save Data" />
                    </div>
            </div>
            <div className="right">
                <VerifyEmailCardComponent />
                <GoogleCard title="Connect to Google" description="Connect your Google account to your Kaari account to easily sign in and access your reservations." />
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
