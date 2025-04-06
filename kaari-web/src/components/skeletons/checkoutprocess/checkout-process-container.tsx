import React, { useState } from 'react';
import { CheckoutProcessStyle } from '../../../pages/checkout-process/styles';
import Logo from '../../../assets/images/purpleLogo.svg';
import CheckoutProgressBar from '../banners/status/banner-checkout-progressbar';
import { CheckoutCard } from '../cards/checkout-card';
import PropertyImage from '../../../assets/images/livingRoomExample.png';
import ProfileImage from '../../../assets/images/ProfilePicture.png';
import { WhiteHeaderUsers } from '../constructed/headers/header-users-white';
import { 
  RentalApplication, 
  PaymentMethod, 
  Confirmation, 
  Success 
} from './sections';

// Define the possible status types for the Success component
type SuccessStatusType = 'success' | 'pending' | 'rejected' | 'payment_failed' | 'refund_processing';

interface CheckoutProcessContainerProps {
  initialStep?: number;
  successStatus?: SuccessStatusType;
}

const CheckoutProcessContainer: React.FC<CheckoutProcessContainerProps> = ({ 
  initialStep = 1,
  successStatus = 'success'
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [status, setStatus] = useState<SuccessStatusType>(successStatus);
  
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleDone = () => {
    // Redirect to dashboard or home page
    console.log('Checkout process completed');
    // Here you would typically redirect to a different page
    // or reset the checkout process
  };
  
  // For demo purposes - allows changing the status
  const changeStatus = (newStatus: SuccessStatusType) => {
    setStatus(newStatus);
    setCurrentStep(4); // Move to the Success step
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <RentalApplication onContinue={handleNext} />;
      case 2:
        return <PaymentMethod onContinue={handleNext} onBack={handleBack} />;
      case 3:
        return <Confirmation onContinue={handleNext} onBack={handleBack} />;
      case 4:
        return <Success onDone={handleDone} status={status} />;
      default:
        return <RentalApplication onContinue={handleNext} />;
    }
  };
  
  return (
    <>
      <WhiteHeaderUsers />
      <CheckoutProcessStyle>
        <div className="checkout-process-header">
          <img src={Logo} alt="Logo" />
          <CheckoutProgressBar currentStep={currentStep === 4 ? 3 : currentStep} />
        </div>
        
        <div className="checkout-process-content">
          {renderCurrentStep()}
          
          <div className="checkout-process-property-card">
            <CheckoutCard
              image={PropertyImage}
              title="Modern Apartment in Agadir"
              moveInDate="05.09.2024"
              lengthOfStay="1 month"
              profileImage={ProfileImage}
              profileName="Leonardo V."
              monthlyRent="2000€"
              securityDeposit="0€"
              serviceFee="400€"
              total="2400€"
            />
          </div>
        </div>
        
        {/* Demo controls for changing status - REMOVE IN PRODUCTION */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Demo Controls (Development Only)</h3>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => changeStatus('success')}>Success</button>
              <button onClick={() => changeStatus('pending')}>Pending</button>
              <button onClick={() => changeStatus('rejected')}>Rejected</button>
              <button onClick={() => changeStatus('payment_failed')}>Payment Failed</button>
              <button onClick={() => changeStatus('refund_processing')}>Refund Processing</button>
            </div>
          </div>
        )}
      </CheckoutProcessStyle>
    </>
  );
};

export default CheckoutProcessContainer; 