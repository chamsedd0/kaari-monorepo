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
  margin-top: 6rem; /* Increased margin to ensure content is below header */
  
  .checkout-header {
    margin-bottom: 3rem;
    text-align: center;
    
    h1 {
      font: ${Theme.typography.fonts.h2};
      color: ${Theme.colors.black};
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, ${Theme.colors.primary}, ${Theme.colors.secondary});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
      font-size: 16px;
    }
  }
  
  .checkout-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    
    .stepper-container {
      margin-bottom: 2rem;
      padding: 1.5rem 2rem;
      background-color: ${Theme.colors.white};
      border-radius: ${Theme.borders.radius.md};
    }
    
    .checkout-form-container {
      background-color: ${Theme.colors.white};
      border-radius: ${Theme.borders.radius.md};
      border: 1px solid ${Theme.colors.tertiary};
      padding: 2.5rem;
      margin-bottom: 3rem;
    }
  }
  
  .error-container {
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    border: 1px solid ${Theme.colors.tertiary};
    padding: 2rem;
    text-align: center;
    
    h1 {
      font: ${Theme.typography.fonts.h4B};
      color: ${Theme.colors.error};
      margin-bottom: 1rem;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
      margin-bottom: 1.5rem;
    }
    
    button {
      background-color: ${Theme.colors.secondary};
      color: ${Theme.colors.white};
      font: ${Theme.typography.fonts.mediumB};
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: ${Theme.borders.radius.md};
      cursor: pointer;
      transition: background-color 0.3s ease;
      
      &:hover {
        background-color: ${Theme.colors.primary};
      }
    }
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
    const moveInDate = searchParams.get('moveInDate');
    
    if (!propertyId) {
      setError('Property ID is required. Please return to the property page and try again.');
      setIsLoading(false);
      return;
    }
    
    const loadCheckoutData = async () => {
      try {
        console.log(`Initiating checkout for propertyId=${propertyId}`);
        const data = await initiateCheckout(propertyId);
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
    return <LoadingScreen isLoading={isLoading} />;
  }

  if (error) {
    return (
      <CheckoutContainer>
        <div className="checkout-header">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
        <div className="error-container">
          <h1>Something went wrong</h1>
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
          <div className="stepper-container">
            <CheckoutStepper activeStep={activeStep} />
          </div>
          
          <div className="checkout-form-container">
            {renderStep()}
          </div>
        </div>
      </CheckoutContainer>
    </CheckoutProvider>
  );
};

export default CheckoutPage; 