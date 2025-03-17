import React from 'react';
import { ContactsPageStyle } from './styles';

const ContactsPage: React.FC = () => {
    return (
        <ContactsPageStyle>
            <h1 className="section-title">Contacts</h1>
            <div className="contacts-content">
                <p>Your contacts will appear here.</p>
            </div>
        </ContactsPageStyle>
    );
};

export default ContactsPage;
