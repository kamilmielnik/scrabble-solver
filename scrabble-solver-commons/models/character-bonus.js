import { BONUS_CHARACTER } from '../constants';
import Bonus from './bonus';

class CharacterBonus extends Bonus {
  canApply(cell) {
    return this.matchesCellCoordinates(cell) && this.matchesCellTileScore(cell);
  }

  matchesCellTileScore(cell) {
    const {
      tile: { character }
    } = cell;
    const cellTileScore = this.config.pointsMap[character];
    return this.score && this.score === cellTileScore;
  }

  getType() {
    return BONUS_CHARACTER;
  }

  getValue() {
    return {
      wordMultiplier: 1,
      characterMultiplier: this.multiplier
    };
  }
}

export default CharacterBonus;
