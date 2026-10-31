import { BLANK, BONUS_CHARACTER, BONUS_WORD, NO_BONUS } from '@scrabble-solver/constants';

import { type Bingo } from './Bingo';
import { type Bonus } from './Bonus';
import { type BonusValue } from './BonusValue';
import { type Cell } from './Cell';
import { CharacterBonus } from './CharacterBonus';
import { type ConfigJson } from './ConfigJson';
import { type Game } from './Game';
import { type Locale } from './Locale';
import { type Tile } from './Tile';
import { type TileConfig } from './TileConfig';
import { WordBonus } from './WordBonus';

/**
 * Browsers keep Ctrl+N, Ctrl+T and Ctrl+W to themselves, and Cmd+Q quits them on macOS.
 * The page never gets to prevent these, so they cannot be digraph shortcuts.
 */
const RESERVED_KEYS = ['n', 'q', 't', 'w'];

export class Config {
  public static fromJson = (json: ConfigJson): Config => {
    return new Config(json);
  };

  public readonly bonuses: Bonus[];

  public readonly config: ConfigJson;

  public readonly digraphs: readonly string[];

  public readonly longestDigraphLength: number;

  public readonly pointsMap: Record<string, number>;

  constructor(config: ConfigJson) {
    this.bonuses = getBonuses(config);
    this.config = config;
    this.digraphs = getDigraphs(config);
    this.longestDigraphLength = Math.max(0, ...this.digraphs.map((digraph) => digraph.length));
    this.pointsMap = getPointsMap(this.config);
  }

  public get alphabet(): string[] {
    return getAlphabet(this.config);
  }

  public get bingo(): Bingo {
    return this.config.bingo;
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

  public getDigraphByShortcut(key: string): string | undefined {
    if (key.length !== 1) {
      return undefined;
    }

    const shortcut = key.toLocaleLowerCase(this.locale);
    return this.digraphs.find((digraph) => getDigraphShortcut(digraph) === shortcut);
  }

  public getDigraphShortcut(digraph: string): string {
    return getDigraphShortcut(digraph);
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

  public isDigraphPart(character: string): boolean {
    return this.digraphs.some((digraph) => digraph.includes(character));
  }

  public isDigraphPrefix(characters: string): boolean {
    return this.digraphs.some((digraph) => digraph.length > characters.length && digraph.startsWith(characters));
  }

  public isDigraphShortcut(key: string): boolean {
    return typeof this.getDigraphByShortcut(key) !== 'undefined';
  }

  public get rackSize(): number {
    return this.config.rackSize;
  }

  public get supportsRemainingTiles(): boolean {
    return this.tiles.every((tile) => typeof tile.count === 'number');
  }

  public get tiles(): TileConfig[] {
    return this.config.tiles;
  }

  public toJson(): ConfigJson {
    return this.config;
  }
}

function getBonuses(config: ConfigJson): Bonus[] {
  return config.bonuses.map((bonus) => {
    if (bonus.type === BONUS_CHARACTER) {
      return new CharacterBonus(bonus);
    }

    if (bonus.type === BONUS_WORD) {
      return new WordBonus(bonus);
    }

    throw new Error(`Unsupported Bonus type: "${bonus.type}"`);
  });
}

function getDigraphs(config: ConfigJson): string[] {
  return getAlphabet(config).filter((character) => character.length > 1);
}

function getAlphabet(config: ConfigJson): string[] {
  return config.tiles.map(({ character }) => character);
}

function getPointsMap(config: ConfigJson): Record<string, number> {
  const pointsMap = Object.create(null) as Record<string, number>;
  return Object.assign(pointsMap, Object.fromEntries(config.tiles.map(({ character, score }) => [character, score])));
}

function getDigraphShortcut(digraph: string): string {
  return (
    Array.from(digraph).find((character) => /\p{L}/u.test(character) && !RESERVED_KEYS.includes(character)) ??
    digraph[0]
  );
}
