import React, { useState } from 'react';
import { FaCreditCard, FaCalendarAlt, FaLock, FaUserAlt, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { CardData } from './payment-method-section';

interface PaymentFormProps {
  onAddCard: (card: CardData) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onAddCard, onCancel }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
    cvv?: string;
  }>({});
  const [isDefault, setIsDefault] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpiryDate(formatExpiryDate(value));
  };

  const validateInputs = () => {
    const newErrors: {
      cardNumber?: string;
      cardName?: string;
      expiryDate?: string;
      cvv?: string;
    } = {};
    let isValid = true;

    // Card Number validation
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
      isValid = false;
    } else if (cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      isValid = false;
    }

    // Card Name validation
    if (!cardName) {
      newErrors.cardName = 'Cardholder name is required';
      isValid = false;
    }

    // Expiry Date validation
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
      isValid = false;
    } else {
      const parts = expiryDate.split('/');
      if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
        newErrors.expiryDate = 'Expiry date must be in MM/YY format';
        isValid = false;
      } else {
        const month = parseInt(parts[0], 10);
        const year = parseInt('20' + parts[1], 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
          newErrors.expiryDate = 'Invalid month';
          isValid = false;
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiryDate = 'Card has expired';
          isValid = false;
        }
      }
    }

    // CVV validation
    if (!cvv) {
      newErrors.cvv = 'CVV is required';
      isValid = false;
    } else if (cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateInputs()) {
      const newCard: CardData = {
        id: `card_${Date.now()}`,
        last4: cardNumber.replace(/\s/g, '').slice(-4),
        expMonth: parseInt(expiryDate.split('/')[0], 10),
        expYear: parseInt('20' + expiryDate.split('/')[1], 10),
        brand: getCardBrand(cardNumber),
        name: cardName,
        isDefault: isDefault
      };
      
      onAddCard(newCard);
    }
  };

  const getCardBrand = (number: string): string => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    
    if (firstDigit === '4') return 'Visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'Mastercard';
    if (['34', '37'].includes(firstTwoDigits)) return 'Amex';
    if (['60', '65'].includes(firstTwoDigits)) return 'Discover';
    
    return 'Unknown';
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>
        <h3>Add Payment Method</h3>
        <CloseButton type="button" onClick={onCancel}>
          <FaTimes />
        </CloseButton>
      </FormHeader>
      
      <FormField>
        <Label htmlFor="cardNumber">Card Number</Label>
        <InputWrapper>
          <FaCreditCard className="field-icon" />
          <Input
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            hasError={!!errors.cardNumber}
          />
        </InputWrapper>
        {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
      </FormField>
      
      <FormField>
        <Label htmlFor="cardName">Cardholder Name</Label>
        <InputWrapper>
          <FaUserAlt className="field-icon" />
          <Input
            id="cardName"
            type="text"
            placeholder="John Doe"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            hasError={!!errors.cardName}
          />
        </InputWrapper>
        {errors.cardName && <ErrorMessage>{errors.cardName}</ErrorMessage>}
      </FormField>
      
      <FormRow>
        <FormField>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <InputWrapper>
            <FaCalendarAlt className="field-icon" />
            <Input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              maxLength={5}
              hasError={!!errors.expiryDate}
            />
          </InputWrapper>
          {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
        </FormField>
        
        <FormField>
          <Label htmlFor="cvv">CVV</Label>
          <InputWrapper>
            <FaLock className="field-icon" />
            <Input
              id="cvv"
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              maxLength={4}
              hasError={!!errors.cvv}
            />
          </InputWrapper>
          {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
        </FormField>
      </FormRow>
      
      <CheckboxField>
        <input
          id="setAsDefault"
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        />
        <label htmlFor="setAsDefault">Set as default payment method</label>
      </CheckboxField>
      
      <FormButtons>
        <CancelButton type="button" onClick={onCancel}>Cancel</CancelButton>
        <SubmitButton type="submit">Add Card</SubmitButton>
      </FormButtons>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const FormField = styled.div`
  margin-bottom: 1.25rem;
  flex: 1;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  ${FormField} {
    width: 50%;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  
  .field-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    font-size: 1rem;
  }
`;

const Input = styled.input<{ hasError: boolean }>`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.hasError ? '#e53935' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53935' : '#6200ea'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(229, 57, 53, 0.1)' : 'rgba(98, 0, 234, 0.1)'};
  }
  
  &::placeholder {
    color: #bdbdbd;
  }
`;

const ErrorMessage = styled.p`
  color: #e53935;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  margin-bottom: 0;
`;

const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  input {
    width: 18px;
    height: 18px;
    accent-color: #6200ea;
  }
  
  label {
    font-size: 0.9rem;
    color: #555;
  }
`;

const FormButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #eeeeee;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background: linear-gradient(to right, #6200ea, #9c27b0);
  border: none;
  border-radius: 8px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: linear-gradient(to right, #5000c9, #8c239e);
    box-shadow: 0 4px 8px rgba(98, 0, 234, 0.2);
  }
`;

export default PaymentForm; 