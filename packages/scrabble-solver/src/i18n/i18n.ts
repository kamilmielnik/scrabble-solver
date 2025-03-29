import { Locale } from '@scrabble-solver/types';

import { type Translations } from 'types';

import english from './languages/english.json';
import french from './languages/french.json';
import german from './languages/german.json';
import persian from './languages/persian.json';
import polish from './languages/polish.json';
import romanian from './languages/romanian.json';
import spanish from './languages/spanish.json';
import turkish from './languages/turkish.json';

export const i18n: Record<Locale, Translations> = {
  [Locale.DE_DE]: german,
  [Locale.EN_GB]: english,
  [Locale.EN_US]: english,
  [Locale.ES_ES]: spanish,
  [Locale.FA_IR]: persian,
  [Locale.FR_FR]: french,
  [Locale.PL_PL]: polish,
  [Locale.RO_RO]: romanian,
  [Locale.TR_TR]: turkish,
};
