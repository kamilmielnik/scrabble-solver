import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';

import { BonusJson } from './BonusJson';
import { BonusValue } from './BonusValue';
import { Cell } from './Cell';
import { type Config } from './Config';

export abstract class Bonus {
  public readonly multiplier: number;

  public readonly score: number | undefined;

  public abstract readonly type: typeof BONUS_CHARACTER | typeof BONUS_WORD;

  public readonly x: number;

  public readonly y: number;

  constructor({ multiplier, score, x, y }: { multiplier: number; score?: number; x: number; y: number }) {
    this.multiplier = multiplier;
    this.score = score;
    this.x = x;
    this.y = y;
  }

  public canApply(_config: Config, cell: Cell): boolean {
    return cell.isEmpty && this.matchesCellCoordinates(cell);
  }

  public matchesCellCoordinates(cell: Cell): boolean {
    return this.x === cell.x && this.y === cell.y;
  }

  public toJson(): BonusJson {
    return {
      multiplier: this.multiplier,
      score: this.score,
      type: this.type,
      x: this.x,
      y: this.y,
    };
  }

  public get value(): BonusValue {
    return {
      characterMultiplier: 1,
      wordMultiplier: 1,
    };
  }
}
