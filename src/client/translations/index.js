import { I18n } from 'i18n-js';
import fr from './fr.json';

// Init translations
const i18n = new I18n({ fr });

i18n.defaultLocale = 'fr';
i18n.locale = i18n.defaultLocale;
// i18n.enableFallback = true;
// i18n.locale = navigator.language;

export default i18n;
