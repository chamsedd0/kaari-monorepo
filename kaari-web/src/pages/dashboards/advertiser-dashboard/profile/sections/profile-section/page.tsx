import React from 'react';
import { ProfileSectionStyle } from './styles';
import Picture from "../../../../../../assets/images/ProfilePicture.png";
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import InputVariant from '../../../../../../components/skeletons/inputs/input-fields/input-variant';
import SelectFieldDatePicker from '../../../../../../components/skeletons/inputs/select-fields/select-field-date-picker';
import UploadFieldVariant from '../../../../../../components/skeletons/inputs/upload-fields/upload-field-variant';
import TextareaVariant from '../../../../../../components/skeletons/inputs/input-fields/textarea-variant';
import GenderCheckBox from '../../../../../../components/skeletons/inputs/check-box/gander-check-box';
import SelectFieldBaseModel from '../../../../../../components/skeletons/inputs/select-fields/select-field-base-model';

const ProfileSection: React.FC = () => {
    return (
        <ProfileSectionStyle>
            <h1 className="section-title">Your Profile</h1>
            <div className="profile-image-container">
                <div className="profile-image">
                    <img src={Picture} alt="Profile" />
                </div>
                <div className="text-button">Edit Profile Picture</div>
            </div>
            <div className="profile-grid">
                <InputVariant title="Full Name" />
                <InputVariant title="Your Surname" />
                <InputVariant title="Phone Number" />
                <SelectFieldDatePicker /> 
                <div className="profile-inbut-group">
                    <div className="profile-inbut-label">Government ID</div>
                    <UploadFieldVariant label="Passport or Front of ID" />
                </div>
                <UploadFieldVariant label="Back of ID" />
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
            <TextareaVariant title="About Me" />
            <div className="profile-actions">
                <PurpleButtonMB48 text="Save Data" />
            </div>
        </ProfileSectionStyle>
    );
};

export default ProfileSection;
