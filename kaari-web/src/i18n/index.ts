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
    fallbackLng: 'en',
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
    }
  });

// Log when language changes
i18n.on('languageChanged', (lng) => {
  console.log(`Language changed to: ${lng}`);
});

export default i18n; 