import { BONUS_WORD } from '@scrabble-solver/constants';

import { Bonus } from './Bonus';
import { type BonusValue } from './BonusValue';

export class WordBonus extends Bonus {
  public readonly type = BONUS_WORD;

  public get value(): BonusValue {
    return {
      characterMultiplier: 1,
      wordMultiplier: this.multiplier,
    };
  }
}
