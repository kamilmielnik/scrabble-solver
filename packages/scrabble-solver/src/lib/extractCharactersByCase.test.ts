import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Locale } from '@scrabble-solver/types';

import extractCharactersByCase from './extractCharactersByCase';

const tests = [
  { input: 'ab ', expected: ['a', 'b', BLANK] },
  { input: 'śćźa', expected: ['a'] },
  { input: 'bueno', expected: ['b', 'u', 'e', 'n', 'o'] },
  { input: 'bellas', expected: ['b', 'e', 'l', 'l', 'a', 's'] },
  { input: 'churro', expected: ['c', 'h', 'u', 'r', 'r', 'o'] },
  { input: 'challulla', expected: ['c', 'h', 'a', 'l', 'l', 'u', 'l', 'l', 'a'] },
  { input: 'beLlas', expected: ['b', 'e', 'l', 'l', 'a', 's'] },
  { input: 'belLas', expected: ['b', 'e', 'l', 'l', 'a', 's'] },
  { input: 'beLLas', expected: ['b', 'e', 'll', 'a', 's'] },
  { input: 'chuRRo', expected: ['c', 'h', 'u', 'rr', 'o'] },
  { input: 'CHuRRo', expected: ['ch', 'u', 'rr', 'o'] },
  { input: 'CHaLLuLLa', expected: ['ch', 'a', 'll', 'u', 'll', 'a'] },
];

describe('extractCharactersByCase', () => {
  const locale = Locale.ES_ES;
  const config = getConfig('scrabble', locale);

  for (const { input, expected } of tests) {
    it(`[${locale}] "${input}"`, () => {
      expect(extractCharactersByCase(config, input)).toEqual(expected);
    });
  }
});
