import React, { useState } from 'react';
import { useCheckoutContext } from '../../../../contexts/checkout-process';
import { PaymentMethodContainer } from '../../../styles/checkoutprocess/checkout-process-sections-style';
import PaymentForm, { PaymentFormData } from '../payment-form';
import { FaCreditCard, FaUserCircle } from 'react-icons/fa';

interface CardListItemProps {
  card: {
    id: string;
    last4: string;
    brand: string;
    name: string;
    expiry: string;
  };
  selected: boolean;
  onSelect: () => void;
}

const CardListItem: React.FC<CardListItemProps> = ({ card, selected, onSelect }) => (
  <div
    className={`card-item ${selected ? 'selected' : ''}`}
    onClick={onSelect}
  >
    <div className="card-icon">
      <FaCreditCard />
    </div>
    <div className="card-details">
      <div className="card-name">{card.brand} •••• {card.last4}</div>
      <div className="card-holder">
        <FaUserCircle size={12} />
        <span>{card.name}</span>
      </div>
      <div className="card-expiry">Expires {card.expiry}</div>
    </div>
    <div className="card-select">
      <input 
        type="radio" 
        checked={selected} 
        onChange={onSelect}
        name="card-selection"
      />
    </div>
  </div>
);

const PaymentMethod: React.FC = () => {
  const { 
    navigateToRentalApplication, 
    navigateToConfirmation, 
    savePaymentMethod 
  } = useCheckoutContext();
  
  const [savedCards, setSavedCards] = useState([
    { 
      id: 'card1', 
      last4: '4242', 
      brand: 'Visa', 
      name: 'John Doe', 
      expiry: '12/25'
    },
    { 
      id: 'card2', 
      last4: '1234', 
      brand: 'Mastercard', 
      name: 'John Doe', 
      expiry: '09/26'
    }
  ]);
  
  const [selectedCardId, setSelectedCardId] = useState<string | null>(savedCards.length > 0 ? savedCards[0].id : null);
  const [showAddNewCard, setShowAddNewCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    setErrorMessage(null);
  };
  
  const handleAddNewCardClick = () => {
    setShowAddNewCard(true);
    setSelectedCardId(null);
  };
  
  const handleCancelAddCard = () => {
    setShowAddNewCard(false);
    setSelectedCardId(savedCards.length > 0 ? savedCards[0].id : null);
  };
  
  const handleSubmitNewCard = (formData: PaymentFormData) => {
    try {
      // In a real implementation, this would likely call a payment processor API
      const newCard = {
        id: `card${Date.now()}`,
        last4: formData.cardNumber.slice(-4),
        brand: detectCardBrand(formData.cardNumber),
        name: formData.nameOnCard,
        expiry: formData.expiryDate
      };
      
      // Add the new card to saved cards
      const updatedCards = [...savedCards, newCard];
      setSavedCards(updatedCards);
      setSelectedCardId(newCard.id);
      setShowAddNewCard(false);
      setErrorMessage(null);
      
      // Save the selected payment method in the checkout context
      savePaymentMethod({
        id: newCard.id,
        type: 'card',
        details: newCard
      });
    } catch (error) {
      setErrorMessage('There was an error processing your card. Please try again.');
    }
  };
  
  const detectCardBrand = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    
    // Simple detection based on card number prefixes
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    
    return 'Card';
  };
  
  const handleProceed = () => {
    if (!selectedCardId && !showAddNewCard) {
      setErrorMessage('Please select a payment method or add a new card');
      return;
    }
    
    if (selectedCardId) {
      const selectedCard = savedCards.find(card => card.id === selectedCardId);
      if (selectedCard) {
        // Save the selected payment method in the checkout context
        savePaymentMethod({
          id: selectedCard.id,
          type: 'card',
          details: selectedCard
        });
        
        // Navigate to the next step
        navigateToConfirmation();
      }
    }
  };

  return (
    <PaymentMethodContainer>
      <h2>Payment Method</h2>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
      </div>
      )}
      
      {!showAddNewCard && (
        <>
          <div className="payment-methods-list">
            {savedCards.map(card => (
              <CardListItem
              key={card.id}
                card={card}
                selected={card.id === selectedCardId}
                onSelect={() => handleCardSelect(card.id)}
            />
          ))}
        </div>
        
          <div className="add-new-method">
            <button className="add-card-button" onClick={handleAddNewCardClick}>
              + Add New Payment Method
            </button>
          </div>
          
          <div className="action-buttons">
            <button 
              className="back-button" 
              onClick={navigateToRentalApplication}
            >
              Back
            </button>
            <button 
              className="proceed-button"
              onClick={handleProceed}
              disabled={!selectedCardId}
            >
              Proceed
          </button>
        </div>
        </>
      )}
      
      {showAddNewCard && (
        <PaymentForm 
          onSubmit={handleSubmitNewCard}
          onCancel={handleCancelAddCard}
        />
      )}
    </PaymentMethodContainer>
  );
};

export default PaymentMethod; 