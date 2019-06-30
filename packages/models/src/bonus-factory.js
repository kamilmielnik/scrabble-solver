import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import CharacterBonus from './character-bonus';
import WordBonus from './word-bonus';

const Constructors = {
  [BONUS_CHARACTER]: CharacterBonus,
  [BONUS_WORD]: WordBonus
};

class BonusFactory {
  constructor(config) {
    this.config = config;
  }

  create({ type, ...params }) {
    const Bonus = Constructors[type];
    return new Bonus({
      config: this.config,
      ...params
    });
  }
}

export default BonusFactory;
