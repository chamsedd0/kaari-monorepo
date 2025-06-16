import React, { useState } from 'react';
import { PayoutMethodStyle } from './styles';
import Mastercard from '../../../../../../components/skeletons/cards/mastercard';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { CompletedPaymentCard } from '../../../../../../components/skeletons/cards/completed-payment-card';
import { useTranslation } from 'react-i18next';
import { useChecklist } from '../../../../../../contexts/checklist/ChecklistContext';

const PayoutMethodPage: React.FC = () => {
  const { t } = useTranslation();
  const { completeItem } = useChecklist();
  const [activeTab, setActiveTab] = useState<'payout' | 'complete'>('payout');
  const [hasPaymentMethod, setHasPaymentMethod] = useState(true); // Assuming there's already a payment method

  // Mark the checklist item as completed if a payment method exists
  React.useEffect(() => {
    if (hasPaymentMethod) {
      completeItem('add_payout_method');
    }
  }, [hasPaymentMethod, completeItem]);

  // Function to handle adding a new payment method
  const handleAddPaymentMethod = () => {
    // In a real implementation, this would open a modal or form to add payment details
    // For now, we'll just simulate adding a payment method
    setHasPaymentMethod(true);
    completeItem('add_payout_method');
  };

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
                {!hasPaymentMethod ? (
                  <p className="content-description">
                    {t('advertiser_dashboard.profile.payout_method.no_payment_methods')}
                  </p>
                ) : (
                  <Mastercard
                    cardNumber="1234"
                    expirationDate=" 04/30"
                    title={t('advertiser_dashboard.profile.payout_method.title')}
                    onClick={() => {}}
                  />
                )}
                <div className="add-payment-method-button">
                  <PurpleButtonMB48 
                    text={t('advertiser_dashboard.profile.payout_method.add_payment_method')} 
                    onClick={handleAddPaymentMethod} 
                  />
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

