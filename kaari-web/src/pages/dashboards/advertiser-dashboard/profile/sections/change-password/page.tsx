import React, { useState, ChangeEvent } from 'react';
import { ChangePasswordStyle } from './styles';
import InputBaseModelWithIcon from '../../../../../../components/skeletons/inputs/input-fields/input-variant-with-icon';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { useTranslation } from 'react-i18next';
import { useToastService } from '../../../../../../services/ToastService';
import { updatePassword as updatePasswordAction } from '../../../../../../backend/server-actions/UserServerActions';
import { useStore } from '../../../../../../backend/store';

const ChangePasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const toast = useToastService();
    const user = useStore(state => state.user);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!user?.id) {
            toast.showToast('error', t('common.error', 'Error'), t('common.not_authenticated', 'Not authenticated'));
            return;
        }
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.showToast('warning', t('common.check_inputs', 'Check inputs'), t('common.fill_all_fields', 'Please fill all fields.'));
            return;
        }
        if (newPassword.length < 8) {
            toast.showToast('warning', t('common.check_inputs', 'Check inputs'), t('common.password_too_short', 'Password must be at least 8 characters.'));
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.showToast('warning', t('common.check_inputs', 'Check inputs'), t('common.password_mismatch', 'New passwords do not match.'));
            return;
        }
        try {
            setSaving(true);
            await updatePasswordAction(user.id, currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            toast.showToast('success', t('common.saved', 'Saved'), t('advertiser_dashboard.profile.change_password.success', 'Password updated.'));
        } catch (e) {
            toast.showToast('error', t('common.error', 'Error'), t('advertiser_dashboard.profile.change_password.error', 'Failed to update password.'));
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

  const getStrength = (pwd: string): { label: string; color: string } => {
    if (!pwd) return { label: '', color: '#999' };
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /\d/.test(pwd);
    const hasSym = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasLower, hasUpper, hasNum, hasSym].filter(Boolean).length + (pwd.length >= 12 ? 1 : 0);
    if (pwd.length < 8 || score <= 2) return { label: t('common.weak', 'Weak'), color: '#DC2626' };
    if (score === 3) return { label: t('common.ok', 'Okay'), color: '#F59E0B' };
    return { label: t('common.strong', 'Strong'), color: '#16A34A' };
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
                {newPassword && (
                  <div style={{ marginTop: 6, fontSize: 12, color: getStrength(newPassword).color }}>
                    {t('common.password_strength', 'Password strength')}: {getStrength(newPassword).label}
                  </div>
                )}
                <InputBaseModelWithIcon
                    title={t('advertiser_dashboard.profile.change_password.confirm_password')}
                    placeholder={t('advertiser_dashboard.profile.change_password.confirm_password_placeholder')}
                    value={confirmPassword}
                    onChange={handleInputChange(setConfirmPassword)}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#DC2626' }}>
                    {t('common.password_mismatch', 'New passwords do not match.')}
                  </div>
                )}
            </div>
            <div className="save-button">
                <PurpleButtonMB48 text={saving ? t('common.saving', 'Saving...') : t('advertiser_dashboard.profile.change_password.save_button')} onClick={handleSave} disabled={saving} />
            </div>
        </ChangePasswordStyle>
    );
};

export default ChangePasswordPage;
