import React, { useState } from 'react';
import { FaCreditCard, FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { PaymentMethodContainer } from '../../styles/checkoutprocess/checkout-process-sections-style';
import PaymentForm from './payment-form';

export interface CardData {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

interface PaymentMethodSectionProps {
  onContinue: (selectedCard: CardData | null) => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({ onContinue }) => {
  // Mock initial cards
  const [cards, setCards] = useState<CardData[]>([
    {
      id: 'card_1',
      cardNumber: '•••• •••• •••• 4242',
      cardHolder: 'John Doe',
      expiryDate: '12/25',
      isDefault: true
    }
  ]);
  
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    setError(null);
  };

  const handleSetDefault = (cardId: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
    setSelectedCardId(cardId);
  };

  const handleRemoveCard = (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    
    // If we're removing the selected card, select another one if available
    if (cardId === selectedCardId && updatedCards.length > 0) {
      setSelectedCardId(updatedCards[0].id);
    } else if (updatedCards.length === 0) {
      setSelectedCardId('');
    }
    
    setCards(updatedCards);
  };

  const handleAddCard = (newCard: CardData) => {
    // If this is the first card, make it default
    if (cards.length === 0) {
      newCard.isDefault = true;
    }
    
    setCards([...cards, newCard]);
    setSelectedCardId(newCard.id);
    setShowAddForm(false);
  };

  const handleContinue = () => {
    if (!selectedCardId && cards.length > 0) {
      setError('Please select a payment method to continue');
      return;
    }
    
    if (cards.length === 0) {
      setError('Please add a payment method to continue');
      return;
    }
    
    const selectedCard = cards.find(card => card.id === selectedCardId) || null;
    onContinue(selectedCard);
  };

  return (
    <PaymentMethodContainer>
      <h2>Payment Method</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {cards.length > 0 && (
        <div className="payment-methods-list">
          {cards.map(card => (
            <div 
              key={card.id} 
              className={`card-item ${selectedCardId === card.id ? 'selected' : ''}`}
              onClick={() => handleCardSelect(card.id)}
            >
              <div className="card-icon">
                <FaCreditCard />
              </div>
              
              <div className="card-details">
                <div className="card-number">{card.cardNumber}</div>
                <div className="card-info">
                  <span className="card-holder">{card.cardHolder}</span>
                  <span className="card-expiry">Expires {card.expiryDate}</span>
                </div>
                {card.isDefault && <span className="default-badge">Default</span>}
              </div>
              
              <div className="card-actions">
                {!card.isDefault && (
                  <>
                    <button 
                      className="set-default-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(card.id);
                      }}
                      aria-label="Set as default payment method"
                    >
                      <FaCheck /> Set Default
                    </button>
                    
                    <button 
                      className="remove-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCard(card.id);
                      }}
                      aria-label="Remove payment method"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showAddForm ? (
        <PaymentForm 
          onAddCard={handleAddCard} 
          onCancel={() => setShowAddForm(false)} 
        />
      ) : (
        <button 
          className="add-payment-method-btn" 
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus /> Add Payment Method
        </button>
      )}
      
      <button 
        className="continue-btn" 
        onClick={handleContinue}
        disabled={cards.length === 0}
      >
        Continue to Review
      </button>
    </PaymentMethodContainer>
  );
};

export default PaymentMethodSection; 