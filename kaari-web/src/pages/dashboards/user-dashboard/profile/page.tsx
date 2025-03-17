import React from 'react';
import { ProfilePageStyle } from './styles';

const ProfilePage: React.FC = () => {
    return (
        <ProfilePageStyle>
            <h1 className="section-title">My Profile</h1>
            <div className="profile-content">
                <div className="profile-info">
                    <div className="profile-image">
                        <img src="https://via.placeholder.com/150" alt="Profile" />
                        <button className="edit-button">Edit</button>
                    </div>
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
                </div>
                <div className="profile-actions">
                    <button className="primary-button">Edit Profile</button>
                    <button className="secondary-button">Change Password</button>
                </div>
            </div>
        </ProfilePageStyle>
    );
};

export default ProfilePage;
