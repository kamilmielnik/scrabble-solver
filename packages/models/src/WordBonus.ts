import { BONUS_WORD } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';

class WordBonus extends Bonus {
  public getType(): string {
    return BONUS_WORD;
  }

  public getValue(): BonusValue {
    return {
      characterMultiplier: 1,
      wordMultiplier: this.multiplier
    };
  }
}

export default WordBonus;
