import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { english } from './translations/english';
import { marathi } from './translations/marathi';
import { hindi } from './translations/hindi';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      en: {
        translation: english
      },
      mr: {
        translation: marathi
      },
      hi: {
        translation: hindi
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n; 