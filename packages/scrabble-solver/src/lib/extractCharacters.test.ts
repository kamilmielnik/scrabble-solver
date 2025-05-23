import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Game, Locale } from '@scrabble-solver/types';

import { extractCharacters } from './extractCharacters';

describe('upperCaseDigraphsOnly = false', () => {
  describe('extractCharacters', () => {
    const locale = Locale.ES_ES;
    const config = getConfig(Game.Scrabble, locale);

    it.each([
      { input: 'ab ', expected: ['a', 'b', BLANK] },
      { input: 'śćźa', expected: ['s', 'c', 'z', 'a'] },
      { input: 'bañó', expected: ['b', 'a', 'ñ', 'o'] },
      { input: 'bueno', expected: ['b', 'u', 'e', 'n', 'o'] },
      { input: 'bellas', expected: ['b', 'e', 'll', 'a', 's'] },
      { input: 'BELLAS', expected: ['b', 'e', 'll', 'a', 's'] },
      { input: 'churro', expected: ['ch', 'u', 'rr', 'o'] },
      { input: 'challulla', expected: ['ch', 'a', 'll', 'u', 'll', 'a'] },
    ])(`[${locale}] "$input"`, ({ input, expected }) => {
      expect(extractCharacters(config, input)).toEqual(expected);
    });
  });

  describe('upperCaseDigraphsOnly = true', () => {
    const locale = Locale.ES_ES;
    const config = getConfig(Game.Scrabble, locale);

    it.each([
      { input: 'ab ', expected: ['a', 'b', BLANK] },
      { input: 'śćźa', expected: ['s', 'c', 'z', 'a'] },
      { input: 'bañó', expected: ['b', 'a', 'ñ', 'o'] },
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
    ])(`[${locale}] "$input"`, ({ input, expected }) => {
      expect(
        extractCharacters(config, input, {
          upperCaseDigraphsOnly: true,
        }),
      ).toEqual(expected);
    });
  });
});
