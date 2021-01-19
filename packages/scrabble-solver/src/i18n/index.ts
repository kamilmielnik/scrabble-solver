import { Locale } from '@scrabble-solver/types';

import en from './en.json';
import fr from './fr.json';
import pl from './pl.json';

// TODO: make typing more accurate, i.e. Record<Locale, Record<TranslationKey, string>>
const i18n: Record<Locale, Record<string, string>> = {
  [Locale.enGb]: en,
  [Locale.enUs]: en,
  [Locale.frFr]: fr,
  [Locale.plPl]: pl,
};

export default i18n;
