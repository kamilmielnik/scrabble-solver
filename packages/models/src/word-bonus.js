import { BONUS_WORD } from '@scrabble-solver/constants';
import Bonus from './bonus';

class WordBonus extends Bonus {
  getValue() {
    return {
      wordMultiplier: this.multiplier,
      characterMultiplier: 1
    };
  }

  getType() {
    return BONUS_WORD;
  }
}

export default WordBonus;
