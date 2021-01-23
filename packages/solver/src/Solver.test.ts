import { literaki } from '@scrabble-solver/configs';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { Board, Locale, Tile } from '@scrabble-solver/types';

import Solver from './Solver';

const generateTiles = (characters: string): Tile[] =>
  characters.split('').map((character) => new Tile({ character, isBlank: false }));

describe('Solver', () => {
  const locale = Locale.PL_PL;
  const config = literaki[locale];
  let solver: Solver | undefined;

  beforeAll(() => {
    return dictionaries.get(locale).then((trie) => {
      solver = new Solver(config, trie);
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
    const tiles = generateTiles('lino');
    const results = solver!.solve(board, tiles);
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
    const tiles = generateTiles('aaąrtwz');
    const [firstResult, ...results] = solver!.solve(board, tiles);
    const bestResult = results.reduce(
      (bestResultCandidate, result) => (result.points > bestResultCandidate.points ? result : bestResultCandidate),
      firstResult,
    );
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
    const tiles = generateTiles('ąchtwwz');
    const [firstResult, ...results] = solver!.solve(board, tiles);
    const bestResult = results.reduce(
      (bestResultCandidate, result) => (result.points > bestResultCandidate.points ? result : bestResultCandidate),
      firstResult,
    );
    expect(bestResult.word).toBe('zmartwychwstałą');
    expect(bestResult.points).toBe(1157);
  });
});
