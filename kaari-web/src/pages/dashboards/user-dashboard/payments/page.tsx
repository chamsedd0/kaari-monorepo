import React, { useState } from 'react';
import { PaymentsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import SecureIcon from '../../../../components/skeletons/icons/secure-payments.svg';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import Mastercard from '../../../../components/skeletons/cards/mastercard';
import { CompletedPaymentCard } from '../../../../components/skeletons/cards/completed-payment-card';
const PaymentsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'payments' | 'completed'>('payments');

    return (
        <PaymentsPageStyle>
            <div className='container'>
                <div className="title-section">
                    <h1 className="title">Payments</h1>
                    <div className="control-buttons">
                        <button 
                            className={`button ${activeTab === 'payments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payments')}
                        >
                            Payments
                        </button>
                        <button 
                            className={`button ${activeTab === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Completed
                        </button>
                    </div>
                </div>
                <div className="main-section">
                    {activeTab === 'payments' && (
                        <>
                            <h2 className="title">Payment Methods</h2>
                            <p className="subtitle">Manage your payment methods using our secure payment system</p>
                            <div className="payment-info-saved">
                                <Mastercard
                                    cardNumber="1234567890123456"
                                    expirationDate="01/2025"
                                    title="Mastercard"
                                    onClick={() => {}}
                                />
                                
                            </div>
                            <div className="advanced-filtering-button">
                                <PurpleButtonMB48 text="Advanced filtering" />
                            </div>
                        </>
                    )}
                    {activeTab === 'completed' && (
                        <>
                            <h2 className="title">Completed</h2>
                            <CompletedPaymentCard
                                paymentDate="Sep 2024"
                                cardType="Master Card"
                                cardNumber="1234"
                                propertyLocation="Agadir"
                                moveInDate="05.09.2024"
                            />
                            <CompletedPaymentCard
                                paymentDate="Sep 2024"
                                cardType="Master Card"
                                cardNumber="1234"
                                propertyLocation="Agadir"
                                moveInDate="05.09.2024"
                            />
                            <CompletedPaymentCard
                                paymentDate="Sep 2024"
                                cardType="Master Card"
                                cardNumber="1234"
                                propertyLocation="Agadir"
                                moveInDate="05.09.2024"
                            />
                        </>
                    )}
                </div>
            </div>
            <div className='info-container'>
                <div className="payment-safety-card">
                    <img src={SecureIcon} alt="Payment Protection" />
                    <h3>Make all payments through Kaari</h3>
                    <p>
                        Always pay and communicate through Kaari to ensure you're protected under our <span className="terms">Terms of Service</span>, <span className="terms">Payment Terms of Service</span>, cancellation, and other safeguards
                    </p>
                    <span className="learn-more">Learn More</span>
                </div>
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
        </PaymentsPageStyle>
    );
};

export default PaymentsPage; 