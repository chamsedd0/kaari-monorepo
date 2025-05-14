import React, { useState, useEffect } from 'react';
import { SettingsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import InputBaseModelWithIcon from '../../../../components/skeletons/inputs/input-fields/input-variant-with-icon';
import InputBaseModel from '../../../../components/skeletons/inputs/input-fields/input-variant';
import VerifyEmailCardComponent from '../../../../components/skeletons/cards/verify-email-card';
import { GoogleCard } from '../../../../components/skeletons/cards/google-card';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import { useAuth } from '../../../../contexts/auth/AuthContext';
import { useToastService } from '../../../../services/ToastService';
import { auth } from '../../../../backend/firebase/config';
import { EmailAuthProvider, updatePassword, updateEmail, reauthenticateWithCredential, sendEmailVerification } from 'firebase/auth';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const toastService = useToastService();
    const [isGoogleProvider, setIsGoogleProvider] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Email states
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        if (user) {
            setCurrentEmail(user.email || '');
            // Check if user is using Google authentication
            const isGoogle = auth.currentUser?.providerData[0]?.providerId === 'google.com';
            setIsGoogleProvider(isGoogle);
            
            // Check email verification status
            if (auth.currentUser) {
                setIsEmailVerified(auth.currentUser.emailVerified);
            }
        }
    }, [user]);

    // Handle email verification
    const handleSendVerification = async () => {
        if (!auth.currentUser) {
            toastService.showToast('error', 'Error', 'No user found.');
            return;
        }

        setVerificationLoading(true);
        try {
            await sendEmailVerification(auth.currentUser);
            toastService.showToast('success', 'Success', 'Verification email sent. Please check your inbox.');
        } catch (error: any) {
            console.error('Error sending verification email:', error);
            let errorMessage = 'Failed to send verification email.';
            if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later.';
            }
            toastService.showToast('error', 'Error', errorMessage);
        } finally {
            setVerificationLoading(false);
        }
    };

    // Listen for email verification status changes
    useEffect(() => {
        if (!auth.currentUser) return;

        // Set up an interval to check email verification status
        const interval = setInterval(async () => {
            try {
                await auth.currentUser?.reload();
                setIsEmailVerified(auth.currentUser?.emailVerified || false);
            } catch (error) {
                console.error('Error checking email verification status:', error);
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, []);

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

    const handlePasswordChange = async () => {
        if (isGoogleProvider) {
            toastService.showToast('error', 'Not Available', 'Password change is not available for Google accounts.');
            return;
        }

        if (!currentPassword || !newPassword || !confirmPassword) {
            toastService.showToast('error', 'Validation Error', 'Please fill in all password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toastService.showToast('error', 'Validation Error', 'New passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            toastService.showToast('error', 'Validation Error', 'New password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user || !user.email) throw new Error('No user found');

            // Reauthenticate user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            toastService.showToast('success', 'Success', 'Password updated successfully.');
        } catch (error: any) {
            console.error('Error updating password:', error);
            let errorMessage = 'Failed to update password.';
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Current password is incorrect.';
            }
            toastService.showToast('error', 'Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = async () => {
        if (isGoogleProvider) {
            toastService.showToast('error', 'Not Available', 'Email change is not available for Google accounts. Please manage your email through your Google account settings.');
            return;
        }

        if (!newEmail) {
            toastService.showToast('error', 'Validation Error', 'Please enter a new email address.');
            return;
        }

        if (newEmail === currentEmail) {
            toastService.showToast('error', 'Validation Error', 'New email must be different from current email.');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            toastService.showToast('error', 'Validation Error', 'Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user found');

            await updateEmail(user, newEmail);
            setCurrentEmail(newEmail);
            setNewEmail('');
            setIsEmailVerified(false); // Reset verification status
            
            // Send verification email for new email address
            await sendEmailVerification(user);
            
            toastService.showToast('success', 'Success', 'Email updated successfully. Please check your inbox for verification email.');
        } catch (error: any) {
            console.error('Error updating email:', error);
            let errorMessage = 'Failed to update email.';
            if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Please sign out and sign in again before changing your email.';
            }
            toastService.showToast('error', 'Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsPageStyle>
            <div className="left">
                <h1 className="settings-title">Settings</h1>
                {isGoogleProvider ? (
                    <p className="settings-info warning">You are signed in with Google. Password and email changes must be managed through your Google account settings.</p>
                ) : (
                    <p className="settings-info">If you want to change your password, you have to enter your current password first. If you have any trouble remembering your password, you can contact Kaari Support for help.</p>
                )}
                
                <div className="settings-password-box">
                    <div className="password-field-container">
                        <InputBaseModelWithIcon 
                            title="Current Password"
                            placeholder="Enter your current password"
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                            disabled={isGoogleProvider || loading}
                            type="password"
                        />
                        <div className="row">
                        <InputBaseModelWithIcon 
                            title="New Password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            disabled={isGoogleProvider || loading}
                            type="password"
                        />
                        <InputBaseModelWithIcon 
                            title="Confirm New Password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            disabled={isGoogleProvider || loading}
                            type="password"
                        />
                        </div>
                    </div>
                </div>
                <div className="save-button">
                    <PurpleButtonMB48 
                        text={loading ? "Saving..." : "Save Changes"} 
                        onClick={handlePasswordChange}
                        disabled={isGoogleProvider || loading}
                    />
                </div>
                
                <div className="email-change">
                    <h2 className="email-change-title">Email change</h2>
                    <div className="your-email-info">
                        <div className="current-email">
                            <label>Your current email is: </label>
                        </div>
                        <div className="your-email">
                            <label>{currentEmail}</label>
                            {isEmailVerified && <span className="verified-badge"> (Verified)</span>}
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
                            disabled={isGoogleProvider || loading}
                        />
                    </div>
                    <div className="save-button">
                        <PurpleButtonMB48 
                            text={loading ? "Changing..." : "Change Email"} 
                            onClick={handleEmailChange}
                            disabled={isGoogleProvider || loading}
                        />
                    </div>
                </div>
            </div>
            <div className="right">
                <VerifyEmailCardComponent 
                    isVerified={isEmailVerified}
                    isLoading={verificationLoading}
                    onSendVerification={handleSendVerification}
                    verifyEmailText={isEmailVerified ? "Your email is verified" : ""}
                    infoText={isEmailVerified 
                        ? "Your email has been verified. You can now fully use all features of Kaari."
                        : "Verify your email to ensure the security of your account and access all features of Kaari."}
                />
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
                            onClick: () => handleSendVerification
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
