import fs from 'fs';
import { literaki } from 'scrabble-solver-commons/dist/configs';
import { Board, Config, Tile } from 'scrabble-solver-commons/dist/models';
import Solver from './index';
import Trie from './trie';

const collectionJson = fs.readFileSync('../dictionary.json', 'utf-8');
const collection = Trie.fromJson(JSON.parse(collectionJson));
const config = new Config(literaki);
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
  '               '
]);

describe('Solver', () => {
  const solver = new Solver(config, collection);

  it('gives correct number of results for "lino"', () => {
    const tiles = [
      new Tile({ character: 'l', isBlank: false }),
      new Tile({ character: 'i', isBlank: false }),
      new Tile({ character: 'n', isBlank: false }),
      new Tile({ character: 'o', isBlank: false })
    ];
    const results = solver.solve(board, tiles);
    expect(results.length).toBe(58);
  });
});
