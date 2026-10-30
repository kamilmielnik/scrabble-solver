import { VOWELS } from '@scrabble-solver/constants';

import { type Locale } from '../Locale';

import { isConsonant } from './isConsonant';

export function isVowel(character: string, locale: Locale): boolean {
  return VOWELS.includes(character) && !isConsonant(character, locale);
}
