import React from 'react';
import { ContactsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import Picture from "../../../../assets/images/support.svg" ;
import VerifyEmailCardComponent from '../../../../components/skeletons/cards/verify-email-card';
import { GoogleCard } from '../../../../components/skeletons/cards/google-card';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';

const ContactsPage: React.FC = () => {
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
                        <PurpleButtonMB48 text="Fill the Form" />
                        </div>
                    </div>
                    <img src={Picture} alt="Contact support" />
                </div>

                <div className="social-media-content">
                    <h3 className="social-media-content-title">Social Media</h3>
                    <div className="social-media-box">
                        <div className="facebook-content">
                            <img src="/facebook-icon.svg" alt="Facebook" className="contact-icon" />
                            <p className="-content-title">facebook.com/kaariofficial</p>
                        </div>
                        <div className="facebook-content">
                            <img src="/twitter-icon.svg" alt="Linkedin" className="contact-icon" />
                            <p className="-content-title">linkedin.com/kaariofficial</p>
                        </div>
                        <div className="facebook-content">
                            <img src="/instagram-icon.svg" alt="Instagram" className="contact-icon" />
                            <p className="-content-title">twitter.com/kaariofficial</p>
                        </div>
                        <div className="facebook-content">
                            <img src="/instagram-icon.svg" alt="Instagram" className="contact-icon" />
                            <p className="-content-title">instagram.com/kaariofficial</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form">
                    <h3 className="contact-form-title">Send Us a Message</h3>
                    <div className="contact-form-container">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input type="text" placeholder="Enter your first name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input type="text" placeholder="Enter your last name" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" placeholder="Enter your email address" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input type="tel" placeholder="Enter your phone number" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <input type="text" placeholder="What is this regarding?" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Message</label>
                            <textarea rows={5} placeholder="Type your message here..."></textarea>
                        </div>
                        <button className="submit-button" type="submit">Send Message</button>
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
        </ContactsPageStyle>
    );
};

export default ContactsPage;
