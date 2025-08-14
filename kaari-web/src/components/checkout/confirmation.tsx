import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { User, Property } from '../../backend/entities';
import { useCheckoutContext } from '../../contexts/checkout-process';
import { createCheckoutReservation } from '../../backend/server-actions/CheckoutServerActions';
import BookingSummary from './BookingSummary';
import referralService from '../../services/ReferralService';
import PaymentGatewayService from '../../services/PaymentGatewayService';
import { getDocumentById } from '../../backend/firebase/firestore';

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
        background-color: white;
        border: 1px solid ${Theme.colors.tertiary};
        
        .section-heading {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid ${Theme.colors.tertiary};
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed ${Theme.colors.tertiary};
          
          &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }
          
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
  }
  
  .navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }
  
  .back-button {
    background-color: white;
    color: ${Theme.colors.gray2};
    border: 1px solid ${Theme.colors.tertiary};
    padding: 16px 32px;
    border-radius: 100px;
    font: ${Theme.typography.fonts.mediumB};
    cursor: pointer;
    transition: all 0.3s ease;
    width: 140px;
    
    &:hover {
      border-color: ${Theme.colors.gray2};
    }
  }
`;

interface ConfirmationProps {
  userData: User;
  propertyData: Property;
}

const Confirmation: React.FC<ConfirmationProps> = ({ userData, propertyData }) => {
  const { navigateToSuccess, navigateToPaymentMethod, selectedPaymentMethod } = useCheckoutContext();
  const [rentalData, setRentalData] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brokerExtraFee, setBrokerExtraFee] = useState<number>(0);

  // Price per month is required by effects below; compute it before effects to avoid TDZ issues
  const pricePerMonth = propertyData.price;

  useEffect(() => {
    // Retrieve rental application data from localStorage
    const savedData = localStorage.getItem('rentalApplicationData');
    console.log('Loaded rental data from localStorage:', savedData);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Parsed rental data:', parsedData);
        setRentalData(parsedData);
      } catch (error) {
        console.error('Error parsing rental application data:', error);
      }
    } else {
      console.warn('No rental application data found in localStorage');
    }
  }, []);

  useEffect(() => {
    const fetchBrokerFee = async () => {
      try {
        const ownerId = propertyData.ownerId;
        if (!ownerId) return setBrokerExtraFee(0);
        const user = await getDocumentById<User>('users', ownerId);
        const percent = (user && typeof user.brokerExtraFeePercent === 'number') ? user.brokerExtraFeePercent : 0;
        if (percent > 0) {
          const clamped = Math.max(0, Math.min(75, percent));
          setBrokerExtraFee(Math.round((clamped / 100) * pricePerMonth));
        } else {
          setBrokerExtraFee(0);
        }
      } catch {
        setBrokerExtraFee(0);
      }
    };
    fetchBrokerFee();
  }, [propertyData.ownerId, pricePerMonth]);

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
    
    if (!rentalData) {
      setError('Rental application data is missing');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare a complete set of rental data with proper defaults
      const formattedRentalData = {
        // Personal information
        fullName: rentalData.fullName,
        email: rentalData.email,
        phoneNumber: rentalData.phoneNumber,
        gender: rentalData.gender,
        dateOfBirth: rentalData.dateOfBirth,
        
        // Stay information
        scheduledDate: rentalData.scheduledDate ? new Date(rentalData.scheduledDate) : new Date(),
        leavingDate: rentalData.leavingDate ? new Date(rentalData.leavingDate) : null,
        numPeople: rentalData.numPeople,
        roommates: rentalData.roommates,
        occupationType: rentalData.occupationType,
        studyPlace: rentalData.studyPlace,
        workPlace: rentalData.workPlace,
        occupationRole: rentalData.occupationRole,
        funding: rentalData.funding,
        hasPets: Boolean(rentalData.hasPets),
        hasSmoking: Boolean(rentalData.hasSmoking),
        aboutMe: rentalData.aboutMe,
        message: rentalData.message || '',
        
        // Payment information
        price: pricePerMonth,
        serviceFee: serviceFee,
        totalPrice: totalPrice,
        
        // Discount information
        discount: rentalData.discount,
        
        // Add-ons information (if any)
        addOns: rentalData.addOns || [],
        
        // Protection option
        protectionOption: selectedPaymentMethod?.protectionOption || 'haani',
        haaniMaxFee: haaniMaxFee
      };

      // Calculate the final payment amount including any add-ons
      let finalPaymentAmount = totalPrice;
      
      // Add the cost of any add-ons to the final payment amount
      if (rentalData.addOns && Array.isArray(rentalData.addOns)) {
        const addOnsTotal = rentalData.addOns.reduce((sum: number, addon: any) => {
          return sum + (addon.price || 0);
        }, 0);
        
        finalPaymentAmount += addOnsTotal;
        
        // Update the total price in the formatted data
        formattedRentalData.totalPrice = finalPaymentAmount;
        
        console.log(`Add-ons total: ${addOnsTotal} MAD, Final payment amount: ${finalPaymentAmount} MAD`);
      }

      // Store the reservation data temporarily for after payment
      const pendingReservation = {
        propertyId: propertyData.id,
        propertyTitle: propertyData.title,
        userId: userData.id,
        rentalData: formattedRentalData,
        paymentMethodId: selectedPaymentMethod.id
      };
      
      // Save the pending reservation to localStorage
      localStorage.setItem('pendingReservation', JSON.stringify(pendingReservation));
      
      // Generate a unique order ID
      const orderID = `res_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Prepare payment data
      const paymentData = {
        amount: finalPaymentAmount,
        currency: 'MAD', // Moroccan Dirham
        orderID,
        customerEmail: userData.email || rentalData.email,
        customerName: userData.name || rentalData.fullName,
        redirectURL: `${window.location.origin}/payment-callback?status=success`,
        callbackURL: `${window.location.origin}/api/payment-callback`,
        customData: {
          userId: userData.id,
          propertyId: propertyData.id,
          reservationType: 'rental',
          addOns: rentalData.addOns || [],
          protectionOption: selectedPaymentMethod?.protectionOption || 'haani'
        }
      };
      
      // Initiate payment
      const paymentResponse = await PaymentGatewayService.initiatePayment(paymentData);
      
      if (!paymentResponse.success || !paymentResponse.htmlForm) {
        throw new Error(paymentResponse.error || 'Failed to initiate payment');
      }
      
      // Redirect to payment page
      PaymentGatewayService.redirectToPaymentPage(paymentResponse.htmlForm);
      
      // The rest of the process will be handled by the payment callback page
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError('Failed to submit reservation. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    if (error) setError(null);
  };
  
  const handleBack = () => {
    navigateToPaymentMethod();
    // Emit event for scroll to top component
    import('../../utils/event-bus').then(({ default: eventBus, EventType }) => {
      eventBus.emit(EventType.CHECKOUT_STEP_CHANGED, {} as any);
    });
  };
  
  if (!rentalData) {
    return <div>Loading application data...</div>;
  }
  
  // Calculate fees
  // Kaari tenant commission: 25% of 1st month rent
  const serviceFee = Math.round(pricePerMonth * 0.25);
  // brokerExtraFee computed via effect

  // Apply discount if available
  const discount = rentalData.discount ? {
    amount: rentalData.discount.amount,
    code: rentalData.discount.code
  } : undefined;
  const discountAmount = discount ? discount.amount : 0;

  // HAANI Max retired; single HAANI plan has no extra fee
  const haaniMaxFee = 0;

  // Calculate total price including broker/agency extra fee
  const totalPrice = pricePerMonth + serviceFee + brokerExtraFee - discountAmount + haaniMaxFee;
  
  return (
    <ConfirmationContainer>
      <h2 className="section-title">Confirm Your Reservation</h2>
      
      <div className="confirmation-sections">
        <div className="confirmation-details">
          <div className="detail-section">
            <h3 className="section-heading">Personal Information</h3>
            
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
              <span className="detail-value">{rentalData.phoneNumber || 'Not provided'}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Gender</span>
              <span className="detail-value">{rentalData.gender || 'Not provided'}</span>
            </div>
          </div>
          
          <div className="detail-section">
            <h3 className="section-heading">Stay Information</h3>
            
            <div className="detail-row">
              <span className="detail-label">Move-in Date</span>
              <span className="detail-value">{formatDate(rentalData.scheduledDate)}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Number of People</span>
              <span className="detail-value">{rentalData.numPeople || '1'}</span>
            </div>
            
            {rentalData.roommates && (
              <div className="detail-row">
                <span className="detail-label">Will Live With</span>
                <span className="detail-value">{rentalData.roommates}</span>
              </div>
            )}
            
            <div className="detail-row">
              <span className="detail-label">Occupation</span>
              <span className="detail-value">{rentalData.occupationType === 'study' ? 'Student' : 'Working Professional'}</span>
            </div>
            
            {rentalData.occupationType === 'study' && rentalData.studyPlace && (
              <div className="detail-row">
                <span className="detail-label">Institution</span>
                <span className="detail-value">{rentalData.studyPlace}</span>
              </div>
            )}
            
            {rentalData.occupationType === 'work' && rentalData.workPlace && (
              <div className="detail-row">
                <span className="detail-label">Workplace</span>
                <span className="detail-value">{rentalData.workPlace}</span>
              </div>
            )}
            
            {rentalData.occupationRole && (
              <div className="detail-row">
                <span className="detail-label">{rentalData.occupationType === 'study' ? 'Field of Study' : 'Role'}</span>
                <span className="detail-value">{rentalData.occupationRole}</span>
              </div>
            )}
            
            <div className="detail-row">
              <span className="detail-label">Funding Source</span>
              <span className="detail-value">{rentalData.funding || 'Not specified'}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Has Pets</span>
              <span className="detail-value">{rentalData.hasPets ? 'Yes' : 'No'}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Has Smoking Habits</span>
              <span className="detail-value">{rentalData.hasSmoking ? 'Yes' : 'No'}</span>
            </div>
            
            {rentalData.leavingDate && (
              <div className="detail-row">
                <span className="detail-label">Approximate Leaving Date</span>
                <span className="detail-value">{formatDate(rentalData.leavingDate)}</span>
              </div>
            )}
          </div>
          
          
          
          <div className="navigation-buttons">
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
        
        <div className="booking-summary">
          <BookingSummary
            propertyData={propertyData}
            moveInDate={rentalData.scheduledDate}
            price={pricePerMonth}
            serviceFee={serviceFee}
            brokerExtraFee={brokerExtraFee}
            total={totalPrice}
            termsAgreed={termsAccepted}
            onTermsChange={handleTermsChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            buttonText="Confirm Reservation"
            discount={discount}
            haaniMaxFee={haaniMaxFee}
          />
          
          {error && (
            <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
              {error}
            </div>
          )}
        </div>
      </div>
      
     
    </ConfirmationContainer>
  );
};

export default Confirmation; 