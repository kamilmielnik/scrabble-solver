import Cell from './Cell';
import ResultJson from './ResultJson';
import Tile from './Tile';

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
    this.cells = cells;
    this.id = id;
    this.length = cells.length;
    this.numberOfBlanks = getBlanks(tiles).length;
    this.numberOfCollisions = numberOfCollisions;
    this.numberOfTiles = tiles.length;
    this.points = points;
    this.pointsRatio = getPointsRatio(tiles, points);
    this.tiles = tiles;
    this.tilesCharacters = getTilesCharacters(tiles);
    this.word = getWord(cells);
  }

  public toJson(): ResultJson {
    return {
      cells: this.cells.map((cell) => cell.toJson()),
      id: this.id,
      numberOfCollisions: this.numberOfCollisions,
      points: this.points
    };
  }
}

const charactersComparator = (a: string, b: string): number => a.localeCompare(b);

const getBlanks = (tiles: Tile[]): Tile[] => tiles.filter(({ isBlank }) => isBlank);

const getNonBlankCharacters = (tiles: Tile[]): string[] => getNonBlanks(tiles).map(({ character }) => character);

const getNonBlanks = (tiles: Tile[]): Tile[] => tiles.filter(({ isBlank }) => !isBlank);

const getPointsRatio = (tiles: Tile[], points: number): number => points / tiles.length;

const getTiles = (cells: Cell[]): Tile[] => cells.filter(({ isEmpty }) => isEmpty).map(({ tile }) => tile);

const getTilesCharacters = (tiles: Tile[]): string => getNonBlankCharacters(tiles).sort(charactersComparator).join('');

const getWord = (cells: Cell[]): string => cells.map(String).join('');

export default Result;
