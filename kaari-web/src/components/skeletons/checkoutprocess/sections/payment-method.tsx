import React, { useState, useEffect } from 'react';
import { useCheckoutContext } from '../../../../contexts/checkout-process';
import { PaymentMethodContainer } from '../../../styles/checkoutprocess/checkout-process-sections-style';
import { FaArrowLeft } from 'react-icons/fa';
import { Theme } from '../../../../theme/theme';
import HaaniOptions from '../../../checkout/haani-options';

const ProtectionOptions: React.FC = () => {
  const { 
    navigateToRentalApplication, 
    navigateToConfirmation, 
    savePaymentMethod 
  } = useCheckoutContext();
  
  // Add Haani options state
  const [protectionOption, setProtectionOption] = useState<'haani' | 'haaniMax'>('haani');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Add effect to make the back button more visible after page load
  useEffect(() => {
    const backButton = document.querySelector('.actions-container .back-button');
    if (backButton) {
      backButton.classList.add('highlight');
      setTimeout(() => {
        backButton.classList.remove('highlight');
      }, 1500);
    }
  }, []);
  
  const handleProceed = () => {
    // Save the selected protection option in the checkout context
    savePaymentMethod({
      id: `protection_${Date.now()}`,
      type: 'protection',
      details: {
        protectionType: protectionOption
      },
      // Include the protection option
      protectionOption: protectionOption,
      // Include additional cost if Haani Max is selected
      additionalCost: protectionOption === 'haaniMax' ? 250 : 0
    });
    
    // Navigate to the next step
    navigateToConfirmation();
  
    // Emit event for scroll to top component
    import('../../../../utils/event-bus').then(({ default: eventBus, EventType }) => {
      eventBus.emit(EventType.CHECKOUT_STEP_CHANGED);
    });
  };

  return (
    <PaymentMethodContainer>
      <h2>Protection Options</h2>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <div className="payment-section">
        <HaaniOptions 
          selectedOption={protectionOption}
          onSelectOption={setProtectionOption}
        />
      </div>
      
      <div className="actions-container">
        <button className="back-button" onClick={navigateToRentalApplication}>
          <FaArrowLeft className="icon" /> Back
        </button>
        <button className="continue-button" onClick={handleProceed}>
          Continue
        </button>
      </div>
    </PaymentMethodContainer>
  );
};

export default ProtectionOptions; 