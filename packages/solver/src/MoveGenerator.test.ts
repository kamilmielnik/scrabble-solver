/* eslint-disable max-lines */

import { Gaddag } from '@kamilmielnik/gaddag';
import { getConfig, languages } from '@scrabble-solver/configs';
import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import {
  type BonusJson,
  type ConfigJson,
  type ResultJson,
  Board,
  Cell,
  Config,
  Game,
  Locale,
  Result,
  Tile,
} from '@scrabble-solver/types';

import { MoveGenerator } from './MoveGenerator';
import { ReferenceSolver } from './ReferenceSolver';

type TileScores = Record<string, number>;

type BoardTilePlacement = [x: number, y: number, character: string, isBlank?: boolean];

type PlacedTile = [x: number, y: number, character: string, isBlank: boolean];

interface MoveSummary {
  placed: PlacedTile[];
  points: number;
  words: string[];
}

type Rule = 'bingos' | 'blanks' | 'crossings' | 'digraphs' | 'singles';

interface Tally extends Record<Rule, number> {
  positions: number;
  results: number;
}

interface Position {
  board: Board;
  config: Config;
  gaddag: Gaddag;
  rack: string[];
}

interface GameExpectation {
  config: Config;
  movesCount: number;
  name: string;
  pointsByStartColumn: Record<number, number>;
  word: string;
}

interface DifferentialScenario {
  exercises: Rule[];
  games: number;
  height: number;
  name: string;
  overrides: Partial<ConfigJson>;
  plies: number;
  premiumDensity: number;
  rackLength: number;
  realConfig?: Config;
  startingTiles?: [x: number, y: number][];
  tileScores: TileScores;
  width: number;
}

const BLANK_CHARACTER = '?';

const BASIC_TILES: TileScores = { a: 1, b: 3, c: 3, d: 2 };

const SPANISH_MINI_TILES: TileScores = { a: 1, c: 3, ch: 5, h: 4, i: 1, l: 1, ll: 8, o: 1 };

const MINI_TILES: TileScores = { a: 1, b: 3, c: 2, d: 5, e: 1 };

const DIFFERENTIAL_SCENARIOS: DifferentialScenario[] = [
  {
    exercises: ['blanks', 'bingos', 'crossings', 'singles'],
    games: 12,
    height: 5,
    name: 'square board',
    overrides: { rackSize: 4 },
    plies: 8,
    premiumDensity: 0,
    rackLength: 4,
    tileScores: MINI_TILES,
    width: 5,
  },
  {
    exercises: ['blanks', 'bingos', 'crossings', 'singles'],
    games: 12,
    height: 7,
    name: 'premiums of every kind',
    overrides: { rackSize: 4 },
    plies: 8,
    premiumDensity: 0.35,
    rackLength: 4,
    tileScores: MINI_TILES,
    width: 7,
  },
  {
    exercises: ['blanks', 'crossings', 'singles'],
    games: 10,
    height: 6,
    name: 'even-sized board',
    overrides: {},
    plies: 8,
    premiumDensity: 0.2,
    rackLength: 4,
    tileScores: MINI_TILES,
    width: 6,
  },
  {
    exercises: ['blanks', 'bingos', 'crossings', 'singles'],
    games: 10,
    height: 4,
    name: 'wide board with a multiplier bingo',
    overrides: { bingo: { multiplier: 3 }, rackSize: 3 },
    plies: 8,
    premiumDensity: 0.25,
    rackLength: 3,
    tileScores: MINI_TILES,
    width: 9,
  },
  {
    exercises: ['blanks', 'bingos', 'crossings', 'singles'],
    games: 10,
    height: 9,
    name: 'tall board with a multiplier bingo',
    overrides: { bingo: { multiplier: 2 }, rackSize: 3 },
    plies: 8,
    premiumDensity: 0.25,
    rackLength: 3,
    tileScores: MINI_TILES,
    width: 4,
  },
  {
    exercises: ['blanks', 'singles'],
    games: 10,
    height: 1,
    name: 'single row',
    overrides: {},
    plies: 5,
    premiumDensity: 0.3,
    rackLength: 4,
    tileScores: MINI_TILES,
    width: 8,
  },
  {
    exercises: ['blanks', 'singles'],
    games: 10,
    height: 8,
    name: 'single column',
    overrides: {},
    plies: 5,
    premiumDensity: 0.3,
    rackLength: 4,
    tileScores: MINI_TILES,
    width: 1,
  },
  {
    exercises: ['blanks', 'crossings', 'singles'],
    games: 10,
    height: 5,
    name: 'blanks worth points',
    overrides: { blankScore: 2 },
    plies: 8,
    premiumDensity: 0.3,
    rackLength: 3,
    tileScores: MINI_TILES,
    width: 5,
  },
  {
    exercises: ['blanks', 'bingos', 'crossings', 'digraphs', 'singles'],
    games: 16,
    height: 6,
    name: 'digraph tiles',
    overrides: { rackSize: 3 },
    plies: 8,
    premiumDensity: 0.25,
    rackLength: 3,
    tileScores: SPANISH_MINI_TILES,
    width: 6,
  },
  {
    exercises: ['crossings', 'singles'],
    games: 10,
    height: 5,
    name: 'one-tile rack',
    overrides: {},
    plies: 10,
    premiumDensity: 0.2,
    rackLength: 1,
    startingTiles: [[2, 2]],
    tileScores: MINI_TILES,
    width: 5,
  },
  {
    exercises: ['blanks', 'bingos', 'crossings', 'singles'],
    games: 8,
    height: 6,
    name: 'rack larger than the configured rack size',
    overrides: { rackSize: 3 },
    plies: 6,
    premiumDensity: 0.2,
    rackLength: 5,
    tileScores: MINI_TILES,
    width: 6,
  },
];

describe('MoveGenerator - input validation', () => {
  const gaddag = Gaddag.fromArray(['ab']);

  it('throws when the alphabet exceeds 64 tiles', () => {
    const config = createConfig(createWideAlphabet(65));
    expect(() => new MoveGenerator(gaddag, config, createBoard(5, 5), createRack(['a']))).toThrow(
      'Alphabets larger than 64 tiles are not supported',
    );
  });

  it('accepts an alphabet of exactly 64 tiles', () => {
    const config = createConfig(createWideAlphabet(64));
    const results = generate(gaddag, config, createBoard(5, 5), ['a', 'b']);
    expect(results.length).toBe(4);
  });

  it('throws when the board is wider than 32 cells', () => {
    const config = createConfig(BASIC_TILES);
    expect(() => new MoveGenerator(gaddag, config, createBoard(33, 5), createRack(['a']))).toThrow(
      'Boards larger than 32x32 are not supported',
    );
  });

  it('throws when the board is taller than 32 cells', () => {
    const config = createConfig(BASIC_TILES);
    expect(() => new MoveGenerator(gaddag, config, createBoard(5, 33), createRack(['a']))).toThrow(
      'Boards larger than 32x32 are not supported',
    );
  });

  it('accepts a 32x32 board', () => {
    const config = createConfig(BASIC_TILES);
    const results = generate(gaddag, config, createBoard(32, 32), ['a', 'b']);
    expect(results.length).toBe(4);
    expect(results.every((result) => coversCell(result, 16, 16))).toBe(true);
  });
});

describe('MoveGenerator - rack edge cases', () => {
  const gaddag = Gaddag.fromArray(['ab']);
  const config = createConfig(BASIC_TILES);
  const board = createBoard(5, 5, [[2, 2, 'a']]);

  it('returns nothing for an empty rack', () => {
    expect(generate(gaddag, config, board, [])).toEqual([]);
  });

  it('returns nothing when the rack has only characters outside the config alphabet', () => {
    expect(generate(gaddag, config, board, ['x'])).toEqual([]);
  });

  it('ignores rack tiles with characters outside the config alphabet', () => {
    expect(generate(gaddag, config, board, ['b', 'x'])).toEqual(generate(gaddag, config, board, ['b']));
  });

  it('returns nothing when rack characters do not occur in the dictionary', () => {
    const configWithZ = createConfig({ ...BASIC_TILES, z: 10 });
    expect(generate(gaddag, configWithZ, board, ['z'])).toEqual([]);
  });
});

describe('MoveGenerator - first move on an empty board', () => {
  it('generates every word placement through the center, in both directions', () => {
    const gaddag = Gaddag.fromArray(['ab', 'ba']);
    const config = createConfig(BASIC_TILES);
    const results = generate(gaddag, config, createBoard(5, 5), ['a', 'b']);
    expect(summarizeAll(results)).toEqual([
      {
        placed: [
          [1, 2, 'a', false],
          [2, 2, 'b', false],
        ],
        points: 4,
        words: ['ab'],
      },
      {
        placed: [
          [1, 2, 'b', false],
          [2, 2, 'a', false],
        ],
        points: 4,
        words: ['ba'],
      },
      {
        placed: [
          [2, 2, 'a', false],
          [3, 2, 'b', false],
        ],
        points: 4,
        words: ['ab'],
      },
      {
        placed: [
          [2, 2, 'b', false],
          [3, 2, 'a', false],
        ],
        points: 4,
        words: ['ba'],
      },
      {
        placed: [
          [2, 1, 'a', false],
          [2, 2, 'b', false],
        ],
        points: 4,
        words: ['ab'],
      },
      {
        placed: [
          [2, 1, 'b', false],
          [2, 2, 'a', false],
        ],
        points: 4,
        words: ['ba'],
      },
      {
        placed: [
          [2, 2, 'a', false],
          [2, 3, 'b', false],
        ],
        points: 4,
        words: ['ab'],
      },
      {
        placed: [
          [2, 2, 'b', false],
          [2, 3, 'a', false],
        ],
        points: 4,
        words: ['ba'],
      },
    ]);
  });

  it('starts from the center of rectangular boards', () => {
    const gaddag = Gaddag.fromArray(['ab']);
    const config = createConfig(BASIC_TILES);
    const wideResults = generate(gaddag, config, createBoard(9, 5), ['a', 'b']);
    expect(wideResults.length).toBe(4);
    expect(wideResults.every((result) => coversCell(result, 4, 2))).toBe(true);
    const tallResults = generate(gaddag, config, createBoard(5, 9), ['a', 'b']);
    expect(tallResults.length).toBe(4);
    expect(tallResults.every((result) => coversCell(result, 2, 4))).toBe(true);
  });

  it('respects the rack multiset', () => {
    const gaddag = Gaddag.fromArray(['aa']);
    const config = createConfig(BASIC_TILES);
    expect(generate(gaddag, config, createBoard(5, 5), ['a'])).toEqual([]);
    expect(generate(gaddag, config, createBoard(5, 5), ['a', 'a']).length).toBe(4);
  });

  it('substitutes missing tiles with a blank', () => {
    const gaddag = Gaddag.fromArray(['aa']);
    const config = createConfig(BASIC_TILES);
    const results = generate(gaddag, config, createBoard(5, 5), ['a', BLANK_CHARACTER]);
    expect(results.length).toBe(8);
    expect(results.every((result) => result.points === 1)).toBe(true);
    expect(results.every((result) => result.blanksCount === 1)).toBe(true);
  });

  it('does not generate one-letter words', () => {
    const gaddag = Gaddag.fromArray(['a', 'ab']);
    const config = createConfig(BASIC_TILES);
    expect(generate(gaddag, config, createBoard(5, 5), ['a'])).toEqual([]);
  });
});

describe('MoveGenerator - anchoring and connectivity', () => {
  it('requires contact with existing tiles', () => {
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [[0, 0, 'a']]);
    expect(generate(Gaddag.fromArray(['bc']), config, board, ['b', 'c'])).toEqual([]);
    expect(generate(Gaddag.fromArray(['abc']), config, board, ['b', 'c']).length).toBe(2);
  });

  it('extends existing words on either side and on both at once', () => {
    const gaddag = Gaddag.fromArray(['dab', 'abe', 'dabe']);
    const config = createConfig({ a: 1, b: 3, d: 2, e: 1 });
    const board = createBoard(5, 5, [
      [1, 2, 'a'],
      [2, 2, 'b'],
    ]);
    const results = generate(gaddag, config, board, ['d', 'e']);
    expect(toWords(results)).toEqual(['dab', 'dabe', 'abe']);
    expect(results.map((result) => result.points)).toEqual([6, 7, 5]);
  });

  it('plays through existing tiles', () => {
    const gaddag = Gaddag.fromArray(['abc']);
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [
      [1, 2, 'a'],
      [3, 2, 'c'],
    ]);
    const results = generateJson(gaddag, config, board, ['b']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: true, points: 7, tiles: ['b'], x: 1, y: 2 }]);
    const [result] = results.map((json) => Result.fromJson(json, board));
    expect(result.word).toBe('abc');
    expect(result.cells.map(({ isEmpty, x, y }) => ({ isEmpty, x, y }))).toEqual([
      { isEmpty: false, x: 1, y: 2 },
      { isEmpty: true, x: 2, y: 2 },
      { isEmpty: false, x: 3, y: 2 },
    ]);
    expect(result.collisions).toEqual([]);
  });

  it('returns nothing on a full board', () => {
    const gaddag = Gaddag.fromArray(['ab']);
    const config = createConfig(BASIC_TILES);
    const placements: BoardTilePlacement[] = [];

    for (let y = 0; y < 3; ++y) {
      for (let x = 0; x < 3; ++x) {
        placements.push([x, y, 'a']);
      }
    }

    expect(generate(gaddag, config, createBoard(3, 3, placements), ['b'])).toEqual([]);
  });

  it('generates nothing around board characters missing from the dictionary', () => {
    const gaddag = Gaddag.fromArray(['ab']);
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [[2, 2, 'z']]);
    expect(generate(gaddag, config, board, ['a', 'b'])).toEqual([]);
  });

  it('treats candidate cells (empty cells holding a tile) as empty', () => {
    const gaddag = Gaddag.fromArray(['ab']);
    const config = createConfig(BASIC_TILES);
    const board = Board.create(5, 5);
    board.updateCell(2, 2, () => new Cell({ isEmpty: true, tile: new Tile({ character: 'a' }), x: 2, y: 2 }));
    expect(generate(gaddag, config, board, ['a', 'b'])).toEqual(
      generate(gaddag, config, Board.create(5, 5), ['a', 'b']),
    );
  });
});

describe('MoveGenerator - perpendicular words (cross-checks)', () => {
  it('rejects placements whose perpendicular word is not in the dictionary', () => {
    const gaddag = Gaddag.fromArray(['bb']);
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [[2, 1, 'a']]);
    expect(generate(gaddag, config, board, ['b', 'b'])).toEqual([]);
  });

  it('validates the perpendicular word at every placed tile', () => {
    const gaddag = Gaddag.fromArray(['bb', 'ab']);
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [
      [1, 1, 'a'],
      [2, 1, 'a'],
    ]);
    const results = generate(gaddag, config, board, ['b', 'b']);
    expect(toSortedPoints(results)).toEqual([4, 4, 10, 10, 14]);
    expect(summarizeAll(results)).toContainEqual({
      placed: [
        [1, 2, 'b', false],
        [2, 2, 'b', false],
      ],
      points: 14,
      words: ['bb', 'ab', 'ab'],
    });
  });

  it('applies cross-check masks to tiles beyond the 32nd alphabet entry', () => {
    const tileScores = createWideAlphabet(40);
    const alphabet = Object.keys(tileScores);
    const high = alphabet[35];
    const other = alphabet[36];
    const gaddag = Gaddag.fromArray([`a${high}`, `b${high}`, `a${other}`]);
    const config = createConfig(tileScores);
    const board = createBoard(5, 5, [
      [1, 2, 'a'],
      [2, 1, 'b'],
    ]);
    const results = generate(gaddag, config, board, [high, other]);
    expect(summarizeAll(results)).toEqual([
      { placed: [[3, 1, high, false]], points: 4, words: [`b${high}`] },
      { placed: [[2, 2, high, false]], points: 6, words: [`a${high}`, `b${high}`] },
      { placed: [[1, 3, high, false]], points: 2, words: [`a${high}`] },
      { placed: [[1, 3, other, false]], points: 2, words: [`a${other}`] },
    ]);
  });

  it('reads perpendicular tiles on both sides of the placed tile', () => {
    const gaddag = Gaddag.fromArray(['abc', 'bd']);
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [
      [2, 1, 'a'],
      [2, 3, 'c'],
      [3, 2, 'd'],
    ]);
    const results = generateJson(gaddag, config, board, ['b']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: true, points: 12, tiles: ['b'], x: 2, y: 2 }]);
    const [result] = results.map((json) => Result.fromJson(json, board));
    expect(result.words).toEqual(['bd', 'abc']);
    expect(result.collisions).toHaveLength(1);
    expect(result.collisions[0].map(({ x, y }) => ({ x, y }))).toEqual([
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ]);
  });
});

describe('MoveGenerator - single-tile moves', () => {
  const gaddag = Gaddag.fromArray(['aba']);
  const config = createConfig(BASIC_TILES);
  const crossroads = () =>
    createBoard(5, 5, [
      [1, 2, 'a'],
      [3, 2, 'a'],
      [2, 1, 'a'],
      [2, 3, 'a'],
    ]);

  it('emits one result when a tile completes words in both directions', () => {
    const results = generate(gaddag, config, crossroads(), ['b']);
    expect(summarizeAll(results)).toEqual([{ placed: [[2, 2, 'b', false]], points: 10, words: ['aba', 'aba'] }]);
    expect(results[0].cells.every((cell) => cell.y === 2)).toBe(true);
  });

  it('keeps blank and real-tile versions of the same placement distinct', () => {
    const results = generate(gaddag, config, crossroads(), ['b', BLANK_CHARACTER]);
    expect(summarizeAll(results)).toEqual([
      { placed: [[2, 2, 'b', false]], points: 10, words: ['aba', 'aba'] },
      { placed: [[2, 2, 'b', true]], points: 4, words: ['aba', 'aba'] },
    ]);
  });
});

describe('MoveGenerator - blanks', () => {
  it('scores blanks with blankScore in both the main and perpendicular word', () => {
    const gaddag = Gaddag.fromArray(['ab']);
    const config = createConfig(BASIC_TILES, { blankScore: 2 });
    const board = createBoard(5, 5, [
      [2, 1, 'a'],
      [1, 2, 'a'],
    ]);
    const results = generate(gaddag, config, board, [BLANK_CHARACTER]);
    expect(summarizeAll(results)).toEqual([
      { placed: [[3, 1, 'b', true]], points: 3, words: ['ab'] },
      { placed: [[2, 2, 'b', true]], points: 6, words: ['ab', 'ab'] },
      { placed: [[1, 3, 'b', true]], points: 3, words: ['ab'] },
    ]);
  });

  it('scores blanks already on the board with blankScore', () => {
    const gaddag = Gaddag.fromArray(['ab']);
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [[2, 2, 'a', true]]);
    const results = generate(gaddag, config, board, ['b']);
    expect(results.map((result) => result.points)).toEqual([3, 3]);
    expect(results[0].cells[0]).toEqual(
      new Cell({ isEmpty: false, tile: new Tile({ character: 'a', isBlank: true }), x: 2, y: 2 }),
    );
  });

  it('plays multiple blanks in a single move', () => {
    const gaddag = Gaddag.fromArray(['bb']);
    const config = createConfig(BASIC_TILES);
    const results = generate(gaddag, config, createBoard(5, 5), [BLANK_CHARACTER, BLANK_CHARACTER]);
    expect(results.length).toBe(4);
    expect(results.every((result) => result.points === 0)).toBe(true);
    expect(results.every((result) => result.blanksCount === 2)).toBe(true);
  });
});

describe('MoveGenerator - digraphs', () => {
  const config = createConfig(SPANISH_MINI_TILES);

  it('plays a digraph tile within words in both directions', () => {
    const gaddag = Gaddag.fromArray(['chico']);
    const results = generate(gaddag, config, createBoard(7, 7), ['ch', 'i', 'c', 'o']);
    expect(results.length).toBe(8);
    expect(toWords(results).every((word) => word === 'chico')).toBe(true);
    expect(results.every((result) => result.points === 10)).toBe(true);
    expect(results.every((result) => result.cells.length === 4)).toBe(true);
  });

  it('does not compose a digraph from two single tiles', () => {
    const gaddag = Gaddag.fromArray(['chico']);
    expect(generate(gaddag, config, createBoard(7, 7), ['c', 'h', 'i', 'c', 'o'])).toEqual([]);
  });

  it('does not compose a digraph from a board tile and a placed tile', () => {
    const gaddag = Gaddag.fromArray(['chico']);
    const board = createBoard(7, 7, [[2, 2, 'c']]);
    expect(generate(gaddag, config, board, ['h', 'i', 'c', 'o'])).toEqual([]);
  });

  it('reads a board digraph tile when extending to the right', () => {
    const gaddag = Gaddag.fromArray(['chico']);
    const board = createBoard(7, 7, [
      [1, 3, 'ch'],
      [2, 3, 'i'],
      [3, 3, 'c'],
    ]);
    const results = generate(gaddag, config, board, ['o']);
    expect(summarizeAll(results)).toEqual([{ placed: [[4, 3, 'o', false]], points: 10, words: ['chico'] }]);
  });

  it('reads a board digraph tile when extending to the left', () => {
    const gaddag = Gaddag.fromArray(['chico']);
    const board = createBoard(7, 7, [
      [3, 3, 'i'],
      [4, 3, 'c'],
      [5, 3, 'o'],
    ]);
    const results = generate(gaddag, config, board, ['ch']);
    expect(summarizeAll(results)).toEqual([{ placed: [[2, 3, 'ch', false]], points: 10, words: ['chico'] }]);
  });

  it('validates perpendicular words through a board digraph tile', () => {
    const gaddag = Gaddag.fromArray(['cho', 'ol']);
    const board = createBoard(7, 7, [[3, 2, 'ch']]);
    const results = generate(gaddag, config, board, ['o', 'l']);
    expect(summarizeAll(results)).toEqual([
      { placed: [[4, 2, 'o', false]], points: 6, words: ['cho'] },
      {
        placed: [
          [3, 3, 'o', false],
          [4, 3, 'l', false],
        ],
        points: 8,
        words: ['ol', 'cho'],
      },
      { placed: [[3, 3, 'o', false]], points: 6, words: ['cho'] },
      {
        placed: [
          [4, 2, 'o', false],
          [4, 3, 'l', false],
        ],
        points: 8,
        words: ['ol', 'cho'],
      },
    ]);
  });

  it('plays a blank as a digraph tile', () => {
    const gaddag = Gaddag.fromArray(['cho']);
    const board = createBoard(7, 7, [[3, 3, 'o']]);
    const results = generate(gaddag, config, board, [BLANK_CHARACTER]);
    expect(summarizeAll(results)).toEqual([
      { placed: [[2, 3, 'ch', true]], points: 1, words: ['cho'] },
      { placed: [[3, 2, 'ch', true]], points: 1, words: ['cho'] },
    ]);
  });

  it('counts a digraph as a single tile for the bingo', () => {
    const gaddag = Gaddag.fromArray(['cho']);
    const bingoConfig = createConfig(SPANISH_MINI_TILES, { rackSize: 2 });
    const results = generate(gaddag, bingoConfig, createBoard(7, 7), ['ch', 'o']);
    expect(results.length).toBe(4);
    expect(results.every((result) => result.points === 56)).toBe(true);
  });

  it('rejects digraphs composed from single tiles in perpendicular words', () => {
    const gaddag = Gaddag.fromArray(['chico', 'ha']);
    const board = createBoard(7, 7, [
      [2, 1, 'c'],
      [2, 3, 'i'],
      [2, 4, 'c'],
      [2, 5, 'o'],
    ]);
    expect(generate(gaddag, config, board, ['h', 'a'])).toEqual([]);
  });

  it('rejects perpendicular words through board tiles that spell a digraph', () => {
    const gaddag = Gaddag.fromArray(['cho', 'oa']);
    const board = createBoard(7, 7, [
      [2, 1, 'c'],
      [2, 2, 'h'],
      [3, 3, 'a'],
    ]);
    expect(generate(gaddag, config, board, ['o'])).toEqual([]);
  });

  it('allows the digraph tile itself in perpendicular words', () => {
    const gaddag = Gaddag.fromArray(['cha', 'cho']);
    const board = createBoard(7, 7, [[2, 3, 'o']]);
    const results = generate(gaddag, config, board, ['ch', 'a']);
    expect(summarizeAll(results)).toEqual([
      {
        placed: [
          [2, 2, 'ch', false],
          [3, 2, 'a', false],
        ],
        points: 12,
        words: ['cha', 'cho'],
      },
      { placed: [[1, 3, 'ch', false]], points: 6, words: ['cho'] },
      {
        placed: [
          [1, 3, 'ch', false],
          [1, 4, 'a', false],
        ],
        points: 12,
        words: ['cha', 'cho'],
      },
      { placed: [[2, 2, 'ch', false]], points: 6, words: ['cho'] },
    ]);
  });
});

describe('MoveGenerator - digraphs with the real Spanish config', () => {
  const config = getConfig(Game.Scrabble, Locale.ES_ES);

  it('plays chico through the center double-word bonus', () => {
    const gaddag = Gaddag.fromArray(['chico']);
    const results = generate(gaddag, config, createBoard(15, 15), ['ch', 'i', 'c', 'o']);
    expect(results.length).toBe(8);
    expect(toWords(results).every((word) => word === 'chico')).toBe(true);
    expect(results.every((result) => result.points === 20)).toBe(true);
  });

  it('orders blank interpretations by tile order (ll before l)', () => {
    const gaddag = Gaddag.fromArray(['pillo', 'pilo']);
    const board = createBoard(15, 15, [
      [5, 4, 'p'],
      [6, 4, 'i'],
      [8, 4, 'o'],
    ]);
    const results = generate(gaddag, config, board, [BLANK_CHARACTER]);
    expect(toWords(results)).toEqual(['pillo', 'pilo']);
    expect(results.map((result) => result.points)).toEqual([5, 5]);
  });

  it('requires the rr tile to play words with a double r', () => {
    const gaddag = Gaddag.fromArray(['carro']);
    const board = createBoard(15, 15, [
      [5, 4, 'c'],
      [6, 4, 'a'],
    ]);
    expect(generate(gaddag, config, board, ['r', 'r', 'o'])).toEqual([]);
    const results = generate(gaddag, config, board, ['rr', 'o']);
    expect(summarizeAll(results)).toEqual([
      {
        placed: [
          [7, 4, 'rr', false],
          [8, 4, 'o', false],
        ],
        points: 13,
        words: ['carro'],
      },
    ]);
  });
});

describe('MoveGenerator - bonuses', () => {
  const gaddag = Gaddag.fromArray(['ab']);
  const board = () => createBoard(5, 5, [[2, 2, 'a']]);
  const characterBonus = (x: number, y: number, multiplier: number, score?: number) => ({
    multiplier,
    score,
    type: BONUS_CHARACTER,
    x,
    y,
  });
  const wordBonus = (x: number, y: number, multiplier: number) => ({ multiplier, type: BONUS_WORD, x, y });

  it('multiplies the placed tile on a character bonus', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [characterBonus(3, 2, 2)] });
    expect(generate(gaddag, config, board(), ['b']).map((result) => result.points)).toEqual([7, 4]);
  });

  it('multiplies the whole word on a word bonus', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [wordBonus(3, 2, 3)] });
    expect(generate(gaddag, config, board(), ['b']).map((result) => result.points)).toEqual([12, 4]);
  });

  it('applies a score-gated character bonus only to tiles with the matching score', () => {
    const matching = createConfig(BASIC_TILES, { bonuses: [characterBonus(3, 2, 2, 3)] });
    expect(generate(gaddag, matching, board(), ['b']).map((result) => result.points)).toEqual([7, 4]);
    const mismatched = createConfig(BASIC_TILES, { bonuses: [characterBonus(3, 2, 2, 2)] });
    expect(generate(gaddag, mismatched, board(), ['b']).map((result) => result.points)).toEqual([4, 4]);
  });

  it('gates blanks by the score of the character they represent', () => {
    const config = createConfig(BASIC_TILES, { blankScore: 2, bonuses: [characterBonus(3, 2, 2, 3)] });
    expect(generate(gaddag, config, board(), [BLANK_CHARACTER]).map((result) => result.points)).toEqual([5, 3]);
  });

  it('applies the first bonus when several share coordinates', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [characterBonus(3, 2, 2), wordBonus(3, 2, 3)] });
    expect(generate(gaddag, config, board(), ['b']).map((result) => result.points)).toEqual([7, 4]);
  });

  it('does not apply bonuses under existing tiles', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [characterBonus(2, 2, 2)] });
    expect(generate(gaddag, config, board(), ['b']).map((result) => result.points)).toEqual([4, 4]);
  });

  it('ignores bonuses outside the board', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [wordBonus(10, 10, 3)] });
    expect(generate(gaddag, config, board(), ['b']).map((result) => result.points)).toEqual([4, 4]);
  });

  it('applies a bonus to both the main and the perpendicular word', () => {
    const crossBoard = createBoard(5, 5, [
      [2, 1, 'a'],
      [1, 2, 'a'],
    ]);
    const characterConfig = createConfig(BASIC_TILES, { bonuses: [characterBonus(2, 2, 2)] });
    expect(generate(gaddag, characterConfig, crossBoard, ['b']).map((result) => result.points)).toEqual([4, 14, 4]);
    const wordConfig = createConfig(BASIC_TILES, { bonuses: [wordBonus(2, 2, 3)] });
    expect(generate(gaddag, wordConfig, crossBoard, ['b']).map((result) => result.points)).toEqual([4, 24, 4]);
  });

  it('multiplies multiple word bonuses together', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [wordBonus(2, 2, 2), wordBonus(4, 2, 2)] });
    const results = generate(Gaddag.fromArray(['abcd']), config, createBoard(5, 5, [[1, 2, 'a']]), ['b', 'c', 'd']);
    expect(summarizeAll(results)).toEqual([
      {
        placed: [
          [2, 2, 'b', false],
          [3, 2, 'c', false],
          [4, 2, 'd', false],
        ],
        points: 36,
        words: ['abcd'],
      },
    ]);
  });
});

describe('MoveGenerator - bingo', () => {
  const gaddag = Gaddag.fromArray(['abcd', 'ac']);
  const board = () =>
    createBoard(5, 5, [
      [1, 2, 'a'],
      [3, 1, 'a'],
    ]);

  it('adds the score bingo when the whole rack is used', () => {
    const config = createConfig(BASIC_TILES, { rackSize: 3 });
    const results = generate(gaddag, config, board(), ['b', 'c', 'd']);
    expect(toSortedPoints(results)).toEqual([4, 4, 4, 4, 59, 63]);
  });

  it('does not apply the bingo when fewer tiles than the rack size are placed', () => {
    const config = createConfig(BASIC_TILES, { rackSize: 4 });
    const results = generate(gaddag, config, board(), ['b', 'c', 'd']);
    expect(toSortedPoints(results)).toEqual([4, 4, 4, 4, 9, 13]);
  });

  it('applies a multiplier bingo to the main word but not to perpendicular words', () => {
    const config = createConfig(BASIC_TILES, { bingo: { multiplier: 3 }, rackSize: 3 });
    const results = generate(gaddag, config, board(), ['b', 'c', 'd']);
    expect(toSortedPoints(results)).toEqual([4, 4, 4, 4, 27, 31]);
  });
});

describe('MoveGenerator - result ordering', () => {
  it('orders results by direction, line, start, and end like the previous solver', () => {
    const gaddag = Gaddag.fromArray(['ab', 'ba']);
    const config = createConfig(BASIC_TILES);
    const results = generate(gaddag, config, createBoard(5, 5), ['a', 'b']);
    expectEnumerationOrder(results);
    expect(toWords(results)).toEqual(['ab', 'ba', 'ab', 'ba', 'ab', 'ba', 'ab', 'ba']);
  });

  it('resolves same-span ties by rack order', () => {
    const gaddag = Gaddag.fromArray(['ab', 'ba']);
    const config = createConfig(BASIC_TILES);
    const results = generate(gaddag, config, createBoard(5, 5), ['b', 'a']);
    expect(toWords(results)).toEqual(['ba', 'ab', 'ba', 'ab', 'ba', 'ab', 'ba', 'ab']);
  });

  it('orders blank interpretations by tile order, after real tiles', () => {
    const gaddag = Gaddag.fromArray(['ab', 'ac', 'ad']);
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    const results = generate(gaddag, config, board, ['d', BLANK_CHARACTER]);
    expect(summarizeAll(results)).toEqual([
      { placed: [[3, 2, 'd', false]], points: 3, words: ['ad'] },
      { placed: [[3, 2, 'b', true]], points: 1, words: ['ab'] },
      { placed: [[3, 2, 'c', true]], points: 1, words: ['ac'] },
      { placed: [[3, 2, 'd', true]], points: 1, words: ['ad'] },
      {
        placed: [
          [1, 3, 'a', true],
          [2, 3, 'd', false],
        ],
        points: 5,
        words: ['ad', 'ad'],
      },
      { placed: [[2, 3, 'd', false]], points: 3, words: ['ad'] },
      { placed: [[2, 3, 'b', true]], points: 1, words: ['ab'] },
      { placed: [[2, 3, 'c', true]], points: 1, words: ['ac'] },
      { placed: [[2, 3, 'd', true]], points: 1, words: ['ad'] },
      {
        placed: [
          [3, 1, 'a', true],
          [3, 2, 'd', false],
        ],
        points: 5,
        words: ['ad', 'ad'],
      },
    ]);
    expect(results.map(({ id }) => id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

describe('MoveGenerator - equivalence with a brute-force reference solver', () => {
  const words = [
    'ab',
    'ace',
    'ad',
    'ae',
    'ba',
    'bad',
    'be',
    'bead',
    'bed',
    'bee',
    'cab',
    'cad',
    'cede',
    'dab',
    'dace',
    'dad',
    'deb',
    'deed',
    'ea',
    'ed',
  ];
  const gaddag = Gaddag.fromArray(words);
  const tiles: TileScores = { a: 1, b: 3, c: 3, d: 2, e: 1 };
  const config = createConfig(tiles);
  const cluster = (): BoardTilePlacement[] => [
    [1, 1, 'b'],
    [1, 2, 'a'],
    [1, 3, 'd'],
    [2, 2, 'b'],
    [3, 2, 'e'],
  ];

  it('matches on a hand-made cluster', () => {
    const results = expectMatchesReference(gaddag, config, createBoard(5, 5, cluster()), ['a', 'd', 'e']);
    expect(results.length).toBeGreaterThan(0);
  });

  it('matches with blanks', () => {
    const results = expectMatchesReference(gaddag, config, createBoard(5, 5, cluster()), ['b', BLANK_CHARACTER]);
    expect(results.length).toBeGreaterThan(0);
  });

  it('matches on a rectangular board', () => {
    const board = createBoard(7, 5, [
      [3, 2, 'a'],
      [4, 2, 'b'],
    ]);
    const results = expectMatchesReference(gaddag, config, board, ['a', 'e', 'd', BLANK_CHARACTER]);
    expect(results.length).toBeGreaterThan(0);
  });

  it('matches on the empty board', () => {
    const results = expectMatchesReference(gaddag, config, createBoard(5, 5), ['b', 'a', 'd']);
    expect(results.length).toBeGreaterThan(0);
  });

  it('matches with bonuses', () => {
    const bonusConfig = createConfig(tiles, {
      bonuses: [
        { multiplier: 2, type: BONUS_CHARACTER, x: 1, y: 2 },
        { multiplier: 2, score: 3, type: BONUS_CHARACTER, x: 2, y: 1 },
        { multiplier: 3, type: BONUS_WORD, x: 3, y: 3 },
        { multiplier: 2, type: BONUS_WORD, x: 0, y: 0 },
      ],
    });
    const results = expectMatchesReference(gaddag, bonusConfig, createBoard(5, 5, cluster()), [
      'a',
      'e',
      BLANK_CHARACTER,
    ]);
    expect(results.length).toBeGreaterThan(0);
  });

  it('matches with a score bingo', () => {
    const bingoConfig = createConfig(tiles, { rackSize: 3 });
    const results = expectMatchesReference(gaddag, bingoConfig, createBoard(5, 5, cluster()), ['a', 'd', 'e']);
    expect(results.length).toBeGreaterThan(0);
  });

  it('matches with a multiplier bingo', () => {
    const bingoConfig = createConfig(tiles, { bingo: { multiplier: 2 }, rackSize: 3 });
    const results = expectMatchesReference(gaddag, bingoConfig, createBoard(5, 5, cluster()), ['a', 'd', 'e']);
    expect(results.length).toBeGreaterThan(0);
  });

  it('matches with digraph tiles', () => {
    const spanishWords = ['cal', 'callo', 'chal', 'chico', 'cho', 'col', 'hilo', 'hola', 'loca', 'ola', 'olla'];
    const spanishGaddag = Gaddag.fromArray(spanishWords);
    const spanishConfig = createConfig(SPANISH_MINI_TILES);
    const board = createBoard(6, 6, [
      [1, 2, 'ch'],
      [2, 2, 'i'],
      [3, 2, 'c'],
      [1, 3, 'o'],
      [4, 1, 'll'],
      [4, 2, 'o'],
      [3, 4, 'o'],
    ]);
    const tileResults = expectMatchesReference(spanishGaddag, spanishConfig, board, ['ch', 'o', 'l', 'a']);
    expect(tileResults.length).toBeGreaterThan(0);
    const blankResults = expectMatchesReference(spanishGaddag, spanishConfig, board, ['o', 'l', BLANK_CHARACTER]);
    expect(blankResults.length).toBeGreaterThan(0);
    const singleHResults = expectMatchesReference(spanishGaddag, spanishConfig, board, ['h', 'o', 'a']);
    expect(singleHResults).toEqual([]);
  });

  it('matches on random boards', () => {
    const scenarios: [number, string[]][] = [
      [11, ['a', 'b', BLANK_CHARACTER]],
      [22, ['d', 'e', 'a']],
      [33, ['b', 'c', BLANK_CHARACTER]],
    ];
    let totalResults = 0;

    for (const [seed, rack] of scenarios) {
      const board = createRandomBoard(5, 5, ['a', 'b', 'c', 'd', 'e'], createRandom(seed));
      totalResults += generate(gaddag, config, board, rack).length;
      expectMatchesReference(gaddag, config, board, rack);
    }

    expect(totalResults).toBeGreaterThan(0);
  });
});

describe('MoveGenerator - first move and the start cell', () => {
  const gaddag = Gaddag.fromArray(['ab']);
  const config = createConfig(BASIC_TILES);

  it('uses the cell right of and below the middle on even-sized boards', () => {
    expect(generateJson(gaddag, config, createBoard(4, 6), ['a', 'b']).map(toSpan)).toEqual([
      [1, 3, true],
      [2, 3, true],
      [2, 2, false],
      [2, 3, false],
    ]);
  });

  it('accepts any letter of the word on the start cell', () => {
    const results = generateJson(Gaddag.fromArray(['abc']), config, createBoard(7, 7), ['a', 'b', 'c']);
    expect(results.map(toSpan)).toEqual([
      [1, 3, true],
      [2, 3, true],
      [3, 3, true],
      [3, 1, false],
      [3, 2, false],
      [3, 3, false],
    ]);
  });

  it('keeps a first move on the board', () => {
    const results = generateJson(Gaddag.fromArray(['abc']), config, createBoard(3, 3), ['a', 'b', 'c']);
    expect(results.map(toSpan)).toEqual([
      [0, 1, true],
      [1, 0, false],
    ]);
  });

  it('rejects a word longer than the board', () => {
    expect(generate(Gaddag.fromArray(['abcd']), config, createBoard(3, 3), ['a', 'b', 'c', 'd'])).toEqual([]);
  });

  it('fills a whole line with a word exactly as long as the board', () => {
    const results = generateJson(Gaddag.fromArray(['abcba']), config, createBoard(5, 5), ['a', 'a', 'b', 'b', 'c']);
    expect(results.map(toSpan)).toEqual([
      [0, 2, true],
      [2, 0, false],
    ]);
  });

  it('plays only along the line of a single-row board', () => {
    expect(generateJson(gaddag, config, createBoard(5, 1), ['a', 'b']).map(toSpan)).toEqual([
      [1, 0, true],
      [2, 0, true],
    ]);
  });

  it('plays only along the line of a single-column board', () => {
    expect(generateJson(gaddag, config, createBoard(1, 5), ['a', 'b']).map(toSpan)).toEqual([
      [0, 1, false],
      [0, 2, false],
    ]);
  });

  it('fits a two-letter word on a two-cell board', () => {
    expect(generateJson(gaddag, config, createBoard(2, 1), ['a', 'b']).map(toSpan)).toEqual([[0, 0, true]]);
    expect(generateJson(gaddag, config, createBoard(1, 2), ['a', 'b']).map(toSpan)).toEqual([[0, 0, false]]);
  });

  it('finds nothing on a one-cell board', () => {
    expect(generate(gaddag, config, createBoard(1, 1), ['a', 'b'])).toEqual([]);
  });

  it.each(Object.entries(languages))('%s starts in the middle of its board', (_, languageConfig) => {
    const [first, second] = languageConfig.alphabet;
    const board = Board.create(languageConfig.boardWidth, languageConfig.boardHeight);
    const twoLetters = Gaddag.fromArray([first + second]);
    const centerX = Math.floor(languageConfig.boardWidth / 2);
    const centerY = Math.floor(languageConfig.boardHeight / 2);
    expect(generateJson(twoLetters, languageConfig, board, [first, second]).map(toSpan)).toEqual([
      [centerX - 1, centerY, true],
      [centerX, centerY, true],
      [centerX, centerY - 1, false],
      [centerX, centerY, false],
    ]);
  });

  it('stops requiring the start cell once any tile is on the board', () => {
    const board = createBoard(5, 5, [[0, 0, 'a']]);
    expect(generateJson(gaddag, config, board, ['b']).map(toSpan)).toEqual([
      [0, 0, true],
      [0, 0, false],
    ]);
  });

  it('accepts an all-blank first move', () => {
    const results = generate(gaddag, config, createBoard(5, 5), [BLANK_CHARACTER, BLANK_CHARACTER]);
    expect(results.map((result) => result.points)).toEqual([0, 0, 0, 0]);
    expect(results.every((result) => coversCell(result, 2, 2))).toBe(true);
  });
});

describe('MoveGenerator - hooks and word extensions', () => {
  const config = createConfig(BASIC_TILES);

  it('scores a back hook as the played word plus the hooked word', () => {
    const results = generate(Gaddag.fromArray(['ab', 'abc', 'cd']), config, createHookBoard(), ['c', 'd']);
    expect(summarizeAll(results)).toEqual([
      { placed: [[3, 2, 'c', false]], points: 7, words: ['abc'] },
      {
        placed: [
          [3, 2, 'c', false],
          [3, 3, 'd', false],
        ],
        points: 12,
        words: ['cd', 'abc'],
      },
    ]);
  });

  it('scores a front hook as the played word plus the hooked word', () => {
    const results = generate(Gaddag.fromArray(['ab', 'cab', 'dc']), config, createHookBoard(), ['c', 'd']);
    expect(summarizeAll(results)).toEqual([
      { placed: [[0, 2, 'c', false]], points: 7, words: ['cab'] },
      {
        placed: [
          [0, 1, 'd', false],
          [0, 2, 'c', false],
        ],
        points: 12,
        words: ['dc', 'cab'],
      },
    ]);
  });

  it('applies the premium under a hook tile to both words', () => {
    const premiumConfig = createConfig(BASIC_TILES, { bonuses: [createWordBonus(3, 2, 2)] });
    const results = generate(Gaddag.fromArray(['ab', 'abc', 'cd']), premiumConfig, createHookBoard(), ['c', 'd']);
    expect(results.map((result) => result.points)).toEqual([14, 24]);
  });

  it('rejects a word that would run into a tile on its right', () => {
    const board = createBoard(6, 6, [[3, 2, 'c']]);
    expect(generate(Gaddag.fromArray(['ab']), config, board, ['a', 'b'])).toEqual([]);
  });

  it('rejects a word that would run into a tile on its left', () => {
    const board = createBoard(6, 6, [[1, 2, 'c']]);
    expect(generate(Gaddag.fromArray(['ab']), config, board, ['a', 'b'])).toEqual([]);
  });

  it('absorbs an adjacent tile into the word when that spells a word', () => {
    const board = createBoard(6, 6, [[3, 2, 'c']]);
    const results = generateJson(Gaddag.fromArray(['abc']), config, board, ['a', 'b']);
    expect(results.map(toSpan)).toEqual([
      [1, 2, true],
      [3, 0, false],
    ]);
  });

  it('fills several gaps and extends past both ends in one move', () => {
    const board = createBoard(7, 7, [
      [2, 2, 'b'],
      [4, 2, 'd'],
    ]);
    const tiles: TileScores = { ...BASIC_TILES, e: 1 };
    const results = generate(Gaddag.fromArray(['abcde']), createConfig(tiles), board, ['a', 'c', 'e']);
    expect(summarizeAll(results)).toEqual([
      {
        placed: [
          [1, 2, 'a', false],
          [3, 2, 'c', false],
          [5, 2, 'e', false],
        ],
        points: 10,
        words: ['abcde'],
      },
    ]);
  });

  it('joins two runs of tiles into one word', () => {
    const board = createRowBoard(['ab def']);
    const tiles: TileScores = { ...BASIC_TILES, e: 1, f: 4 };
    const results = generate(Gaddag.fromArray(['abc', 'abcdef']), createConfig(tiles), board, ['c']);
    expect(summarizeAll(results)).toEqual([{ placed: [[2, 0, 'c', false]], points: 14, words: ['abcdef'] }]);
  });

  it('rejects a word that stops in the middle of a run of board tiles', () => {
    const board = createRowBoard([' bcd ']);
    const tiles: TileScores = { ...BASIC_TILES, e: 1 };
    expect(generate(Gaddag.fromArray(['abc']), createConfig(tiles), board, ['a'])).toEqual([]);
  });

  it('rejects a word whose last placed tile touches a board tile further along', () => {
    const board = createRowBoard([' a  d ']);
    expect(generate(Gaddag.fromArray(['abc']), config, board, ['b', 'c'])).toEqual([]);
    expect(toWords(generate(Gaddag.fromArray(['abcd']), config, board, ['b', 'c']))).toEqual(['abcd']);
  });

  it('rejects filling a gap when the joined runs do not spell a word', () => {
    const board = createRowBoard(['ab def']);
    const tiles: TileScores = { ...BASIC_TILES, e: 1, f: 4 };
    expect(generate(Gaddag.fromArray(['abc', 'def']), createConfig(tiles), board, ['c'])).toEqual([]);
  });
});

describe('MoveGenerator - crossings and parallel plays', () => {
  const config = createConfig(BASIC_TILES);
  const gaddag = Gaddag.fromArray(['aba', 'ad', 'bc', 'dcd']);
  const rack = ['d', 'c', 'd'];

  it('rejects a move when any one of its crossings is not a word, keeping the moves that avoid it', () => {
    const board = createBoard(5, 5, [
      [1, 1, 'a'],
      [2, 1, 'c'],
    ]);
    const results = generate(Gaddag.fromArray(['ab', 'bb']), config, board, ['b', 'b']);
    expect(summarizeAll(results)).toEqual([
      {
        placed: [
          [0, 2, 'b', false],
          [1, 2, 'b', false],
        ],
        points: 10,
        words: ['bb', 'ab'],
      },
      { placed: [[1, 2, 'b', false]], points: 4, words: ['ab'] },
    ]);
  });

  it('reads runs of several tiles on both sides of a crossing', () => {
    const board = createBoard(5, 5, [
      [2, 0, 'a'],
      [2, 1, 'b'],
      [2, 3, 'd'],
      [2, 4, 'a'],
    ]);
    const results = generate(Gaddag.fromArray(['abcda', 'cc']), config, board, ['c', 'c']);
    expect(summarizeAll(results)).toEqual([
      {
        placed: [
          [1, 2, 'c', false],
          [2, 2, 'c', false],
        ],
        points: 16,
        words: ['cc', 'abcda'],
      },
      {
        placed: [
          [2, 2, 'c', false],
          [3, 2, 'c', false],
        ],
        points: 16,
        words: ['cc', 'abcda'],
      },
      { placed: [[2, 2, 'c', false]], points: 10, words: ['abcda'] },
    ]);
  });

  it('scores a parallel play as its main word plus every crossing', () => {
    const results = generate(gaddag, config, createParallelBoard(), rack);
    expect(summarize(findByWord(results, 'dcd'))).toEqual({
      placed: [
        [1, 2, 'd', false],
        [2, 2, 'c', false],
        [3, 2, 'd', false],
      ],
      points: 19,
      words: ['dcd', 'ad', 'bc', 'ad'],
    });
  });

  it('applies a word premium to the main word and only the crossing on that cell', () => {
    const premiumConfig = createConfig(BASIC_TILES, { bonuses: [createWordBonus(2, 2, 2)] });
    expect(findByWord(generate(gaddag, premiumConfig, createParallelBoard(), rack), 'dcd').points).toBe(32);
  });

  it('applies a letter premium to the main word and only the crossing on that cell', () => {
    const premiumConfig = createConfig(BASIC_TILES, { bonuses: [createCharacterBonus(1, 2, 3)] });
    expect(findByWord(generate(gaddag, premiumConfig, createParallelBoard(), rack), 'dcd').points).toBe(27);
  });
});

describe('MoveGenerator - board edges and corners', () => {
  const config = createConfig(BASIC_TILES);
  const gaddag = Gaddag.fromArray(['ab', 'ba']);
  const onlyAb = Gaddag.fromArray(['ab']);

  it('plays up to the last column', () => {
    const results = generateJson(onlyAb, config, createBoard(5, 5, [[3, 4, 'a']]), ['b']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: true, points: 4, tiles: ['b'], x: 3, y: 4 }]);
  });

  it('plays up to the last row', () => {
    const results = generateJson(onlyAb, config, createBoard(5, 5, [[4, 3, 'a']]), ['b']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: false, points: 4, tiles: ['b'], x: 4, y: 3 }]);
  });

  it('plays from the first column', () => {
    const results = generateJson(onlyAb, config, createBoard(5, 5, [[1, 0, 'b']]), ['a']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: true, points: 4, tiles: ['a'], x: 0, y: 0 }]);
  });

  it('plays from the first row', () => {
    const results = generateJson(onlyAb, config, createBoard(5, 5, [[0, 1, 'b']]), ['a']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: false, points: 4, tiles: ['a'], x: 0, y: 0 }]);
  });

  it('does not treat the end of a row as adjacent to the start of the next row', () => {
    const results = generate(gaddag, config, createBoard(5, 5, [[4, 1, 'a']]), ['a', 'b']);
    expect(results).toHaveLength(7);
    expect(results.flatMap((result) => result.cells).every((cell) => cell.x >= 3)).toBe(true);
  });

  it('does not treat the start of a row as adjacent to the end of the previous row', () => {
    const results = generate(gaddag, config, createBoard(5, 5, [[0, 2, 'a']]), ['a', 'b']);
    expect(results).toHaveLength(7);
    expect(results.flatMap((result) => result.cells).every((cell) => cell.x <= 1)).toBe(true);
  });

  it('plays around tiles in all four corners', () => {
    const board = createBoard(5, 5, [
      [0, 0, 'a'],
      [4, 0, 'a'],
      [0, 4, 'a'],
      [4, 4, 'a'],
    ]);
    expect(generateJson(gaddag, config, board, ['b']).map(toSpan)).toEqual([
      [0, 0, true],
      [3, 0, true],
      [0, 4, true],
      [3, 4, true],
      [0, 0, false],
      [0, 3, false],
      [4, 0, false],
      [4, 3, false],
    ]);
  });
});

describe('MoveGenerator - nearly full boards', () => {
  const config = createConfig(BASIC_TILES);

  it('completes the only remaining hole, scoring both words', () => {
    const results = generate(Gaddag.fromArray(['bab']), config, createHoleBoard(), ['a']);
    expect(summarizeAll(results)).toEqual([{ placed: [[1, 1, 'a', false]], points: 14, words: ['bab', 'bab'] }]);
  });

  it('completes a hole in the corner', () => {
    const board = createRowBoard(['aba', 'bab', 'ab ']);
    const results = generate(Gaddag.fromArray(['abc']), config, board, ['c']);
    expect(summarizeAll(results)).toEqual([{ placed: [[2, 2, 'c', false]], points: 14, words: ['abc', 'abc'] }]);
  });

  it('validates only the words the move creates, not the rest of the board', () => {
    const results = generate(Gaddag.fromArray(['bab']), config, createHoleBoard(), ['a']);
    expect(toWords(results)).toEqual(['bab']);
  });

  it('finds nothing when no tile fits the last hole', () => {
    expect(generate(Gaddag.fromArray(['bab']), config, createHoleBoard(), ['c'])).toEqual([]);
  });

  it('finds nothing on a full board, even with blanks on the rack', () => {
    const board = createRowBoard(['ab', 'ba']);
    const results = generate(Gaddag.fromArray(['ab', 'ba']), config, board, [BLANK_CHARACTER, BLANK_CHARACTER]);
    expect(results).toEqual([]);
  });

  it('ignores completely filled lines while playing on the others', () => {
    const board = createRowBoard(['abab', '    ', '    ']);
    const results = generateJson(Gaddag.fromArray(['ab', 'bb']), config, board, ['b']);
    expect(results.map(toSpan)).toEqual([
      [0, 0, false],
      [1, 0, false],
      [2, 0, false],
      [3, 0, false],
    ]);
  });
});

describe('MoveGenerator - rack sizes', () => {
  const config = createConfig(BASIC_TILES);

  it('places a lone tile only next to board tiles', () => {
    const board = createBoard(5, 5, [[2, 2, 'b']]);
    const results = generate(Gaddag.fromArray(['ab', 'cab']), config, board, ['a']);
    expect(summarizeAll(results)).toEqual([
      { placed: [[1, 2, 'a', false]], points: 4, words: ['ab'] },
      { placed: [[2, 1, 'a', false]], points: 4, words: ['ab'] },
    ]);
  });

  it('never places more tiles than the rack holds, even with a longer word available', () => {
    const board = createBoard(7, 7, [[3, 3, 'a']]);
    const results = generate(Gaddag.fromArray(['abc', 'dabc']), config, board, ['b', 'c']);
    expect(toWords(results)).toEqual(['abc', 'abc']);
  });

  it('plays racks larger than the configured rack size', () => {
    const tiles: TileScores = { ...BASIC_TILES, e: 1, f: 1, g: 1, h: 1, i: 1 };
    const results = generate(Gaddag.fromArray(['abcdefghi']), createConfig(tiles), createBoard(9, 9), [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
    ]);
    expect(toWords(results)).toEqual(['abcdefghi', 'abcdefghi']);
    expect(results.every((result) => result.tilesCount === 9)).toBe(true);
  });

  it('does not repeat moves for duplicate tiles on the rack', () => {
    const gaddag = Gaddag.fromArray(['ab']);
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    expect(generateJson(gaddag, config, board, ['b', 'b', 'b'])).toEqual(generateJson(gaddag, config, board, ['b']));
  });
});

describe('MoveGenerator - one-tile plays', () => {
  const gaddag = Gaddag.fromArray(['aba', 'aca']);
  const config = createConfig(BASIC_TILES);

  it('reports a one-tile play spelling only a horizontal word as horizontal', () => {
    const board = createBoard(5, 5, [
      [1, 2, 'a'],
      [3, 2, 'a'],
    ]);
    const results = generateJson(gaddag, config, board, ['b']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: true, points: 5, tiles: ['b'], x: 1, y: 2 }]);
  });

  it('reports a one-tile play spelling only a vertical word as vertical', () => {
    const board = createBoard(5, 5, [
      [2, 1, 'a'],
      [2, 3, 'a'],
    ]);
    const results = generateJson(gaddag, config, board, ['b']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: false, points: 5, tiles: ['b'], x: 2, y: 1 }]);
  });

  it('reports a one-tile play spelling words in both directions once, as horizontal', () => {
    const results = generateJson(gaddag, config, createCrossroadsBoard(), ['b']);
    expect(results).toEqual([{ blankIndices: [], id: 0, isHorizontal: true, points: 10, tiles: ['b'], x: 1, y: 2 }]);
  });

  it('keeps one result per letter on the same cell', () => {
    const results = generate(gaddag, config, createCrossroadsBoard(), ['b', 'c']);
    expect(summarizeAll(results)).toEqual([
      { placed: [[2, 2, 'b', false]], points: 10, words: ['aba', 'aba'] },
      { placed: [[2, 2, 'c', false]], points: 10, words: ['aca', 'aca'] },
    ]);
  });

  it('keeps one result per cell for the same letter', () => {
    const board = createRowBoard([' a   a ', 'a a a a', ' a   a ']);
    const results = generateJson(gaddag, config, board, ['b']);
    expect(results.map(toSpan)).toEqual([
      [0, 1, true],
      [2, 1, true],
      [4, 1, true],
    ]);
  });

  it('keeps blank and real versions apart for every letter on every cell', () => {
    const results = generate(gaddag, config, createCrossroadsBoard(), ['b', 'c', BLANK_CHARACTER]);
    expect(results.map(toPlacedSummary)).toEqual(['b', 'c', 'b?', 'c?']);
  });
});

describe('MoveGenerator - blanks and premiums', () => {
  const gaddag = Gaddag.fromArray(['ab']);

  it('scores nothing for a blank on a letter premium', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createCharacterBonus(3, 2, 3)] });
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    expect(generate(gaddag, config, board, [BLANK_CHARACTER]).map((result) => result.points)).toEqual([1, 1]);
  });

  it('applies a word premium under a blank', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(3, 2, 3)] });
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    expect(generate(gaddag, config, board, [BLANK_CHARACTER]).map((result) => result.points)).toEqual([3, 1]);
  });

  it('applies a word premium under a blank to both words it completes', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(2, 2, 2)] });
    const board = createBoard(5, 5, [
      [2, 1, 'a'],
      [1, 2, 'a'],
    ]);
    expect(generate(gaddag, config, board, [BLANK_CHARACTER]).map((result) => result.points)).toEqual([1, 4, 1]);
  });

  it('plays two blanks and a real tile together, scoring only the real tile', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(2, 2, 2)] });
    const results = generateJson(Gaddag.fromArray(['abd']), config, createBoard(5, 5), [
      BLANK_CHARACTER,
      'd',
      BLANK_CHARACTER,
    ]);
    expect(results).toHaveLength(6);
    expect(results.every(({ blankIndices, points }) => points === 4 && blankIndices.join() === '0,1')).toBe(true);
  });

  it('counts a blank on the board as zero in both the main word and a crossing', () => {
    const results = generate(Gaddag.fromArray(['ab', 'bd']), createConfig(BASIC_TILES), createBlankCrossingBoard(), [
      'b',
    ]);
    expect(summarizeAll(results)).toEqual([
      { placed: [[3, 1, 'b', false]], points: 8, words: ['ab', 'bd'] },
      { placed: [[2, 2, 'b', false]], points: 8, words: ['bd', 'ab'] },
    ]);
  });

  it('does not re-apply the premium under a blank already on the board', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(2, 2, 3)] });
    const board = createBoard(5, 5, [[2, 2, 'a', true]]);
    expect(generate(gaddag, config, board, ['b']).map((result) => result.points)).toEqual([3, 3]);
  });

  it('only lets a blank stand for tiles of the config alphabet', () => {
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    const results = generate(Gaddag.fromArray(['ax']), createConfig(BASIC_TILES), board, [BLANK_CHARACTER]);
    expect(results).toEqual([]);
  });

  it('plays the three blanks of Crossplay', () => {
    const config = getConfig(Game.Crossplay, Locale.EN_US);
    const blanks = [BLANK_CHARACTER, BLANK_CHARACTER, BLANK_CHARACTER];
    const results = generateJson(Gaddag.fromArray(['cat']), config, createBoard(15, 15), blanks);
    expect(results).toHaveLength(6);
    expect(results.every(({ blankIndices, points }) => points === 0 && blankIndices.join() === '0,1,2')).toBe(true);
  });

  it('plays the four blanks of Super Scrabble', () => {
    const config = getConfig(Game.SuperScrabble, Locale.EN_US);
    const blanks = [BLANK_CHARACTER, BLANK_CHARACTER, BLANK_CHARACTER, BLANK_CHARACTER];
    const results = generateJson(Gaddag.fromArray(['quiz']), config, createBoard(21, 21), blanks);
    expect(results).toHaveLength(8);
    expect(results.every(({ blankIndices, points }) => points === 0 && blankIndices.join() === '0,1,2,3')).toBe(true);
  });
});

describe('MoveGenerator - premium squares', () => {
  it('stacks letter and word premiums in the main word', () => {
    const config = createConfig(BASIC_TILES, {
      bonuses: [createCharacterBonus(2, 2, 3), createWordBonus(3, 2, 2), createWordBonus(4, 2, 3)],
    });
    const board = createBoard(7, 7, [[1, 2, 'a']]);
    const results = generate(Gaddag.fromArray(['abcd']), config, board, ['b', 'c', 'd']);
    expect(results.map((result) => result.points)).toEqual([90, 9]);
  });

  it('adds letter premiums up instead of multiplying them together', () => {
    const config = createConfig(BASIC_TILES, {
      bonuses: [createCharacterBonus(2, 2, 2), createCharacterBonus(3, 2, 3)],
    });
    const board = createBoard(7, 7, [[1, 2, 'a']]);
    const results = generate(Gaddag.fromArray(['abcd']), config, board, ['b', 'c', 'd']);
    expect(results.map((result) => result.points)).toEqual([18, 9]);
  });

  it('gives each crossing only the premium of its own cell', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createCharacterBonus(1, 2, 3), createWordBonus(2, 2, 2)] });
    const board = createBoard(5, 5, [
      [1, 1, 'a'],
      [2, 1, 'a'],
    ]);
    const results = generate(Gaddag.fromArray(['ab', 'ac', 'bc']), config, board, ['b', 'c']);
    expect(findByPlacedCells(results, [1, 2], [2, 2]).points).toBe(42);
  });

  it('ignores premiums under board tiles in crossings', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(2, 1, 3)] });
    const board = createBoard(5, 5, [[2, 1, 'a']]);
    const results = generate(Gaddag.fromArray(['ab', 'bd']), config, board, ['b', 'd']);
    expect(findByPlacedCells(results, [2, 2], [3, 2]).points).toBe(9);
  });

  it('ignores premiums further along the line than the word reaches', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(4, 2, 3), createWordBonus(0, 2, 3)] });
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    const results = generate(Gaddag.fromArray(['ab']), config, board, ['b']);
    expect(results.map((result) => result.points)).toEqual([4, 4]);
  });

  it('does not wrap a bonus past the right edge onto the next row', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(5, 1, 3)] });
    const board = createBoard(5, 5, [[1, 2, 'b']]);
    const results = generate(Gaddag.fromArray(['ab']), config, board, ['a']);
    expect(findByPlacedCells(results, [0, 2]).points).toBe(4);
  });

  it('does not wrap a bonus past the left edge onto the previous row', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(-1, 3, 3)] });
    const board = createBoard(5, 5, [[3, 2, 'b']]);
    const results = generate(Gaddag.fromArray(['ba']), config, board, ['a']);
    expect(findByPlacedCells(results, [4, 2]).points).toBe(4);
  });

  it('multiplies by nine when a word spans two triple-word squares', () => {
    const config = getConfig(Game.Scrabble, Locale.EN_US);
    const board = createBoard(15, 15, [[4, 0, 'l']]);
    const results = generate(Gaddag.fromArray(['absolute']), config, board, ['a', 'b', 's', 'o', 'u', 't', 'e']);
    expect(summarizeAll(results).map(({ points, words }) => [points, words])).toEqual([[149, ['absolute']]]);
  });

  it('applies the quadruple-word corner of Super Scrabble', () => {
    const config = getConfig(Game.SuperScrabble, Locale.EN_US);
    const board = createBoard(21, 21, [[2, 0, 'i']]);
    const results = generate(Gaddag.fromArray(['quiz']), config, board, ['q', 'u', 'z']);
    expect(results.map((result) => result.points)).toEqual([128]);
  });

  it('applies the quadruple-letter squares of Super Scrabble', () => {
    const config = getConfig(Game.SuperScrabble, Locale.EN_US);
    const board = createBoard(21, 21, [[6, 2, 'o']]);
    const results = generate(Gaddag.fromArray(['zo']), config, board, ['z']);
    expect(findByPlacedCells(results, [5, 2]).points).toBe(41);
  });

  it('triples only the tiles of the matching score on Literaki squares', () => {
    const config = getConfig(Game.Literaki, Locale.PL_PL);
    const results = generateJson(Gaddag.fromArray(['ząb']), config, createBoard(15, 15), ['z', 'ą', 'b']);
    expect(results.map(({ points, x, y }) => [x, y, points])).toEqual([
      [5, 7, 9],
      [6, 7, 19],
      [7, 7, 15],
      [7, 5, 9],
      [7, 6, 19],
      [7, 7, 15],
    ]);
  });

  it('scores a blank as zero on a Literaki square it would otherwise match', () => {
    const config = getConfig(Game.Literaki, Locale.PL_PL);
    const results = generateJson(Gaddag.fromArray(['ząb']), config, createBoard(15, 15), ['z', BLANK_CHARACTER, 'b']);
    expect(results.filter(({ blankIndices, isHorizontal }) => isHorizontal && blankIndices.length === 1)).toEqual([
      { blankIndices: [1], id: 0, isHorizontal: true, points: 4, tiles: ['z', 'ą', 'b'], x: 5, y: 7 },
      { blankIndices: [1], id: 1, isHorizontal: true, points: 4, tiles: ['z', 'ą', 'b'], x: 6, y: 7 },
      { blankIndices: [1], id: 2, isHorizontal: true, points: 10, tiles: ['z', 'ą', 'b'], x: 7, y: 7 },
    ]);
  });
});

describe('MoveGenerator - bingo rules', () => {
  const gaddag = Gaddag.fromArray(['ab']);

  it('adds a score bingo after the word premiums, so it is never multiplied', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [createWordBonus(2, 2, 2)], rackSize: 2 });
    const results = generate(gaddag, config, createBoard(5, 5), ['a', 'b']);
    expect(results.map((result) => result.points)).toEqual([58, 58, 58, 58]);
  });

  it('multiplies a multiplier bingo on top of the word premiums', () => {
    const config = createConfig(BASIC_TILES, {
      bingo: { multiplier: 3 },
      bonuses: [createWordBonus(2, 2, 2)],
      rackSize: 2,
    });
    const results = generate(gaddag, config, createBoard(5, 5), ['a', 'b']);
    expect(results.map((result) => result.points)).toEqual([24, 24, 24, 24]);
  });

  it('counts placed tiles, not the length of the word', () => {
    const config = createConfig(BASIC_TILES, { rackSize: 2 });
    const board = createBoard(5, 5, [[2, 2, 'b']]);
    const results = generate(Gaddag.fromArray(['abc']), config, board, ['a', 'c']);
    expect(results.map((result) => result.points)).toEqual([57, 57]);
  });

  it('does not award a bingo for a word as long as the rack when a board tile supplies a letter', () => {
    const config = createConfig(BASIC_TILES, { rackSize: 3 });
    const board = createBoard(5, 5, [[2, 2, 'b']]);
    const results = generate(Gaddag.fromArray(['abc']), config, board, ['a', 'c', 'd']);
    expect(results.map((result) => result.points)).toEqual([7, 7]);
  });

  it('awards the bingo for the configured rack size, not for emptying the given rack', () => {
    const config = createConfig(BASIC_TILES, { rackSize: 2 });
    const results = generate(gaddag, config, createBoard(5, 5), ['a', 'b', 'c']);
    expect(results.map((result) => result.points)).toEqual([54, 54, 54, 54]);
  });

  it('awards the bingo for a rack bigger than seven only when all of it is played', () => {
    const tiles: TileScores = { ...BASIC_TILES, e: 1, f: 1, g: 1, h: 1 };
    const config = createConfig(tiles, { rackSize: 8 });
    const rack = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const words = ['abcdefg', 'abcdefgh'];
    const results = generate(Gaddag.fromArray(words), config, createBoard(9, 9), rack);
    expect(results.find((result) => result.word === 'abcdefg')?.points).toBe(12);
    expect(results.find((result) => result.word === 'abcdefgh')?.points).toBe(63);
  });

  it('awards the bingo when blanks fill part of the rack', () => {
    const config = createConfig(BASIC_TILES, { rackSize: 2 });
    const results = generate(gaddag, config, createBoard(5, 5), ['a', BLANK_CHARACTER]);
    expect(results.map((result) => result.points)).toEqual([51, 51, 51, 51]);
  });

  it('applies neither bonus when the config defines no bingo', () => {
    const config = createConfig(BASIC_TILES, { bingo: {} as ConfigJson['bingo'], rackSize: 2 });
    const results = generate(gaddag, config, createBoard(5, 5), ['a', 'b']);
    expect(results.map((result) => result.points)).toEqual([4, 4, 4, 4]);
  });
});

describe('MoveGenerator - digraph tiles and scoring', () => {
  const config = createConfig(SPANISH_MINI_TILES);

  it('multiplies the score of the digraph tile, not of its letters, on a letter premium', () => {
    const premiumConfig = createConfig(SPANISH_MINI_TILES, { bonuses: [createCharacterBonus(2, 3, 3)] });
    const board = createBoard(7, 7, [[3, 3, 'o']]);
    const results = generate(Gaddag.fromArray(['cho']), premiumConfig, board, ['ch']);
    expect(results.map((result) => result.points)).toEqual([16, 6]);
  });

  it('scores a blank digraph as zero on a letter premium', () => {
    const premiumConfig = createConfig(SPANISH_MINI_TILES, { bonuses: [createCharacterBonus(2, 3, 3)] });
    const board = createBoard(7, 7, [[3, 3, 'o']]);
    const results = generate(Gaddag.fromArray(['cho']), premiumConfig, board, [BLANK_CHARACTER]);
    expect(results.map((result) => result.points)).toEqual([1, 1]);
  });

  it('applies a word premium under a blank digraph', () => {
    const premiumConfig = createConfig(SPANISH_MINI_TILES, { bonuses: [createWordBonus(2, 3, 2)] });
    const board = createBoard(7, 7, [[3, 3, 'o']]);
    const results = generate(Gaddag.fromArray(['cho']), premiumConfig, board, [BLANK_CHARACTER]);
    expect(results.map((result) => result.points)).toEqual([2, 1]);
  });

  it('counts a letter premium under a digraph tile in both words it completes', () => {
    const premiumConfig = createConfig(SPANISH_MINI_TILES, { bonuses: [createCharacterBonus(2, 2, 2)] });
    const board = createBoard(7, 7, [[2, 3, 'o']]);
    const results = generate(Gaddag.fromArray(['cha', 'cho']), premiumConfig, board, ['ch', 'a']);
    expect(findByPlacedCells(results, [2, 2], [3, 2]).points).toBe(22);
  });

  it('counts a blank digraph on the board as zero', () => {
    const board = createBoard(7, 7, [[3, 2, 'ch', true]]);
    const results = generate(Gaddag.fromArray(['cho']), config, board, ['o']);
    expect(summarizeAll(results)).toEqual([
      { placed: [[4, 2, 'o', false]], points: 1, words: ['cho'] },
      { placed: [[3, 3, 'o', false]], points: 1, words: ['cho'] },
    ]);
  });

  it('does not re-apply the premium under a digraph tile on the board', () => {
    const premiumConfig = createConfig(SPANISH_MINI_TILES, { bonuses: [createCharacterBonus(3, 2, 3)] });
    const board = createBoard(7, 7, [[3, 2, 'ch']]);
    const results = generate(Gaddag.fromArray(['cho']), premiumConfig, board, ['o']);
    expect(results.map((result) => result.points)).toEqual([6, 6]);
  });
});

describe('MoveGenerator - digraph tiles and spelling', () => {
  const config = createConfig(SPANISH_MINI_TILES);

  it('allows a single-letter tile next to a digraph tile that starts with the same letter', () => {
    const gaddag = Gaddag.fromArray(['ccho']);
    const results = generate(gaddag, config, createBoard(7, 7), ['c', 'ch', 'o']);
    expect(results).toHaveLength(6);
    expect(results.every((result) => result.points === 9 && result.word === 'ccho')).toBe(true);
  });

  it('refuses the same word when it is spelled with single-letter tiles only', () => {
    expect(generate(Gaddag.fromArray(['ccho']), config, createBoard(7, 7), ['c', 'c', 'h', 'o'])).toEqual([]);
  });

  it('offers both the single and the double tile when they compete for a cell', () => {
    const gaddag = Gaddag.fromArray(['llo', 'lo']);
    const board = createBoard(7, 7, [[3, 3, 'o']]);
    const results = generate(gaddag, config, board, ['l', 'll']);
    expect(summarizeAll(results)).toEqual([
      { placed: [[2, 3, 'l', false]], points: 2, words: ['lo'] },
      { placed: [[2, 3, 'll', false]], points: 9, words: ['llo'] },
      { placed: [[3, 2, 'l', false]], points: 2, words: ['lo'] },
      { placed: [[3, 2, 'll', false]], points: 9, words: ['llo'] },
    ]);
  });

  it('refuses a double letter spelled with two single tiles', () => {
    const board = createBoard(7, 7, [[3, 3, 'o']]);
    expect(generate(Gaddag.fromArray(['llo']), config, board, ['l', 'l'])).toEqual([]);
  });

  it('allows board tiles of a crossing that spell a digraph only around the placed tile', () => {
    const gaddag = Gaddag.fromArray(['al', 'cah']);
    const board = createBoard(7, 7, [
      [2, 1, 'c'],
      [2, 3, 'h'],
    ]);
    const results = generate(gaddag, config, board, ['a', 'l']);
    expect(summarize(findByPlacedCells(results, [2, 2], [3, 2]))).toEqual({
      placed: [
        [2, 2, 'a', false],
        [3, 2, 'l', false],
      ],
      points: 10,
      words: ['al', 'cah'],
    });
  });

  it('does not count a lone digraph tile as a word', () => {
    expect(generate(Gaddag.fromArray(['ch']), config, createBoard(7, 7), ['ch'])).toEqual([]);
  });

  it('refuses a tile that would spell a digraph with the board tile after it in a crossing', () => {
    const gaddag = Gaddag.fromArray(['ac', 'cho']);
    const board = createBoard(7, 7, [
      [2, 3, 'h'],
      [2, 4, 'o'],
    ]);
    expect(generate(gaddag, config, board, ['a', 'c'])).toEqual([]);
  });

  it('allows the same crossing in a language without that digraph', () => {
    const gaddag = Gaddag.fromArray(['ac', 'cho']);
    const board = createBoard(7, 7, [
      [2, 3, 'h'],
      [2, 4, 'o'],
    ]);
    const results = generate(gaddag, createConfig({ a: 1, c: 3, h: 4, o: 1 }), board, ['a', 'c']);
    expect(summarize(findByWord(results, 'ac'))).toEqual({
      placed: [
        [1, 2, 'a', false],
        [2, 2, 'c', false],
      ],
      points: 12,
      words: ['ac', 'cho'],
    });
  });

  it('spells a digraph of the alphabet from single tiles only in languages without it', () => {
    const results = generate(Gaddag.fromArray(['cho']), createConfig({ c: 3, h: 4, o: 1 }), createBoard(7, 7), [
      'c',
      'h',
      'o',
    ]);
    expect(results).toHaveLength(6);
  });

  it('skips rack digraph tiles whose letters are missing from the dictionary', () => {
    const tiles: TileScores = { a: 1, b: 1, xy: 5, yx: 5 };
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    expect(generate(Gaddag.fromArray(['ab', 'xa']), createConfig(tiles), board, ['xy', 'yx'])).toEqual([]);
  });

  it('plays the other tiles normally when a digraph of the alphabet has a letter missing from the dictionary', () => {
    const gaddag = Gaddag.fromArray(['ab', 'ba', 'xa']);
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    const plain = createConfig({ a: 1, b: 3, x: 1 });
    const withUnknownDigraphs = createConfig({ a: 1, b: 3, x: 1, xy: 5, yx: 5 });
    expect(generateJson(gaddag, withUnknownDigraphs, board, ['b', 'x'])).toEqual(
      generateJson(gaddag, plain, board, ['b', 'x']),
    );
  });

  it('never reads only the known half of a board digraph tile', () => {
    const tiles: TileScores = { a: 1, x: 1, xy: 5, yx: 5 };
    const gaddag = Gaddag.fromArray(['ax', 'xa']);
    expect(generate(gaddag, createConfig(tiles), createBoard(5, 5, [[2, 2, 'xy']]), ['a'])).toEqual([]);
    expect(generate(gaddag, createConfig(tiles), createBoard(5, 5, [[2, 2, 'yx']]), ['a'])).toEqual([]);
  });

  it('generates nothing around board digraph tiles with a letter missing from the dictionary', () => {
    const tiles: TileScores = { a: 1, b: 1, x: 1, xy: 5, yx: 5 };
    const gaddag = Gaddag.fromArray(['ab', 'xa']);
    const rack = ['a', 'b'];
    expect(generate(gaddag, createConfig(tiles), createBoard(5, 5, [[2, 2, 'xy']]), rack)).toEqual([]);
    expect(generate(gaddag, createConfig(tiles), createBoard(5, 5, [[2, 2, 'yx']]), rack)).toEqual([]);
  });

  it('counts a word through a board digraph tile only when both of its letters follow on', () => {
    const board = createBoard(7, 7, [[3, 3, 'ch']]);
    const results = generate(Gaddag.fromArray(['cha', 'co']), config, board, ['a', 'o']);
    expect(toWords(results)).toEqual(['cha', 'cha']);
  });
});

describe('MoveGenerator - non-square boards', () => {
  const gaddag = Gaddag.fromArray(['ba']);
  const config = createConfig(BASIC_TILES);

  it('maps the far corner of a wide board in both passes', () => {
    const results = generateJson(gaddag, config, createBoard(9, 4, [[8, 3, 'a']]), ['b']);
    expect(results.map(toSpan)).toEqual([
      [7, 3, true],
      [8, 2, false],
    ]);
  });

  it('maps the far corner of a tall board in both passes', () => {
    const results = generateJson(gaddag, config, createBoard(4, 9, [[3, 8, 'a']]), ['b']);
    expect(results.map(toSpan)).toEqual([
      [2, 8, true],
      [3, 7, false],
    ]);
  });

  it('reads a bonus by column and row, not by position in the pass', () => {
    const premiumConfig = createConfig(BASIC_TILES, { bonuses: [createWordBonus(1, 3, 3)] });
    const board = createBoard(4, 9, [[1, 4, 'a']]);
    const results = generateJson(gaddag, premiumConfig, board, ['b']);
    expect(results.map(({ isHorizontal, points }) => [isHorizontal, points])).toEqual([
      [true, 4],
      [false, 12],
    ]);
  });
});

describe('MoveGenerator - every game', () => {
  const ENGLISH_WORD = 'jukebox';
  const expectations: GameExpectation[] = [
    {
      config: getConfig(Game.Scrabble, Locale.EN_US),
      movesCount: 14,
      name: 'Scrabble',
      pointsByStartColumn: { 1: 114, 7: 110 },
      word: ENGLISH_WORD,
    },
    {
      config: getConfig(Game.ScrabbleDuel, Locale.EN_US),
      movesCount: 10,
      name: 'Scrabble Duel',
      pointsByStartColumn: { 0: 106, 4: 106 },
      word: ENGLISH_WORD,
    },
    {
      config: getConfig(Game.SuperScrabble, Locale.EN_US),
      movesCount: 14,
      name: 'Super Scrabble',
      pointsByStartColumn: { 4: 82, 10: 80 },
      word: ENGLISH_WORD,
    },
    {
      config: getConfig(Game.LetterLeague, Locale.EN_US),
      movesCount: 14,
      name: 'Letter League',
      pointsByStartColumn: { 7: 216, 8: 108, 13: 216 },
      word: ENGLISH_WORD,
    },
    {
      config: getConfig(Game.Literaki, Locale.EN_US),
      movesCount: 14,
      name: 'Literaki',
      pointsByStartColumn: { 1: 85, 5: 93, 7: 79 },
      word: ENGLISH_WORD,
    },
    {
      config: getConfig(Game.Crossplay, Locale.EN_US),
      movesCount: 14,
      name: 'Crossplay',
      pointsByStartColumn: { 1: 112, 7: 116 },
      word: ENGLISH_WORD,
    },
    {
      config: getConfig(Game.Wordfeud, Locale.EN_US),
      movesCount: 14,
      name: 'Wordfeud',
      pointsByStartColumn: { 1: 102, 7: 102 },
      word: ENGLISH_WORD,
    },
    {
      config: getConfig(Game.Kelimelik, Locale.TR_TR),
      movesCount: 14,
      name: 'Kelimelik',
      pointsByStartColumn: { 1: 68, 3: 49, 7: 68 },
      word: 'güzelce',
    },
    {
      config: getConfig(Game.Wyrazy, Locale.PL_PL),
      movesCount: 14,
      name: 'Wyrazy',
      pointsByStartColumn: { 4: 51, 5: 77, 7: 77 },
      word: 'żółtość',
    },
  ];

  it.each(expectations.map((expectation) => [expectation.name, expectation] as const))(
    '%s scores a bingo by its own board, tiles and bingo bonus',
    (_, { config, movesCount, pointsByStartColumn, word }) => {
      const results = generateJson(Gaddag.fromArray([word]), config, createEmptyBoard(config), word.split(''));
      const horizontal = results.filter(({ isHorizontal }) => isHorizontal);
      const centerY = Math.floor(config.boardHeight / 2);
      expect(results).toHaveLength(movesCount);
      expect(horizontal.every(({ tiles, y }) => y === centerY && tiles.join('') === word)).toBe(true);

      for (const [startColumn, points] of Object.entries(pointsByStartColumn)) {
        expect([startColumn, horizontal.find(({ x }) => x === Number(startColumn))?.points]).toEqual([
          startColumn,
          points,
        ]);
      }
    },
  );

  it('scores Letter League differently along its columns, since its board is not square', () => {
    const config = getConfig(Game.LetterLeague, Locale.EN_US);
    const results = generateJson(
      Gaddag.fromArray([ENGLISH_WORD]),
      config,
      createEmptyBoard(config),
      ENGLISH_WORD.split(''),
    );
    expect(results.find(({ isHorizontal, y }) => !isHorizontal && y === 9)?.points).toBe(120);
  });

  it('confines Scrabble Duel to its 11x11 board', () => {
    const config = getConfig(Game.ScrabbleDuel, Locale.EN_US);
    const results = generateJson(
      Gaddag.fromArray([ENGLISH_WORD]),
      config,
      createEmptyBoard(config),
      ENGLISH_WORD.split(''),
    );
    expect(results.filter(({ isHorizontal }) => isHorizontal).map(({ x }) => x)).toEqual([0, 1, 2, 3, 4]);
  });

  it.each([
    ['Crossplay', Game.Crossplay, Locale.EN_US, 5],
    ['Wordfeud', Game.Wordfeud, Locale.EN_US, 5],
    ['Letter League', Game.LetterLeague, Locale.EN_US, 4],
    ['Super Scrabble', Game.SuperScrabble, Locale.EN_US, 4],
  ] as const)('%s has no premium on its start cell', (_, game, locale, points) => {
    const config = getConfig(game, locale);
    const results = generateJson(Gaddag.fromArray(['ab']), config, createEmptyBoard(config), ['a', 'b']);
    expect(results.map((result) => result.points)).toEqual([points, points, points, points]);
  });

  it.each([
    ['Scrabble', Game.Scrabble, 8],
    ['Scrabble Duel', Game.ScrabbleDuel, 8],
  ] as const)('%s doubles the word on its start cell', (_, game, points) => {
    const config = getConfig(game, Locale.EN_US);
    const results = generateJson(Gaddag.fromArray(['ab']), config, createEmptyBoard(config), ['a', 'b']);
    expect(results.map((result) => result.points)).toEqual([points, points, points, points]);
  });
});

describe('MoveGenerator - right-to-left and non-Latin alphabets', () => {
  const persian = getConfig(Game.Scrabble, Locale.FA_IR);
  const persianWord = 'کتاب';
  const persianTiles = persianWord.split('');

  it('lays a Persian word out in reading order, from the lowest coordinate up', () => {
    const results = generateJson(Gaddag.fromArray([persianWord]), persian, createEmptyBoard(persian), persianTiles);
    expect(results.map((result) => [result.x, result.y, result.isHorizontal, result.points])).toEqual([
      [4, 7, true, 12],
      [5, 7, true, 12],
      [6, 7, true, 12],
      [7, 7, true, 12],
      [7, 4, false, 12],
      [7, 5, false, 12],
      [7, 6, false, 12],
      [7, 7, false, 12],
    ]);
    expect(results.every(({ tiles }) => tiles.join('') === persianWord)).toBe(true);
  });

  it('rebuilds the Persian word from a result', () => {
    const board = createEmptyBoard(persian);
    const [result] = generate(Gaddag.fromArray([persianWord]), persian, board, persianTiles);
    expect(result.word).toBe(persianWord);
  });

  it('checks crossings on the last Persian tile, which is the 32nd of the alphabet', () => {
    expect(persian.alphabet.indexOf('ی')).toBe(31);
    const board = createBoard(
      15,
      15,
      persianTiles.map((character, index) => [6 + index, 7, character]),
    );
    const results = generate(Gaddag.fromArray([persianWord, 'کی', 'تن']), persian, board, ['ی', 'ن']);
    expect(summarizeAll(results)).toEqual([
      { placed: [[6, 8, 'ی', false]], points: 5, words: ['کی'] },
      { placed: [[7, 8, 'ن', false]], points: 2, words: ['تن'] },
    ]);
  });

  it('keeps the dotted and dotless Turkish i apart', () => {
    const config = getConfig(Game.Kelimelik, Locale.TR_TR);
    const board = createBoard(15, 15, [[7, 7, 'k']]);
    expect(generate(Gaddag.fromArray(['ki']), config, board, ['ı'])).toEqual([]);
    expect(generate(Gaddag.fromArray(['kı']), config, board, ['ı']).map(({ points }) => points)).toEqual([3, 3]);
    expect(generate(Gaddag.fromArray(['ki']), config, board, ['i']).map(({ points }) => points)).toEqual([2, 2]);
  });

  it('keeps Polish letters with diacritics apart from the plain ones', () => {
    const config = getConfig(Game.Scrabble, Locale.PL_PL);
    const board = createBoard(15, 15, [[7, 6, 'z']]);
    expect(generate(Gaddag.fromArray(['zą']), config, board, ['a'])).toEqual([]);
    expect(generate(Gaddag.fromArray(['zą']), config, board, ['ą']).length).toBeGreaterThan(0);
  });
});

describe('MoveGenerator - alphabet and board size boundaries', () => {
  const gaddag = Gaddag.fromArray(['ab']);
  const config = createConfig(BASIC_TILES);

  it('throws for a board too big in both dimensions', () => {
    expect(() => new MoveGenerator(gaddag, config, createBoard(33, 33), [])).toThrow(
      'Boards larger than 32x32 are not supported',
    );
  });

  it('accepts a board at the limit in only one dimension', () => {
    expect(generateJson(gaddag, config, createBoard(32, 5), ['a', 'b'])).toHaveLength(4);
    expect(generateJson(gaddag, config, createBoard(5, 32), ['a', 'b'])).toHaveLength(4);
  });

  it('orders moves correctly up to the last line of a 32x32 board', () => {
    const board = createBoard(32, 32, [
      [0, 0, 'a'],
      [29, 31, 'a'],
      [31, 29, 'a'],
    ]);
    expect(generateJson(gaddag, config, board, ['b'])).toEqual([
      { blankIndices: [], id: 0, isHorizontal: true, points: 4, tiles: ['b'], x: 0, y: 0 },
      { blankIndices: [], id: 1, isHorizontal: true, points: 4, tiles: ['b'], x: 29, y: 31 },
      { blankIndices: [], id: 2, isHorizontal: false, points: 4, tiles: ['b'], x: 0, y: 0 },
      { blankIndices: [], id: 3, isHorizontal: false, points: 4, tiles: ['b'], x: 31, y: 29 },
    ]);
  });

  it('orders by line before start column on the widest board', () => {
    const board = createBoard(32, 2, [
      [20, 0, 'a'],
      [0, 1, 'a'],
    ]);
    expect(generateJson(gaddag, config, board, ['b']).map(toSpan)).toEqual([
      [20, 0, true],
      [0, 1, true],
      [20, 0, false],
    ]);
  });

  it('reports the alphabet before the board when both are too big', () => {
    expect(() => new MoveGenerator(gaddag, createConfig(createWideAlphabet(65)), createBoard(33, 33), [])).toThrow(
      'Alphabets larger than 64 tiles are not supported',
    );
  });

  it.each([[0], [31], [32], [63]])('tells alphabet entry %i apart from every other in a crossing', (allowedIndex) => {
    const { allowed, board, fullConfig, fullGaddag, rack } = createFullAlphabetPosition(allowedIndex);
    const results = generate(fullGaddag, fullConfig, board, rack).filter((result) => {
      return result.cells.some((cell) => cell.isEmpty && cell.x === 2 && cell.y === 2);
    });
    expect(results.flatMap((result) => result.tiles.map((tile) => tile.character))).toEqual([allowed]);
  });

  it('does not confuse a high alphabet entry on one cell with a low one on the next cell', () => {
    const { alphabet, fullConfig } = createFullAlphabetPosition(0);
    const [low, crossing, main] = alphabet;
    const high = alphabet[32];
    const board = createBoard(5, 5, [
      [1, 2, main],
      [3, 1, crossing],
    ]);
    const results = generate(Gaddag.fromArray([main + high, crossing + low]), fullConfig, board, [high, low]);
    expect(results.map(toPlacedSummary)).toEqual([low, high, high, low]);
  });

  it('keeps blank and real versions of the very last alphabet entry apart', () => {
    const { allowed, board, fullConfig, fullGaddag } = createFullAlphabetPosition(63);
    const results = generate(fullGaddag, fullConfig, board, [allowed, BLANK_CHARACTER]);
    expect(
      summarizeAll(results.filter((result) => result.tilesCount === 1)).map(({ placed }) => placed),
    ).toContainEqual([[2, 2, allowed, true]]);
    expect(
      summarizeAll(results.filter((result) => result.tilesCount === 1)).map(({ placed }) => placed),
    ).toContainEqual([[2, 2, allowed, false]]);
  });
});

describe('MoveGenerator - sort determinism', () => {
  const words = ['ab', 'abc', 'ba', 'bac', 'cab'];
  const gaddag = Gaddag.fromArray(words);
  const config = createConfig(BASIC_TILES);
  const rack = ['c', 'a', BLANK_CHARACTER, 'b'];

  it('gives the same results on every run', () => {
    expect(generateJson(gaddag, config, createSortBoard(), rack)).toEqual(
      generateJson(gaddag, config, createSortBoard(), rack),
    );
  });

  it('does not depend on the order of the word list', () => {
    const reversed = Gaddag.fromArray(words.toReversed());
    expect(generateJson(reversed, config, createSortBoard(), rack)).toEqual(
      generateJson(gaddag, config, createSortBoard(), rack),
    );
  });

  it('orders lines numerically, not as text', () => {
    const position = createBoard(15, 15, [
      [3, 2, 'a'],
      [11, 10, 'a'],
    ]);
    const results = generateJson(Gaddag.fromArray(['ab']), config, position, ['b']);
    expect(results.map(toSpan)).toEqual([
      [3, 2, true],
      [11, 10, true],
      [3, 2, false],
      [11, 10, false],
    ]);
  });

  it('numbers results by their final position', () => {
    const results = generateJson(gaddag, config, createSortBoard(), rack);
    expect(results.length).toBeGreaterThan(1);
    expect(results.map(({ id }) => id)).toEqual(results.map((_, index) => index));
  });

  it('finds the same moves whatever the order of the rack', () => {
    const forward = generate(gaddag, config, createSortBoard(), rack).map(signatureOf).sort();
    const backward = generate(gaddag, config, createSortBoard(), rack.toReversed()).map(signatureOf).sort();
    expect(forward).toEqual(backward);
  });

  it('reorders only ties when the rack is reordered', () => {
    const forward = generate(gaddag, config, createSortBoard(), rack).map(enumerationKey);
    const backward = generate(gaddag, config, createSortBoard(), rack.toReversed()).map(enumerationKey);
    expect(forward).toEqual(backward);
  });

  it('orders blank interpretations by the config alphabet, not by the dictionary', () => {
    const reversedAlphabet = createConfig({ d: 2, c: 3, b: 3, a: 1 });
    const position = createBoard(5, 5, [[2, 2, 'a']]);
    const results = generate(Gaddag.fromArray(['ab', 'ac', 'ad']), reversedAlphabet, position, [BLANK_CHARACTER]);
    expect(toWords(results)).toEqual(['ad', 'ac', 'ab', 'ad', 'ac', 'ab']);
  });

  it('ranks blanks by the first blank on the rack, so they can precede real tiles', () => {
    const position = createBoard(5, 5, [[2, 2, 'a']]);
    const results = generate(Gaddag.fromArray(['ab']), config, position, [BLANK_CHARACTER, 'b', BLANK_CHARACTER]);
    expect(results.filter((result) => result.tilesCount === 1).map(toPlacedSummary)).toEqual(['b?', 'b', 'b?', 'b']);
  });

  it('uses the first copy of a duplicated tile for the tie-break', () => {
    const tied = Gaddag.fromArray(['ab', 'ac']);
    const position = createBoard(5, 5, [[2, 2, 'a']]);
    expect(toWords(generate(tied, config, position, ['b', 'c', 'b'])).slice(0, 2)).toEqual(['ab', 'ac']);
    expect(toWords(generate(tied, config, position, ['c', 'b', 'c'])).slice(0, 2)).toEqual(['ac', 'ab']);
  });
});

describe('MoveGenerator - result shape', () => {
  const config = createConfig({ ...BASIC_TILES, e: 1 });
  const gaddag = Gaddag.fromArray(['abcde']);
  const rack = [BLANK_CHARACTER, 'c', BLANK_CHARACTER, 'e'];

  it('starts a move at its first cell, board tiles included, in either direction', () => {
    const results = generateJson(Gaddag.fromArray(['abc']), config, createBoard(5, 5, [[2, 2, 'b']]), ['a', 'c']);
    expect(results).toEqual([
      { blankIndices: [], id: 0, isHorizontal: true, points: 7, tiles: ['a', 'c'], x: 1, y: 2 },
      { blankIndices: [], id: 1, isHorizontal: false, points: 7, tiles: ['a', 'c'], x: 2, y: 1 },
    ]);
  });

  it('lists only the placed tiles and counts blank indices among them, not in the word', () => {
    const results = generateJson(gaddag, config, createShapeBoard(), rack);
    expect(results).toEqual([
      { blankIndices: [0, 2], id: 0, isHorizontal: true, points: 7, tiles: ['a', 'c', 'd', 'e'], x: 2, y: 3 },
      { blankIndices: [0, 2], id: 1, isHorizontal: false, points: 7, tiles: ['a', 'c', 'd', 'e'], x: 3, y: 2 },
    ]);
  });

  it('holds exactly the documented fields', () => {
    const [result] = generateJson(gaddag, config, createShapeBoard(), rack);
    expect(Object.keys(result).sort()).toEqual(['blankIndices', 'id', 'isHorizontal', 'points', 'tiles', 'x', 'y']);
  });

  it('round-trips through Result', () => {
    const position = createShapeBoard();
    const results = generateJson(gaddag, config, position, rack);
    expect(results.map((json) => Result.fromJson(json, position).toJson())).toEqual(results);
  });

  it('leaves the board and the rack untouched', () => {
    const position = createShapeBoard();
    const tiles = createRack(rack);
    const boardBefore = JSON.stringify(position.toJson());
    const tilesBefore = JSON.stringify(tiles);
    new MoveGenerator(gaddag, config, position, tiles).run();
    expect(JSON.stringify(position.toJson())).toBe(boardBefore);
    expect(JSON.stringify(tiles)).toBe(tilesBefore);
  });
});

describe('MoveGenerator - unusual input', () => {
  const config = createConfig(BASIC_TILES);

  it('treats a cell marked as filled but holding no tile as empty', () => {
    const gaddag = Gaddag.fromArray(['ab']);
    const board = Board.create(5, 5);
    board.updateCell(0, 0, () => new Cell({ isEmpty: false, x: 0, y: 0 }));
    expect(generate(gaddag, config, board, ['a', 'b'])).toEqual(
      generate(gaddag, config, Board.create(5, 5), ['a', 'b']),
    );
  });

  it('scores a board tile outside the config alphabet as zero when the dictionary knows it', () => {
    const board = createBoard(5, 5, [[2, 2, 'z']]);
    const results = generate(Gaddag.fromArray(['zb']), config, board, ['b']);
    expect(results.map((result) => result.points)).toEqual([3, 3]);
  });

  it('skips rack tiles the dictionary does not know while playing the others', () => {
    const board = createBoard(5, 5, [[2, 2, 'a']]);
    const known = generateJson(Gaddag.fromArray(['ab']), config, board, ['b']);
    expect(generateJson(Gaddag.fromArray(['ab']), config, board, ['c', 'b', 'd'])).toEqual(known);
  });
});

describe('MoveGenerator - seeded differential testing against the reference solver', () => {
  it.each(DIFFERENTIAL_SCENARIOS.map((scenario) => [scenario.name, scenario] as const))(
    '%s: matches in self-played games',
    (_, scenario) => {
      const tally = createTally();

      for (let game = 0; game < scenario.games; ++game) {
        playGame(scenario, game, tally);
      }

      expect(tally.positions).toBeGreaterThan(0);

      for (const rule of scenario.exercises) {
        expect([rule, tally[rule]]).not.toEqual([rule, 0]);
      }
    },
  );

  it.each(DIFFERENTIAL_SCENARIOS.map((scenario) => [scenario.name, scenario] as const))(
    '%s: matches on boards of random tiles that spell nothing in particular',
    (_, scenario) => {
      let resultsCount = 0;

      for (let seed = 1; seed <= 30; ++seed) {
        const random = createRandom(seed * 104729);
        const position = createPosition(scenario, random);
        const board = createNoiseBoard(scenario, random);
        const rack = drawRack(scenario, random);
        resultsCount += expectMatchesReference(position.gaddag, position.config, board, rack).length;
      }

      expect(resultsCount).toBeGreaterThan(0);
    },
  );

  it.each(Object.entries(languages))('%s: matches on its real board, premiums and tiles', (name, config) => {
    const random = createRandom(hashName(name));
    const tiles = pickTiles(config, random);
    const scenario = createRealConfigScenario(name, config, tiles);
    const tally = createTally();
    playGame(scenario, hashName(name) % 1000, tally);
    expect(tally.results).toBeGreaterThan(0);
    expect(tally.crossings).toBeGreaterThan(0);
  });
});

function generate(gaddag: Gaddag, config: Config, board: Board, rack: string[]): Result[] {
  return generateJson(gaddag, config, board, rack).map((json) => Result.fromJson(json, board));
}

function generateJson(gaddag: Gaddag, config: Config, board: Board, rack: string[]): ResultJson[] {
  return new MoveGenerator(gaddag, config, board, createRack(rack)).run();
}

function expectMatchesReference(gaddag: Gaddag, config: Config, board: Board, rack: string[]): Result[] {
  const results = generate(gaddag, config, board, rack);
  const signatures = results.map(signatureOf);
  expect(new Set(signatures).size).toBe(signatures.length);
  expect(results.map(({ id }) => id)).toEqual(results.map((_, index) => index));
  expectEnumerationOrder(results);
  expect([...signatures].sort()).toEqual(new ReferenceSolver(gaddag, config, board, createRack(rack)).solve());
  return results;
}

function summarizeAll(results: Result[]): MoveSummary[] {
  return results.map(summarize);
}

function summarize(result: Result): MoveSummary {
  return {
    placed: result.cells.filter((cell) => cell.isEmpty).map(toPlacedTile),
    points: result.points,
    words: result.words,
  };
}

function toPlacedTile(cell: Cell): PlacedTile {
  return [cell.x, cell.y, cell.tile.character, cell.tile.isBlank];
}

function toWords(results: Result[]): string[] {
  return results.map((result) => result.word);
}

function toSortedPoints(results: Result[]): number[] {
  return results.map((result) => result.points).sort((a, b) => a - b);
}

function coversCell(result: Result, x: number, y: number): boolean {
  return result.cells.some((cell) => cell.x === x && cell.y === y);
}

function signatureOf(result: Result): string {
  const placed = result.cells
    .filter((cell) => cell.isEmpty)
    .map((cell) => `${cell.x},${cell.y},${cell.tile.character},${cell.tile.isBlank ? 1 : 0}`)
    .sort()
    .join(' ');
  const words = [...result.words].sort().join(' ');
  return `${placed} | ${words} | ${result.points}`;
}

function expectEnumerationOrder(results: Result[]): void {
  const keys = results.map(enumerationKey);
  expect(keys).toEqual([...keys].sort());
}

function enumerationKey(result: Result): string {
  const [firstCell] = result.cells;
  const lastCell = result.cells[result.cells.length - 1];
  const isHorizontal = firstCell.y === lastCell.y;
  const key = isHorizontal ? [0, firstCell.y, firstCell.x, lastCell.x] : [1, firstCell.x, firstCell.y, lastCell.y];
  return key.map((value) => String(value).padStart(2, '0')).join('|');
}

function createConfig(tileScores: TileScores, overrides: Partial<ConfigJson> = {}): Config {
  return new Config({
    bingo: { score: 50 },
    blankScore: 0,
    blanksCount: 2,
    boardHeight: 15,
    boardWidth: 15,
    bonuses: [],
    game: Game.Scrabble,
    locale: Locale.EN_GB,
    name: 'MoveGenerator tests',
    rackSize: 7,
    tiles: Object.entries(tileScores).map(([character, score]) => ({ character, count: 1, score })),
    ...overrides,
  });
}

function createBoard(width: number, height: number, placements: BoardTilePlacement[] = []): Board {
  const board = Board.create(width, height);

  for (const [x, y, character, isBlank = false] of placements) {
    board.updateCell(x, y, () => new Cell({ isEmpty: false, tile: new Tile({ character, isBlank }), x, y }));
  }

  return board;
}

function createRack(characters: string[]): Tile[] {
  return characters.map((character) =>
    character === BLANK_CHARACTER
      ? new Tile({ character: '', isBlank: true })
      : new Tile({ character, isBlank: false }),
  );
}

function createRandomBoard(width: number, height: number, characters: string[], random: () => number): Board {
  const placements: BoardTilePlacement[] = [];

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (random() < 0.2) {
        placements.push([x, y, characters[Math.floor(random() * characters.length)]]);
      }
    }
  }

  if (placements.length === 0) {
    placements.push([Math.floor(width / 2), Math.floor(height / 2), characters[0]]);
  }

  return createBoard(width, height, placements);
}

function createRandom(seed: number): () => number {
  let state = (seed % 2147483647) + 1;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

function createWideAlphabet(size: number): TileScores {
  const tiles: TileScores = { a: 1, b: 3 };

  for (let index = 2; index < size; ++index) {
    tiles[String.fromCharCode(0x100 + index)] = 1;
  }

  return tiles;
}

function toSpan({ isHorizontal, x, y }: ResultJson): [x: number, y: number, isHorizontal: boolean] {
  return [x, y, isHorizontal];
}

function toPlacedSummary(result: Result): string {
  return result.tiles.map((tile) => `${tile.character}${tile.isBlank ? BLANK_CHARACTER : ''}`).join('');
}

function findByWord(results: Result[], word: string): Result {
  const matches = results.filter((result) => result.word === word);
  expect(matches).toHaveLength(1);
  return matches[0];
}

function findByPlacedCells(results: Result[], ...coordinates: [x: number, y: number][]): Result {
  const matches = results.filter((result) => hasPlacedExactly(result, coordinates));
  expect(matches).toHaveLength(1);
  return matches[0];
}

function hasPlacedExactly(result: Result, coordinates: [x: number, y: number][]): boolean {
  const placed = result.cells.filter((cell) => cell.isEmpty).map(({ x, y }) => `${x},${y}`);
  return placed.join(' ') === coordinates.map(([x, y]) => `${x},${y}`).join(' ');
}

function createCharacterBonus(x: number, y: number, multiplier: number, score?: number): BonusJson {
  return { multiplier, score, type: BONUS_CHARACTER, x, y };
}

function createWordBonus(x: number, y: number, multiplier: number): BonusJson {
  return { multiplier, type: BONUS_WORD, x, y };
}

function createEmptyBoard(config: Config): Board {
  return Board.create(config.boardWidth, config.boardHeight);
}

function createRowBoard(rows: string[]): Board {
  const placements: BoardTilePlacement[] = rows.flatMap((row, y) =>
    row.split('').flatMap((character, x): BoardTilePlacement[] => (character === ' ' ? [] : [[x, y, character]])),
  );
  return createBoard(rows[0].length, rows.length, placements);
}

function createHookBoard(): Board {
  return createBoard(6, 6, [
    [1, 2, 'a'],
    [2, 2, 'b'],
  ]);
}

function createParallelBoard(): Board {
  return createBoard(5, 5, [
    [1, 1, 'a'],
    [2, 1, 'b'],
    [3, 1, 'a'],
  ]);
}

function createHoleBoard(): Board {
  return createRowBoard(['aba', 'b b', 'aba']);
}

function createCrossroadsBoard(): Board {
  return createBoard(5, 5, [
    [1, 2, 'a'],
    [3, 2, 'a'],
    [2, 1, 'a'],
    [2, 3, 'a'],
  ]);
}

function createBlankCrossingBoard(): Board {
  return createBoard(5, 5, [
    [2, 1, 'a', true],
    [3, 2, 'd'],
  ]);
}

function createSortBoard(): Board {
  return createBoard(5, 5, [
    [1, 1, 'a'],
    [2, 2, 'b'],
  ]);
}

function createShapeBoard(): Board {
  return createBoard(7, 7, [[3, 3, 'b']]);
}

function createFullAlphabetPosition(allowedIndex: number): {
  allowed: string;
  alphabet: string[];
  board: Board;
  fullConfig: Config;
  fullGaddag: Gaddag;
  rack: string[];
} {
  const letters = Array.from({ length: 63 }, (_, index) => String.fromCharCode(0x100 + index));
  const alphabet = [...letters, letters[61] + letters[62]];
  const [crossing, main] = [alphabet[1], alphabet[2]];
  const candidates = [alphabet[0], alphabet[31], alphabet[32], alphabet[63]];
  const allowed = alphabet[allowedIndex];
  const fullGaddag = Gaddag.fromArray([...alphabet.map((tile) => main + tile), crossing + allowed]);
  const fullConfig = createConfig(Object.fromEntries(alphabet.map((tile) => [tile, 1])));
  const board = createBoard(5, 5, [
    [1, 2, main],
    [2, 1, crossing],
  ]);
  return { allowed, alphabet, board, fullConfig, fullGaddag, rack: candidates };
}

function createTally(): Tally {
  return { blanks: 0, bingos: 0, crossings: 0, digraphs: 0, positions: 0, results: 0, singles: 0 };
}

function updateTally(tally: Tally, results: Result[], config: Config): void {
  ++tally.positions;
  tally.results += results.length;

  for (const result of results) {
    tally.blanks += result.blanksCount > 0 ? 1 : 0;
    tally.bingos += result.tilesCount === config.rackSize ? 1 : 0;
    tally.crossings += result.collisions.length > 0 ? 1 : 0;
    tally.digraphs += result.tiles.some(({ character }) => character.length > 1) ? 1 : 0;
    tally.singles += result.tilesCount === 1 ? 1 : 0;
  }
}

function playGame(scenario: DifferentialScenario, game: number, tally: Tally): void {
  const random = createRandom((game + 1) * 7919);
  const { config, gaddag } = createPosition(scenario, random);
  const placements: BoardTilePlacement[] = (scenario.startingTiles ?? []).map(([x, y]) => [
    x,
    y,
    pickFrom(Object.keys(scenario.tileScores), random),
  ]);
  let board = createBoard(scenario.width, scenario.height, placements);

  for (let ply = 0; ply < scenario.plies; ++ply) {
    const rack = drawRack(scenario, random);
    const results = expectMatchesReference(gaddag, config, board, rack);
    const position: Position = { board, config, gaddag, rack };
    expectRepeatableAndRackIndependent(position, results, random);
    expectTransposedMoves(position, results);
    updateTally(tally, results, config);

    if (results.length > 0) {
      board = playResult(board, pickFrom(results, random));
    }
  }
}

function createPosition(scenario: DifferentialScenario, random: () => number): { config: Config; gaddag: Gaddag } {
  const tiles = Object.keys(scenario.tileScores);
  const bonuses = createRandomBonuses(scenario, random);
  const config = scenario.realConfig ?? createConfig(scenario.tileScores, { bonuses, ...scenario.overrides });
  return { config, gaddag: Gaddag.fromArray(createRandomWords(tiles, 60, random)) };
}

function createRandomWords(tiles: string[], count: number, random: () => number): string[] {
  return Array.from({ length: count }, () => {
    const length = 2 + Math.floor(random() * 4);
    return Array.from({ length }, () => pickFrom(tiles, random)).join('');
  });
}

function createRandomBonuses(
  { height, premiumDensity, tileScores, width }: DifferentialScenario,
  random: () => number,
) {
  const scores = Object.values(tileScores);
  const bonuses: BonusJson[] = [];

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (random() < premiumDensity) {
        bonuses.push(createRandomBonus(x, y, scores, random));
      }
    }
  }

  return bonuses;
}

function createRandomBonus(x: number, y: number, scores: number[], random: () => number): BonusJson {
  const multiplier = 2 + Math.floor(random() * 3);
  const kind = random();

  if (kind < 0.4) {
    return createWordBonus(x, y, multiplier);
  }

  return createCharacterBonus(x, y, multiplier, kind < 0.7 ? undefined : pickFrom(scores, random));
}

function drawRack({ rackLength, tileScores }: DifferentialScenario, random: () => number): string[] {
  const tiles = Object.keys(tileScores);
  return Array.from({ length: rackLength }, () => {
    return random() < 0.15 ? BLANK_CHARACTER : pickFrom(tiles, random);
  });
}

function createNoiseBoard({ height, tileScores, width }: DifferentialScenario, random: () => number): Board {
  const tiles = Object.keys(tileScores);
  const density = 0.1 + random() * 0.4;
  const placements: BoardTilePlacement[] = [];

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (random() < density) {
        placements.push([x, y, pickFrom(tiles, random), random() < 0.2]);
      }
    }
  }

  return createBoard(width, height, placements);
}

function playResult(board: Board, result: Result): Board {
  const nextBoard = board.clone();

  for (const { tile, x, y } of result.cells) {
    nextBoard.updateCell(x, y, () => new Cell({ isEmpty: false, tile, x, y }));
  }

  return nextBoard;
}

function expectRepeatableAndRackIndependent(
  { board, config, gaddag, rack }: Position,
  results: Result[],
  random: () => number,
): void {
  const shuffledSignatures = generate(gaddag, config, board, shuffle(rack, random)).map(signatureOf).sort();
  expect(shuffledSignatures).toEqual(results.map(signatureOf).sort());
  expect(generateJson(gaddag, config, board, rack)).toEqual(results.map((result) => result.toJson()));
}

function expectTransposedMoves({ board, config, gaddag, rack }: Position, results: Result[]): void {
  const transposed = generate(gaddag, transposeConfig(config), transposeBoard(board), rack);
  expect(transposed.map(transposedSignatureOf).sort()).toEqual(results.map(signatureOf).sort());
}

function transposedSignatureOf(result: Result): string {
  const placed = result.cells
    .filter((cell) => cell.isEmpty)
    .map((cell) => `${cell.y},${cell.x},${cell.tile.character},${cell.tile.isBlank ? 1 : 0}`)
    .sort()
    .join(' ');
  const words = [...result.words].sort().join(' ');
  return `${placed} | ${words} | ${result.points}`;
}

function transposeConfig(config: Config): Config {
  const json = config.toJson();
  const bonuses = json.bonuses.map((bonus) => ({ ...bonus, x: bonus.y, y: bonus.x }));
  return new Config({ ...json, boardHeight: json.boardWidth, boardWidth: json.boardHeight, bonuses });
}

function transposeBoard(board: Board): Board {
  const transposed = Board.create(board.rowsCount, board.columnsCount);

  for (const row of board.rows) {
    for (const { isEmpty, tile, x, y } of row) {
      transposed.updateCell(y, x, () => new Cell({ isEmpty, tile, x: y, y: x }));
    }
  }

  return transposed;
}

function pickTiles(config: Config, random: () => number): string[] {
  const singles = config.alphabet.filter((tile) => tile.length === 1);
  return [...shuffle(singles, random).slice(0, 5), ...config.twoCharacterTiles];
}

function createRealConfigScenario(name: string, config: Config, tiles: string[]): DifferentialScenario {
  return {
    exercises: [],
    games: 1,
    height: config.boardHeight,
    name,
    overrides: {},
    plies: 4,
    premiumDensity: 0,
    rackLength: 4,
    realConfig: config,
    tileScores: Object.fromEntries(tiles.map((tile) => [tile, config.pointsMap[tile]])),
    width: config.boardWidth,
  };
}

function hashName(name: string): number {
  return name.split('').reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) % 2147483647, 7);
}

function shuffle<T>(values: T[], random: () => number): T[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; --index) {
    const otherIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[otherIndex]] = [shuffled[otherIndex], shuffled[index]];
  }

  return shuffled;
}

function pickFrom<T>(values: T[], random: () => number): T {
  return values[Math.floor(random() * values.length)];
}
