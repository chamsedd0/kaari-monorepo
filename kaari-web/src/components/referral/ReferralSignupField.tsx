import React, { useEffect, useState } from 'react';
import { getReferralCode } from '../../utils/referral-utils';

interface ReferralSignupFieldProps {
  onReferralCodeChange?: (code: string | null) => void;
}

/**
 * A hidden component that extracts referral code from URL or localStorage
 * and provides it to the parent form component
 */
const ReferralSignupField: React.FC<ReferralSignupFieldProps> = ({ 
  onReferralCodeChange 
}) => {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Extract referral code from URL or localStorage
    const code = getReferralCode(window.location.href);
    setReferralCode(code);
    
    // Notify parent component if callback provided
    if (onReferralCodeChange && code) {
      onReferralCodeChange(code);
    }
  }, [onReferralCodeChange]);

  // This component doesn't render anything visible
  // It just adds a hidden input to forms
  return referralCode ? (
    <input 
      type="hidden" 
      name="referralCode" 
      value={referralCode} 
      data-testid="referral-code-field"
    />
  ) : null;
};

export default ReferralSignupField; 