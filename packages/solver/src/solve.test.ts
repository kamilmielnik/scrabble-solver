/* eslint-disable max-lines */

import { Gaddag } from '@kamilmielnik/gaddag';
import { getConfig } from '@scrabble-solver/configs';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { Board, Game, Locale, Result, Tile } from '@scrabble-solver/types';

import { solve } from './solve';

import { solve as solveFromPackageEntry } from './index';

const generateTiles = (characters: string[]): Tile[] => {
  return characters.map((character) => new Tile({ character, isBlank: false }));
};

const getBestResult = ([firstResult, ...results]: Result[]): Result => {
  return results.reduce(
    (bestResultCandidate, result) => (result.points > bestResultCandidate.points ? result : bestResultCandidate),
    firstResult,
  );
};

describe('solve', () => {
  const config = getConfig(Game.Scrabble, Locale.EN_US);
  const gaddag = Gaddag.fromArray(['at', 'ta']);

  it('is the function the package exports', () => {
    expect(solveFromPackageEntry).toBe(solve);
  });

  it('returns every legal move as json', () => {
    const results = solve(gaddag, config, Board.create(15, 15), generateTiles(['a', 't']));
    expect(results).toEqual([
      { blankIndices: [], id: 0, isHorizontal: true, points: 4, tiles: ['a', 't'], x: 6, y: 7 },
      { blankIndices: [], id: 1, isHorizontal: true, points: 4, tiles: ['t', 'a'], x: 6, y: 7 },
      { blankIndices: [], id: 2, isHorizontal: true, points: 4, tiles: ['a', 't'], x: 7, y: 7 },
      { blankIndices: [], id: 3, isHorizontal: true, points: 4, tiles: ['t', 'a'], x: 7, y: 7 },
      { blankIndices: [], id: 4, isHorizontal: false, points: 4, tiles: ['a', 't'], x: 7, y: 6 },
      { blankIndices: [], id: 5, isHorizontal: false, points: 4, tiles: ['t', 'a'], x: 7, y: 6 },
      { blankIndices: [], id: 6, isHorizontal: false, points: 4, tiles: ['a', 't'], x: 7, y: 7 },
      { blankIndices: [], id: 7, isHorizontal: false, points: 4, tiles: ['t', 'a'], x: 7, y: 7 },
    ]);
  });

  it('returns no moves for an empty rack', () => {
    expect(solve(gaddag, config, Board.create(15, 15), [])).toEqual([]);
  });

  it('lets unsupported boards fail loudly', () => {
    expect(() => solve(gaddag, config, Board.create(33, 15), [])).toThrow('Boards larger than 32x32 are not supported');
  });
});

describe('solve - pl-PL', () => {
  const locale = Locale.PL_PL;
  const config = getConfig(Game.Literaki, locale);
  let gaddag: Gaddag | undefined;

  beforeAll(() => {
    return dictionaries.get(locale).then((loadedGaddag) => {
      gaddag = loadedGaddag;
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
    const results = solve(gaddag!, config, board, tiles);
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
    const results = solve(gaddag!, config, board, tiles);
    const bestResult = getBestResult(results.map((result) => Result.fromJson(result, board, locale)));
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
    const results = solve(gaddag!, config, board, tiles);
    const bestResult = getBestResult(results.map((result) => Result.fromJson(result, board, locale)));
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
    const results = solve(gaddag!, config, board, tiles);
    expect(results.length).toBe(4);
  });
});

describe('solve - es-ES', () => {
  const locale = Locale.ES_ES;
  const config = getConfig(Game.Scrabble, locale);
  let gaddag: Gaddag | undefined;

  beforeAll(() => {
    return dictionaries.get(locale).then((loadedGaddag) => {
      gaddag = loadedGaddag;
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
    const results = solve(gaddag!, config, board, tiles);
    const bestResult = getBestResult(results.map((result) => Result.fromJson(result, board, locale)));
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
    const results = solve(gaddag!, config, board, tiles);
    const words = results.map((result) => Result.fromJson(result, board, locale).word);
    expect(words).not.toContain('chocho');
  });
});

describe('solve - en-GB', () => {
  const locale = Locale.EN_GB;
  const config = getConfig(Game.Scrabble, locale);
  let gaddag: Gaddag | undefined;

  beforeAll(() => {
    return dictionaries.get(locale).then((loadedGaddag) => {
      gaddag = loadedGaddag;
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
    const results = solve(gaddag!, config, board, tiles).map((json) => Result.fromJson(json, board, locale));
    expect(results.some((result) => result.word === 'no')).toBe(true);
    expect(results.some((result) => result.word === 'on')).toBe(true);
    expect(results.length).toBe(2);
  });
});
