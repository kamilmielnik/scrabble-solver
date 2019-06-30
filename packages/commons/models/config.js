import { BLANK } from '../constants';
import BonusFactory from './bonus-factory';

const NO_BONUS = { wordMultiplier: 1, characterMultiplier: 1 };

class Config {
  constructor(config) {
    const bonusFactory = new BonusFactory(this);
    this.id = config.id;
    this.name = config.name;
    this.allTilesBonusScore = config.allTilesBonusScore;
    this.blankScore = config.blankScore;
    this.boardWidth = config.boardWidth;
    this.boardHeight = config.boardHeight;
    this.maximumNumberOfCharacters = config.maximumNumberOfCharacters;
    this.numberOfBlanks = config.numberOfBlanks;
    this.bonuses = getBonuses(bonusFactory, config);
    this.characters = config.characters;
    this.alphabet = getAlphabet(config);
    this.allCharacters = getAllCharacters(config);
    this.pointsMap = getPointsMap(config);
  }

  getCellBonusValue(cell) {
    if (!cell.isEmpty) {
      return NO_BONUS;
    }

    const cellBonus = this.bonuses.find((bonus) => bonus.canApply(cell));

    if (!cellBonus) {
      return NO_BONUS;
    }

    return cellBonus.getValue();
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      blankScore: this.blankScore,
      boardWidth: this.boardWidth,
      boardHeight: this.boardHeight,
      maximumNumberOfCharacters: this.maximumNumberOfCharacters,
      characters: this.characters,
      allTilesBonusScore: this.allTilesBonusScore,
      numberOfBlanks: this.numberOfBlanks,
      bonuses: this.bonuses.map((bonus) => bonus.toJson())
    };
  }

  static fromJson(json) {
    return new Config(json);
  }
}

const getAlphabet = ({ characters }) => characters.map(({ character }) => character);
const getAllCharacters = ({ characters, numberOfBlanks }) =>
  characters.reduce(
    (allCharacters, { character, count }) =>
      allCharacters +
      Array(count)
        .fill(character)
        .join(''),
    Array(numberOfBlanks)
      .fill(BLANK)
      .join('')
  );
const getPointsMap = ({ characters }) =>
  characters.reduce(
    (pointsMap, { character, score }) => ({
      ...pointsMap,
      [character]: score
    }),
    {}
  );
const getBonuses = (bonusFactory, { bonuses }) => bonuses.map((bonus) => bonusFactory.create(bonus));

export default Config;
