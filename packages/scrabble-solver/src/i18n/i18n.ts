import { Locale } from '@scrabble-solver/types';

import { Translations } from 'types';

import english from './english.json';
import french from './french.json';
import german from './german.json';
import persian from './persian.json';
import polish from './polish.json';
import romanian from './romanian.json';
import spanish from './spanish.json';

const i18n: Record<Locale, Translations> = {
  [Locale.DE_DE]: german,
  [Locale.EN_GB]: english,
  [Locale.EN_US]: english,
  [Locale.ES_ES]: spanish,
  [Locale.FA_IR]: persian,
  [Locale.FR_FR]: french,
  [Locale.PL_PL]: polish,
  [Locale.RO_RO]: romanian,
};

export default i18n;
