import React, { useState } from 'react';
import { RecommendToFriendStyle } from './styles';
import image from '../../../../../../assets/images/Frame.png';
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
            
            <img 
                className="recommend-to-friend-image" 
                src={image} 
                alt="Recommend to a friend" 
            />
        </RecommendToFriendStyle>
    );
};

export default RecommendToFriend;
