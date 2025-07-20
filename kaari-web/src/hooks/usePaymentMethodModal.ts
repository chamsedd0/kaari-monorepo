import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { getAuth } from 'firebase/auth';

export interface UsePaymentMethodModalResult {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  hasPaymentMethod: boolean;
  checkPaymentMethod: () => Promise<boolean>;
  loading: boolean;
}

export function usePaymentMethodModal(): UsePaymentMethodModalResult {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [loading, setLoading] = useState(true);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const checkPaymentMethod = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error('User not authenticated');
        return false;
      }
      
      // Check in payoutMethods collection
      const payoutMethodsRef = collection(db, 'payoutMethods');
      const q = query(
        payoutMethodsRef,
        where('userId', '==', user.uid),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      const hasMethod = !querySnapshot.empty;
      
      setHasPaymentMethod(hasMethod);
      return hasMethod;
    } catch (error) {
      console.error('Error checking payment method:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check on mount
  useEffect(() => {
    checkPaymentMethod();
  }, [checkPaymentMethod]);

  return {
    isModalOpen,
    openModal,
    closeModal,
    hasPaymentMethod,
    checkPaymentMethod,
    loading
  };
}

// Default export for backward compatibility
export default usePaymentMethodModal; 