import fs from 'fs';
import { Trie } from '@kamilmielnik/trie';
import { literaki } from '@scrabble-solver/configs';
import { Board, Tile } from '@scrabble-solver/models';

import Solver from './Solver';

const locale = 'pl-PL';
const serializedCollection = fs.readFileSync(`dictionaries/${locale}.txt`, 'utf-8');
const collection = Trie.deserialize(serializedCollection);
const config = literaki[locale];

const generateTiles = (characters: string): Tile[] =>
  characters.split('').map((character) => new Tile({ character, isBlank: false }));

describe('Solver', () => {
  const solver = new Solver(config, collection);

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
    const results = solver.solve(board, tiles);
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
    const [firstResult, ...results] = solver.solve(board, tiles);
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
    const [firstResult, ...results] = solver.solve(board, tiles);
    const bestResult = results.reduce(
      (bestResultCandidate, result) => (result.points > bestResultCandidate.points ? result : bestResultCandidate),
      firstResult,
    );
    expect(bestResult.word).toBe('zmartwychwstałą');
    expect(bestResult.points).toBe(1157);
  });
});
