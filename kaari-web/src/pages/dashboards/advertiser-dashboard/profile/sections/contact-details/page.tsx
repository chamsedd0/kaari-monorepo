import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

const ContactDetailsStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;

    .section-title {
        font: ${Theme.typography.fonts.h2};
        color: ${Theme.colors.black};
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
`;

const ContactDetailsPage: React.FC = () => {
    return (
        <ContactDetailsStyle>
            <h1 className="section-title">Contact Details</h1>
            <div className="content">
                {/* Content will be added here */}
            </div>
        </ContactDetailsStyle>
    );
};

export default ContactDetailsPage;
