import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Game, Locale } from '@scrabble-solver/types';

import extractCharacters from './extractCharacters';

const tests = [
  { input: 'ab ', expected: ['a', 'b', BLANK] },
  { input: 'śćźa', expected: ['a'] },
  { input: 'bueno', expected: ['b', 'u', 'e', 'n', 'o'] },
  { input: 'bellas', expected: ['b', 'e', 'll', 'a', 's'] },
  { input: 'BELLAS', expected: ['b', 'e', 'll', 'a', 's'] },
  { input: 'churro', expected: ['ch', 'u', 'rr', 'o'] },
  { input: 'challulla', expected: ['ch', 'a', 'll', 'u', 'll', 'a'] },
];

describe('extractCharacters', () => {
  const locale = Locale.ES_ES;
  const config = getConfig(Game.Scrabble, locale);

  it.each(tests)(`[${locale}] "$input"`, ({ input, expected }) => {
    expect(extractCharacters(config, input)).toEqual(expected);
  });
});
