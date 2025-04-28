import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckoutProvider } from '../../contexts/checkout-process';
import CheckoutStepper from '../../components/checkout/checkout-stepper';
import RentalApplication from '../../components/checkout/rental-application';
import PaymentMethod from '../../components/skeletons/checkoutprocess/sections/payment-method';
import Confirmation from '../../components/checkout/confirmation';
import SuccessPage from '../../components/checkout/success';
import { initiateCheckout, CheckoutData } from '../../backend/server-actions/CheckoutServerActions';
import LoadingScreen from '../../components/loading/LoadingScreen';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  .checkout-header {
    margin-bottom: 2rem;
    text-align: center;
    
    h1 {
      font: ${Theme.typography.fonts.h2};
      color: ${Theme.colors.black};
      margin-bottom: 0.5rem;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
    }
  }
  
  .checkout-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const propertyId = searchParams.get('propertyId');
    const listingId = searchParams.get('listingId');
    const moveInDate = searchParams.get('moveInDate');
    
    if (!propertyId) {
      setError('Property ID is required. Please return to the property page and try again.');
      setIsLoading(false);
      return;
    }
    
    const loadCheckoutData = async () => {
      try {
        console.log(`Initiating checkout for propertyId=${propertyId}`);
        const data = await initiateCheckout(propertyId, listingId || undefined);
        setCheckoutData(data);
        
        if (moveInDate) {
          const rentalData = {
            movingDate: moveInDate,
            visitDate: '',
            message: ''
          };
          localStorage.setItem('rentalApplicationData', JSON.stringify(rentalData));
        }
      } catch (err) {
        console.error('Error loading checkout data:', err);
        setError('Failed to load checkout data. The property may not exist or is no longer available.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCheckoutData();
  }, [searchParams]);

  const handleNavigate = (step: number) => {
    setActiveStep(step);
  };

  const renderStep = () => {
    if (!checkoutData) return null;
    
    switch (activeStep) {
      case 1:
        return <RentalApplication userData={checkoutData.user} propertyData={checkoutData.property} />;
      case 2:
        return <PaymentMethod />;
      case 3:
        return <Confirmation propertyData={checkoutData.property} userData={checkoutData.user} />;
      case 4:
        return <SuccessPage propertyData={checkoutData.property} />;
      default:
        return <RentalApplication userData={checkoutData.user} propertyData={checkoutData.property} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (error) {
    return (
      <CheckoutContainer>
        <div className="checkout-header">
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutProvider onNavigate={handleNavigate}>
      <CheckoutContainer>
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your reservation request</p>
        </div>
        
        <div className="checkout-content">
          <CheckoutStepper activeStep={activeStep} />
          {renderStep()}
        </div>
      </CheckoutContainer>
    </CheckoutProvider>
  );
};

export default CheckoutPage; 