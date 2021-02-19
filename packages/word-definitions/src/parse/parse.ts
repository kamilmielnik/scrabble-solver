import { Locale } from '@scrabble-solver/types';

import { ParseResult } from '../types';

import parseEnglish from './parseEnglish';
import parseFrench from './parseFrench';
import parsePolish from './parsePolish';

const parsePerLocale: Record<Locale, (html: string) => ParseResult> = {
  [Locale.EN_GB]: parseEnglish,
  [Locale.EN_US]: parseEnglish,
  [Locale.FR_FR]: parseFrench,
  [Locale.PL_PL]: parsePolish,
};

const parse = (locale: Locale, html: string): ParseResult => {
  return parsePerLocale[locale](html);
};

export default parse;
