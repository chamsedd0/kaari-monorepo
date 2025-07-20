import { useState, useEffect, useRef } from 'react';
import { useStore } from '../backend/store';
import referralService from '../services/ReferralService';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

export interface ActiveDiscount {
  amount: number;
  expiryDate: Date;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
  code: string;
  isInUse?: boolean; // Add this field to track if discount is associated with a booking
}

export const useActiveReferralDiscount = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDiscount, setActiveDiscount] = useState<ActiveDiscount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const currentUser = useStore(state => state.user);
  const { showToast } = useToast();
  const { t } = useTranslation();
  
  // Ref to track if this is the first load
  const isFirstLoad = useRef(true);
  // Ref to track the previous discount state
  const prevDiscountRef = useRef<ActiveDiscount | null>(null);

  // Calculate time left until expiry
  const calculateTimeLeft = (expiryDate: Date): { days: number; hours: number; minutes: number } => {
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  // Update time left every minute
  useEffect(() => {
    if (!activeDiscount) return;

    const timer = setInterval(() => {
      setActiveDiscount(prev => {
        if (!prev) return null;
        
        const timeLeft = calculateTimeLeft(prev.expiryDate);
        
        // If discount has expired, return null and show toast
        if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
          showToast({
            type: 'error',
            title: t('referral.discount.expired'),
            message: t('referral.discount.expired'),
            duration: 5000
          });
          return null;
        }
        
        return {
          ...prev,
          timeLeft
        };
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [activeDiscount, showToast, t]);

  // Retry mechanism for fetching discount
  const fetchDiscount = async () => {
    if (!currentUser || !currentUser.id) {
      setActiveDiscount(null);
      setLoading(false);
      return;
    }
    
    // Only clients can have discounts
    if (currentUser.role !== 'client') {
      console.log(`User role ${currentUser.role} is not eligible for referral discounts`);
      setActiveDiscount(null);
      setLoading(false);
      return;
    }
    
    try {
      const discount = await referralService.getUserDiscount(currentUser.id);
      
      // Check if discount is already associated with a booking
      const isDiscountInUse = await referralService.isDiscountInUse(currentUser.id);
      
      if (discount && !discount.isUsed && discount.expiryDate > new Date()) {
        const timeLeft = calculateTimeLeft(discount.expiryDate);
        const newDiscount = {
          amount: discount.amount,
          expiryDate: discount.expiryDate,
          timeLeft,
          code: discount.code || 'KAARI',
          isInUse: isDiscountInUse // Add this field
        };
        
        setActiveDiscount(newDiscount);
        setError(null);
        
        // Show toast when discount is applied (but not on first load)
        if (!isFirstLoad.current && !prevDiscountRef.current) {
          showToast({
            type: 'success',
            title: t('referral.discount.applied'),
            message: t('referral.discount.banner', { 
              code: newDiscount.code, 
              amount: newDiscount.amount 
            }),
            duration: 5000
          });
        }
        
        // Update the previous discount ref
        prevDiscountRef.current = newDiscount;
      } else if (isDiscountInUse) {
        // If discount exists but is already in use with a booking
        setActiveDiscount(null);
        setError(null);
        
        // Only show toast if we previously had a discount
        if (prevDiscountRef.current) {
          showToast({
            type: 'info',
            title: t('referral.discount.inUse'),
            message: t('referral.discount.inUseMessage', { 
              amount: prevDiscountRef.current.amount 
            }),
            duration: 5000
          });
        }
        
        prevDiscountRef.current = null;
      } else {
        // If we had a discount before but not now, it might have expired
        if (prevDiscountRef.current) {
          showToast({
            type: 'error',
            title: t('referral.discount.expired'),
            message: t('referral.discount.expired'),
            duration: 5000
          });
        }
        
        setActiveDiscount(null);
        prevDiscountRef.current = null;
      }
    } catch (err) {
      console.error('Error checking active discount:', err);
      
      // Set more specific error message based on error type
      if (err instanceof Error) {
        if (err.message.includes('permission-denied')) {
          setError('Permission denied while checking for active discounts');
        } else if (err.message.includes('not-found')) {
          setError('No discount information found');
        } else {
          setError(`Failed to check for active discounts: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred while checking for discounts');
      }
      
      setActiveDiscount(null);
      
      // Implement retry logic (max 3 retries)
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchDiscount();
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setLoading(false);
      // No longer the first load
      isFirstLoad.current = false;
    }
  };

  // Check for active discount on mount and when user changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    fetchDiscount();
  }, [currentUser]);

  // Method to manually refresh the discount
  const refreshDiscount = () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    fetchDiscount();
  };

  return { activeDiscount, loading, error, refreshDiscount };
};

export default useActiveReferralDiscount; 