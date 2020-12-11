import Cell, { CellJson } from './Cell';
import Tile from './Tile';

export interface ResultJson {
  cells: CellJson[];
  id: number;
  numberOfCollisions: number;
  points: number;
}

class Result {
  public static fromJson(json: ResultJson): Result {
    return new Result({
      cells: json.cells.map(Cell.fromJson),
      id: json.id,
      numberOfCollisions: json.numberOfCollisions,
      points: json.points
    });
  }

  public readonly cells: Cell[];

  public readonly id: number;

  public readonly length: number;

  public readonly numberOfCollisions: number;

  public readonly numberOfBlanks: number;

  public readonly numberOfTiles: number;

  public readonly points: number;

  public readonly pointsRatio: number;

  public readonly tiles: Tile[];

  public readonly tilesCharacters: string;

  public readonly word: string;

  constructor({
    cells,
    id,
    numberOfCollisions,
    points
  }: {
    cells: Cell[];
    id: number;
    numberOfCollisions: number;
    points: number;
  }) {
    const tiles = getTiles(cells);
    this.id = id;
    this.points = points;
    this.cells = cells;
    this.numberOfCollisions = numberOfCollisions;
    this.word = getWord(cells);
    this.length = cells.length;
    this.tiles = tiles;
    this.tilesCharacters = getTilesCharacters(tiles);
    this.numberOfTiles = tiles.length;
    this.numberOfBlanks = getBlanks(tiles).length;
    this.pointsRatio = getPointsRatio(tiles, points);
  }

  public toJson(): ResultJson {
    return {
      id: this.id,
      points: this.points,
      cells: this.cells.map((cell) => cell.toJson()),
      numberOfCollisions: this.numberOfCollisions
    };
  }
}

const getTiles = (cells: Cell[]): Tile[] => cells.filter(({ isEmpty }) => isEmpty).map(({ tile }) => tile);

const getWord = (cells: Cell[]): string => cells.map(String).join('');

const getBlanks = (tiles: Tile[]): Tile[] => tiles.filter(({ isBlank }) => isBlank);

const getTilesCharacters = (tiles: Tile[]): string => getNonBlankCharacters(tiles).sort(charactersComparator).join('');

const getNonBlankCharacters = (tiles: Tile[]): string[] => getNonBlanks(tiles).map(({ character }) => character);

const getNonBlanks = (tiles: Tile[]): Tile[] => tiles.filter(({ isBlank }) => !isBlank);

const getPointsRatio = (tiles: Tile[], points: number): number => points / tiles.length;

const charactersComparator = (a: string, b: string): number => a.localeCompare(b);

export default Result;
