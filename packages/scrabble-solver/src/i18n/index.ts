import { Locale } from 'types';

import en from './en.json';
import pl from './pl.json';
import fr from './fr.json';

// TODO: make typing more accurate, i.e. Record<Locale, Record<TranslationKey, string>>
const i18n: Record<Locale, Record<string, string>> = {
  'en-US': en,
  'en-GB': en,
  'pl-PL': pl,
  'fr-FR': fr,
};

export default i18n;
