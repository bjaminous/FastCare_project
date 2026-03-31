import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import en from './locales/en.json';
import ar from './locales/ar.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import tr from './locales/tr.json';
import id from './locales/id.json';
import zh from './locales/zh.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ar: { translation: ar },
      es: { translation: es },
      pt: { translation: pt },
      de: { translation: de },
      tr: { translation: tr },
      id: { translation: id },
      zh: { translation: zh },
    },
    fallbackLng: 'fr',
    lng: localStorage.getItem('fc_lang') || 'fr',
    interpolation: { escapeValue: false },
  });

export default i18n;
