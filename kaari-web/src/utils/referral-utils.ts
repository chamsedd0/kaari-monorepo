/**
 * Utility functions for handling referral codes
 */

// Local storage key for referral code
const REFERRAL_CODE_KEY = 'kaari_referral_code';

/**
 * Extracts referral code from URL query parameters
 * @param url The URL to extract from (window.location.href)
 * @returns The referral code or null if not found
 */
export const extractReferralCodeFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    // Check for 'ref' parameter first, then fall back to 'code' parameter
    return urlObj.searchParams.get('ref') || urlObj.searchParams.get('code');
  } catch (error) {
    console.error('Error extracting referral code from URL:', error);
    return null;
  }
};

/**
 * Saves referral code to localStorage
 * @param code The referral code to save
 */
export const saveReferralCode = (code: string): void => {
  if (!code) return;
  
  try {
    localStorage.setItem(REFERRAL_CODE_KEY, code);
  } catch (error) {
    console.error('Error saving referral code to localStorage:', error);
  }
};

/**
 * Gets referral code from localStorage
 * @returns The saved referral code or null if not found
 */
export const getSavedReferralCode = (): string | null => {
  try {
    return localStorage.getItem(REFERRAL_CODE_KEY);
  } catch (error) {
    console.error('Error getting referral code from localStorage:', error);
    return null;
  }
};

/**
 * Clears saved referral code from localStorage
 */
export const clearSavedReferralCode = (): void => {
  try {
    localStorage.removeItem(REFERRAL_CODE_KEY);
  } catch (error) {
    console.error('Error clearing referral code from localStorage:', error);
  }
};

/**
 * Checks if a referral code is present in the URL or localStorage
 * @param url Optional URL to check (defaults to window.location.href)
 * @returns True if a referral code is present, false otherwise
 */
export const hasReferralCode = (url?: string): boolean => {
  const urlCode = url ? extractReferralCodeFromUrl(url) : null;
  const savedCode = getSavedReferralCode();
  
  return Boolean(urlCode || savedCode);
};

/**
 * Gets referral code from URL or localStorage
 * @param url Optional URL to check (defaults to window.location.href)
 * @returns The referral code or null if not found
 */
export const getReferralCode = (url?: string): string | null => {
  // First check URL
  if (url) {
    const urlCode = extractReferralCodeFromUrl(url);
    if (urlCode) {
      // Save to localStorage for persistence
      saveReferralCode(urlCode);
      return urlCode;
    }
  }
  
  // Then check localStorage
  return getSavedReferralCode();
};

/**
 * Generates a referral link with the given code
 * @param code The referral code to include in the link
 * @returns A complete referral link
 */
export const generateReferralLink = (code: string): string => {
  if (!code) return '';
  // Use window.location.origin to make it work in any environment
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.kaari.ma';
  return `${origin}/referral/claim-discount?ref=${code}`;
}; 