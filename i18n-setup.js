import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import es from './locales/es.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    AsyncStorage.getItem('preferredLanguage')
      .then((language) => {
        if (language) {
          callback(language);
        } else {
          callback(Localization.locale.startsWith('es') ? 'es' : 'en');
        }
      })
      .catch(() => {
        callback('en'); // fallback if error
      });
  },
  init: () => {},
  cacheUserLanguage: (lng) => {
    AsyncStorage.setItem('preferredLanguage', lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    nsSeparator: false, // ✅ This fixes dot notation like "logout.button"
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
