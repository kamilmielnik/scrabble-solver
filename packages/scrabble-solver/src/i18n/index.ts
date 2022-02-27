import { Locale } from '@scrabble-solver/types';

import { Translations } from 'types';

import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import pl from './pl.json';

const i18n: Record<Locale, Translations> = {
  [Locale.EN_GB]: en,
  [Locale.EN_US]: en,
  [Locale.ES_ES]: es,
  [Locale.FR_FR]: fr,
  [Locale.PL_PL]: pl,
  [Locale.DE_DE]: de,
};

export default i18n;
