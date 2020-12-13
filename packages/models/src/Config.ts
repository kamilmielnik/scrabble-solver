import { BLANK, BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';
import Cell from './Cell';
import CharacterBonus from './CharacterBonus';
import ConfigJson from './ConfigJson';
import WordBonus from './WordBonus';

const NO_BONUS = { wordMultiplier: 1, characterMultiplier: 1 };

class Config {
  public static fromJson(json: ConfigJson) {
    return new Config(json);
  }

  public readonly config: ConfigJson;

  constructor(config: ConfigJson) {
    this.config = config;
  }

  public get alphabet(): string[] {
    return getAlphabet(this.config);
  }

  public get allCharacters(): string {
    return getAllCharacters(this.config);
  }

  public get bonuses(): Bonus[] {
    return this.config.bonuses.map((bonus) => {
      if (bonus.type === BONUS_CHARACTER) {
        return new CharacterBonus({ config: this, ...bonus });
      }

      if (bonus.type === BONUS_WORD) {
        return new WordBonus({ config: this, ...bonus });
      }

      throw new Error(`Unsupported Bonus type: "${bonus.type}"`);
    });
  }

  public get pointsMap(): Record<string, number> {
    return getPointsMap(this.config);
  }

  public getCellBonusValue(cell: Cell): BonusValue {
    if (!cell.isEmpty) {
      return NO_BONUS;
    }

    const cellBonus = this.bonuses.find((bonus) => bonus.canApply(cell));

    if (!cellBonus) {
      return NO_BONUS;
    }

    return cellBonus.getValue();
  }

  public getCharacterPoints(character: string): number {
    return this.pointsMap[character];
  }

  public hasCharacter(character: string): boolean {
    return this.alphabet.includes(character);
  }

  public toJson(): ConfigJson {
    return this.config;
  }
}

const getAllCharacters = (config: ConfigJson) =>
  config.tiles.reduce(
    (allCharacters, { character, count }) => allCharacters + Array(count).fill(character).join(''),
    Array(config.numberOfBlanks).fill(BLANK).join('')
  );

const getAlphabet = (config: ConfigJson): string[] => config.tiles.map(({ character }) => character);

const getPointsMap = (config: ConfigJson): Record<string, number> =>
  config.tiles.reduce(
    (pointsMap, { character, score }) => ({
      ...pointsMap,
      [character]: score
    }),
    {}
  );

export default Config;
