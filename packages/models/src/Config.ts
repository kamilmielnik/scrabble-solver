import { BLANK, BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';
import Cell from './Cell';
import CharacterBonus from './CharacterBonus';
import ConfigJson from './ConfigJson';
import WordBonus from './WordBonus';

const NO_BONUS = { characterMultiplier: 1, wordMultiplier: 1 };

class Config {
  public static fromJson(json: ConfigJson): Config {
    return new Config(json);
  }

  public readonly bonuses: Bonus[];

  public readonly config: ConfigJson;

  public readonly pointsMap: Record<string, number>;

  constructor(config: ConfigJson) {
    this.bonuses = getBonuses(config);
    this.config = config;
    this.pointsMap = getPointsMap(this.config);
  }

  public get allCharacters(): string {
    return getAllCharacters(this.config);
  }

  public get allTilesBonusScore(): number {
    return this.config.allTilesBonusScore;
  }

  public get alphabet(): string[] {
    return getAlphabet(this.config);
  }

  public get blankScore(): number {
    return this.config.blankScore;
  }

  public get boardHeight(): number {
    return this.config.boardHeight;
  }

  public get boardWidth(): number {
    return this.config.boardWidth;
  }

  public getCellBonusValue(cell: Cell): BonusValue {
    if (!cell.isEmpty) {
      return NO_BONUS;
    }

    const cellBonus = this.bonuses.find((bonus) => bonus.canApply(this, cell));

    if (!cellBonus) {
      return NO_BONUS;
    }

    return cellBonus.value;
  }

  public getCharacterPoints(character: string): number {
    return this.pointsMap[character] || 0;
  }

  public hasCharacter(character: string): boolean {
    return this.alphabet.includes(character);
  }

  public get maximumNumberOfCharacters(): number {
    return this.config.maximumNumberOfCharacters;
  }

  public toJson(): ConfigJson {
    return this.config;
  }
}

const getBonuses = (config: ConfigJson): Bonus[] => {
  return config.bonuses.map((bonus) => {
    if (bonus.type === BONUS_CHARACTER) {
      return new CharacterBonus(bonus);
    }

    if (bonus.type === BONUS_WORD) {
      return new WordBonus(bonus);
    }

    throw new Error(`Unsupported Bonus type: "${bonus.type}"`);
  });
};

const getAllCharacters = (config: ConfigJson) =>
  config.tiles.reduce(
    (allCharacters, { character, count }) => allCharacters + Array(count).fill(character).join(''),
    Array(config.numberOfBlanks).fill(BLANK).join(''),
  );

const getAlphabet = (config: ConfigJson): string[] => config.tiles.map(({ character }) => character);

const getPointsMap = (config: ConfigJson): Record<string, number> =>
  config.tiles.reduce(
    (pointsMap, { character, score }) => ({
      ...pointsMap,
      [character]: score,
    }),
    {},
  );

export default Config;
