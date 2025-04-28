import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { User, Property } from '../../backend/entities';
import { useCheckoutContext } from '../../contexts/checkout-process';
import { createCheckoutReservation } from '../../backend/server-actions/CheckoutServerActions';

const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .section-title {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .confirmation-sections {
    display: flex;
    gap: 2rem;
    
    @media (max-width: 992px) {
      flex-direction: column;
    }
    
    .confirmation-details {
      flex: 1;
      
      .detail-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border-radius: ${Theme.borders.radius.md};
        background-color: ${Theme.colors.tertiary};
        
        .section-heading {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid ${Theme.colors.gray};
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          
          .detail-label {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
          }
          
          .detail-value {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            text-align: right;
          }
        }
      }
    }
    
    .confirmation-summary {
      width: 350px;
      
      @media (max-width: 992px) {
        width: 100%;
      }
      
      .summary-section {
        position: sticky;
        top: 2rem;
        padding: 1.5rem;
        border-radius: ${Theme.borders.radius.md};
        background-color: ${Theme.colors.secondary};
        color: white;
        
        .summary-heading {
          font: ${Theme.typography.fonts.largeB};
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .property-details {
          margin-bottom: 1.5rem;
          
          .property-image {
            width: 100%;
            height: 150px;
            border-radius: ${Theme.borders.radius.sm};
            object-fit: cover;
            margin-bottom: 1rem;
          }
          
          .property-title {
            font: ${Theme.typography.fonts.mediumB};
            margin-bottom: 0.5rem;
          }
          
          .property-address {
            font: ${Theme.typography.fonts.smallM};
            opacity: 0.8;
          }
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          
          .summary-label {
            font: ${Theme.typography.fonts.smallM};
            opacity: 0.8;
          }
          
          .summary-value {
            font: ${Theme.typography.fonts.smallB};
          }
        }
        
        .summary-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          margin: 1rem 0;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 1rem 0;
          
          .total-label {
            font: ${Theme.typography.fonts.mediumB};
          }
          
          .total-value {
            font: ${Theme.typography.fonts.largeB};
          }
        }
        
        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin: 1.5rem 0;
          
          input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin-top: 3px;
          }
          
          label {
            font: ${Theme.typography.fonts.smallM};
            opacity: 0.9;
          }
        }
        
        .submit-button {
          width: 100%;
          background-color: white;
          color: ${Theme.colors.secondary};
          border: none;
          padding: 12px;
          border-radius: ${Theme.borders.radius.md};
          font: ${Theme.typography.fonts.mediumB};
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        }
        
        .error-message {
          margin-top: 1rem;
          color: white;
          background-color: rgba(255, 0, 0, 0.2);
          padding: 0.5rem;
          border-radius: ${Theme.borders.radius.sm};
          font: ${Theme.typography.fonts.smallM};
        }
      }
    }
  }
`;

interface ConfirmationProps {
  userData: User;
  propertyData: Property;
}

const Confirmation: React.FC<ConfirmationProps> = ({ userData, propertyData }) => {
  const { navigateToSuccess, selectedPaymentMethod } = useCheckoutContext();
  const [rentalData, setRentalData] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Retrieve rental application data from localStorage
    const savedData = localStorage.getItem('rentalApplicationData');
    if (savedData) {
      setRentalData(JSON.parse(savedData));
    }
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format address
  const formatAddress = (address: Property['address']) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };
  
  const handleSubmit = async () => {
    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }
    
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    if (!rentalData || !rentalData.visitDate) {
      setError('Rental application data is missing');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create reservation using server action
      const reservation = await createCheckoutReservation(
        propertyData.id,
        undefined,
        new Date(rentalData.visitDate),
        rentalData.message || 'No additional message provided.',
        selectedPaymentMethod.id
      );
      
      // Save reservation ID to localStorage for the success page
      localStorage.setItem('lastReservationId', reservation.id);
      
      // Clear rental application data from localStorage
      localStorage.removeItem('rentalApplicationData');
      
      // Navigate to success page
      navigateToSuccess();
    } catch (err: any) {
      console.error('Error creating reservation:', err);
      setError(err.message || 'Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!rentalData) {
    return <div>Loading application data...</div>;
  }
  
  return (
    <ConfirmationContainer>
      <h2 className="section-title">Confirm Your Reservation</h2>
      
      <div className="confirmation-sections">
        <div className="confirmation-details">
          <div className="detail-section">
            <h3 className="section-heading">Rental Application Details</h3>
            
            <div className="detail-row">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{rentalData.fullName}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{rentalData.email}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Phone Number</span>
              <span className="detail-value">{rentalData.phoneNumber}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Visit Date</span>
              <span className="detail-value">{formatDate(rentalData.visitDate)}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Moving Date</span>
              <span className="detail-value">{rentalData.movingDate ? formatDate(rentalData.movingDate) : 'Not specified'}</span>
            </div>
            
            {rentalData.message && (
              <div className="detail-row">
                <span className="detail-label">Additional Information</span>
                <span className="detail-value">{rentalData.message}</span>
              </div>
            )}
          </div>
          
          <div className="detail-section">
            <h3 className="section-heading">Payment Method</h3>
            
            {selectedPaymentMethod ? (
              <>
                <div className="detail-row">
                  <span className="detail-label">Card Type</span>
                  <span className="detail-value">{selectedPaymentMethod.details.brand}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Card Number</span>
                  <span className="detail-value">•••• •••• •••• {selectedPaymentMethod.details.last4}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Expiration</span>
                  <span className="detail-value">{selectedPaymentMethod.details.expiry}</span>
                </div>
              </>
            ) : (
              <div className="detail-row">
                <span className="detail-value">No payment method selected</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="confirmation-summary">
          <div className="summary-section">
            <h3 className="summary-heading">Reservation Summary</h3>
            
            <div className="property-details">
              <img 
                src={propertyData.images[0] || 'https://via.placeholder.com/300x150'} 
                alt={propertyData.title} 
                className="property-image" 
              />
              <h4 className="property-title">{propertyData.title}</h4>
              <p className="property-address">{formatAddress(propertyData.address)}</p>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Visit Date</span>
              <span className="summary-value">{formatDate(rentalData.visitDate)}</span>
            </div>
            
            {rentalData.movingDate && (
              <div className="summary-row">
                <span className="summary-label">Expected Move-in</span>
                <span className="summary-value">{formatDate(rentalData.movingDate)}</span>
              </div>
            )}
            
            <div className="summary-divider"></div>
            
            <div className="summary-row">
              <span className="summary-label">Property Price</span>
              <span className="summary-value">${propertyData.price.toLocaleString()}/month</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Security Deposit</span>
              <span className="summary-value">$0 (due upon acceptance)</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="total-row">
              <span className="total-label">Total Due Now</span>
              <span className="total-value">$0</span>
            </div>
            
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the terms and conditions and understand that this is a request for viewing and/or application for rental pending owner approval.
              </label>
            </div>
            
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting || !termsAccepted}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Reservation Request'}
            </button>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    </ConfirmationContainer>
  );
};

export default Confirmation; 