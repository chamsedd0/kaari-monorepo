import { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentMethodDetails {
  id: string;
  type: string;
  details: any;
}

interface CheckoutContextType {
  navigateToRentalApplication: () => void;
  navigateToPaymentMethod: () => void;
  navigateToConfirmation: () => void;
  navigateToSuccess: () => void;
  savePaymentMethod: (method: PaymentMethodDetails) => void;
  selectedPaymentMethod: PaymentMethodDetails | null;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckoutContext must be used within a CheckoutProvider');
  }
  return context;
};

interface CheckoutProviderProps {
  children: ReactNode;
  onNavigate?: (step: number) => void;
}

export const CheckoutProvider = ({ children, onNavigate }: CheckoutProviderProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDetails | null>(null);

  const navigateToRentalApplication = () => {
    if (onNavigate) onNavigate(1);
  };

  const navigateToPaymentMethod = () => {
    if (onNavigate) onNavigate(2);
  };

  const navigateToConfirmation = () => {
    if (onNavigate) onNavigate(3);
  };

  const navigateToSuccess = () => {
    if (onNavigate) onNavigate(4);
  };

  const savePaymentMethod = (method: PaymentMethodDetails) => {
    setSelectedPaymentMethod(method);
  };

  const value = {
    navigateToRentalApplication,
    navigateToPaymentMethod,
    navigateToConfirmation,
    navigateToSuccess,
    savePaymentMethod,
    selectedPaymentMethod,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};

export default CheckoutContext; 