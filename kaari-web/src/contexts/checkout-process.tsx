import React, { createContext, useContext, useState } from 'react';

interface PaymentMethodDetails {
  id: string;
  type: string;
  details: any;
  protectionOption?: 'haani';
  additionalCost?: number;
}

interface CheckoutContextType {
  navigateToRentalApplication: () => void;
  navigateToPaymentMethod: () => void;
  navigateToConfirmation: () => void;
  navigateToSuccess: () => void;
  savePaymentMethod: (method: PaymentMethodDetails) => void;
  selectedPaymentMethod: PaymentMethodDetails | null;
}

const CheckoutContext = createContext<CheckoutContextType>({
  navigateToRentalApplication: () => {},
  navigateToPaymentMethod: () => {},
  navigateToConfirmation: () => {},
  navigateToSuccess: () => {},
  savePaymentMethod: () => {},
  selectedPaymentMethod: null,
});

export const useCheckoutContext = () => useContext(CheckoutContext);

interface CheckoutProviderProps {
  children: React.ReactNode;
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