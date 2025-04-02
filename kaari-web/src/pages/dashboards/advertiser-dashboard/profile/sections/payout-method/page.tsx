import React, { useState } from 'react';
import { PayoutMethodStyle } from './styles';
import Mastercard from '../../../../../../components/skeletons/cards/mastercard';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { CompletedPaymentCard } from '../../../../../../components/skeletons/cards/completed-payment-card';
const PayoutMethodPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payout' | 'complete'>('payout');

  return (
    <PayoutMethodStyle>
      <div className="title-container">
        <h1 className="title">Payout Method</h1>
        <div className="payout-complete-container">
          <div 
            className={`payout-text ${activeTab === 'payout' ? 'active' : ''}`}
            onClick={() => setActiveTab('payout')}
          >
            Payout
          </div>
          <div 
            className={`payout-text ${activeTab === 'complete' ? 'active' : ''}`}
            onClick={() => setActiveTab('complete')}
          >
            Completed
          </div>
        </div>
      </div>

      <div className="content-container">
       
        
        {activeTab === 'payout' && (
          <div className="content-container">
             <h2 className="content-title">Payout methods</h2>
                <p className="content-description">
                Manage your payout methods using our secure payment system
                </p>
                <Mastercard
                  cardNumber="1234"
                  expirationDate=" 04/30"
                  title="Master Card"
                  onClick={() => {}}
                />
                <div className="add-payment-method-button">
                  <PurpleButtonMB48 text="Add payment method" onClick={() => {}} />
                </div>
          </div>
        )}
        
        {activeTab === 'complete' && (
          <div className="content-container">
          <h2 className="content-title">Completed</h2>
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
          </div>
        )}
      </div>
    </PayoutMethodStyle>
  );
};

export default PayoutMethodPage;

