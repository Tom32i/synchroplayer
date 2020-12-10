import I18n from 'i18n-js';
import fr from './fr.json';

// Init translations
// I18n.fallbacks = true;
I18n.translations = { fr };
I18n.defaultLocale = 'fr';
I18n.locale = I18n.defaultLocale;
// I18n.locale = navigator.language;
