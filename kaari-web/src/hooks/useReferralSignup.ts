import { useState, useEffect } from 'react';
import { getReferralCode, clearSavedReferralCode } from '../utils/referral-utils';
import referralService from '../services/ReferralService';
import { useNavigate } from 'react-router-dom';
import eventBus, { EventType } from '../utils/event-bus';

export const useReferralSignup = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<{ amount: number; expiryDays: number } | null>(null);
  const navigate = useNavigate();

  // Check for referral code on mount
  useEffect(() => {
    const code = getReferralCode(window.location.href);
    setReferralCode(code);
    setIsApplied(Boolean(code));
    
    if (code) {
      // Set default discount info
      setDiscount({
        amount: 200, // 200 MAD
        expiryDays: 7  // 7 days
      });
    }
  }, []);

  // Claim the discount
  const claimDiscount = () => {
    if (!referralCode) {
      setError('No referral code found');
      return;
    }
    
    // Navigate to the signup page with the referral code
    navigate(`/referral/signup?ref=${referralCode}`);
  };

  // Apply referral code to a user
  const applyReferralCode = async (userId: string): Promise<boolean> => {
    if (!referralCode || !userId) {
      setError('Missing referral code or user ID');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await referralService.applyReferralCode(userId, referralCode);
      
      if (success) {
        // Clear the code from localStorage after successful application
        clearSavedReferralCode();
        setIsApplied(true);
      } else {
        setError('Failed to apply referral code');
      }
      
      setLoading(false);
      return success;
    } catch (err) {
      console.error('Error applying referral code:', err);
      setError('An error occurred while applying the referral code');
      setLoading(false);
      return false;
    }
  };

  // Get the user's active discount
  const getUserDiscount = async (userId: string) => {
    if (!userId) {
      return null;
    }
    
    try {
      return await referralService.getUserDiscount(userId);
    } catch (err) {
      console.error('Error getting user discount:', err);
      return null;
    }
  };

  // Apply discount to a booking
  const applyDiscountToBooking = async (
    userId: string, 
    bookingId: string, 
    propertyId: string, 
    propertyName: string, 
    bookingAmount: number
  ): Promise<number> => {
    if (!userId || !bookingId) {
      return 0;
    }
    
    try {
      return await referralService.applyDiscountToBooking(
        userId,
        bookingId,
        propertyId,
        propertyName,
        bookingAmount
      );
    } catch (err) {
      console.error('Error applying discount to booking:', err);
      return 0;
    }
  };

  return {
    referralCode,
    isApplied,
    loading,
    error,
    discount,
    claimDiscount,
    applyReferralCode,
    getUserDiscount,
    applyDiscountToBooking
  };
};

export default useReferralSignup; 