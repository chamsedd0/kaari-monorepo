import React, { useState, ChangeEvent } from 'react';
import { ContactDetailsStyle } from './styles';
import InputBaseModel from '../../../../../../components/skeletons/inputs/input-fields/input-variant';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';

const ContactDetailsPage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');

    const handleSave = () => {
        // Implement contact details update logic here
        console.log('Updating contact details...');
    };

    const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    return (
        <ContactDetailsStyle>
            <h1 className="section-title">Contact Details</h1>
            <p className="section-info">
                Enter your contact information so that the tenants or Kaari Support Team can reach you. 
                It is in your best interests that you enter both email and your phone number
            </p>
            <div className="contact-fields">
                <div className="field-row">
                    <InputBaseModel
                        type="text"
                        title="Phone Number"
                        placeholder="+01234567890"
                        value={phone}
                        onChange={handleInputChange(setPhone)}
                    />
                    <InputBaseModel
                        type="text"
                        title="Email"
                        placeholder="email@email.com"
                        value={email}
                        onChange={handleInputChange(setEmail)}
                    />
                </div>
                <InputBaseModel
                    type="text"
                    title="Additional Contact Details"
                    placeholder="WhatsApp number, additional email, etc."
                    value={additionalDetails}
                    onChange={handleInputChange(setAdditionalDetails)}
                />
            </div>
            <div className="save-button">
                <PurpleButtonMB48 text="Save Changes" onClick={handleSave} />
            </div>
        </ContactDetailsStyle>
    );
};

export default ContactDetailsPage;
