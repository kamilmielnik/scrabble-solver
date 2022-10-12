import { CONSONANTS, VOWELS } from '@scrabble-solver/constants';

import Cell from './Cell';
import ResultJson from './ResultJson';
import Tile from './Tile';

type Collision = Cell[];

class Result {
  public static fromJson(json: ResultJson): Result {
    return new Result({
      id: json.id,
      cells: json.cells.map(Cell.fromJson),
      collisions: json.collisions.map((collision) => collision.map(Cell.fromJson)),
      points: json.points,
    });
  }

  public readonly blanksCount: number;

  public readonly cells: Cell[];

  public readonly collisions: Collision[];

  public readonly consonantsCount: number;

  public readonly id: number;

  public readonly length: number;

  public readonly points: number;

  public readonly pointsRatio: number;

  public readonly tiles: Tile[];

  public readonly tilesCharacters: string;

  public readonly tilesCount: number;

  public readonly vowelsCount: number;

  public readonly word: string;

  public readonly words: string[];

  public readonly wordsCount: number;

  constructor({
    cells,
    id,
    collisions,
    points,
  }: {
    cells: Cell[];
    id: number;
    collisions: Collision[];
    points: number;
  }) {
    const tiles = getTiles(cells);
    this.blanksCount = getBlanks(tiles).length;
    this.cells = cells;
    this.collisions = collisions;
    this.consonantsCount = getConsonants(tiles).length;
    this.id = id;
    this.length = cells.length;
    this.points = points;
    this.pointsRatio = getPointsRatio(tiles, points);
    this.tiles = tiles;
    this.tilesCharacters = getTilesCharacters(tiles);
    this.tilesCount = tiles.length;
    this.vowelsCount = getVowels(tiles).length;
    this.word = getWord(cells);
    this.words = getWords(cells, collisions);
    this.wordsCount = 1 + this.collisions.length;
  }

  public toJson(): ResultJson {
    return {
      cells: this.cells.map((cell) => cell.toJson()),
      id: this.id,
      collisions: this.collisions.map((collision) => collision.map((cell) => cell.toJson())),
      points: this.points,
    };
  }
}

const charactersComparator = (a: string, b: string): number => a.localeCompare(b);

const getBlanks = (tiles: Tile[]): Tile[] => tiles.filter(({ isBlank }) => isBlank);

const getConsonants = (tiles: Tile[]): Tile[] => tiles.filter(isConsonant);

const getVowels = (tiles: Tile[]): Tile[] => tiles.filter(isVowel);

const getNonBlankCharacters = (tiles: Tile[]): string[] => getNonBlanks(tiles).map(({ character }) => character);

const getNonBlanks = (tiles: Tile[]): Tile[] => tiles.filter(({ isBlank }) => !isBlank);

const getPointsRatio = (tiles: Tile[], points: number): number => points / tiles.length;

const getTiles = (cells: Cell[]): Tile[] => cells.filter(({ isEmpty }) => isEmpty).map(({ tile }) => tile);

const getTilesCharacters = (tiles: Tile[]): string => getNonBlankCharacters(tiles).sort(charactersComparator).join('');

// eslint-disable-next-line prefer-template
const getWord = (cells: Cell[]): string => cells.reduce((word, cell) => word + cell.toString(), '');

const getWords = (cells: Cell[], collisions: Collision[]): string[] => [cells, ...collisions].map(getWord);

const isConsonant = ({ character, isBlank }: Tile): boolean => CONSONANTS.includes(character) && !isBlank;

const isVowel = ({ character, isBlank }: Tile): boolean => VOWELS.includes(character) && !isBlank;

export default Result;
