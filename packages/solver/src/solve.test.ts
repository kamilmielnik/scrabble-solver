/* eslint-disable max-lines */

import { Trie } from '@kamilmielnik/trie';
import { getConfig } from '@scrabble-solver/configs';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { Board, Game, Locale, Result, Tile } from '@scrabble-solver/types';

import solve from './solve';

const generateTiles = (characters: string[]): Tile[] => {
  return characters.map((character) => new Tile({ character, isBlank: false }));
};

const getBestResult = ([firstResult, ...results]: Result[]): Result => {
  return results.reduce(
    (bestResultCandidate, result) => (result.points > bestResultCandidate.points ? result : bestResultCandidate),
    firstResult,
  );
};

describe('solve - pl-PL', () => {
  const locale = Locale.PL_PL;
  const config = getConfig(Game.Literaki, locale);
  let trie: Trie | undefined;

  beforeAll(() => {
    return dictionaries.get(locale).then((loadedTrie) => {
      trie = loadedTrie;
    });
  });

  it('żyło', () => {
    const board = Board.fromStringArray([
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '   żyło        ',
      '               ',
      '               ',
      '               ',
    ]);
    const tiles = generateTiles(['l', 'i', 'n', 'o']);
    const results = solve(trie!, config, board, tiles);
    expect(results.length).toBe(60);
  });

  it('zmartwychwstałą x9', () => {
    const board = Board.fromStringArray([
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '       n       ',
      '       armia   ',
      '       p   miot',
      '       ośka   r',
      '     boi  n   w',
      ' deski   po  da',
      ' or o    in fał',
      ' m  twych s  ł ',
      '               ',
      '               ',
    ]);
    const tiles = generateTiles(['a', 'a', 'ą', 'r', 't', 'w', 'z']);
    const results = solve(trie!, config, board, tiles);
    const bestResult = getBestResult(results.map((result) => Result.fromJson(result)));
    expect(bestResult.word).toBe('zmartwychwstałą');
    expect(bestResult.points).toBe(682);
  });

  it('zmartwychwstałą x24', () => {
    const board = Board.fromStringArray([
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '       ś   miot',
      '     s piska  r',
      '     p i      w',
      'j  fiolę j   da',
      'as o iw  au  ał',
      ' mar  y   stał ',
      'da do    ot    ',
      'ar  ń    m     ',
    ]);
    const tiles = generateTiles(['ą', 'c', 'h', 't', 'w', 'w', 'z']);
    const results = solve(trie!, config, board, tiles);
    const bestResult = getBestResult(results.map((result) => Result.fromJson(result)));
    expect(bestResult.word).toBe('zmartwychwstałą');
    expect(bestResult.points).toBe(1157);
  });

  it('does not duplicate results', () => {
    const board = Board.fromStringArray([
      '             a ',
      '              a',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
    ]);
    const tiles = generateTiles(['d']);
    const results = solve(trie!, config, board, tiles);
    expect(results.length).toBe(4);
  });
});

describe('solve - es-ES', () => {
  const locale = Locale.ES_ES;
  const config = getConfig(Game.Scrabble, locale);
  let trie: Trie | undefined;

  beforeAll(() => {
    return dictionaries.get(locale).then((loadedTrie) => {
      trie = loadedTrie;
    });
  });

  it('llana', () => {
    const board = Board.fromStringArray([
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
    ]);
    const tiles = generateTiles(['ll', 'a', 'n', 'a']);
    const results = solve(trie!, config, board, tiles);
    const bestResult = getBestResult(results.map((result) => Result.fromJson(result)));
    expect(results.length).toBe(24);
    expect(bestResult.points).toBe(22);
  });

  it('chooho - does not use C + H to imitate CH', () => {
    const board = Board.fromStringArray([
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
    ]);
    const tiles = generateTiles(['ch', 'o', 'o', 'c', 'h']);
    const results = solve(trie!, config, board, tiles);
    const words = results.map((result) => result.cells.map((cell) => cell.tile?.character).join(''));
    expect(words).not.toContain('chocho');
  });
});

describe('solve - en-GB', () => {
  const locale = Locale.EN_GB;
  const config = getConfig(Game.Scrabble, locale);
  let trie: Trie | undefined;

  beforeAll(() => {
    return dictionaries.get(locale).then((loadedTrie) => {
      trie = loadedTrie;
    });
  });

  it('no', () => {
    const board = Board.fromStringArray([
      '               ',
      '             ko',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
      '               ',
    ]);
    const tiles = generateTiles(['n']);
    const results = solve(trie!, config, board, tiles).map(Result.fromJson);
    expect(results.some((result) => result.word === 'no')).toBe(true);
    expect(results.some((result) => result.word === 'on')).toBe(true);
    expect(results.length).toBe(2);
  });
});
