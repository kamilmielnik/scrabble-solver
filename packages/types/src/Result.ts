import { type Board } from './Board';
import { type Cell } from './Cell';
import { getCells, getCollisions, isConsonant, isVowel } from './lib';
import { type Locale } from './Locale';
import { type ResultJson } from './ResultJson';
import { type Tile } from './Tile';

type Collision = Cell[];

export class Result {
  public static fromJson = (json: ResultJson, board: Board, locale: Locale): Result => {
    const cells = getCells(board, json);

    return new Result({
      cells,
      collisions: getCollisions(board, cells, json.isHorizontal),
      id: json.id,
      locale,
      points: json.points,
    });
  };

  public readonly blanksCount: number;

  public readonly cells: Cell[];

  public readonly collisions: Collision[];

  public readonly consonantsCount: number;

  public readonly id: number;

  public readonly length: number;

  public readonly points: number;

  public readonly pointsRatio: number;

  public readonly tiles: Tile[];

  public readonly tilesCount: number;

  public readonly vowelsCount: number;

  public readonly word: string;

  public readonly words: string[];

  public readonly wordsCount: number;

  constructor({
    cells,
    id,
    collisions,
    locale,
    points,
  }: {
    cells: Cell[];
    id: number;
    collisions: Collision[];
    locale: Locale;
    points: number;
  }) {
    const tiles = getTiles(cells);
    this.blanksCount = getBlanks(tiles).length;
    this.cells = cells;
    this.collisions = collisions;
    this.consonantsCount = tiles.filter((tile) => !tile.isBlank && isConsonant(tile.character, locale)).length;
    this.id = id;
    this.length = cells.length;
    this.points = points;
    this.pointsRatio = getPointsRatio(tiles, points);
    this.tiles = tiles;
    this.tilesCount = tiles.length;
    this.vowelsCount = tiles.filter((tile) => !tile.isBlank && isVowel(tile.character, locale)).length;
    this.word = getWord(cells);
    this.words = getWords(cells, collisions);
    this.wordsCount = 1 + this.collisions.length;
  }

  public toJson(): ResultJson {
    const placed = this.cells.filter((cell) => cell.isEmpty);

    return {
      blankIndices: placed.flatMap((cell, index) => (cell.tile.isBlank ? [index] : [])),
      id: this.id,
      isHorizontal: this.isHorizontal(),
      points: this.points,
      tiles: placed.map((cell) => cell.tile.character),
      x: this.cells[0].x,
      y: this.cells[0].y,
    };
  }

  public isHorizontal(): boolean {
    return this.cells[0].y === this.cells[1].y;
  }

  public isVertical(): boolean {
    return this.cells[0].x === this.cells[1].x;
  }
}

const getBlanks = (tiles: Tile[]): Tile[] => tiles.filter(({ isBlank }) => isBlank);

const getPointsRatio = (tiles: Tile[], points: number): number => points / tiles.length;

const getTiles = (cells: Cell[]): Tile[] => cells.filter(({ isEmpty }) => isEmpty).map(({ tile }) => tile);

const getWord = (cells: Cell[]): string => cells.reduce((word, cell) => word + cell.toString(), '');

const getWords = (cells: Cell[], collisions: Collision[]): string[] => [cells, ...collisions].map(getWord);
