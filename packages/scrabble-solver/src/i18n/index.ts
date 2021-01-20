import { Locale } from '@scrabble-solver/types';

import { Translations } from 'types';

import en from './en.json';
import fr from './fr.json';
import pl from './pl.json';

const i18n: Record<Locale, Translations> = {
  [Locale.EN_GB]: en,
  [Locale.EN_US]: en,
  [Locale.FR_FR]: fr,
  [Locale.PL_PL]: pl,
};

export default i18n;
