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

const ContactsPage: React.FC = () => {
    // Form state
    const [formData, setFormData] = useState<SupportFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: ''
    });
    
    // UI state
    const [formVisible, setFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof SupportFormData, string>>>({});
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    
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
        
        // Clear previous submission result when form is edited
        if (submitResult) {
            setSubmitResult(null);
        }
    };
    
    // Validate form data
    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof SupportFormData, string>> = {};
        
        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (formData.phoneNumber.trim() && !isValidPhoneNumber(formData.phoneNumber)) {
            errors.phoneNumber = 'Please enter a valid phone number';
        }
        
        if (!formData.subject.trim()) {
            errors.subject = 'Subject is required';
        }
        
        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            errors.message = 'Message must be at least 10 characters';
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
        setSubmitResult(null);
        
        try {
            const result = await sendSupportEmail(formData);
            setSubmitResult(result);
            
            if (result.success) {
                // Reset form on successful submission
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            console.error('Error submitting support form:', error);
            setSubmitResult({
                success: false,
                message: 'An unexpected error occurred. Please try again later.'
            });
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
                        <h2 className="contacts-content-info-title">Kaari Customer Support Available 24/7</h2>
                        <p className="contacts-email-number">kaariofficial@gmail.com | +2125XXXXXXX</p>
                        <p className="contacts-content-description">
                            Have questions or need assistance? Feel free to reach out to us using the contact form below or through our email and phone number. We're here to help!
                        </p>
                        <div className="form-button">
                            <PurpleButtonMB48 text="Fill the Form" onClick={handleShowForm} />
                        </div>
                    </div>
                    <img src={Picture} alt="Contact support" />
                </div>

                <div className="social-media-content">
                    <h3 className="social-media-content-title">Social Media</h3>
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
                    <h3 className="contact-form-title">Contact us via Form</h3>
                    
                    {submitResult && (
                        <div className={`form-result ${submitResult.success ? 'success' : 'error'}`}>
                            {submitResult.message}
                        </div>
                    )}
                    
                    <div className="contact-form-container">
                        <div className="form-row">
                            <div className="form-group">
                                <InputBaseModel
                                    title="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    error={formErrors.firstName}
                                />
                            </div>
                            <div className="form-group">
                                <InputBaseModel
                                    title="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    error={formErrors.lastName}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <InputBaseModel
                                    title="Email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={formErrors.email}
                                />
                            </div>
                            <div className="form-group">
                                <InputBaseModel
                                    title="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    error={formErrors.phoneNumber}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <InputBaseModel
                                title="Subject"
                                value={formData.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                error={formErrors.subject}
                            />
                        </div>
                        <div className="form-group">
                            <TextAreaBaseModel
                                title="Message"
                                value={formData.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                error={formErrors.message}
                            />
                        </div>
                        <div className="form-button">
                            <PurpleButtonMB48
                                text={isSubmitting ? "Sending..." : "Send Message"}
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
