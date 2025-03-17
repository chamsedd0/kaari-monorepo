import React from 'react';
import { PaymentsPageStyle } from './styles';

const PaymentsPage: React.FC = () => {
    return (
        <PaymentsPageStyle>
            <h1 className="section-title">Payments</h1>
            <div className="payments-content">
                <p>Your payment history will appear here.</p>
            </div>
        </PaymentsPageStyle>
    );
};

export default PaymentsPage; 