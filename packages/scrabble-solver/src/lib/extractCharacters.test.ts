import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Config, Game, Locale } from '@scrabble-solver/types';

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
      expect(extractCharacters(config, input)).toEqual([...expected]);
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
      ).toEqual([...expected]);
    });
  });
});

describe('digraphs longer than two characters', () => {
  const config = getConfig(Game.Scrabble, Locale.CA_ES);

  it.each([
    { input: 'cel·la', expected: ['c', 'e', 'l·l', 'a'] },
    { input: 'CEL·LA', expected: ['c', 'e', 'l·l', 'a'] },
    { input: 'cel.la', expected: ['c', 'e', 'l·l', 'a'] },
    { input: 'ceŀla', expected: ['c', 'e', 'l·l', 'a'] },
    { input: 'cella', expected: ['c', 'e', 'l', 'l', 'a'] },
    { input: 'canya', expected: ['c', 'a', 'ny', 'a'] },
    { input: 'quatre', expected: ['qu', 'a', 't', 'r', 'e'] },
    { input: 'qüestió', expected: ['qu', 'e', 's', 't', 'i', 'o'] },
    { input: 'força', expected: ['f', 'o', 'r', 'ç', 'a'] },
  ])('reads "$input"', ({ input, expected }) => {
    expect(extractCharacters(config, input)).toEqual([...expected]);
  });

  it.each([
    { input: 'q', expected: [] },
    { input: 'y', expected: [] },
    { input: '·', expected: [] },
    { input: 'l·', expected: ['l'] },
  ])('drops parts of digraphs from "$input", because they are no tiles', ({ input, expected }) => {
    expect(extractCharacters(config, input)).toEqual([...expected]);
  });

  it.each([
    { input: 'q', expected: ['q'] },
    { input: 'y', expected: ['y'] },
    { input: '·', expected: ['·'] },
    { input: 'l·', expected: ['l', '·'] },
    { input: 'ж', expected: [] },
  ])('keeps parts of digraphs from "$input" on request', ({ input, expected }) => {
    expect(extractCharacters(config, input, { keepDigraphParts: true })).toEqual([...expected]);
  });

  it.each([
    { input: 'cel·la', expected: ['c', 'e', 'l', 'l', 'a'] },
    { input: 'CEL·LA', expected: ['c', 'e', 'l·l', 'a'] },
    { input: 'ceL·la', expected: ['c', 'e', 'l', 'l', 'a'] },
    { input: 'ceL·La', expected: ['c', 'e', 'l·l', 'a'] },
    { input: 'caNYa', expected: ['c', 'a', 'ny', 'a'] },
    { input: 'caNya', expected: ['c', 'a', 'n', 'a'] },
    { input: 'QUatre', expected: ['qu', 'a', 't', 'r', 'e'] },
  ])('reads only uppercase digraphs from "$input" on request', ({ input, expected }) => {
    expect(extractCharacters(config, input, { upperCaseDigraphsOnly: true })).toEqual([...expected]);
  });

  it('prefers the longest digraph', () => {
    const tiles = [
      { character: 't', score: 1 },
      { character: 'tl', score: 1 },
      { character: 'tlh', score: 1 },
    ];
    const klingon = new Config({ ...config.toJson(), tiles });

    expect(extractCharacters(klingon, 'tlhtlt')).toEqual(['tlh', 'tl', 't']);
  });
});
