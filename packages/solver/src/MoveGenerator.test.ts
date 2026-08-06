/* eslint-disable max-lines */

import { Gaddag } from '@kamilmielnik/gaddag';
import { getConfig } from '@scrabble-solver/configs';
import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import {
  Board,
  type Bonus,
  Cell,
  type CellJson,
  Config,
  type ConfigJson,
  Game,
  isMultiplierBingo,
  isScoreBingo,
  Locale,
  Result,
  type ResultJson,
  Tile,
} from '@scrabble-solver/types';

import { MoveGenerator } from './MoveGenerator';

const BLANK_CHARACTER = '?';

type TileScores = Record<string, number>;

type BoardTilePlacement = [x: number, y: number, character: string, isBlank?: boolean];

type PlacedTile = [x: number, y: number, character: string, isBlank: boolean];

interface MoveSummary {
  placed: PlacedTile[];
  points: number;
  words: string[];
}

const createConfig = (tileScores: TileScores, overrides: Partial<ConfigJson> = {}): Config =>
  new Config({
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

const createBoard = (width: number, height: number, placements: BoardTilePlacement[] = []): Board => {
  const board = Board.create(width, height);

  for (const [x, y, character, isBlank = false] of placements) {
    board.updateCell(x, y, () => new Cell({ isEmpty: false, tile: new Tile({ character, isBlank }), x, y }));
  }

  return board;
};

const createRack = (characters: string[]): Tile[] =>
  characters.map((character) =>
    character === BLANK_CHARACTER
      ? new Tile({ character: '', isBlank: true })
      : new Tile({ character, isBlank: false }),
  );

const generate = (gaddag: Gaddag, config: Config, board: Board, rack: string[]): ResultJson[] =>
  new MoveGenerator(gaddag, config, board, createRack(rack)).run();

const toPlacedTile = (cell: CellJson): PlacedTile => [
  cell.x,
  cell.y,
  cell.tile?.character ?? '',
  cell.tile?.isBlank ?? false,
];

const summarize = (json: ResultJson): MoveSummary => ({
  placed: json.cells.filter((cell) => cell.isEmpty).map(toPlacedTile),
  points: json.points,
  words: Result.fromJson(json).words,
});

const summarizeAll = (results: ResultJson[]): MoveSummary[] => results.map(summarize);

const toWords = (results: ResultJson[]): string[] => results.map((json) => Result.fromJson(json).word);

const toSortedPoints = (results: ResultJson[]): number[] => results.map((json) => json.points).sort((a, b) => a - b);

const coversCell = (json: ResultJson, x: number, y: number): boolean =>
  json.cells.some((cell) => cell.x === x && cell.y === y);

const signatureOf = (json: ResultJson): string => {
  const placed = json.cells
    .filter((cell) => cell.isEmpty)
    .map((cell) => `${cell.x},${cell.y},${cell.tile?.character},${cell.tile?.isBlank ? 1 : 0}`)
    .sort()
    .join(' ');
  const words = [...Result.fromJson(json).words].sort().join(' ');
  return `${placed} | ${words} | ${json.points}`;
};

const enumerationKey = (json: ResultJson): string => {
  const [firstCell] = json.cells;
  const lastCell = json.cells[json.cells.length - 1];
  const isHorizontal = firstCell.y === lastCell.y;
  const key = isHorizontal ? [0, firstCell.y, firstCell.x, lastCell.x] : [1, firstCell.x, firstCell.y, lastCell.y];
  return key.map((value) => String(value).padStart(2, '0')).join('|');
};

const expectEnumerationOrder = (results: ResultJson[]): void => {
  const keys = results.map(enumerationKey);
  expect(keys).toEqual([...keys].sort());
};

interface ReferencePlacement {
  alpha: number;
  isBlank: boolean;
}

/**
 * Brute-force oracle: enumerates every span and rack assignment, validating and
 * scoring moves with the same semantics as MoveGenerator, but without a shred
 * of its cleverness (no GADDAG traversal, no cross-check masks, no anchors).
 */
class ReferenceSolver {
  private readonly gaddag: Gaddag;
  private readonly config: Config;
  private readonly width: number;
  private readonly height: number;
  private readonly filled: boolean[] = [];
  private readonly boardCharacters: string[] = [];
  private readonly boardScores: number[] = [];
  private readonly boardIsEmpty: boolean;
  private readonly alphabet: string[];
  private readonly rackCounts: number[];
  private blanksLeft = 0;

  private horizontal = true;
  private line = 0;
  private start = 0;
  private end = 0;
  private emptyPositions: number[] = [];
  private placements: ReferencePlacement[] = [];
  private readonly moves = new Set<string>();

  constructor(gaddag: Gaddag, config: Config, board: Board, tiles: Tile[]) {
    this.gaddag = gaddag;
    this.config = config;
    this.width = board.columnsCount;
    this.height = board.rowsCount;

    for (const row of board.rows) {
      for (const cell of row) {
        const hasTile = !cell.isEmpty && cell.hasTile();
        this.filled.push(hasTile);
        this.boardCharacters.push(hasTile ? cell.tile.character : '');
        this.boardScores.push(this.boardTileScore(cell, hasTile));
      }
    }

    this.boardIsEmpty = this.filled.every((isFilled) => !isFilled);
    this.alphabet = config.alphabet;
    this.rackCounts = this.alphabet.map(() => 0);

    for (const tile of tiles) {
      if (tile.isBlank) {
        ++this.blanksLeft;
        continue;
      }

      const alpha = this.alphabet.indexOf(tile.character);

      if (alpha !== -1) {
        ++this.rackCounts[alpha];
      }
    }
  }

  public solve(): string[] {
    for (const horizontal of [true, false]) {
      this.horizontal = horizontal;
      this.enumerateSpans();
    }

    return [...this.moves].sort();
  }

  private get linesCount(): number {
    return this.horizontal ? this.height : this.width;
  }

  private get lineLength(): number {
    return this.horizontal ? this.width : this.height;
  }

  private enumerateSpans(): void {
    const rackTotal = this.rackCounts.reduce((sum, count) => sum + count, this.blanksLeft);

    for (let line = 0; line < this.linesCount; ++line) {
      for (let start = 0; start < this.lineLength; ++start) {
        for (let end = start + 1; end < this.lineLength; ++end) {
          this.line = line;
          this.start = start;
          this.end = end;
          this.trySpan(rackTotal);
        }
      }
    }
  }

  private trySpan(rackTotal: number): void {
    if (!this.isSpanMaximal()) {
      return;
    }

    this.emptyPositions = this.spanPositions().filter((position) => !this.isFilled(position));

    if (this.emptyPositions.length === 0 || this.emptyPositions.length > rackTotal) {
      return;
    }

    this.placements = this.emptyPositions.map(() => ({ alpha: -1, isBlank: false }));
    this.tryPlacements(0);
  }

  private isSpanMaximal(): boolean {
    const beforeFilled = this.start > 0 && this.isFilled(this.start - 1);
    const afterFilled = this.end < this.lineLength - 1 && this.isFilled(this.end + 1);
    return !beforeFilled && !afterFilled;
  }

  private tryPlacements(index: number): void {
    if (!this.gaddag.hasPrefix(this.prefixBefore(index))) {
      return;
    }

    if (index === this.emptyPositions.length) {
      this.tryMove();
      return;
    }

    for (let alpha = 0; alpha < this.alphabet.length; ++alpha) {
      if (this.rackCounts[alpha] > 0) {
        --this.rackCounts[alpha];
        this.placements[index] = { alpha, isBlank: false };
        this.tryPlacements(index + 1);
        ++this.rackCounts[alpha];
      }

      if (this.blanksLeft > 0) {
        --this.blanksLeft;
        this.placements[index] = { alpha, isBlank: true };
        this.tryPlacements(index + 1);
        ++this.blanksLeft;
      }
    }
  }

  private prefixBefore(index: number): string {
    const limit = index < this.emptyPositions.length ? this.emptyPositions[index] : this.end + 1;
    let prefix = '';

    for (let position = this.start; position < limit; ++position) {
      prefix += this.characterAt(position);
    }

    return prefix;
  }

  private tryMove(): void {
    const characters = this.spanPositions().map((position) => this.characterAt(position));

    if (!this.gaddag.has(characters.join(''))) {
      return;
    }

    if (this.hasAdjacentDigraph(characters)) {
      return;
    }

    if (!this.isConnected()) {
      return;
    }

    const crossWords: string[] = [];

    for (const position of this.emptyPositions) {
      const cross = this.crossAt(position);

      if (!cross) {
        continue;
      }

      const crossWord = cross.characters.join('');

      if (!this.gaddag.has(crossWord) || this.hasAdjacentDigraph(cross.characters)) {
        return;
      }

      crossWords.push(crossWord);
    }

    this.moves.add(this.createSignature(characters.join(''), crossWords));
  }

  private hasAdjacentDigraph(characters: string[]): boolean {
    const digraphs = this.config.twoCharacterTiles;
    return characters.some((character, index) => index > 0 && digraphs.includes(characters[index - 1] + character));
  }

  private isConnected(): boolean {
    if (this.boardIsEmpty) {
      const centerLine = Math.floor((this.horizontal ? this.height : this.width) / 2);
      const centerPosition = Math.floor((this.horizontal ? this.width : this.height) / 2);
      return this.line === centerLine && this.start <= centerPosition && centerPosition <= this.end;
    }

    return this.emptyPositions.some((position) => this.touchesBoardTile(position));
  }

  private touchesBoardTile(position: number): boolean {
    const x = this.xOf(position);
    const y = this.yOf(position);
    return (
      this.isFilledAt(x - 1, y) || this.isFilledAt(x + 1, y) || this.isFilledAt(x, y - 1) || this.isFilledAt(x, y + 1)
    );
  }

  private crossAt(position: number): { baseScore: number; characters: string[] } | undefined {
    const dx = this.horizontal ? 0 : 1;
    const dy = this.horizontal ? 1 : 0;
    const [startX, startY] = this.crossRunEnd(position, -dx, -dy);
    const [endX, endY] = this.crossRunEnd(position, dx, dy);

    if (startX === endX && startY === endY) {
      return undefined;
    }

    const characters: string[] = [];
    let baseScore = 0;

    for (let x = startX, y = startY; x <= endX && y <= endY; x += dx, y += dy) {
      if (x === this.xOf(position) && y === this.yOf(position)) {
        characters.push(this.characterAt(position));
        continue;
      }

      const cellIndex = y * this.width + x;
      baseScore += this.boardScores[cellIndex];
      characters.push(this.boardCharacters[cellIndex]);
    }

    return { baseScore, characters };
  }

  private crossRunEnd(position: number, dx: number, dy: number): [number, number] {
    let x = this.xOf(position);
    let y = this.yOf(position);

    while (this.isFilledAt(x + dx, y + dy)) {
      x += dx;
      y += dy;
    }

    return [x, y];
  }

  private score(): number {
    let collisionsScore = 0;
    let mainScore = 0;
    let wordMultiplier = 1;

    for (const position of this.spanPositions()) {
      if (this.isFilled(position)) {
        mainScore += this.boardScores[this.globalIndex(position)];
        continue;
      }

      const placement = this.placementAt(position);
      const bonus = this.bonusAt(position);
      const cellWordMultiplier = bonus?.type === BONUS_WORD ? bonus.multiplier : 1;
      const tileScore = this.tileScore(placement) * this.characterMultiplier(placement, bonus);
      mainScore += tileScore;
      wordMultiplier *= cellWordMultiplier;
      const cross = this.crossAt(position);

      if (cross) {
        collisionsScore += (cross.baseScore + tileScore) * cellWordMultiplier;
      }
    }

    return this.applyBingo(mainScore * wordMultiplier, collisionsScore);
  }

  private applyBingo(wordsScore: number, collisionsScore: number): number {
    if (this.emptyPositions.length !== this.config.rackSize) {
      return wordsScore + collisionsScore;
    }

    const { bingo } = this.config;

    if (isScoreBingo(bingo)) {
      return wordsScore + collisionsScore + bingo.score;
    }

    if (isMultiplierBingo(bingo)) {
      return wordsScore * bingo.multiplier + collisionsScore;
    }

    return wordsScore + collisionsScore;
  }

  private characterMultiplier(placement: ReferencePlacement, bonus: Bonus | undefined): number {
    if (bonus?.type !== BONUS_CHARACTER) {
      return 1;
    }

    const characterScore = this.config.pointsMap[this.alphabet[placement.alpha]] || 0;

    if (typeof bonus.score === 'number' && bonus.score !== characterScore) {
      return 1;
    }

    return bonus.multiplier;
  }

  private tileScore({ alpha, isBlank }: ReferencePlacement): number {
    return isBlank ? this.config.blankScore : this.config.pointsMap[this.alphabet[alpha]] || 0;
  }

  private bonusAt(position: number): Bonus | undefined {
    const x = this.xOf(position);
    const y = this.yOf(position);
    return this.config.bonuses.find((bonus) => bonus.x === x && bonus.y === y);
  }

  private createSignature(mainWord: string, crossWords: string[]): string {
    const placed = this.emptyPositions
      .map((position, index) => {
        const { alpha, isBlank } = this.placements[index];
        return `${this.xOf(position)},${this.yOf(position)},${this.alphabet[alpha]},${isBlank ? 1 : 0}`;
      })
      .sort()
      .join(' ');
    const words = [mainWord, ...crossWords].sort().join(' ');
    return `${placed} | ${words} | ${this.score()}`;
  }

  private boardTileScore(cell: Cell, hasTile: boolean): number {
    if (!hasTile) {
      return 0;
    }

    if (cell.tile.isBlank) {
      return this.config.blankScore;
    }

    return this.config.pointsMap[cell.tile.character] || 0;
  }

  private characterAt(position: number): string {
    if (this.isFilled(position)) {
      return this.boardCharacters[this.globalIndex(position)];
    }

    return this.alphabet[this.placementAt(position).alpha];
  }

  private placementAt(position: number): ReferencePlacement {
    return this.placements[this.emptyPositions.indexOf(position)];
  }

  private spanPositions(): number[] {
    const positions: number[] = [];

    for (let position = this.start; position <= this.end; ++position) {
      positions.push(position);
    }

    return positions;
  }

  private globalIndex(position: number): number {
    return this.yOf(position) * this.width + this.xOf(position);
  }

  private isFilled(position: number): boolean {
    return this.filled[this.globalIndex(position)];
  }

  private isFilledAt(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height && this.filled[y * this.width + x];
  }

  private xOf(position: number): number {
    return this.horizontal ? position : this.line;
  }

  private yOf(position: number): number {
    return this.horizontal ? this.line : position;
  }
}

const expectMatchesReference = (gaddag: Gaddag, config: Config, board: Board, rack: string[]): ResultJson[] => {
  const results = generate(gaddag, config, board, rack);
  const signatures = results.map(signatureOf);
  expect(new Set(signatures).size).toBe(signatures.length);
  expect(results.map(({ id }) => id)).toEqual(results.map((_, index) => index));
  expectEnumerationOrder(results);
  expect([...signatures].sort()).toEqual(new ReferenceSolver(gaddag, config, board, createRack(rack)).solve());
  return results;
};

const createRandom = (seed: number): (() => number) => {
  let state = (seed % 2147483647) + 1;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
};

const createRandomBoard = (width: number, height: number, characters: string[], random: () => number): Board => {
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
};

const createWideAlphabet = (size: number): TileScores => {
  const tiles: TileScores = { a: 1, b: 3 };

  for (let index = 2; index < size; ++index) {
    tiles[String.fromCharCode(0x100 + index)] = 1;
  }

  return tiles;
};

const BASIC_TILES: TileScores = { a: 1, b: 3, c: 3, d: 2 };

const SPANISH_MINI_TILES: TileScores = { a: 1, c: 3, ch: 5, h: 4, i: 1, l: 1, ll: 8, o: 1 };

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
    expect(results.every((json) => coversCell(json, 16, 16))).toBe(true);
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
    expect(wideResults.every((json) => coversCell(json, 4, 2))).toBe(true);
    const tallResults = generate(gaddag, config, createBoard(5, 9), ['a', 'b']);
    expect(tallResults.length).toBe(4);
    expect(tallResults.every((json) => coversCell(json, 2, 4))).toBe(true);
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
    expect(results.every((json) => json.points === 1)).toBe(true);
    expect(results.every((json) => Result.fromJson(json).blanksCount === 1)).toBe(true);
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
    expect(results.map((json) => json.points)).toEqual([6, 7, 5]);
  });

  it('plays through existing tiles', () => {
    const gaddag = Gaddag.fromArray(['abc']);
    const config = createConfig(BASIC_TILES);
    const board = createBoard(5, 5, [
      [1, 2, 'a'],
      [3, 2, 'c'],
    ]);
    const results = generate(gaddag, config, board, ['b']);
    expect(results).toEqual([
      {
        cells: [
          { isEmpty: false, tile: { character: 'a', isBlank: false }, x: 1, y: 2 },
          { isEmpty: true, tile: { character: 'b', isBlank: false }, x: 2, y: 2 },
          { isEmpty: false, tile: { character: 'c', isBlank: false }, x: 3, y: 2 },
        ],
        collisions: [],
        id: 0,
        points: 7,
      },
    ]);
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
    const results = generate(gaddag, config, board, ['b']);
    expect(results).toEqual([
      {
        cells: [
          { isEmpty: true, tile: { character: 'b', isBlank: false }, x: 2, y: 2 },
          { isEmpty: false, tile: { character: 'd', isBlank: false }, x: 3, y: 2 },
        ],
        collisions: [
          [
            { isEmpty: false, tile: { character: 'a', isBlank: false }, x: 2, y: 1 },
            { isEmpty: true, tile: { character: 'b', isBlank: false }, x: 2, y: 2 },
            { isEmpty: false, tile: { character: 'c', isBlank: false }, x: 2, y: 3 },
          ],
        ],
        id: 0,
        points: 12,
      },
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
    expect(results.map((json) => json.points)).toEqual([3, 3]);
    expect(results[0].cells[0]).toEqual({ isEmpty: false, tile: { character: 'a', isBlank: true }, x: 2, y: 2 });
  });

  it('plays multiple blanks in a single move', () => {
    const gaddag = Gaddag.fromArray(['bb']);
    const config = createConfig(BASIC_TILES);
    const results = generate(gaddag, config, createBoard(5, 5), [BLANK_CHARACTER, BLANK_CHARACTER]);
    expect(results.length).toBe(4);
    expect(results.every((json) => json.points === 0)).toBe(true);
    expect(results.every((json) => Result.fromJson(json).blanksCount === 2)).toBe(true);
  });
});

describe('MoveGenerator - digraphs', () => {
  const config = createConfig(SPANISH_MINI_TILES);

  it('plays a digraph tile within words in both directions', () => {
    const gaddag = Gaddag.fromArray(['chico']);
    const results = generate(gaddag, config, createBoard(7, 7), ['ch', 'i', 'c', 'o']);
    expect(results.length).toBe(8);
    expect(toWords(results).every((word) => word === 'chico')).toBe(true);
    expect(results.every((json) => json.points === 10)).toBe(true);
    expect(results.every((json) => json.cells.length === 4)).toBe(true);
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
    expect(results.every((json) => json.points === 56)).toBe(true);
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
    expect(results.every((json) => json.points === 20)).toBe(true);
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
    expect(results.map((json) => json.points)).toEqual([5, 5]);
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
    expect(generate(gaddag, config, board(), ['b']).map((json) => json.points)).toEqual([7, 4]);
  });

  it('multiplies the whole word on a word bonus', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [wordBonus(3, 2, 3)] });
    expect(generate(gaddag, config, board(), ['b']).map((json) => json.points)).toEqual([12, 4]);
  });

  it('applies a score-gated character bonus only to tiles with the matching score', () => {
    const matching = createConfig(BASIC_TILES, { bonuses: [characterBonus(3, 2, 2, 3)] });
    expect(generate(gaddag, matching, board(), ['b']).map((json) => json.points)).toEqual([7, 4]);
    const mismatched = createConfig(BASIC_TILES, { bonuses: [characterBonus(3, 2, 2, 2)] });
    expect(generate(gaddag, mismatched, board(), ['b']).map((json) => json.points)).toEqual([4, 4]);
  });

  it('gates blanks by the score of the character they represent', () => {
    const config = createConfig(BASIC_TILES, { blankScore: 2, bonuses: [characterBonus(3, 2, 2, 3)] });
    expect(generate(gaddag, config, board(), [BLANK_CHARACTER]).map((json) => json.points)).toEqual([5, 3]);
  });

  it('applies the first bonus when several share coordinates', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [characterBonus(3, 2, 2), wordBonus(3, 2, 3)] });
    expect(generate(gaddag, config, board(), ['b']).map((json) => json.points)).toEqual([7, 4]);
  });

  it('does not apply bonuses under existing tiles', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [characterBonus(2, 2, 2)] });
    expect(generate(gaddag, config, board(), ['b']).map((json) => json.points)).toEqual([4, 4]);
  });

  it('ignores bonuses outside the board', () => {
    const config = createConfig(BASIC_TILES, { bonuses: [wordBonus(10, 10, 3)] });
    expect(generate(gaddag, config, board(), ['b']).map((json) => json.points)).toEqual([4, 4]);
  });

  it('applies a bonus to both the main and the perpendicular word', () => {
    const crossBoard = createBoard(5, 5, [
      [2, 1, 'a'],
      [1, 2, 'a'],
    ]);
    const characterConfig = createConfig(BASIC_TILES, { bonuses: [characterBonus(2, 2, 2)] });
    expect(generate(gaddag, characterConfig, crossBoard, ['b']).map((json) => json.points)).toEqual([4, 14, 4]);
    const wordConfig = createConfig(BASIC_TILES, { bonuses: [wordBonus(2, 2, 3)] });
    expect(generate(gaddag, wordConfig, crossBoard, ['b']).map((json) => json.points)).toEqual([4, 24, 4]);
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
