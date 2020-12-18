import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';

import styles from './Cell.module.scss';

const CHARACTER_CLASSNAMES = {
  1: styles.bonusCharacter1,
  2: styles.bonusCharacter2,
  3: styles.bonusCharacter3,
  5: styles.bonusCharacter5
};

const WORD_CLASSNAMES = {
  2: styles.bonusWord2,
  3: styles.bonusWord3
};

const CHARACTER_MULTIPLIER_CLASSNAMES = {
  2: styles.bonusCharacterMultiplier2,
  3: styles.bonusCharacterMultiplier3
};

const CHARACTER_POINTS_CLASSNAMES = {
  1: styles.characterPoints1,
  2: styles.characterPoints2,
  3: styles.characterPoints3,
  4: styles.characterPoints3,
  5: styles.characterPoints5
};

export const getCharacterPointsClassname = (characterPoints) => {
  if (characterPoints > 5) {
    return styles.characterPoints5;
  }
  return CHARACTER_POINTS_CLASSNAMES[characterPoints];
};

export const getBonusClassname = (cell, bonus) => {
  const shouldShowBonus = cell.isEmpty && bonus;
  if (!shouldShowBonus) {
    return null;
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
const getWordBonusClassname = (bonus) => WORD_CLASSNAMES[bonus.multiplier];
const getCharacterBonusClassname = (bonus) => {
  if (bonus.score) {
    return CHARACTER_CLASSNAMES[bonus.score];
  }

  return CHARACTER_MULTIPLIER_CLASSNAMES[bonus.multiplier];
};
