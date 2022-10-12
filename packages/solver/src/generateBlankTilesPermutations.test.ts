import { literaki } from '@scrabble-solver/configs';
import { Locale, Tile } from '@scrabble-solver/types';

import generateBlankTilesPermutations from './generateBlankTilesPermutations';

describe('generateBlankTilesPermutations', () => {
  const locale = Locale.PL_PL;
  const config = literaki[locale];

  it('does not affect non-blank tiles', () => {
    const permutations = generateBlankTilesPermutations(config, [
      new Tile({ character: 'a', isBlank: false }),
      new Tile({ character: 'b', isBlank: false }),
      new Tile({ character: 'c', isBlank: false }),
    ]);

    expect(permutations.length).toBe(1);
    expect(permutations[0].map(String).join('')).toEqual('abc');
  });

  it('replaces blank tiles', () => {
    const permutations = generateBlankTilesPermutations(config, [
      new Tile({ character: 'a', isBlank: false }),
      new Tile({ character: 'a', isBlank: false }),
      new Tile({ character: '', isBlank: true }),
    ]);

    expect(permutations.length).toBe(config.alphabet.length);
    expect(permutations[0][2].toJson()).toEqual({
      character: config.alphabet[0],
      isBlank: true,
    });
    expect(permutations[permutations.length - 1][2].toJson()).toEqual({
      character: config.alphabet[config.alphabet.length - 1],
      isBlank: true,
    });
  });
});
