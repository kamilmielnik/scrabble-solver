import { BONUS_WORD } from '@scrabble-solver/constants';
import { Bonus } from '@scrabble-solver/types';

import { COLOR_BONUS_CHARACTER, COLOR_BONUS_CHARACTER_MULTIPLIER, COLOR_BONUS_WORD } from 'parameters';

const getBonusColor = (bonus: Bonus): string => {
  if (bonus.type === BONUS_WORD) {
    return COLOR_BONUS_WORD[bonus.multiplier];
  }

  if (bonus.score) {
    return COLOR_BONUS_CHARACTER[bonus.score];
  }

  return COLOR_BONUS_CHARACTER_MULTIPLIER[bonus.multiplier];
};

export default getBonusColor;
