import { BONUS_CHARACTER } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';
import Cell from './Cell';
import Config from './Config';

class CharacterBonus extends Bonus {
  public readonly type = BONUS_CHARACTER;

  public canApply(config: Config, cell: Cell): boolean {
    return this.matchesCellCoordinates(cell) && this.matchesCellTileScore(config, cell);
  }

  public matchesCellTileScore(config: Config, cell: Cell): boolean {
    const cellTileScore = config.pointsMap[cell.tile.character];
    return Boolean(this.score) && this.score === cellTileScore;
  }

  public get value(): BonusValue {
    return {
      characterMultiplier: this.multiplier,
      wordMultiplier: 1,
    };
  }
}

export default CharacterBonus;
