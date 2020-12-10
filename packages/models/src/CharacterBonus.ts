import { BONUS_CHARACTER } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';
import Cell from './Cell';

class CharacterBonus extends Bonus {
  public canApply(cell: Cell): boolean {
    return this.matchesCellCoordinates(cell) && this.matchesCellTileScore(cell);
  }

  public getType(): BONUS_CHARACTER {
    return BONUS_CHARACTER;
  }

  public getValue(): BonusValue {
    return {
      characterMultiplier: this.multiplier,
      wordMultiplier: 1
    };
  }

  public matchesCellTileScore(cell: Cell): boolean {
    const cellTileScore = this.config.pointsMap[cell.tile.character];
    return Boolean(this.score) && this.score === cellTileScore;
  }
}

export default CharacterBonus;
