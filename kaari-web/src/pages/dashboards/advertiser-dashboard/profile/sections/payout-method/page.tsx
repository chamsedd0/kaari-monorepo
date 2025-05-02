import React, { useState } from 'react';
import { PayoutMethodStyle } from './styles';
import Mastercard from '../../../../../../components/skeletons/cards/mastercard';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { CompletedPaymentCard } from '../../../../../../components/skeletons/constructed/status-cards/completed-payment-card';
import { useTranslation } from 'react-i18next';

const PayoutMethodPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'payout' | 'complete'>('payout');

  return (
    <PayoutMethodStyle>
      <div className="title-container">
        <h1 className="title">{t('advertiser_dashboard.profile.payout_method.title')}</h1>
        <div className="payout-complete-container">
          <div 
            className={`payout-text ${activeTab === 'payout' ? 'active' : ''}`}
            onClick={() => setActiveTab('payout')}
          >
            {t('advertiser_dashboard.profile.payout_method.payout_tab')}
          </div>
          <div 
            className={`payout-text ${activeTab === 'complete' ? 'active' : ''}`}
            onClick={() => setActiveTab('complete')}
          >
            {t('advertiser_dashboard.profile.payout_method.completed_tab')}
          </div>
        </div>
      </div>

      <div className="content-container">
        {activeTab === 'payout' && (
          <div className="content-container">
             <h2 className="content-title">{t('advertiser_dashboard.profile.payout_method.payment_methods')}</h2>
                <p className="content-description">
                {t('advertiser_dashboard.profile.payout_method.no_payment_methods')}
                </p>
                <Mastercard
                  cardNumber="1234"
                  expirationDate=" 04/30"
                  title={t('advertiser_dashboard.profile.payout_method.title')}
                  onClick={() => {}}
                />
                <div className="add-payment-method-button">
                  <PurpleButtonMB48 text={t('advertiser_dashboard.profile.payout_method.add_payment_method')} onClick={() => {}} />
                </div>
          </div>
        )}
        
        {activeTab === 'complete' && (
          <div className="content-container">
          <h2 className="content-title">{t('advertiser_dashboard.profile.payout_method.completed_transactions')}</h2>
            <CompletedPaymentCard
            paymentDate="Sep 2024"
            cardType="Master Card"
            cardNumber="1234"
            propertyLocation={t('common.default_city')}
            moveInDate="05.09.2024"
            />
            <CompletedPaymentCard
            paymentDate="Sep 2024"
            cardType="Master Card"
            cardNumber="1234"
            propertyLocation={t('common.default_city')}
            moveInDate="05.09.2024"
            />
            <CompletedPaymentCard
            paymentDate="Sep 2024"
            cardType="Master Card"
            cardNumber="1234"
            propertyLocation={t('common.default_city')}
            moveInDate="05.09.2024"
            />
          </div>
        )}
      </div>
    </PayoutMethodStyle>
  );
};

export default PayoutMethodPage;

