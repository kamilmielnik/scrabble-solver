import { Locale } from '@scrabble-solver/types';

import { Translations } from 'types';

import de from './de.json';
import en from './en.json';
import es from './es.json';
import fa from './fa.json';
import fr from './fr.json';
import pl from './pl.json';
import ro from './ro.json';

const i18n: Record<Locale, Translations> = {
  [Locale.DE_DE]: de,
  [Locale.EN_GB]: en,
  [Locale.EN_US]: en,
  [Locale.ES_ES]: es,
  [Locale.FA_IR]: fa,
  [Locale.FR_FR]: fr,
  [Locale.PL_PL]: pl,
  [Locale.RO_RO]: ro,
};

export default i18n;
