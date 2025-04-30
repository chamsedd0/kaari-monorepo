import React from 'react';
import { CheckoutSummaryCard, CheckoutButton, CheckoutCheckboxContainer } from '../styles/inputs/checkout/checkout-input-style';
import { Property } from '../../backend/entities';
import { Theme } from '../../theme/theme';

interface BookingSummaryProps {
  propertyData: Property;
  moveInDate?: string;
  lengthOfStay?: string;
  price: number;
  serviceFee: number;
  total: number;
  termsAgreed: boolean;
  onTermsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  buttonText?: string;
  showTerms?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  propertyData,
  moveInDate,
  lengthOfStay,
  price,
  serviceFee,
  total,
  termsAgreed,
  onTermsChange,
  onSubmit,
  isSubmitting = false,
  buttonText = 'Proceed',
  showTerms = true
}) => {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format the address
  const formatAddress = (address: Property['address']) => {
    return `${address.city}, ${address.country}`;
  };

  return (
    <CheckoutSummaryCard>
      <div className="card-header">
        <h3>Booking Summary</h3>
      </div>
      <div className="card-content">
        <div className="property-details">
          <img 
            src={propertyData.images?.[0] || 'https://via.placeholder.com/100'} 
            alt={propertyData.title} 
            className="property-image" 
          />
          <div className="property-info">
            <h4 className="property-title">{propertyData.title}</h4>
            <p className="property-location">{formatAddress(propertyData.address)}</p>
            {moveInDate && (
              <p className="property-date">Move-in date: {formatDate(moveInDate)}</p>
            )}
            {lengthOfStay && (
              <p className="property-date">Length of stay: {lengthOfStay}</p>
            )}
          </div>
        </div>

        <div className="info-row">
          <span className="label">Price for 30 days</span>
          <span className="value">{formatCurrency(price)}</span>
        </div>

        <div className="info-row">
          <span className="label">Service fee</span>
          <span className="value">{formatCurrency(serviceFee)}</span>
        </div>

        <div className="info-row total">
          <span className="label">In Total</span>
          <span className="value">{formatCurrency(total)}</span>
        </div>

        {showTerms && (
          <CheckoutCheckboxContainer>
            <input
              id="terms"
              type="checkbox"
              checked={termsAgreed}
              onChange={onTermsChange}
              required
            />
            <label htmlFor="terms">
              I agree to the <a href="#" style={{ color: Theme.colors.secondary, textDecoration: 'underline' }}>Terms and Conditions</a>
            </label>
          </CheckoutCheckboxContainer>
        )}

        <div style={{ marginTop: '20px' }}>
          <CheckoutButton 
            onClick={onSubmit}
            disabled={isSubmitting || (showTerms && !termsAgreed)}
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Processing...' : buttonText}
          </CheckoutButton>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          fontSize: '13px', 
          color: Theme.colors.gray2,
          padding: '8px 0',
          borderTop: `1px solid ${Theme.colors.tertiary}`,
          marginTop: '24px',
          paddingTop: '16px'
        }}>
          <p style={{ margin: 0 }}>
            <a href="#" style={{ color: Theme.colors.secondary, textDecoration: 'underline' }}>
              Cancellation Policy
            </a> for Tenants
          </p>
        </div>
      </div>
    </CheckoutSummaryCard>
  );
};

export default BookingSummary; 