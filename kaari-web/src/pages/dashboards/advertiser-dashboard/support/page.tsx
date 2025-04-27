import React, { useState } from 'react';
import { ContactsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import Picture from "../../../../assets/images/support.svg" ;
import { GoogleCard } from '../../../../components/skeletons/cards/google-card';
import facebook from "../../../../components/skeletons/icons/facebook.svg"
import twitter from "../../../../components/skeletons/icons/twitter.svg"
import instagram from "../../../../components/skeletons/icons/instagram.svg"
import linkedin from "../../../../components/skeletons/icons/linkedIn.svg"
import InputBaseModel from '../../../../components/skeletons/inputs/input-fields/input-variant';
import TextAreaBaseModel from '../../../../components/skeletons/inputs/input-fields/textarea-variant';
import { sendSupportEmail, isValidEmail, isValidPhoneNumber, SupportFormData } from '../../../../backend/server-actions/SupportServerActions';
import { useToastService } from '../../../../services/ToastService';
import { useTranslation } from 'react-i18next';

const ContactsPage: React.FC = () => {
    const { t } = useTranslation();
    
    // Form state
    const [formData, setFormData] = useState<SupportFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: ''
    });
    
    // Toast service
    const toast = useToastService();
    
    // UI state
    const [formVisible, setFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof SupportFormData, string>>>({});
    
    // Handle form input changes
    const handleInputChange = (field: keyof SupportFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error for this field if it exists
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };
    
    // Validate form data
    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof SupportFormData, string>> = {};
        
        if (!formData.firstName.trim()) {
            errors.firstName = t('advertiser_dashboard.support.validation.first_name_required');
        }
        
        if (!formData.lastName.trim()) {
            errors.lastName = t('advertiser_dashboard.support.validation.last_name_required');
        }
        
        if (!formData.email.trim()) {
            errors.email = t('advertiser_dashboard.support.validation.email_required');
        } else if (!isValidEmail(formData.email)) {
            errors.email = t('advertiser_dashboard.support.validation.invalid_email');
        }
        
        if (formData.phoneNumber.trim() && !isValidPhoneNumber(formData.phoneNumber)) {
            errors.phoneNumber = t('advertiser_dashboard.support.validation.invalid_phone');
        }
        
        if (!formData.subject.trim()) {
            errors.subject = t('advertiser_dashboard.support.validation.subject_required');
        }
        
        if (!formData.message.trim()) {
            errors.message = t('advertiser_dashboard.support.validation.message_required');
        } else if (formData.message.length < 10) {
            errors.message = t('advertiser_dashboard.support.validation.message_length');
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const result = await sendSupportEmail(formData);
            
            if (result.success) {
                // Show success toast
                toast.support.messageSuccess();
                
                // Reset form on successful submission
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    subject: '',
                    message: ''
                });
            } else {
                // Show error toast
                toast.support.messageError(result.message);
            }
        } catch (error) {
            console.error('Error submitting support form:', error);
            toast.support.messageError('An unexpected error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Show form handler
    const handleShowForm = () => {
        setFormVisible(true);
        // Scroll to form section
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <ContactsPageStyle>
            <div className="main-content">
                <div className="contacts-content">
                    <div className="contacts-content-info">
                        <h2 className="contacts-content-info-title">{t('advertiser_dashboard.support.title')}</h2>
                        <p className="contacts-email-number">{t('advertiser_dashboard.support.contact_info')}</p>
                        <p className="contacts-content-description">
                            {t('advertiser_dashboard.support.description')}
                        </p>
                        <div className="form-button">
                            <PurpleButtonMB48 text={t('advertiser_dashboard.support.fill_form')} onClick={handleShowForm} />
                        </div>
                    </div>
                    <img src={Picture} alt="Contact support" />
                </div>

                <div className="social-media-content">
                    <h3 className="social-media-content-title">{t('advertiser_dashboard.support.social_media')}</h3>
                    <div className="social-media-box">
                        <div className="facebook-content">
                            <img src={facebook} alt="Facebook" className="contact-icon" />
                            <p className="-content-title">facebook.com/kaariofficial</p>
                        </div>
                        <div className="facebook-content">
                            <img src={linkedin} alt="Linkedin" className="contact-icon" />
                            <p className="-content-title">linkedin.com/kaariofficial</p>
                        </div>
                        <div className="facebook-content">
                            <img src={twitter} alt="twitter" className="contact-icon" />
                            <p className="-content-title">twitter.com/kaariofficial</p>
                        </div>
                        <div className="facebook-content">
                            <img src={instagram} alt="Instagram" className="contact-icon" />
                            <p className="-content-title">instagram.com/kaariofficial</p>
                        </div>
                    </div>
                </div>

                <div id="contact-form" className="contact-form">
                    <h3 className="contact-form-title">{t('advertiser_dashboard.support.contact_form')}</h3>
                    
                    <div className="contact-form-container">
                        <div className="form-row">
                            <div className="form-group">
                                <InputBaseModel
                                    title={t('advertiser_dashboard.support.first_name')}
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    error={formErrors.firstName}
                                />
                            </div>
                            <div className="form-group">
                                <InputBaseModel
                                    title={t('advertiser_dashboard.support.last_name')}
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    error={formErrors.lastName}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <InputBaseModel
                                    title={t('advertiser_dashboard.support.email')}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={formErrors.email}
                                />
                            </div>
                            <div className="form-group">
                                <InputBaseModel
                                    title={t('advertiser_dashboard.support.phone_number')}
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    error={formErrors.phoneNumber}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <InputBaseModel
                                title={t('advertiser_dashboard.support.subject')}
                                value={formData.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                error={formErrors.subject}
                            />
                        </div>
                        <div className="form-group">
                            <TextAreaBaseModel
                                title={t('advertiser_dashboard.support.message')}
                                value={formData.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                error={formErrors.message}
                            />
                        </div>
                        <div className="form-button">
                            <PurpleButtonMB48
                                text={isSubmitting ? t('advertiser_dashboard.support.sending') : t('advertiser_dashboard.support.send_message')}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="right">
            
            
            </div>
        </ContactsPageStyle>
    );
};

export default ContactsPage;
