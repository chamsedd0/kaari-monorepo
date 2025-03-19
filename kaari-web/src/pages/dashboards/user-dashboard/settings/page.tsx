import React, { useState } from 'react';
import { SettingsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import InputBaseModelWithIcon from '../../../../components/skeletons/inputs/input-fields/input-variant-with-icon';
import InputBaseModel from '../../../../components/skeletons/inputs/input-fields/input-variant';
import VerifyEmailCardComponent from '../../../../components/skeletons/cards/verify-email-card';
import { GoogleCard } from '../../../../components/skeletons/cards/google-card';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';

const SettingsPage: React.FC = () => {
    // Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Email states
    const [currentEmail, setCurrentEmail] = useState('ayoubchaanoune2@gmail.com');
    const [newEmail, setNewEmail] = useState('');
    
    // Handle password changes
    const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPassword(e.target.value);
    };
    
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };
    
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };
    
    // Handle email change
    const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value);
    };

    
    return (
        <SettingsPageStyle>
            <div className="left">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-info">If you want to change your password, you have to enter your current password first. If you have any trouble remembering your password, you can contact Kaari Support for help.</p>
                
                <div className="settings-password-box">
                    <div className="password-field-container">
                        <InputBaseModelWithIcon 
                            title="Current Password"
                            placeholder="Enter your current password"
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                        />
                        <div className="row">
                        <InputBaseModelWithIcon 
                            title="New Password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />
                        <InputBaseModelWithIcon 
                            title="Confirm New Password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        </div>
                    </div>
                </div>
                <div className="save-button">
                    <PurpleButtonMB48 text="Save Changes" />
                </div>
                
                <div className="email-change">
                    <h2 className="email-change-title">Email change</h2>
                    <div className="your-email-info">
                        <div className="current-email">
                            <label>Your current email is: </label>
                        </div>
                        <div className="your-email">
                            <label>{currentEmail}</label>
                        </div>
                    </div>
                    <div className="new-email-box">
                        <div className="new-email-title">
                            New Email
                        </div>
                        <InputBaseModel
                            type="text"
                            placeholder="Enter your new email address"
                            value={newEmail}
                            onChange={handleNewEmailChange}
                        />
                    </div>
                    <div className="save-button">
                        <PurpleButtonMB48 text="Change Email" />
                    </div>
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

        </SettingsPageStyle>
    );
};

export default SettingsPage;
