import React, { createContext, useContext } from 'react';
import { usePaymentMethodModal } from '../hooks/usePaymentMethodModal';
import PaymentMethodRequiredModal from './modals/PaymentMethodRequiredModal';

// Create a context for the payment method
interface PaymentMethodContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  hasPaymentMethod: boolean | null;
  isLoading: boolean;
  checkPaymentMethod: () => Promise<boolean>;
  ensurePaymentMethod: () => Promise<boolean>;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | null>(null);

// Hook to use the payment method context
export function usePaymentMethod() {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error('usePaymentMethod must be used within a PaymentMethodProvider');
  }
  return context;
}

interface PaymentMethodProviderProps {
  children: React.ReactNode;
  checkOnMount?: boolean;
}

// Provider component
export function PaymentMethodProvider({ children, checkOnMount = false }: PaymentMethodProviderProps) {
  const {
    isModalOpen,
    openModal,
    closeModal,
    hasPaymentMethod,
    isLoading,
    checkPaymentMethod,
    ensurePaymentMethod,
    handlePaymentMethodAdded,
    requiredFor
  } = usePaymentMethodModal({
    checkOnMount
  });

  const contextValue = {
    isModalOpen,
    openModal,
    closeModal,
    hasPaymentMethod,
    isLoading,
    checkPaymentMethod,
    ensurePaymentMethod
  };

  return (
    <PaymentMethodContext.Provider value={contextValue}>
      {children}
      <PaymentMethodRequiredModal
        open={isModalOpen}
        onClose={closeModal}
        onSuccess={handlePaymentMethodAdded}
        requiredFor={requiredFor}
      />
    </PaymentMethodContext.Provider>
  );
} 