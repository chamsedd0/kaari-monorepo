import React, { useState, ChangeEvent } from 'react';
import { ChangePasswordStyle } from './styles';
import InputBaseModel from '../../../../../../components/skeletons/inputs/input-fields/input-variant';
import { PurpleButtonWhiteText } from '../../../../../../components/styles/buttons/interfaces/purple_button_white_text';

const ChangePasswordPage: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = () => {
        // Implement password change logic here
        console.log('Changing password...');
    };

    const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    return (
        <ChangePasswordStyle>
            <h1 className="section-title">Change Password</h1>
            <p className="section-info">
                If you want to change your password, you have to enter your current password first. 
                If you have any trouble remembering your password, you can contact Kaari Support for help.
            </p>
            <div className="password-fields">
                <div className="field-row">
                    <InputBaseModel
                        type="password"
                        title="Current Password"
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={handleInputChange(setCurrentPassword)}
                    />
                </div>
                <div className="field-row double">
                    <InputBaseModel
                        type="password"
                        title="New Password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={handleInputChange(setNewPassword)}
                    />
                    <InputBaseModel
                        type="password"
                        title="Re-enter New Password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={handleInputChange(setConfirmPassword)}
                    />
                </div>
            </div>
            <PurpleButtonWhiteText className="save-button" onClick={handleSave}>
                Save Changes
            </PurpleButtonWhiteText>
        </ChangePasswordStyle>
    );
};

export default ChangePasswordPage;
