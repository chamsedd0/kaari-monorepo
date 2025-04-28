import React, { useState, useEffect } from 'react';
import { useCheckoutContext } from '../../../../contexts/checkout-process';
import { PaymentMethodContainer } from '../../../styles/checkoutprocess/checkout-process-sections-style';
import PaymentForm, { PaymentFormData } from '../payment-form';
import { FaCreditCard, FaEllipsisH, FaArrowLeft, FaTimes, FaChevronDown } from 'react-icons/fa';
import MastercardIcon from '/mastercard-icon.svg';
import VisaIcon from '/visa-icon.svg';

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
  onSetDefault: () => void;
  onRemove: () => void;
  isDefault: boolean;
}

const CardListItem: React.FC<CardListItemProps> = ({ 
  card, 
  selected, 
  onSelect
}) => {
  const getCardIcon = (brand: string) => {
    if (brand.toLowerCase().includes('master')) {
      return MastercardIcon;
    } else if (brand.toLowerCase().includes('visa')) {
      return VisaIcon;
    }
    return null;
  };

  const cardIcon = getCardIcon(card.brand);

  return (
  <div
    className={`card-item ${selected ? 'selected' : ''}`}
    onClick={onSelect}
  >
    <div className="card-icon">
        {cardIcon ? (
          <img src={cardIcon} alt={card.brand} className="card-brand-icon" />
        ) : (
          <FaCreditCard size={24} />
        )}
    </div>
    <div className="card-details">
        <div className="card-title">
          {card.brand} <span className="card-number">•••• {card.last4}</span>
        </div>
        <div className="card-info">
          <span className="card-expiry">Expiration: {card.expiry}</span>
        </div>
      </div>
      <div className="card-actions">
        <button className="options-button">
          <FaEllipsisH />
        </button>
      </div>
    </div>
  );
}

const StepIndicator = () => {
  return (
    <div className="step-indicator">
      <div className="step-circles">
        <div className="step-circle">1</div>
        <div className="step-line"></div>
        <div className="step-circle active">2</div>
        <div className="step-line"></div>
        <div className="step-circle">3</div>
      </div>
      <div className="step-labels">
        <span className="step-label">Rental application</span>
        <span className="step-label active">Add card details</span>
        <span className="step-label">Confirmation</span>
      </div>
  </div>
);
};

const PaymentMethod: React.FC = () => {
  const { 
    navigateToRentalApplication, 
    navigateToConfirmation, 
    savePaymentMethod 
  } = useCheckoutContext();
  
  const [savedCards, setSavedCards] = useState([
    { 
      id: 'card1', 
      last4: '1234', 
      brand: 'Master Card', 
      name: 'John Doe', 
      expiry: '04/30',
      isDefault: true
    }
  ]);
  
  const [selectedCardId, setSelectedCardId] = useState<string | null>(savedCards.length > 0 ? savedCards[0].id : null);
  const [showAddNewCard, setShowAddNewCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [rememberCard, setRememberCard] = useState(false);
  
  // Add effect to make the back button more visible after page load
  useEffect(() => {
    const backButton = document.querySelector('.back-button-container .back-button');
    if (backButton) {
      backButton.classList.add('highlight');
      setTimeout(() => {
        backButton.classList.remove('highlight');
      }, 1500);
    }
  }, []);
  
  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    setErrorMessage(null);
  };
  
  const handleAddNewCardClick = () => {
    setShowAddNewCard(true);
  };
  
  const handleCloseAddCard = () => {
    setShowAddNewCard(false);
  };
  
  const handleAddCard = (cardData: any) => {
    // For newly added cards, make it default if it's the first card
    const isFirstCard = savedCards.length === 0;
    
      const newCard = {
      id: cardData.id || `card_${Date.now()}`,
      last4: cardData.last4 || cardData.cardNumber.slice(-4),
      brand: cardData.brand || (cardData.cardNumber.startsWith('5') ? 'Master Card' : 'Visa'),
      name: cardData.cardHolder || cardData.nameOnCard || 'Card Holder',
      expiry: cardData.expiryDate || 'MM/YY',
      isDefault: isFirstCard || cardData.isDefault
    };
    
    // If adding a default card, update other cards
    const updatedCards = isFirstCard || newCard.isDefault 
      ? savedCards.map(card => ({ ...card, isDefault: false }))
      : [...savedCards];
    
    setSavedCards([...updatedCards, newCard]);
    setSelectedCardId(newCard.id);
    setShowAddNewCard(false);
  };
  
  const handleProceed = () => {
    if (!selectedCardId && savedCards.length > 0) {
      setErrorMessage('Please select a payment method to continue');
      return;
    }
    
    if (savedCards.length === 0) {
      setErrorMessage('Please add a payment method to continue');
      return;
    }
    
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
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: any = {};
    
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    }
    
    if (!expiryMonth.trim() || !expiryYear.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    
    if (!cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrorMessage(newErrors.cardNumber || newErrors.expiryDate || newErrors.cvv);
      return;
    }
    
    // Submit the form data
    handleAddCard({
      id: `card_${Date.now()}`,
      cardNumber,
      expiryDate: `${expiryMonth}/${expiryYear}`,
      cvv,
      cardHolder: cardholderName,
      remember: rememberCard,
      last4: cardNumber.replace(/\s/g, '').slice(-4),
      brand: cardNumber.startsWith('5') ? 'Master Card' : 'Visa'
    });
    
    setShowCardForm(false);
  };

  return (
    <PaymentMethodContainer>
      <div className="back-button-container">
        <button 
          className="back-button" 
          onClick={navigateToRentalApplication}
        >
          <FaArrowLeft /> <span>Back</span>
        </button>
      </div>
      
      <h2>Payment Method</h2>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
      </div>
      )}
      
      <div className="payment-section">
        <h3 className="section-title">Your Payment Methods</h3>
        
        {savedCards.length > 0 && (
          <div className="payment-methods-list">
            {savedCards.map(card => (
              <CardListItem
              key={card.id}
                card={card}
                selected={card.id === selectedCardId}
                onSelect={() => handleCardSelect(card.id)}
                onSetDefault={() => {}}
                onRemove={() => {}}
                isDefault={card.isDefault}
            />
          ))}
        </div>
        )}
        
        <button 
          className="add-card-button-link" 
          onClick={() => setShowCardForm(true)}
        >
          Add another payment method +
            </button>
          
          <div className="action-buttons">
            <button 
              className="proceed-button"
              onClick={handleProceed}
            disabled={savedCards.length === 0}
            >
              Proceed
          </button>
        </div>
      </div>
      
      {showCardForm && (
        <div className="payment-method-popup-overlay">
          <div className="payment-method-popup">
            <button className="popup-close" onClick={() => setShowCardForm(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            
            <div className="popup-header">
              <h2>Add a payment method</h2>
            </div>
            
            <div className="card-brands">
              <img src="/visa-icon.svg" alt="Visa" className="card-brand-icon" />
              <img src="/mastercard-icon.svg" alt="MasterCard" className="card-brand-icon" />
            </div>
            
            <form onSubmit={handleCardSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Cardholder name"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <div className="select-wrapper">
                    <select 
                      className="select-input"
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value)}
                      required
                    >
                      <option value="" disabled>Month</option>
                      {Array.from({length: 12}, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="select-wrapper">
                    <select 
                      className="select-input"
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value)}
                      required
                    >
                      <option value="" disabled>Year</option>
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Security code (CVV)"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
              
              <div className="remember-details">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberCard}
                    onChange={(e) => setRememberCard(e.target.checked)}
                  />
                  Save card details for future payments
                </label>
              </div>
              
              <div className="popup-actions">
                <button type="button" className="cancel-button" onClick={() => setShowCardForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="add-card-button">
                  Add card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PaymentMethodContainer>
  );
};

export default PaymentMethod; 