import { BLANK, BONUS_CHARACTER, BONUS_WORD, NO_BONUS } from '@scrabble-solver/constants';

import Bonus from './Bonus';
import BonusValue from './BonusValue';
import Cell from './Cell';
import CharacterBonus from './CharacterBonus';
import ConfigJson from './ConfigJson';
import Game from './Game';
import Locale from './Locale';
import Tile from './Tile';
import TileConfig from './TileConfig';
import WordBonus from './WordBonus';

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

  public get allTilesBonusScore(): number {
    return this.config.allTilesBonusScore;
  }

  public get alphabet(): string[] {
    return getAlphabet(this.config);
  }

  public get blankScore(): number {
    return this.config.blankScore;
  }

  public get blanksCount(): number {
    return this.config.blanksCount;
  }

  public get boardHeight(): number {
    return this.config.boardHeight;
  }

  public get boardWidth(): number {
    return this.config.boardWidth;
  }

  public get game(): Game {
    return this.config.game;
  }

  public get locale(): Locale {
    return this.config.locale;
  }

  public get twoCharacterTiles(): string[] {
    return this.config.tiles.filter((tile) => tile.character.length === 2).map((tile) => tile.character);
  }

  public getCellBonus(cell: Cell): Bonus | undefined {
    return this.bonuses.find((bonus) => bonus.matchesCellCoordinates(cell));
  }

  public getCellBonusValue(cell: Cell): BonusValue {
    return this.getCellBonus(cell)?.value || NO_BONUS;
  }

  public getCharacterPoints(character: string | null): number | undefined {
    if (character === null) {
      return undefined;
    }

    if (character === BLANK) {
      return this.blankScore;
    }

    return this.pointsMap[character];
  }

  public getTwoCharacterTileByPrefix(character: string): string | undefined {
    if (character.length !== 1) {
      return undefined;
    }

    return this.twoCharacterTiles.find((characters) => characters.startsWith(character));
  }

  public getTilePoints(tile: Tile | null): number | undefined {
    if (tile === null) {
      return undefined;
    }

    return tile.isBlank ? this.blankScore : this.getCharacterPoints(tile.character);
  }

  public hasCharacter(character: string): boolean {
    return character in this.pointsMap;
  }

  public isTwoCharacterTilePrefix(character: string): boolean {
    return typeof this.getTwoCharacterTileByPrefix(character) !== 'undefined';
  }

  public get maximumCharactersCount(): number {
    return this.config.maximumCharactersCount;
  }

  public get tiles(): TileConfig[] {
    return this.config.tiles;
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
