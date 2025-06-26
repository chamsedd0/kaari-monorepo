import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

// Log the translation files
console.log('Translation files loaded:', {
  en: !!enTranslation,
  fr: !!frTranslation
});

// Function to determine the default language
const getDefaultLanguage = () => {
  // Check localStorage first
  const storedLang = localStorage.getItem('i18nextLng');
  if (storedLang) {
    if (storedLang.startsWith('fr')) return 'fr';
    if (storedLang.startsWith('en')) return 'en';
  }
  
  // Default to French
  return 'fr';
};

// Set default language in localStorage
const defaultLang = getDefaultLanguage();
localStorage.setItem('i18nextLng', defaultLang);

// Log the advertiser onboarding translations to verify they're loaded
console.log('Advertiser onboarding translations:', {
  en: enTranslation.advertiser_onboarding ? 'Loaded' : 'Missing',
  fr: frTranslation.advertiser_onboarding ? 'Loaded' : 'Missing'
});

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      fr: {
        translation: frTranslation
      }
    },
    lng: defaultLang, // Force the language to be the default one
    fallbackLng: 'fr', // Changed from 'en' to 'fr'
    debug: true, // Enable debug
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false
    },
    
    // Ensure translations are loaded immediately
    initImmediate: false
  });

// Log when language changes
i18n.on('languageChanged', (lng) => {
  console.log(`Language changed to: ${lng}`);
  localStorage.setItem('i18nextLng', lng);
});

// Force reload translations
i18n.reloadResources().then(() => {
  console.log('Initial translations loaded');
  console.log('Current language:', i18n.language);
  console.log('Translation for welcome:', i18n.t('advertiser_onboarding.welcome'));
});

export default i18n; 