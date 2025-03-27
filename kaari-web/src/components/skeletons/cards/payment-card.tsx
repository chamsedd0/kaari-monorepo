import React from 'react';
import { PaymentCard } from '../../styles/cards/card-base-model-style-payment';

interface PaymentCardProps {
    title?: string;
    incomeAmount: string;
    incomeText?: string;
    infoItems: Array<{
        title: string;
        number: string;
    }>;
    onViewMore?: () => void;
}

const PaymentCardComponent: React.FC<PaymentCardProps> = ({
    title = "Payment",
    incomeAmount,
    incomeText = "Total Income",
    infoItems,
    onViewMore
}) => {
    return (
        <PaymentCard>
            <div className="title-viewmore-container">
                <h3 className="title">{title}</h3>
                <span className="viewmore-text" onClick={onViewMore}>View More</span>
            </div>

            <div className="income-container">
                <span className="income-amount">{incomeAmount}</span>
                <span className="income-text">{incomeText}</span>
            </div>

            <div className="info-container">
                {infoItems.map((item, index) => (
                    <div key={index} className="title-number-container">
                        <span className="title">{item.title}</span>
                        <span className="number">{item.number}</span>
                    </div>
                ))}
            </div>
        </PaymentCard>
    );
};

export default PaymentCardComponent;

