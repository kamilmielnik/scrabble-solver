/* eslint-disable max-lines */

import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import { type BonusJson, type ConfigJson, Game } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import * as games from './index';

type GameConfig = Omit<ConfigJson, 'locale' | 'tiles'>;
type GameName = keyof typeof games;
type Transform = (x: number, y: number, game: GameConfig) => [number, number];

const GAMES: Record<GameName, GameConfig> = { ...games };

const MOVE_GENERATOR_MAX_BOARD_DIMENSION = 32;

const NO_BONUS = 'none';
const DOUBLE_WORD = `${BONUS_WORD} x2 for any points`;
const RED_TILES_TRIPLED = `${BONUS_CHARACTER} x3 for 5 points`;

const PUBLISHED_RULES: Record<GameName, Partial<GameConfig>> = {
  crossplay: { bingo: { score: 40 }, blanksCount: 3, boardHeight: 15, boardWidth: 15, game: Game.Crossplay },
  kelimelik: { bingo: { score: 30 }, blanksCount: 2, boardHeight: 15, boardWidth: 15, game: Game.Kelimelik },
  letterLeague: { bingo: { multiplier: 2 }, blanksCount: 2, boardHeight: 19, boardWidth: 27, game: Game.LetterLeague },
  literaki: { bingo: { score: 50 }, blanksCount: 2, boardHeight: 15, boardWidth: 15, game: Game.Literaki },
  scrabble: { bingo: { score: 50 }, blanksCount: 2, boardHeight: 15, boardWidth: 15, game: Game.Scrabble },
  scrabbleDuel: { bingo: { score: 50 }, blanksCount: 2, boardHeight: 11, boardWidth: 11, game: Game.ScrabbleDuel },
  superScrabble: { bingo: { score: 50 }, blanksCount: 4, boardHeight: 21, boardWidth: 21, game: Game.SuperScrabble },
  wordfeud: { bingo: { score: 40 }, blanksCount: 2, boardHeight: 15, boardWidth: 15, game: Game.Wordfeud },
  wyrazy: { bingo: { score: 25 }, blanksCount: 2, boardHeight: 15, boardWidth: 15, game: Game.Wyrazy },
};

const CENTRE_BONUSES: [Exclude<GameName, 'superScrabble'>, string][] = [
  ['crossplay', NO_BONUS],
  ['kelimelik', NO_BONUS],
  ['letterLeague', NO_BONUS],
  ['literaki', RED_TILES_TRIPLED],
  ['scrabble', DOUBLE_WORD],
  ['scrabbleDuel', DOUBLE_WORD],
  ['wordfeud', NO_BONUS],
  ['wyrazy', NO_BONUS],
];

const SCRABBLE_BOARD = [
  'T..l...T...l..T',
  '.D...t...t...D.',
  '..D...l.l...D..',
  'l..D...l...D..l',
  '....D.....D....',
  '.t...t...t...t.',
  '..l...l.l...l..',
  'T..l...D...l..T',
  '..l...l.l...l..',
  '.t...t...t...t.',
  '....D.....D....',
  'l..D...l...D..l',
  '..D...l.l...D..',
  '.D...t...t...D.',
  'T..l...T...l..T',
];

const SUPER_SCRABBLE_BOARD = [
  'Q..l...T..l..T...l..Q',
  '.D..t...D...D...t..D.',
  '..D..q...D.D...q..D..',
  'l..T..l...T...l..T..l',
  '.t..D...t...t...D..t.',
  '..q..D...l.l...D..q..',
  '...l..D...l...D..l...',
  'T......D.....D......T',
  '.D..t...t...t...t..D.',
  '..D..l...l.l...l..D..',
  'l..T..l.......l..T..l',
  '..D..l...l.l...l..D..',
  '.D..t...t...t...t..D.',
  'T......D.....D......T',
  '...l..D...l...D..l...',
  '..q..D...l.l...D..q..',
  '.t..D...t...t...D..t.',
  'l..T..l...T...l..T..l',
  '..D..q...D.D...q..D..',
  '.D..t...D...D...t..D.',
  'Q..l...T..l..T...l..Q',
];

describe.each(Object.entries(games))('%s', (name, game) => {
  it('follows the published rules for board size, blanks and the seven-tile bonus', () => {
    expect(game).toMatchObject(PUBLISHED_RULES[name as GameName]);
  });

  it('deals seven tiles and scores a blank at zero', () => {
    expect(game.rackSize).toBe(7);
    expect(game.blankScore).toBe(0);
  });

  it('defines the seven-tile bonus as either flat points or a multiplier, never both', () => {
    const [[kind, value], ...rest] = Object.entries(game.bingo);

    expect(rest).toEqual([]);
    expect(['multiplier', 'score']).toContain(kind);
    expect(value).toBeGreaterThan(1);
  });

  it('fits the board in what the move generator can pack into a sort key', () => {
    expect(game.boardWidth).toBeLessThanOrEqual(MOVE_GENERATOR_MAX_BOARD_DIMENSION);
    expect(game.boardHeight).toBeLessThanOrEqual(MOVE_GENERATOR_MAX_BOARD_DIMENSION);
  });

  it('has odd board dimensions, so that a single cell is the centre', () => {
    expect(game.boardWidth % 2).toBe(1);
    expect(game.boardHeight % 2).toBe(1);
  });

  it('keeps every bonus inside the board', () => {
    const outside = game.bonuses.filter(({ x, y }) => !isInsideBoard(game, x, y));

    expect(outside).toEqual([]);
  });

  it('keeps every bonus on whole-number coordinates', () => {
    const fractional = game.bonuses.filter(({ x, y }) => !Number.isInteger(x) || !Number.isInteger(y));

    expect(fractional).toEqual([]);
  });

  it('never puts two bonuses on one cell', () => {
    const cells = game.bonuses.map(({ x, y }) => `${x},${y}`);

    expect(new Set(cells).size).toBe(cells.length);
  });

  it('uses only the bonus types that a Config can build', () => {
    const types = new Set<string>(game.bonuses.map(({ type }) => type));

    expect(types).toEqual(new Set([BONUS_CHARACTER, BONUS_WORD]));
  });

  it('multiplies by 2, 3 or 4 only', () => {
    const multipliers = new Set(game.bonuses.map(({ multiplier }) => multiplier));

    expect(multipliers.difference(new Set([2, 3, 4]))).toEqual(new Set());
  });

  it('is symmetric when mirrored left to right', () => {
    expect(findAsymmetricBonuses(game, mirrorHorizontally)).toEqual([]);
  });

  it('is symmetric when mirrored top to bottom', () => {
    expect(findAsymmetricBonuses(game, mirrorVertically)).toEqual([]);
  });
});

describe.each(Object.entries(games).filter(([, game]) => isSquare(game)))('square board of %s', (_name, game) => {
  it('is symmetric across the main diagonal', () => {
    expect(findAsymmetricBonuses(game, transposeMainDiagonal)).toEqual([]);
  });

  it('is symmetric across the anti-diagonal', () => {
    expect(findAsymmetricBonuses(game, transposeAntiDiagonal)).toEqual([]);
  });
});

describe('board shapes', () => {
  it('has Letter League as the only board that is not square', () => {
    const notSquare = Object.values(games).filter((game) => !isSquare(game));

    expect(notSquare).toEqual([games.letterLeague]);
  });
});

describe('centre cell', () => {
  it.each(CENTRE_BONUSES)('of %s has the bonus that the game gives it', (name, expected) => {
    const game = GAMES[name];

    expect(getBonusKind(getBonus(game, getCentreX(game), getCentreY(game)))).toBe(expected);
  });

  it.todo('of superScrabble doubles the word, as the centre star does in the published rules');
});

describe('Scrabble', () => {
  it('has the published board', () => {
    expect(renderBoard(games.scrabble)).toEqual(SCRABBLE_BOARD);
  });

  it('has the 61 published premium squares', () => {
    expect(countBonuses(games.scrabble)).toEqual({ 'word x2': 17, 'word x3': 8, 'letter x2': 24, 'letter x3': 12 });
  });
});

describe('Super Scrabble', () => {
  it('has the published board, apart from the centre star', () => {
    const actual = maskCentre(renderBoard(games.superScrabble));

    expect(actual).toEqual(maskCentre(SUPER_SCRABBLE_BOARD));
  });

  it('embeds the Scrabble board in its middle 15x15 cells, apart from the centre star', () => {
    const actual = renderBoard(games.superScrabble)
      .slice(3, 18)
      .map((row) => row.slice(3, 18));

    expect(maskCentre(actual)).toEqual(maskCentre(SCRABBLE_BOARD));
  });

  it('puts its quadruple word squares in the four corners', () => {
    const quadrupleWords = games.superScrabble.bonuses.filter(isQuadrupleWord).map(({ x, y }) => [x, y]);

    expect(quadrupleWords).toEqual([
      [0, 0],
      [20, 0],
      [0, 20],
      [20, 20],
    ]);
  });

  it('is the only game with quadruple squares', () => {
    const withQuadruples = Object.values(games).filter(({ bonuses }) => {
      return bonuses.some(({ multiplier }) => multiplier === 4);
    });

    expect(withQuadruples).toEqual([games.superScrabble]);
  });
});

describe('Crossplay', () => {
  it('has the published premium square counts', () => {
    expect(countBonuses(games.crossplay)).toEqual({ 'word x2': 8, 'word x3': 8, 'letter x2': 20, 'letter x3': 20 });
  });

  it('puts triple letters in the corners', () => {
    for (const [x, y] of getCorners(games.crossplay)) {
      expect(getBonus(games.crossplay, x, y)).toEqual({ multiplier: 3, type: BONUS_CHARACTER, x, y });
    }
  });

  it('puts triple words three squares from the corners along the edges', () => {
    const tripleWords = games.crossplay.bonuses.filter(({ multiplier, type }) => {
      return type === BONUS_WORD && multiplier === 3;
    });

    expect(new Set(tripleWords.map(({ x, y }) => `${x},${y}`))).toEqual(
      new Set(['3,0', '11,0', '0,3', '14,3', '0,11', '14,11', '3,14', '11,14']),
    );
  });

  it('has no word bonus in the central 49 squares', () => {
    const centralWordBonuses = games.crossplay.bonuses.filter(({ type, x, y }) => {
      return type === BONUS_WORD && x >= 4 && x <= 10 && y >= 4 && y <= 10;
    });

    expect(centralWordBonuses).toEqual([]);
  });
});

describe('Literaki', () => {
  it('triples a letter only when the tile colour matches the field, and colours mean 1, 2, 3 or 5 points', () => {
    const letterBonuses = games.literaki.bonuses.filter(({ type }) => type === BONUS_CHARACTER);

    expect(new Set(letterBonuses.map(({ multiplier }) => multiplier))).toEqual(new Set([3]));
    expect(new Set(letterBonuses.map(({ score }) => score))).toEqual(new Set([1, 2, 3, 5]));
  });

  it('has word bonuses of 2X and 3X that do not depend on the tile colour', () => {
    const wordBonuses = games.literaki.bonuses.filter(({ type }) => type === BONUS_WORD);

    expect(new Set(wordBonuses.map(({ multiplier }) => multiplier))).toEqual(new Set([2, 3]));
    expect(wordBonuses.filter((bonus) => 'score' in bonus)).toEqual([]);
  });

  it('is the only game whose bonuses depend on the tile', () => {
    const withTileDependentBonuses = Object.values(games).filter(({ bonuses }) => {
      return bonuses.some((bonus: BonusJson) => bonus.score !== undefined);
    });

    expect(withTileDependentBonuses).toEqual([games.literaki]);
  });
});

function countBonuses(game: GameConfig): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const { multiplier, type } of game.bonuses) {
    const key = `${type === BONUS_WORD ? 'word' : 'letter'} x${multiplier}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}

function findAsymmetricBonuses(game: GameConfig, transform: Transform): BonusJson[] {
  return game.bonuses.filter((bonus) => {
    const [x, y] = transform(bonus.x, bonus.y, game);
    const counterpart = getBonus(game, x, y);

    return getBonusKind(counterpart) !== getBonusKind(bonus);
  });
}

function getBonus(game: GameConfig, x: number, y: number): BonusJson | undefined {
  return game.bonuses.find((bonus) => bonus.x === x && bonus.y === y);
}

function getBonusKind(bonus: BonusJson | undefined): string {
  return bonus ? `${bonus.type} x${bonus.multiplier} for ${bonus.score ?? 'any'} points` : 'none';
}

function getBoardSymbol(bonus: BonusJson | undefined): string {
  if (!bonus) {
    return '.';
  }

  const symbols = bonus.type === BONUS_WORD ? ['D', 'T', 'Q'] : ['l', 't', 'q'];

  return symbols[bonus.multiplier - 2];
}

function getCentreX(game: GameConfig): number {
  return Math.floor(game.boardWidth / 2);
}

function getCentreY(game: GameConfig): number {
  return Math.floor(game.boardHeight / 2);
}

function getCorners(game: GameConfig): [number, number][] {
  const right = game.boardWidth - 1;
  const bottom = game.boardHeight - 1;

  return [
    [0, 0],
    [right, 0],
    [0, bottom],
    [right, bottom],
  ];
}

function isInsideBoard(game: GameConfig, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < game.boardWidth && y < game.boardHeight;
}

function isQuadrupleWord({ multiplier, type }: BonusJson): boolean {
  return type === BONUS_WORD && multiplier === 4;
}

function isSquare(game: GameConfig): boolean {
  return game.boardWidth === game.boardHeight;
}

function maskCentre(rows: string[]): string[] {
  const centre = Math.floor(rows.length / 2);

  return rows.map((row, y) => (y === centre ? `${row.slice(0, centre)}*${row.slice(centre + 1)}` : row));
}

function mirrorHorizontally(x: number, y: number, game: GameConfig): [number, number] {
  return [game.boardWidth - 1 - x, y];
}

function mirrorVertically(x: number, y: number, game: GameConfig): [number, number] {
  return [x, game.boardHeight - 1 - y];
}

function renderBoard(game: GameConfig): string[] {
  return Array.from({ length: game.boardHeight }, (_row, y) => {
    return Array.from({ length: game.boardWidth }, (_cell, x) => getBoardSymbol(getBonus(game, x, y))).join('');
  });
}

function transposeAntiDiagonal(x: number, y: number, game: GameConfig): [number, number] {
  return [game.boardHeight - 1 - y, game.boardWidth - 1 - x];
}

function transposeMainDiagonal(x: number, y: number): [number, number] {
  return [y, x];
}
