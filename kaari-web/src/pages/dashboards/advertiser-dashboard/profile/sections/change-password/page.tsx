import React, { useState, ChangeEvent } from 'react';
import { ChangePasswordStyle } from './styles';
import InputBaseModelWithIcon from '../../../../../../components/skeletons/inputs/input-fields/input-variant-with-icon';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { useTranslation } from 'react-i18next';

const ChangePasswordPage: React.FC = () => {
    const { t } = useTranslation();
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
            <h1 className="section-title">{t('advertiser_dashboard.profile.change_password.title')}</h1>
            <p className="section-info">
                {t('advertiser_dashboard.profile.password_requirements')}
            </p>
            
                
            <div className="input-filed">
                <InputBaseModelWithIcon
                    title={t('advertiser_dashboard.profile.change_password.current_password')}
                    placeholder={t('advertiser_dashboard.profile.change_password.current_password_placeholder')}
                    value={currentPassword}
                    onChange={handleInputChange(setCurrentPassword)}
                />
            </div>
                
            <div className="password-fields">
                <InputBaseModelWithIcon
                    title={t('advertiser_dashboard.profile.change_password.new_password')}
                    placeholder={t('advertiser_dashboard.profile.change_password.new_password_placeholder')}
                    value={newPassword}
                    onChange={handleInputChange(setNewPassword)}
                />
                <InputBaseModelWithIcon
                    title={t('advertiser_dashboard.profile.change_password.confirm_password')}
                    placeholder={t('advertiser_dashboard.profile.change_password.confirm_password_placeholder')}
                    value={confirmPassword}
                    onChange={handleInputChange(setConfirmPassword)}
                />
            </div>
            <div className="save-button">
                <PurpleButtonMB48 text={t('advertiser_dashboard.profile.change_password.save_button')} onClick={handleSave} />
            </div>
        </ChangePasswordStyle>
    );
};

export default ChangePasswordPage;
