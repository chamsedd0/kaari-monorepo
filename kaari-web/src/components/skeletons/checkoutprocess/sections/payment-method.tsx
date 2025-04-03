import React, { useState } from 'react';
import { PurpleButtonMB48 } from '../../buttons/purple_MB48';
import { BackButton } from '../../buttons/back_button';
import PaymentMethodCard from '../../cards/payment-method-card';
import { FormContainer } from '../../../styles/checkoutprocess/checkout-process-sections-style';

interface PaymentMethodProps {
  onContinue: () => void;
  onBack: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ onContinue, onBack }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const paymentCards = [
    {
      id: 'mastercard',
      cardNumber: '**** **** **** 1234',
      expiryDate: '04/30',
      cardType: 'Mastercard',
      logoSrc: '/mastercard-logo.svg'
    },
    {
      id: 'visa',
      cardNumber: '**** **** **** 5678',
      expiryDate: '05/25',
      cardType: 'Visa',
      logoSrc: '/visa-logo.svg'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    onBack();
    scrollToTop();
  };

  const handleContinue = () => {
    onContinue();
    scrollToTop();
  };

  return (
    <div className="checkout-process-form">
      <div className="checkout-process-form-title">
        Your Payment Methods
      </div>
      
      <FormContainer>
        <div className="saved-cards">
          {paymentCards.map(card => (
            <PaymentMethodCard
              key={card.id}
              cardNumber={card.cardNumber}
              expiryDate={card.expiryDate}
              cardType={card.cardType}
              logoSrc={card.logoSrc}
              isSelected={selectedCard === card.id}
              onClick={() => setSelectedCard(card.id)}
            />
          ))}
        </div>
        
        <div className="add-payment-method">
          <button className="add-payment-button" onClick={() => console.log('Add payment method')}>
            + Add another payment method
          </button>
        </div>
      </FormContainer>
      
      <div className="button-container">
        <BackButton onClick={handleBack} />
        <PurpleButtonMB48 
          text="Proceed" 
          onClick={handleContinue}
          disabled={!selectedCard} 
        />
      </div>
    </div>
  );
};

export default PaymentMethod; 