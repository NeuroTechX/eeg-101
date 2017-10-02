import I18n from 'react-native-i18n';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import de from './locales/de';

I18n.fallbacks = true;

I18n.translations = {
  en,
  es,
  de,
  fr
};


export default I18n;
