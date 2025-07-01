import React, { useState, useRef, useEffect } from 'react';
import { ModalOverlayStyle, CardDetailsModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';

// Import card logos
import VisaLogo from '../../../skeletons/icons/visa-logo.svg';
import MasterCardLogo from '../../../skeletons/icons/mastercard-logo.svg';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cardDetails: {
    cardNumber: string;
    expiration: string;
    cvv: string;
    zipCode: string;
    country: string;
    rememberCard: boolean;
  }) => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [rememberCard, setRememberCard] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      cardNumber,
      expiration,
      cvv,
      zipCode,
      country,
      rememberCard
    });
    
    onClose();
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiration(value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlayStyle>
      <CardDetailsModalStyle ref={modalRef}>
        <div className="modal-header">
          <div className="logo-container">
            <h2>Add card details</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="card-logos">
            <img src={VisaLogo} alt="Visa" />
            <img src={MasterCardLogo} alt="MasterCard" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="card-number">Card number</label>
              <input
                type="text"
                id="card-number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="+01 234 567 89 10"
                maxLength={16}
                required
              />
            </div>

            <div className="card-inputs">
              <div className="form-group">
                <label htmlFor="expiration">Expiration</label>
                <input
                  type="text"
                  id="expiration"
                  value={expiration}
                  onChange={handleExpirationChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="zip-code">ZIP code</label>
              <input
                type="text"
                id="zip-code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Select country"
                required
              />
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember-card"
                checked={rememberCard}
                onChange={(e) => setRememberCard(e.target.checked)}
              />
              <label htmlFor="remember-card">Remember my payment details</label>
            </div>

            <div className="payment-method-selector">
              <a href="#" onClick={(e) => {
                e.preventDefault();
              }}>
                Choose another payment method
              </a>
            </div>

            <div className="button-container">
              <PurpleButtonLB60 text="Add Card" onClick={handleSubmit} />
            </div>
          </form>
        </div>
      </CardDetailsModalStyle>
    </ModalOverlayStyle>
  );
};

export default CardDetailsModal; 