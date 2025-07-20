import { useState, useEffect, useCallback } from 'react';
import { hasPaymentMethod } from '../backend/server-actions/UserServerActions';

/**
 * Hook to manage the payment method modal
 * @param options Configuration options
 * @returns Modal state and control functions
 */
export function usePaymentMethodModal(options: {
  checkOnMount?: boolean;
  requiredFor?: 'refund' | 'payout';
  onPaymentMethodAdded?: () => void;
} = {}) {
  const { checkOnMount = false, requiredFor = 'payout', onPaymentMethodAdded } = options;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMethod, setHasMethod] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to check if the user has a payment method
  const checkPaymentMethod = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await hasPaymentMethod();
      setHasMethod(result);
      return result;
    } catch (error) {
      console.error('Error checking payment method:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to open the modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Function to close the modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Function to ensure the user has a payment method
  const ensurePaymentMethod = useCallback(async (): Promise<boolean> => {
    const hasPaymentMethod = await checkPaymentMethod();
    
    if (!hasPaymentMethod) {
      openModal();
      return false;
    }
    
    return true;
  }, [checkPaymentMethod, openModal]);

  // Function to handle when payment method is added
  const handlePaymentMethodAdded = useCallback(() => {
    setHasMethod(true);
    if (onPaymentMethodAdded) {
      onPaymentMethodAdded();
    }
  }, [onPaymentMethodAdded]);

  // Check payment method on mount if requested
  useEffect(() => {
    if (checkOnMount) {
      checkPaymentMethod();
    }
  }, [checkOnMount, checkPaymentMethod]);

  return {
    isModalOpen,
    openModal,
    closeModal,
    hasPaymentMethod: hasMethod,
    isLoading,
    checkPaymentMethod,
    ensurePaymentMethod,
    handlePaymentMethodAdded,
    requiredFor
  };
} 