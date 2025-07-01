import React, { useState, ChangeEvent } from 'react';
import { ContactDetailsStyle } from './styles';
import InputBaseModel from '../../../../../../components/skeletons/inputs/input-fields/input-variant';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { useTranslation } from 'react-i18next';

const ContactDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');

    const handleSave = () => {
        // Implement contact details update logic here
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
                        type="text"
                        title={t('advertiser_dashboard.profile.contact_details.phone')}
                        placeholder={t('advertiser_dashboard.profile.contact_details.phone_placeholder')}
                        value={phone}
                        onChange={handleInputChange(setPhone)}
                    />
                    <InputBaseModel
                        type="text"
                        title={t('advertiser_dashboard.profile.contact_details.email')}
                        placeholder={t('advertiser_dashboard.profile.contact_details.email_placeholder')}
                        value={email}
                        onChange={handleInputChange(setEmail)}
                    />
                </div>
                <InputBaseModel
                    type="text"
                    title={t('advertiser_dashboard.profile.contact_details.additional_info')}
                    placeholder={t('advertiser_dashboard.profile.contact_details.additional_info_placeholder')}
                    value={additionalDetails}
                    onChange={handleInputChange(setAdditionalDetails)}
                />
            </div>
            <div className="save-button">
                <PurpleButtonMB48 text={t('advertiser_dashboard.profile.contact_details.save_changes')} onClick={handleSave} />
            </div>
        </ContactDetailsStyle>
    );
};

export default ContactDetailsPage;
