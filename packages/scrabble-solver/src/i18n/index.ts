import { Locale } from '@scrabble-solver/types';

import { Translations } from 'types';

import de from './de.json';
import en from './en.json';
import es from './es.json';
//TODO will translate after i could get it to work :)
import fa from './fa.json';
import fr from './fr.json';
import pl from './pl.json';

const i18n: Record<Locale, Translations> = {
  [Locale.DE_DE]: de,
  [Locale.EN_GB]: en,
  [Locale.EN_US]: en,
  [Locale.ES_ES]: es,
  [Locale.FA_IR]: fa,
  [Locale.FR_FR]: fr,
  [Locale.PL_PL]: pl,
};

export default i18n;
