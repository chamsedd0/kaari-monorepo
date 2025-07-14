import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import referralService, { ReferralData } from '../services/ReferralService';
import { generateReferralLink } from '../utils/referral-utils';

export const useReferralProgram = () => {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates for referral data
    const unsubscribe = referralService.subscribeToReferralData(
      user.id,
      (data) => {
        setReferralData(data);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  // Generate the full referral link
  const getReferralLink = (): string => {
    if (!referralData?.referralCode) return '';
    return generateReferralLink(referralData.referralCode);
  };

  // Request a payout
  const requestPayout = async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      return await referralService.requestPayout(user.id);
    } catch (error) {
      console.error('Error requesting payout:', error);
      setError('Failed to request payout. Please try again.');
      return false;
    }
  };

  // Calculate bonus rate based on number of listings
  const calculateBonusRate = (listingsCount: number): string => {
    return referralService.calculateBonusRate(listingsCount);
  };

  // Check if referral pass is active
  const isReferralPassActive = (): boolean => {
    if (!referralData?.referralPass) return false;
    
    // For founding partners, the pass is active for 90 days without checking conditions
    if (user?.foundingPartner) {
      const { expiryDate } = referralData.referralPass;
      const now = new Date();
      return expiryDate > now;
    }
    
    // For regular advertisers, check the active flag and expiry date
    const { active, expiryDate } = referralData.referralPass;
    const now = new Date();
    
    return active && expiryDate > now;
  };

  // Calculate time remaining on referral pass
  const getReferralPassTimeRemaining = (): { days: number; hours: number; minutes: number; seconds: number } | null => {
    if (!referralData?.referralPass?.expiryDate) {
      return null;
    }
    
    const now = new Date();
    const expiryDate = referralData.referralPass.expiryDate;
    
    if (expiryDate <= now) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return {
      days: diffDays,
      hours: diffHours,
      minutes: diffMinutes,
      seconds: diffSeconds
    };
  };

  // Check if the user has met requirements to activate the referral pass
  const hasMetReferralPassRequirements = (): boolean => {
    if (!referralData?.referralPass) return false;
    
    // Founding partners automatically meet the requirements
    if (user?.foundingPartner) return true;
    
    const { listingsSincePass, bookingsSincePass, listingRequirement, bookingRequirement } = referralData.referralPass;
    
    return listingsSincePass >= listingRequirement || bookingsSincePass >= bookingRequirement;
  };

  return {
    referralData,
    loading,
    error,
    getReferralLink,
    requestPayout,
    calculateBonusRate,
    isReferralPassActive,
    getReferralPassTimeRemaining,
    hasMetReferralPassRequirements
  };
};

export default useReferralProgram; 