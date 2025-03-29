import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Game, Locale } from '@scrabble-solver/types';

import { extractRack } from './lib';

describe('extractRack', () => {
  const locale = Locale.ES_ES;
  const config = getConfig(Game.Scrabble, locale);

  it.each([
    { input: 'ab ', expected: ['a', 'b', BLANK, null, null, null, null] },
    { input: 'śćźa', expected: ['a', null, null, null, null, null, null] },
    { input: 'bueno', expected: ['b', 'u', 'e', 'n', 'o', null, null] },
    { input: 'bellas', expected: ['b', 'e', 'l', 'l', 'a', 's', null] },
    { input: 'churro', expected: ['c', 'h', 'u', 'r', 'r', 'o', null] },
    { input: 'challulla', expected: ['c', 'h', 'a', 'l', 'l', 'u', 'l'] },
    { input: 'beLlas', expected: ['b', 'e', 'l', 'l', 'a', 's', null] },
    { input: 'belLas', expected: ['b', 'e', 'l', 'l', 'a', 's', null] },
    { input: 'beLLas', expected: ['b', 'e', 'll', 'a', 's', null, null] },
    { input: 'chuRRo', expected: ['c', 'h', 'u', 'rr', 'o', null, null] },
    { input: 'CHuRRo', expected: ['ch', 'u', 'rr', 'o', null, null, null] },
    { input: 'CHaLLuLLa', expected: ['ch', 'a', 'll', 'u', 'll', 'a', null] },
  ])(`[${locale}] "$input"`, ({ input, expected }) => {
    expect(extractRack(config, input)).toEqual(expected);
  });
});
