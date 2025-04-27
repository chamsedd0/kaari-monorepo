import React from 'react';
import { PaymentCard } from '../../styles/cards/card-base-model-style-payment';
import { useTranslation } from 'react-i18next';

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
    title,
    incomeAmount,
    incomeText,
    infoItems,
    onViewMore
}) => {
    const { t } = useTranslation();
    
    return (
        <PaymentCard>
            <div className="title-viewmore-container">
                <h3 className="title">{title || t('advertiser_dashboard.payments.title', 'Payment')}</h3>
                <span className="viewmore-text" onClick={onViewMore}>{t('common.view_more', 'View More')}</span>
            </div>

            <div className="income-container">
                <span className="income-amount">{incomeAmount}</span>
                <span className="income-text">{incomeText || t('advertiser_dashboard.payments.total_income', 'Total Income')}</span>
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

