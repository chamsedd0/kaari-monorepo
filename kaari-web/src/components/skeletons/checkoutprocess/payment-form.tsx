import React, { useState, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock, FaTimes } from 'react-icons/fa';
import { Theme } from '../../../theme/theme';

export interface PaymentFormData {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentFormProps {
  onSubmit: (formData: PaymentFormData) => void;
  onCancel: () => void;
  onAddCard?: (cardData: any) => void; // For compatibility with payment-method-section
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, onCancel, onAddCard }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };

  // Format expiry date with slash
  const formatExpiryDate = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
      return digits;
    }
    
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Apply formatting based on field
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true,
      });
    }
    
    // Validate field
    validateField(name, formattedValue);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'cardNumber':
        const digitsOnly = value.replace(/\D/g, '');
        if (!digitsOnly) {
          error = 'Card number is required';
        } else if (digitsOnly.length < 13 || digitsOnly.length > 19) {
          error = 'Card number must be between 13 and 19 digits';
        } else if (!luhnCheck(digitsOnly)) {
          error = 'Invalid card number';
        }
        break;
        
      case 'nameOnCard':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        }
        break;
        
      case 'expiryDate':
        const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!value) {
          error = 'Expiry date is required';
        } else if (!expiryPattern.test(value)) {
          error = 'Use MM/YY format';
        } else {
          const [month, year] = value.split('/');
          const now = new Date();
          const currentYear = now.getFullYear() % 100;
          const currentMonth = now.getMonth() + 1;
          
          const expYear = parseInt(year, 10);
          const expMonth = parseInt(month, 10);
          
          if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            error = 'Card has expired';
          }
        }
        break;
        
      case 'cvv':
        if (!value) {
          error = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(value)) {
          error = 'CVV must be 3 or 4 digits';
        }
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined,
    }));
    
    return !error;
  };

  // Luhn algorithm for credit card validation
  const luhnCheck = (cardNumber: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  const validateForm = (): boolean => {
    const fields: (keyof PaymentFormData)[] = ['cardNumber', 'nameOnCard', 'expiryDate', 'cvv'];
    let isValid = true;
    
    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    // Validate all fields
    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      isValid = isValid && fieldValid;
    });
    
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Handle both interfaces
      if (onAddCard) {
        const cardData = {
          id: `card_${Date.now()}`,
          cardNumber: formData.cardNumber,
          cardHolder: formData.nameOnCard,
          expiryDate: formData.expiryDate,
          isDefault: false,
          last4: formData.cardNumber.replace(/\s/g, '').slice(-4),
          brand: detectCardBrand(formData.cardNumber)
        };
        onAddCard(cardData);
      } else {
        onSubmit(formData);
      }
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

  return (
    <FormContainer>
      <FormHeader>
        <h3>Add Payment Method</h3>
        <CloseButton onClick={onCancel}>
          <FaTimes />
        </CloseButton>
      </FormHeader>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="cardNumber">Card Number</Label>
          <InputWrapper>
            <IconWrapper>
              <FaCreditCard />
            </IconWrapper>
            <Input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              maxLength={19}
              hasError={!!(touched.cardNumber && errors.cardNumber)}
            />
          </InputWrapper>
          {touched.cardNumber && errors.cardNumber && (
            <ErrorMessage>{errors.cardNumber}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="nameOnCard">Cardholder Name</Label>
          <InputWrapper>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              id="nameOnCard"
              name="nameOnCard"
              type="text"
              placeholder="John Doe"
              value={formData.nameOnCard}
              onChange={handleInputChange}
              hasError={!!(touched.nameOnCard && errors.nameOnCard)}
            />
          </InputWrapper>
          {touched.nameOnCard && errors.nameOnCard && (
            <ErrorMessage>{errors.nameOnCard}</ErrorMessage>
          )}
        </FormGroup>
        
        <ExpiryAndCvvContainer>
          <FormGroup>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <InputWrapper>
              <IconWrapper>
                <FaCalendarAlt />
              </IconWrapper>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                maxLength={5}
                hasError={!!(touched.expiryDate && errors.expiryDate)}
              />
            </InputWrapper>
            {touched.expiryDate && errors.expiryDate && (
              <ErrorMessage>{errors.expiryDate}</ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="cvv">CVV</Label>
            <InputWrapper>
              <IconWrapper>
                <FaLock />
              </IconWrapper>
              <Input
                id="cvv"
                name="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                maxLength={4}
                hasError={!!(touched.cvv && errors.cvv)}
              />
            </InputWrapper>
            {touched.cvv && errors.cvv && (
              <ErrorMessage>{errors.cvv}</ErrorMessage>
            )}
          </FormGroup>
        </ExpiryAndCvvContainer>
        
        <FormActions>
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">
            Add Card
          </SubmitButton>
        </FormActions>
      </Form>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-top: 20px;
  border: 1px solid ${Theme.colors.tertiary};
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
    font: ${Theme.typography.fonts.largeB};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
  font: ${Theme.typography.fonts.smallB};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  color: ${Theme.colors.gray2};
  font-size: 16px;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : Theme.colors.tertiary};
  border-radius: ${Theme.borders.radius.md};
  font-size: 16px;
  color: #333;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e74c3c' : Theme.colors.secondary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(231, 76, 60, 0.2)' : 'rgba(143, 39, 206, 0.2)'};
  }
  
  &::placeholder {
    color: ${Theme.colors.gray};
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  font: ${Theme.typography.fonts.smallM};
`;

const ExpiryAndCvvContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  background-color: transparent;
  border: 1px solid ${Theme.colors.tertiary};
  color: ${Theme.colors.gray2};
  padding: 10px 16px;
  border-radius: ${Theme.borders.radius.md};
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: ${Theme.borders.radius.md};
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${Theme.colors.primary};
  }
`;

export default PaymentForm; 