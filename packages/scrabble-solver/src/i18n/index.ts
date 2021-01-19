import { Locale } from 'types';

import en from './en.json';
import fr from './fr.json';
import pl from './pl.json';

// TODO: make typing more accurate, i.e. Record<Locale, Record<TranslationKey, string>>
const i18n: Record<Locale, Record<string, string>> = {
  'en-US': en,
  'en-GB': en,
  'fr-FR': fr,
  'pl-PL': pl,
};

export default i18n;
