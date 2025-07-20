import React, { createContext, useContext, ReactNode } from 'react';
import usePaymentMethodModal, { UsePaymentMethodModalResult } from '../hooks/usePaymentMethodModal';
import PaymentMethodRequiredModal from './modals/PaymentMethodRequiredModal';

// Extended interface with ensurePaymentMethod
export interface PaymentMethodContextType extends UsePaymentMethodModalResult {
  ensurePaymentMethod: (callback: () => void) => Promise<void>;
}

// Create context
const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

// Hook to use the context
export function usePaymentMethod(): PaymentMethodContextType {
  const context = useContext(PaymentMethodContext);
  
  if (context === undefined) {
    throw new Error('usePaymentMethod must be used within a PaymentMethodProvider');
  }
  
  return context;
}

interface PaymentMethodProviderProps {
  children: ReactNode;
}

export function PaymentMethodProvider({ children }: PaymentMethodProviderProps) {
  const paymentMethodModal = usePaymentMethodModal();
  
  // Helper function to ensure a payment method exists before proceeding
  const ensurePaymentMethod = async (callback: () => void) => {
    const hasMethod = await paymentMethodModal.checkPaymentMethod();
    
    if (hasMethod) {
      callback();
    } else {
      paymentMethodModal.openModal();
    }
  };
  
  // Create the context value with all properties
  const contextValue: PaymentMethodContextType = {
    ...paymentMethodModal,
    ensurePaymentMethod
  };
  
  return (
    <PaymentMethodContext.Provider value={contextValue}>
      {children}
      
      <PaymentMethodRequiredModal
        open={paymentMethodModal.isModalOpen}
        onClose={paymentMethodModal.closeModal}
        onSuccess={paymentMethodModal.checkPaymentMethod}
      />
    </PaymentMethodContext.Provider>
  );
}

// Default export for backward compatibility
export default PaymentMethodProvider; 