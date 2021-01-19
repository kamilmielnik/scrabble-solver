import { BONUS_WORD } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';

class WordBonus extends Bonus {
  public readonly type = BONUS_WORD;

  public get value(): BonusValue {
    return {
      characterMultiplier: 1,
      wordMultiplier: this.multiplier,
    };
  }
}

export default WordBonus;
