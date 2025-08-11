import React, { useState, ChangeEvent } from 'react';
import { ContactDetailsStyle } from './styles';
import InputBaseModel from '../../../../../../components/skeletons/inputs/input-fields/input-variant';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { useTranslation } from 'react-i18next';
import { useToastService } from '../../../../../../services/ToastService';
import { useStore } from '../../../../../../backend/store';
import { updateUserProfile } from '../../../../../../backend/server-actions/UserServerActions';

const ContactDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const toast = useToastService();
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [saving, setSaving] = useState(false);

    const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const validatePhone = (value: string) => value.replace(/[^\d]/g, '').length >= 8;

    const handleSave = async () => {
        if (!user?.id) {
            toast.showToast('error', t('common.error', 'Error'), t('common.not_authenticated', 'Not authenticated')) ;
            return;
        }
        if (email && !validateEmail(email)) {
            toast.showToast('warning', t('common.check_inputs', 'Check inputs'), t('common.invalid_email', 'Please enter a valid email address.'));
            return;
        }
        if (phone && !validatePhone(phone)) {
            toast.showToast('warning', t('common.check_inputs', 'Check inputs'), t('common.invalid_phone', 'Please enter a valid phone number.'));
            return;
        }
        try {
            setSaving(true);
            const updated = await updateUserProfile(user.id, {
                phoneNumber: phone,
                email,
                contactAdditionalInfo: additionalDetails
            });
            setUser(updated);
            toast.showToast('success', t('common.saved', 'Saved'), t('advertiser_dashboard.profile.contact_details.save_success', 'Contact details updated.'));
        } catch (e) {
            toast.showToast('error', t('common.error', 'Error'), t('advertiser_dashboard.profile.contact_details.save_error', 'Failed to update contact details.'));
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    return (
        <ContactDetailsStyle>
            <h1 className="section-title">{t('advertiser_dashboard.profile.contact_details.title')}</h1>
            <p className="section-info">
                {t('advertiser_dashboard.profile.contact_details.additional_info')}
            </p>
            <div className="contact-fields">
                <div className="field-row">
                    <InputBaseModel
                        type="tel"
                        title={t('advertiser_dashboard.profile.contact_details.phone')}
                        placeholder={t('advertiser_dashboard.profile.contact_details.phone_placeholder', 'e.g. +212 6 12 34 56 78')}
                        value={phone}
                        onChange={handleInputChange(setPhone)}
                    />
                    <InputBaseModel
                        type="email"
                        title={t('advertiser_dashboard.profile.contact_details.email')}
                        placeholder={t('advertiser_dashboard.profile.contact_details.email_placeholder', 'name@example.com')}
                        value={email}
                        onChange={handleInputChange(setEmail)}
                    />
                </div>
                <InputBaseModel
                    type="text"
                    title={t('advertiser_dashboard.profile.contact_details.additional_info')}
                    placeholder={t('advertiser_dashboard.profile.contact_details.additional_info_placeholder', 'Optional notes for faster contact')}
                    value={additionalDetails}
                    onChange={handleInputChange(setAdditionalDetails)}
                />
            </div>
            <div className="save-button">
                <PurpleButtonMB48 text={saving ? t('common.saving', 'Saving...') : t('advertiser_dashboard.profile.contact_details.save_changes')} onClick={handleSave} disabled={saving} />
            </div>
        </ContactDetailsStyle>
    );
};

export default ContactDetailsPage;
