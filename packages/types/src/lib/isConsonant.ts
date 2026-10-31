import { CONSONANTS } from '@scrabble-solver/constants';

import { Locale } from '../Locale';

export function isConsonant(character: string, locale: Locale): boolean {
  return CONSONANTS.includes(character) || (locale === Locale.TR_TR && character === 'y');
}
