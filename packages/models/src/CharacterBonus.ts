import { BONUS_CHARACTER } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';
import Cell from './Cell';

class CharacterBonus extends Bonus {
  public readonly type = BONUS_CHARACTER;

  public canApply(cell: Cell): boolean {
    return this.matchesCellCoordinates(cell) && this.matchesCellTileScore(cell);
  }

  public matchesCellTileScore(cell: Cell): boolean {
    const cellTileScore = this.config.pointsMap[cell.tile.character];
    return Boolean(this.score) && this.score === cellTileScore;
  }

  public get value(): BonusValue {
    return {
      characterMultiplier: this.multiplier,
      wordMultiplier: 1
    };
  }
}

export default CharacterBonus;
