import { Trie } from '@kamilmielnik/trie';
import { literaki } from '@scrabble-solver/configs';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { Board, Cell, FinalPattern, Locale, Tile, VerticalPattern } from '@scrabble-solver/types';

import fillPattern from './fillPattern';

describe('fillPattern', () => {
  const board = Board.fromStringArray([' t ', 'do ', '   ']);
  const locale = Locale.PL_PL;
  const config = literaki[locale];
  let trie: Trie | undefined;

  beforeAll(() => {
    return dictionaries.get(locale).then((loadedTrie) => {
      trie = loadedTrie;
    });
  });

  it('fills patterns', () => {
    const pattern = new VerticalPattern(board, [
      new Cell({ x: 0, y: 0 }),
      new Cell({ x: 0, y: 1, tile: new Tile({ character: 'd', isBlank: false }) }),
      new Cell({ x: 0, y: 2 }),
    ]);
    const tiles = [
      new Tile({ character: 'o', isBlank: false }),
      new Tile({ character: 'a', isBlank: false }),
      new Tile({ character: 'd', isBlank: false }),
    ];
    const filledPatterns = fillPattern(trie!, config, pattern, tiles);

    expect(filledPatterns.length).toBe(1);
  });

  it('fills patterns with blanks', () => {
    const pattern = new VerticalPattern(board, [board.rows[0][1], board.rows[1][1], board.rows[2][1]]);
    const tiles = [new Tile({ character: ' ', isBlank: true }), new Tile({ character: 'ó', isBlank: false })];
    const filledPatterns = fillPattern(trie!, config, pattern, tiles);

    expect(filledPatterns.map(String)).toEqual([
      'toć',
      'tog',
      'toi',
      'tok',
      'tom',
      'ton',
      'toń',
      'top',
      'tor',
      'tos',
      'toy',
      'toż',
    ]);
  });

  it('does not modify filled patterns', () => {
    const pattern = new FinalPattern(
      new VerticalPattern(board, [
        new Cell({ x: 0, y: 0, isEmpty: false, tile: new Tile({ character: 'o', isBlank: false }) }),
        new Cell({ x: 0, y: 1, isEmpty: false, tile: new Tile({ character: 'k', isBlank: false }) }),
        new Cell({ x: 0, y: 2, isEmpty: false, tile: new Tile({ character: 'o', isBlank: false }) }),
      ]),
    );
    const tiles = [new Tile({ character: 'ń', isBlank: false })];
    const filledPatterns = fillPattern(trie!, config, pattern, tiles);

    expect(filledPatterns.length).toBe(1);
    expect(filledPatterns[0]).toEqual(pattern);
  });

  it('does not accept non-placeable filled patterns', () => {
    const pattern = new VerticalPattern(board, [
      new Cell({ x: 0, y: 0, isEmpty: false, tile: new Tile({ character: 'd', isBlank: false }) }),
      new Cell({ x: 0, y: 1, isEmpty: false, tile: new Tile({ character: 'd', isBlank: false }) }),
      new Cell({ x: 0, y: 2, isEmpty: false, tile: new Tile({ character: 'd', isBlank: false }) }),
    ]);
    const tiles = [new Tile({ character: 'ń', isBlank: false })];
    const filledPatterns = fillPattern(trie!, config, pattern, tiles);

    expect(filledPatterns.length).toBe(0);
  });
});
