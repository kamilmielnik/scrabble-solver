import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import { Bonus, Cell } from '@scrabble-solver/models';

import styles from './Cell.module.scss';

const CHARACTER_CLASSNAMES: Record<number, string> = {
  1: styles.bonusCharacter1,
  2: styles.bonusCharacter2,
  3: styles.bonusCharacter3,
  5: styles.bonusCharacter5,
};

const WORD_CLASSNAMES: Record<number, string> = {
  2: styles.bonusWord2,
  3: styles.bonusWord3,
};

const CHARACTER_MULTIPLIER_CLASSNAMES: Record<number, string> = {
  2: styles.bonusCharacterMultiplier2,
  3: styles.bonusCharacterMultiplier3,
};

export const getBonusClassname = (cell: Cell, bonus: Bonus | undefined): string | undefined => {
  if (!bonus || !cell.isEmpty) {
    return undefined;
  }

  const { type } = bonus;

  if (type === BONUS_WORD) {
    return getWordBonusClassname(bonus);
  }

  if (type === BONUS_CHARACTER) {
    return getCharacterBonusClassname(bonus);
  }

  throw new Error(`Unknown bonus type: ${type} ${bonus.x} ${bonus.y} ${bonus.multiplier} ${bonus.score}`);
};

const getWordBonusClassname = (bonus: Bonus): string | undefined => {
  return WORD_CLASSNAMES[bonus.multiplier];
};

const getCharacterBonusClassname = (bonus: Bonus): string | undefined => {
  if (bonus.score) {
    return CHARACTER_CLASSNAMES[bonus.score];
  }

  return CHARACTER_MULTIPLIER_CLASSNAMES[bonus.multiplier];
};
