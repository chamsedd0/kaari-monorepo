import React, { useState } from 'react';
import { CheckoutProcessStyle } from '../../../pages/checkout-process/styles';
import Logo from '../../../assets/images/purpleLogo.svg';
import CheckoutProgressBar from '../banners/status/banner-checkout-progressbar';
import { CheckoutCard } from '../cards/checkout-card';
import PropertyImage from '../../../assets/images/livingRoomExample.png';
import ProfileImage from '../../../assets/images/ProfilePicture.png';
import { 
  RentalApplication, 
  PaymentMethod, 
  Confirmation, 
  Success 
} from './sections';
import { CheckoutProvider } from '../../../contexts/checkout-process';

// Define the possible status types for the Success component
type SuccessStatusType = 'success' | 'pending' | 'rejected' | 'payment_failed' | 'refund_processing';

interface CheckoutProcessContainerProps {
  initialStep?: number;
  successStatus?: SuccessStatusType;
  propertyData?: {
    id: string;
    title: string;
    image?: string;
    images?: string[]; // Add images array
    moveInDate: string;
    lengthOfStay: string;
    profileImage: string;
    profileName: string;
    monthlyRent: string;
    securityDeposit: string;
    serviceFee: string;
    total: string;
  };
}

const CheckoutProcessContainer: React.FC<CheckoutProcessContainerProps> = ({ 
  initialStep = 1,
  successStatus = 'success',
  propertyData
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [status, setStatus] = useState<SuccessStatusType>(successStatus);
  
  // Default property data if none provided
  const defaultPropertyData = {
    id: '1',
    title: "Modern Apartment in Agadir",
    image: PropertyImage,
    moveInDate: "05.09.2024",
    lengthOfStay: "1 month",
    profileImage: ProfileImage,
    profileName: "Leonardo V.",
    monthlyRent: "2000€",
    securityDeposit: "0€",
    serviceFee: "400€",
    total: "2400€"
  };
  
  const property = propertyData || defaultPropertyData;
  
  // Get the display image from either the first image in the images array, the image property, or the default
  const displayImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : (property.image || PropertyImage);
  
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
        return <PaymentMethod />;
      case 3:
        return <Confirmation onContinue={handleNext} onBack={handleBack} />;
      case 4:
        return <Success onDone={handleDone} status={status} />;
      default:
        return <RentalApplication onContinue={handleNext} />;
    }
  };
  
  return (
    <CheckoutProcessStyle>
      <div className="checkout-process-header">
        <img src={Logo} alt="Logo" className="logo" />
        <CheckoutProgressBar currentStep={currentStep === 4 ? 3 : currentStep} />
      </div>
      
      <CheckoutProvider onNavigate={(step) => setCurrentStep(step)}>
        <div className="checkout-process-content">
          <div className="checkout-process-form">
            {renderCurrentStep()}
          </div>
          
          <div className="checkout-process-property-card">
            <CheckoutCard
              image={displayImage}
              title={property.title}
              moveInDate={property.moveInDate}
              lengthOfStay={property.lengthOfStay}
              profileImage={property.profileImage}
              profileName={property.profileName}
              monthlyRent={property.monthlyRent}
              securityDeposit={property.securityDeposit}
              serviceFee={property.serviceFee}
              total={property.total}
            />
          </div>
        </div>
      </CheckoutProvider>
      
      {/* Demo controls for changing status - REMOVE IN PRODUCTION */}
      {process.env.NODE_ENV === 'development' && (
        <div className="demo-controls">
          <h3>Demo Controls (Development Only)</h3>
          <div className="button-group">
            <button onClick={() => changeStatus('success')}>Success</button>
            <button onClick={() => changeStatus('pending')}>Pending</button>
            <button onClick={() => changeStatus('rejected')}>Rejected</button>
            <button onClick={() => changeStatus('payment_failed')}>Payment Failed</button>
            <button onClick={() => changeStatus('refund_processing')}>Refund Processing</button>
          </div>
        </div>
      )}
    </CheckoutProcessStyle>
  );
};

export default CheckoutProcessContainer; 