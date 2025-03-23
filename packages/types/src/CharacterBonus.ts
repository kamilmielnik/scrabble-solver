import { BONUS_CHARACTER } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';
import Cell from './Cell';
import type Config from './Config';

class CharacterBonus extends Bonus {
  public readonly type = BONUS_CHARACTER;

  public canApply(config: Config, cell: Cell): boolean {
    return super.canApply(config, cell) && this.matchesCellTileScore(config, cell);
  }

  public matchesCellTileScore(config: Config, cell: Cell): boolean {
    if (typeof this.score === 'undefined') {
      return true;
    }

    return this.score === config.pointsMap[cell.tile.character];
  }

  public get value(): BonusValue {
    return {
      characterMultiplier: this.multiplier,
      wordMultiplier: 1,
    };
  }
}

export default CharacterBonus;
