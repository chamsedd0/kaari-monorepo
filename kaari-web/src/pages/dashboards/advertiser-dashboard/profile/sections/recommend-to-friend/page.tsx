import React, { useState } from 'react';
import { RecommendToFriendStyle } from './styles';
import BannerBg from './bannerBg.svg'
import InputBaseModel1 from '../../../../../../components/styles/inputs/input-fields/input-base-model-style-1';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';

const RecommendToFriend: React.FC = () => {
    

    

    return (
        <RecommendToFriendStyle>
            <h1 className="title">Recommend to a Friend</h1>
            <h2 className="secondary-title">
            Recommend Kaari to your friends and earn a reward!
            </h2>
            
            <p className="info-text">
            Write the email addresses of property owners you know who need a clever way to rent
            </p>
            
            <div className="input-container">
                <label className="input-label">Separate email addresses with a coma or put each one on a new line </label>
                <InputBaseModel1>
                    <input type="text" placeholder="Emails of property owners" />
                    </InputBaseModel1>
            </div>
            
            <div className="button-container">
                <PurpleButtonMB48 text="Save Changes" />
            </div>
            
            <div className="recommend-banner">
                <img src={BannerBg} alt="Recommend to a friend" />
                <div className="banner-content">
                    <h2>When your friend signs up for Kaari, we send you 100 EUR!</h2>
                    <h3>That sounds great but how does it work?</h3>
                    <p>Thank you for inviting your friends to Kaari! We will send a personalized email to every address you have given us. Each email contains a link with a unique code.</p>
                    <p>When your friend follows the link and signs up to Kaari, we get ready to send you 100 EUR! (We will send it to the account listed in your profile). Once the first tenant pays their first rent (as part of the signing process), we will send you the money!</p>
                    <h3>So... Do you want to recommend some more people?</h3>
                </div>
            </div>
        </RecommendToFriendStyle>
    );
};

export default RecommendToFriend;
