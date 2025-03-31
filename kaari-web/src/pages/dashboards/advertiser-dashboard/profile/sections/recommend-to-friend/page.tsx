import React, { useState, ChangeEvent } from 'react';
import { RecommendToFriendStyle } from './styles';
import InputBaseModel from '../../../../../../components/skeletons/inputs/input-fields/input-variant';
import { PurpleButtonWhiteText } from '../../../../../../components/styles/buttons/interfaces/purple_button_white_text';

const RecommendToFriendPage: React.FC = () => {
    const [emails, setEmails] = useState('');

    const handleSave = () => {
        // Implement recommend to friend logic here
        console.log('Sending recommendations...');
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmails(e.target.value);
    };

    return (
        <RecommendToFriendStyle>
            <h1 className="section-title">Recommend to friends</h1>
            <div>
                <p className="section-subtitle">
                    Write the email addresses of property owners you know who need a clever way to rent
                </p>
                <InputBaseModel
                    type="text"
                    title="Email Addresses"
                    placeholder="Separate email addresses with a comma or put each one on a new line"
                    value={emails}
                    onChange={handleInputChange}
                />
                <PurpleButtonWhiteText className="save-button" onClick={handleSave}>
                    Save Changes
                </PurpleButtonWhiteText>
            </div>
            <div className="reward-info">
                <h2 className="reward-title">When your friend signs up for Kaari,</h2>
                <h3 className="reward-amount">we send you 100 EUR!</h3>
                <p className="reward-description">
                    That sounds great but how does it work?
                </p>
                <p className="reward-steps">
                    Thank you for inviting your friends to Kaari! We will send a personalized email to every address you have given us. Each email contains a link with a unique code.
                </p>
                <p className="reward-steps">
                    When your friend follows the link and signs up to Kaari, we get ready to send you 100 EUR (We will send it to the account listed in your profile). Once the first tenant pays their first rent (as part of the signing process), we will send you the money!
                </p>
                <p className="reward-question">
                    So... Do you want to recommend some more people?
                </p>
            </div>
        </RecommendToFriendStyle>
    );
};

export default RecommendToFriendPage;
