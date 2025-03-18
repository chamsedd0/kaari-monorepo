import React, { useState } from 'react';
import { FAQsPageStyle } from './styles';
import ArrowDown from '../../../../components/skeletons/icons/arrow-down.svg'

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

const FAQsPage: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

    const faqs: FAQ[] = [
        {
            id: 1,
            question: "Is Kaari a rental agency?",
            answer: "No, we are not a real estate agency. Kaari is an online platform that connects people searching for their next home with landlords seeking tenants."
        },
        {
            id: 2,
            question: "My booking request has been accepted. What's next?",
            answer: "Congratulations! Now that your booking is confirmed, you'll receive all the details including the property address, contact information for the landlord or property manager, and check-in instructions. You can access all these details in your booking confirmation email and in your Kaari account dashboard."
        },
        {
            id: 3,
            question: "What if I want to cancel my booking?",
            answer: "If you need to cancel your booking, you can do so through your Kaari account. Please note that cancellation policies vary depending on the property and the timing of your cancellation. You can find the specific cancellation policy for your booking in your reservation details."
        },
        {
            id: 4,
            question: "Can I visit the place before I book?",
            answer: "Yes, in many cases you can arrange a viewing before booking. You can request this by contacting the property owner through our messaging system. Some properties also offer virtual tours which you can access on the property listing page."
        },
        {
            id: 5,
            question: "What if the landlord does not approve my reservation?",
            answer: "If your reservation request is not approved, you won't be charged and you're free to book another property. We recommend completing your profile with all relevant information to increase your chances of approval."
        },
        {
            id: 6,
            question: "How can I pay the rent?",
            answer: "Rent payments can be made through our secure payment system using credit/debit cards or bank transfers. You can set up automatic payments or pay manually each month through your Kaari account dashboard."
        },
        {
            id: 7,
            question: "How can I contact the landlord?",
            answer: "Once your booking is confirmed, you can contact the landlord directly through our messaging system in your Kaari account. This keeps all your communication in one place and provides a record of your conversations."
        }
    ];

    const toggleFAQ = (id: number) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <FAQsPageStyle>
            <h1 className="section-title">Frequently Asked Questions</h1>
            <div className="faqs-content">
                {faqs.map((faq) => (
                    <div key={faq.id} className="faq-item">
                        <div 
                            className="faq-question" 
                            onClick={() => toggleFAQ(faq.id)}
                        >
                            <span className="question-text">{faq.question}</span>
                            <div 
                                className="question-icon"
                                style={{ transform: openFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            >
                                <img src={ArrowDown} className="question-icon-image" alt="Arrow Down" />
                            </div>
                        </div>
                        <div className={`faq-answer ${openFAQ === faq.id ? '' : 'hidden'}`}>
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </FAQsPageStyle>
    );
};

export default FAQsPage;
