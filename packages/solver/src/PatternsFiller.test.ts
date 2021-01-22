import { literaki } from '@scrabble-solver/configs';
import { getDictionary } from '@scrabble-solver/dictionaries';
import { Board, Cell, Locale, Tile, VerticalPattern } from '@scrabble-solver/types';

import PatternsFiller from './PatternsFiller';

describe('PatternsFiller', () => {
  const board = Board.fromStringArray([' t ', 'do ', '   ']);
  const locale = Locale.PL_PL;
  const config = literaki[locale];
  let patternsFiller: PatternsFiller | undefined;

  beforeAll(() => {
    return getDictionary(locale).then((trie) => {
      patternsFiller = new PatternsFiller(config, trie);
    });
  });

  it('does not affect non-blank tiles', () => {
    const permutations = patternsFiller!.generateBlankTilesPermutations([
      new Tile({ character: 'a', isBlank: false }),
      new Tile({ character: 'b', isBlank: false }),
      new Tile({ character: 'c', isBlank: false }),
    ]);
    expect(permutations.length).toBe(1);
    expect(permutations[0].map(String).join('')).toEqual('abc');
  });

  it('replaces blank tiles', () => {
    const permutations = patternsFiller!.generateBlankTilesPermutations([
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

  it('fills patterns', () => {
    const pattern = new VerticalPattern({
      board,
      cells: [
        new Cell({ x: 0, y: 0 }),
        new Cell({ x: 0, y: 1, tile: new Tile({ character: 'd', isBlank: false }) }),
        new Cell({ x: 0, y: 2 }),
      ],
    });
    const tiles = [
      new Tile({ character: 'o', isBlank: false }),
      new Tile({ character: 'a', isBlank: false }),
      new Tile({ character: 'd', isBlank: false }),
    ];
    const filledPatterns = patternsFiller!.fill(pattern, tiles);
    expect(filledPatterns.length).toBe(1);
  });

  it('does not modify filled patterns', () => {
    const pattern = new VerticalPattern({
      board,
      cells: [
        new Cell({ x: 0, y: 0, isEmpty: false, tile: new Tile({ character: 'o', isBlank: false }) }),
        new Cell({ x: 0, y: 1, isEmpty: false, tile: new Tile({ character: 'k', isBlank: false }) }),
        new Cell({ x: 0, y: 2, isEmpty: false, tile: new Tile({ character: 'o', isBlank: false }) }),
      ],
    });
    const tiles = [new Tile({ character: 'ń', isBlank: false })];
    const filledPatterns = patternsFiller!.fill(pattern, tiles);
    expect(filledPatterns.length).toBe(1);
    expect(filledPatterns[0]).toEqual(pattern);
  });

  it('does not accept non-placeable filled patterns', () => {
    const pattern = new VerticalPattern({
      board,
      cells: [
        new Cell({ x: 0, y: 0, isEmpty: false, tile: new Tile({ character: 'd', isBlank: false }) }),
        new Cell({ x: 0, y: 1, isEmpty: false, tile: new Tile({ character: 'd', isBlank: false }) }),
        new Cell({ x: 0, y: 2, isEmpty: false, tile: new Tile({ character: 'd', isBlank: false }) }),
      ],
    });
    const tiles = [new Tile({ character: 'ń', isBlank: false })];
    const filledPatterns = patternsFiller!.fill(pattern, tiles);
    expect(filledPatterns.length).toBe(0);
  });
});
