import { Gaddag } from '@kamilmielnik/gaddag';
import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { Board, type Config, Game, Locale, type ResultJson, Tile } from '@scrabble-solver/types';

import { referenceSolve } from './reference/referenceSolve';
import { type WordFinder } from './reference/WordFinder';
import { solve } from './solve';

const generateTiles = (characters: string[]): Tile[] => {
  return characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
};

/**
 * Results are compared as canonicalized sets: ids and ordering differ between
 * the two implementations, everything else must match exactly.
 */
const canonicalize = (results: ResultJson[]): string[] => {
  return results
    .map((result) => {
      const cells = result.cells.map((cell) => JSON.stringify(cell)).join('|');
      const collisions = result.collisions.map((collision) => collision.map((cell) => JSON.stringify(cell)).join('|'));
      return JSON.stringify({ cells, collisions: collisions.sort(), points: result.points });
    })
    .sort();
};

const expectParity = (
  wordFinder: WordFinder & Parameters<typeof solve>[0],
  config: Config,
  boardRows: string[],
  characters: string[],
) => {
  const board = Board.fromStringArray(boardRows);
  const actual = solve(wordFinder, config, board.clone(), generateTiles(characters));
  const expected = referenceSolve(wordFinder, config, board, generateTiles(characters));
  const actualCanonical = canonicalize(actual);
  const expectedCanonical = canonicalize(expected);
  const missing = expectedCanonical.filter((entry) => !actualCanonical.includes(entry));
  const extra = actualCanonical.filter((entry) => !expectedCanonical.includes(entry));
  expect(missing.slice(0, 3)).toEqual([]);
  expect(extra.slice(0, 3)).toEqual([]);
  expect(actual.length).toBe(expected.length);
};

const SMALL_BOARD = [
  '               ',
  '               ',
  '               ',
  '               ',
  '               ',
  '  cozy         ',
  '   a           ',
  '   flames a    ',
  '        taxi   ',
  '    ratio e    ',
  '    a   n      ',
  '    verge      ',
  '    e          ',
  '    n          ',
  '               ',
];

const EMPTY_BOARD: string[] = Array.from({ length: 15 }, () => '               ');

describe('solve matches the reference implementation', () => {
  describe('en-US Scrabble', () => {
    const config = getConfig(Game.Scrabble, Locale.EN_US);
    let gaddag: Parameters<typeof solve>[0];

    beforeAll(async () => {
      gaddag = await dictionaries.get(Locale.EN_US);
    });

    it('empty board', () => {
      expectParity(gaddag, config, EMPTY_BOARD, ['r', 'e', 't', 'i', 'n', 'a', 's']);
    });

    it('empty board with blank', () => {
      expectParity(gaddag, config, EMPTY_BOARD, ['w', 'o', 'r', BLANK]);
    });

    it('mid-game board', () => {
      expectParity(gaddag, config, SMALL_BOARD, ['r', 'e', 't', 'i', 'n', 'a', 's']);
    });

    it('mid-game board with blank', () => {
      expectParity(gaddag, config, SMALL_BOARD, ['q', 'u', 'z', BLANK, 'e']);
    });

    it('single tile', () => {
      expectParity(gaddag, config, SMALL_BOARD, ['s']);
    });

    it('duplicated tiles', () => {
      expectParity(gaddag, config, SMALL_BOARD, ['e', 'e', 'e', 's', 's']);
    });
  });

  describe('en-US Super Scrabble (score bingo, bigger board)', () => {
    const config = getConfig(Game.SuperScrabble, Locale.EN_US);
    let gaddag: Parameters<typeof solve>[0];

    beforeAll(async () => {
      gaddag = await dictionaries.get(Locale.EN_US);
    });

    it('mid-game board', () => {
      const board = [
        '                     ',
        '                     ',
        '                     ',
        '                     ',
        '                     ',
        '                     ',
        '                     ',
        '                     ',
        '        cozy         ',
        '         a           ',
        '         flames      ',
        '          a          ',
        '          x          ',
        '          i          ',
        '                     ',
        '                     ',
        '                     ',
        '                     ',
        '                     ',
        '                     ',
        '                     ',
      ];
      expectParity(gaddag, config, board, ['r', 'e', 't', 'i', 'n', 'a', 's']);
    });
  });

  describe('pl-PL Literaki (multiplier bingo, score-gated bonuses)', () => {
    const config = getConfig(Game.Literaki, Locale.PL_PL);
    let gaddag: Parameters<typeof solve>[0];

    beforeAll(async () => {
      gaddag = await dictionaries.get(Locale.PL_PL);
    });

    it('empty board', () => {
      expectParity(gaddag, config, EMPTY_BOARD, ['a', 'e', 'i', 'n', 'o', 'r', 's']);
    });

    it('mid-game board', () => {
      const board = [
        '               ',
        '               ',
        '               ',
        '               ',
        '   s           ',
        '   mysz        ',
        '   a           ',
        '   korale      ',
        '        tor    ',
        '     wino a    ',
        '     a  s k    ',
        '  kier         ',
        '               ',
        '               ',
        '               ',
      ];
      expectParity(gaddag, config, board, ['a', 'e', 'i', 'n', 'o', 'r', 'ó']);
    });

    it('mid-game board with blank', () => {
      const board = [
        '               ',
        '               ',
        '               ',
        '               ',
        '   s           ',
        '   mysz        ',
        '   a           ',
        '   korale      ',
        '        tor    ',
        '     wino a    ',
        '     a  s k    ',
        '  kier         ',
        '               ',
        '               ',
        '               ',
      ];
      expectParity(gaddag, config, board, ['ż', 'ó', 'ł', BLANK]);
    });
  });

  describe('es-ES Scrabble (two-character tiles)', () => {
    const config = getConfig(Game.Scrabble, Locale.ES_ES);
    let gaddag: Parameters<typeof solve>[0];

    beforeAll(async () => {
      gaddag = await dictionaries.get(Locale.ES_ES);
    });

    it('empty board with digraph tiles', () => {
      expectParity(gaddag, config, EMPTY_BOARD, ['ll', 'a', 'n', 'a']);
    });

    it('digraph imitation is rejected', () => {
      expectParity(gaddag, config, EMPTY_BOARD, ['ch', 'o', 'o', 'c', 'h']);
    });

    it('board with digraph tiles placed', () => {
      const board = [
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '       llana   ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
      ];
      expectParity(gaddag, config, board, ['o', 's', 'e', 'ch']);
    });

    it('board with digraph tiles and blank', () => {
      const board = [
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '       llana   ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
      ];
      expectParity(gaddag, config, board, ['o', 's', BLANK]);
    });
  });

  describe('synthetic dictionaries', () => {
    const config = getConfig(Game.Scrabble, Locale.EN_US);

    it('crowded board forces cross-checks', () => {
      const gaddag = Gaddag.fromArray(['ab', 'ba', 'aa', 'bb', 'aba', 'bab', 'abba', 'baab']);
      const board = [
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '       a       ',
        '       b       ',
        '               ',
        '      ab       ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
      ];
      expectParity(gaddag, config, board, ['a', 'b', 'a', 'b']);
    });

    it('one-letter words', () => {
      const gaddag = Gaddag.fromArray(['a', 'ab', 'ba']);
      const board = [
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '       b       ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
      ];
      expectParity(gaddag, config, board, ['a', 'b']);
    });
  });
});
