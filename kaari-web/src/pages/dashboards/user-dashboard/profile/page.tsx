import React from 'react';
import { ProfilePageStyle } from './styles';
import Picture from "../../../../assets/images/ProfilePicture.png" ;
import VerifyEmailCardComponent from '../../../../components/skeletons/cards/verify-email-card';
import { GoogleCard } from '../../../../components/skeletons/cards/google-card';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
const ProfilePage: React.FC = () => {
    return (
        <ProfilePageStyle>
            <div className="left">
                <h1 className="section-title">Your Profile</h1>
                <div className="profile-content">
                    <div className="profile-info">
                        <div className="profile-image">
                            <img src={Picture} alt="Profile" />
                            <button className="edit-button">Edit</button>
                        </div>
                        <div className="your-info-text">Your Information</div>
                        <div className="profile-details">
                            <div className="detail-group">
                                <label>Full Name</label>
                                <input type="text" value="John Doe" readOnly />
                            </div>
                            <div className="detail-group">
                                <label>Email</label>
                                <input type="email" value="john.doe@example.com" readOnly />
                            </div>
                            <div className="detail-group">
                                <label>Phone</label>
                                <input type="tel" value="+1 234 567 8900" readOnly />
                            </div>
                            <div className="detail-group">
                                <label>Address</label>
                                <input type="text" value="123 Main St, City, Country" readOnly />
                            </div>
                        </div>
                        <div className="profile-actions">
                            <PurpleButtonMB48 text="Save Data" />
                        </div>
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
        </ProfilePageStyle>
    );
};

export default ProfilePage;
