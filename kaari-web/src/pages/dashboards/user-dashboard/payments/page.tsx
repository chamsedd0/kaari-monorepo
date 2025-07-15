import React, { useState, useEffect } from 'react';
import { PaymentsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import SecureIcon from '../../../../components/skeletons/icons/secure-payments.svg';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import Mastercard from '../../../../components/skeletons/cards/mastercard';
import { CompletedPaymentCard } from '../../../../components/skeletons/cards/completed-payment-card';
import { getUserPayments } from '../../../../backend/server-actions/PaymentServerActions';
import { formatDate } from '../../../../utils/date-utils';

const PaymentsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'payments' | 'completed'>('payments');
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Load user payments
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const paymentData = await getUserPayments();
                setPayments(paymentData);
                setError(null);
            } catch (err: any) {
                console.error('Error loading payments:', err);
                setError(err.message || 'Failed to load payment data');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Format payment date for display
    const formatPaymentDate = (date: Date) => {
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };

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
                                <PurpleButtonMB48 text="Add payment method" />
                            </div>
                        </>
                    )}
                    {activeTab === 'completed' && (
                        <>
                            <h2 className="title">Completed Payments</h2>
                            
                            {loading ? (
                                <p>Loading payment history...</p>
                            ) : error ? (
                                <p className="error-message">{error}</p>
                            ) : payments.length === 0 ? (
                                <p>No payment history found.</p>
                            ) : (
                                payments.map((paymentItem) => (
                                    <CompletedPaymentCard
                                        key={paymentItem.payment.id}
                                        paymentDate={formatPaymentDate(paymentItem.payment.paymentDate)}
                                        cardType={paymentItem.payment.paymentMethod === 'card' ? "Master Card" : paymentItem.payment.paymentMethod}
                                        cardNumber={paymentItem.payment.transactionId?.slice(-4) || '****'}
                                        propertyLocation={paymentItem.property?.location?.city || 'Unknown Location'}
                                        moveInDate={paymentItem.payment.createdAt ? formatDate(paymentItem.payment.createdAt) : 'Unknown Date'}
                                        amount={`${paymentItem.payment.amount} ${paymentItem.payment.currency || 'MAD'}`}
                                    />
                                ))
                            )}
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