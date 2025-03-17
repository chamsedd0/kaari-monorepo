import React from 'react';
import { FAQsPageStyle } from './styles';

const FAQsPage: React.FC = () => {
    return (
        <FAQsPageStyle>
            <h1 className="section-title">Frequently Asked Questions</h1>
            <div className="faqs-content">
                <p>FAQs will appear here.</p>
            </div>
        </FAQsPageStyle>
    );
};

export default FAQsPage;
