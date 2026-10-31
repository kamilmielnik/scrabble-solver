/* eslint-disable max-lines */

import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import { type BonusJson, type ConfigJson } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import * as games from './index';

type GameConfig = Omit<ConfigJson, 'locale' | 'tiles'>;
type Transform = (x: number, y: number, game: GameConfig) => [number, number];

const MOVE_GENERATOR_MAX_BOARD_DIMENSION = 32;

describe.each(Object.entries(games))('%s', (name, game) => {
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

  it('has odd board dimensions, so that a single cell is the center', () => {
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

describe('Super Scrabble', () => {
  it('embeds the Scrabble board in its middle 15x15 cells', () => {
    const actual = renderBoard(games.superScrabble)
      .slice(3, 18)
      .map((row) => row.slice(3, 18));

    expect(actual).toEqual(renderBoard(games.scrabble));
  });
});

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

function isInsideBoard(game: GameConfig, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < game.boardWidth && y < game.boardHeight;
}

function isSquare(game: GameConfig): boolean {
  return game.boardWidth === game.boardHeight;
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
