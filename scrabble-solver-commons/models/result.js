import Cell from './cell';

class Result {
  constructor({ id, points, cells, numberOfCollisions }) {
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

  toJson() {
    return {
      id: this.id,
      points: this.points,
      cells: this.cells.map((cell) => cell.toJson()),
      numberOfCollisions: this.numberOfCollisions
    };
  }

  static fromJson(json) {
    return new Result({
      id: json.id,
      points: json.points,
      cells: json.cells.map(Cell.fromJson),
      numberOfCollisions: json.numberOfCollisions
    });
  }
}

const getTiles = (cells) => cells.filter(({ isEmpty }) => isEmpty).map(({ tile }) => tile);
const getWord = (cells) => cells.map(String).join('');
const getBlanks = (tiles) => tiles.filter(({ isBlank }) => isBlank);
const getTilesCharacters = (tiles) => getNonBlankCharacters(tiles).sort(charactersComparator).join('');
const getNonBlankCharacters = (tiles) => getNonBlanks(tiles).map(({ character }) => character);
const getNonBlanks = (tiles) => tiles.filter(({ isBlank }) => !isBlank);
const getPointsRatio = (tiles, points) => points / tiles.length;
const charactersComparator = (a, b) => a.localeCompare(b);

export default Result;
