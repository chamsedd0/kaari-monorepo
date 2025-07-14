/**
 * Utility functions for language-related operations
 */

import i18n from '../i18n';

/**
 * Check if the current route is part of the onboarding flow where Arabic should be available
 * @returns boolean indicating if Arabic should be shown as an option
 */
export const shouldShowArabicOption = (): boolean => {
  const path = window.location.pathname;
  
  // List of paths where Arabic should be available
  const arabicEnabledPaths = [
    '/advertiser-signup',
    '/advertiser-signup/founding-partners',
    '/advertiser-signup/form',
    '/become-advertiser',
    '/become-advertiser/thank-you',
    '/email-verification',
    '/email-verification/success',
    '/email-verification/error',
    '/email-verification/waiting'
  ];
  
  // Check if current path is in the list or starts with any of the paths
  return arabicEnabledPaths.some(enabledPath => 
    path === enabledPath || path.startsWith(`${enabledPath}/`)
  );
};

/**
 * Get the available languages based on the current route
 * @returns array of language codes that should be available
 */
export const getAvailableLanguages = (): string[] => {
  return shouldShowArabicOption() ? ['en', 'fr', 'ar'] : ['en', 'fr'];
};

/**
 * Check and fix the current language if needed
 * If the current language is Arabic but we're not in an Arabic-enabled path,
 * switch to French
 */
export const checkAndFixLanguage = (): void => {
  const currentLang = i18n.language;
  if (currentLang && currentLang.startsWith('ar') && !shouldShowArabicOption()) {
    // Switch to French
    i18n.changeLanguage('fr');
  }
}; 