import { type Gaddag } from '@kamilmielnik/gaddag';
import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import {
  type Board,
  type Bonus,
  type Cell,
  type Config,
  isMultiplierBingo,
  isScoreBingo,
  type Tile,
} from '@scrabble-solver/types';

interface ReferencePlacement {
  alpha: number;
  isBlank: boolean;
}

/**
 * Brute-force oracle: enumerates every span and rack assignment, validating and
 * scoring moves with the same semantics as MoveGenerator, but without a shred
 * of its cleverness (no GADDAG traversal, no cross-check masks, no anchors).
 */
export class ReferenceSolver {
  private readonly gaddag: Gaddag;
  private readonly config: Config;
  private readonly width: number;
  private readonly height: number;
  private readonly filled: boolean[] = [];
  private readonly boardCharacters: string[] = [];
  private readonly boardScores: number[] = [];
  private readonly boardIsEmpty: boolean;
  private readonly alphabet: string[];
  private readonly rackCounts: number[];
  private blanksLeft = 0;

  private horizontal = true;
  private line = 0;
  private start = 0;
  private end = 0;
  private emptyPositions: number[] = [];
  private placements: ReferencePlacement[] = [];
  private readonly moves = new Set<string>();

  constructor(gaddag: Gaddag, config: Config, board: Board, tiles: Tile[]) {
    this.gaddag = gaddag;
    this.config = config;
    this.width = board.columnsCount;
    this.height = board.rowsCount;

    for (const row of board.rows) {
      for (const cell of row) {
        const hasTile = !cell.isEmpty && cell.hasTile();
        this.filled.push(hasTile);
        this.boardCharacters.push(hasTile ? cell.tile.character : '');
        this.boardScores.push(this.boardTileScore(cell, hasTile));
      }
    }

    this.boardIsEmpty = this.filled.every((isFilled) => !isFilled);
    this.alphabet = config.alphabet;
    this.rackCounts = this.alphabet.map(() => 0);

    for (const tile of tiles) {
      if (tile.isBlank) {
        ++this.blanksLeft;
        continue;
      }

      const alpha = this.alphabet.indexOf(tile.character);

      if (alpha !== -1) {
        ++this.rackCounts[alpha];
      }
    }
  }

  public solve(): string[] {
    for (const horizontal of [true, false]) {
      this.horizontal = horizontal;
      this.enumerateSpans();
    }

    return [...this.moves].sort();
  }

  private get linesCount(): number {
    return this.horizontal ? this.height : this.width;
  }

  private get lineLength(): number {
    return this.horizontal ? this.width : this.height;
  }

  private enumerateSpans(): void {
    const rackTotal = this.rackCounts.reduce((sum, count) => sum + count, this.blanksLeft);

    for (let line = 0; line < this.linesCount; ++line) {
      for (let start = 0; start < this.lineLength; ++start) {
        for (let end = start + 1; end < this.lineLength; ++end) {
          this.line = line;
          this.start = start;
          this.end = end;
          this.trySpan(rackTotal);
        }
      }
    }
  }

  private trySpan(rackTotal: number): void {
    if (!this.isSpanMaximal()) {
      return;
    }

    this.emptyPositions = this.spanPositions().filter((position) => !this.isFilled(position));

    if (this.emptyPositions.length === 0 || this.emptyPositions.length > rackTotal) {
      return;
    }

    this.placements = this.emptyPositions.map(() => ({ alpha: -1, isBlank: false }));
    this.tryPlacements(0);
  }

  private isSpanMaximal(): boolean {
    const beforeFilled = this.start > 0 && this.isFilled(this.start - 1);
    const afterFilled = this.end < this.lineLength - 1 && this.isFilled(this.end + 1);
    return !beforeFilled && !afterFilled;
  }

  private tryPlacements(index: number): void {
    if (!this.gaddag.hasPrefix(this.prefixBefore(index))) {
      return;
    }

    if (index === this.emptyPositions.length) {
      this.tryMove();
      return;
    }

    for (let alpha = 0; alpha < this.alphabet.length; ++alpha) {
      if (this.rackCounts[alpha] > 0) {
        --this.rackCounts[alpha];
        this.placements[index] = { alpha, isBlank: false };
        this.tryPlacements(index + 1);
        ++this.rackCounts[alpha];
      }

      if (this.blanksLeft > 0) {
        --this.blanksLeft;
        this.placements[index] = { alpha, isBlank: true };
        this.tryPlacements(index + 1);
        ++this.blanksLeft;
      }
    }
  }

  private prefixBefore(index: number): string {
    const limit = index < this.emptyPositions.length ? this.emptyPositions[index] : this.end + 1;
    let prefix = '';

    for (let position = this.start; position < limit; ++position) {
      prefix += this.characterAt(position);
    }

    return prefix;
  }

  private tryMove(): void {
    const characters = this.spanPositions().map((position) => this.characterAt(position));

    if (!this.gaddag.has(characters.join(''))) {
      return;
    }

    if (this.hasAdjacentDigraph(characters)) {
      return;
    }

    if (!this.isConnected()) {
      return;
    }

    const crossWords: string[] = [];

    for (const position of this.emptyPositions) {
      const cross = this.crossAt(position);

      if (!cross) {
        continue;
      }

      const crossWord = cross.characters.join('');

      if (!this.gaddag.has(crossWord) || this.hasAdjacentDigraph(cross.characters)) {
        return;
      }

      crossWords.push(crossWord);
    }

    this.moves.add(this.createSignature(characters.join(''), crossWords));
  }

  private hasAdjacentDigraph(characters: string[]): boolean {
    const digraphs = this.config.twoCharacterTiles;
    return characters.some((character, index) => index > 0 && digraphs.includes(characters[index - 1] + character));
  }

  private isConnected(): boolean {
    if (this.boardIsEmpty) {
      const centerLine = Math.floor((this.horizontal ? this.height : this.width) / 2);
      const centerPosition = Math.floor((this.horizontal ? this.width : this.height) / 2);
      return this.line === centerLine && this.start <= centerPosition && centerPosition <= this.end;
    }

    return this.emptyPositions.some((position) => this.touchesBoardTile(position));
  }

  private touchesBoardTile(position: number): boolean {
    const x = this.xOf(position);
    const y = this.yOf(position);
    return (
      this.isFilledAt(x - 1, y) || this.isFilledAt(x + 1, y) || this.isFilledAt(x, y - 1) || this.isFilledAt(x, y + 1)
    );
  }

  private crossAt(position: number): { baseScore: number; characters: string[] } | undefined {
    const dx = this.horizontal ? 0 : 1;
    const dy = this.horizontal ? 1 : 0;
    const [startX, startY] = this.crossRunEnd(position, -dx, -dy);
    const [endX, endY] = this.crossRunEnd(position, dx, dy);

    if (startX === endX && startY === endY) {
      return undefined;
    }

    const characters: string[] = [];
    let baseScore = 0;

    for (let x = startX, y = startY; x <= endX && y <= endY; x += dx, y += dy) {
      if (x === this.xOf(position) && y === this.yOf(position)) {
        characters.push(this.characterAt(position));
        continue;
      }

      const cellIndex = y * this.width + x;
      baseScore += this.boardScores[cellIndex];
      characters.push(this.boardCharacters[cellIndex]);
    }

    return { baseScore, characters };
  }

  private crossRunEnd(position: number, dx: number, dy: number): [number, number] {
    let x = this.xOf(position);
    let y = this.yOf(position);

    while (this.isFilledAt(x + dx, y + dy)) {
      x += dx;
      y += dy;
    }

    return [x, y];
  }

  private score(): number {
    let collisionsScore = 0;
    let mainScore = 0;
    let wordMultiplier = 1;

    for (const position of this.spanPositions()) {
      if (this.isFilled(position)) {
        mainScore += this.boardScores[this.globalIndex(position)];
        continue;
      }

      const placement = this.placementAt(position);
      const bonus = this.bonusAt(position);
      const cellWordMultiplier = bonus?.type === BONUS_WORD ? bonus.multiplier : 1;
      const tileScore = this.tileScore(placement) * this.characterMultiplier(placement, bonus);
      mainScore += tileScore;
      wordMultiplier *= cellWordMultiplier;
      const cross = this.crossAt(position);

      if (cross) {
        collisionsScore += (cross.baseScore + tileScore) * cellWordMultiplier;
      }
    }

    return this.applyBingo(mainScore * wordMultiplier, collisionsScore);
  }

  private applyBingo(wordsScore: number, collisionsScore: number): number {
    if (this.emptyPositions.length !== this.config.rackSize) {
      return wordsScore + collisionsScore;
    }

    const { bingo } = this.config;

    if (isScoreBingo(bingo)) {
      return wordsScore + collisionsScore + bingo.score;
    }

    if (isMultiplierBingo(bingo)) {
      return wordsScore * bingo.multiplier + collisionsScore;
    }

    return wordsScore + collisionsScore;
  }

  private characterMultiplier(placement: ReferencePlacement, bonus: Bonus | undefined): number {
    if (bonus?.type !== BONUS_CHARACTER) {
      return 1;
    }

    const characterScore = this.config.pointsMap[this.alphabet[placement.alpha]] || 0;

    if (typeof bonus.score === 'number' && bonus.score !== characterScore) {
      return 1;
    }

    return bonus.multiplier;
  }

  private tileScore({ alpha, isBlank }: ReferencePlacement): number {
    return isBlank ? this.config.blankScore : this.config.pointsMap[this.alphabet[alpha]] || 0;
  }

  private bonusAt(position: number): Bonus | undefined {
    const x = this.xOf(position);
    const y = this.yOf(position);
    return this.config.bonuses.find((bonus) => bonus.x === x && bonus.y === y);
  }

  private createSignature(mainWord: string, crossWords: string[]): string {
    const placed = this.emptyPositions
      .map((position, index) => {
        const { alpha, isBlank } = this.placements[index];
        return `${this.xOf(position)},${this.yOf(position)},${this.alphabet[alpha]},${isBlank ? 1 : 0}`;
      })
      .sort()
      .join(' ');
    const words = [mainWord, ...crossWords].sort().join(' ');
    return `${placed} | ${words} | ${this.score()}`;
  }

  private boardTileScore(cell: Cell, hasTile: boolean): number {
    if (!hasTile) {
      return 0;
    }

    if (cell.tile.isBlank) {
      return this.config.blankScore;
    }

    return this.config.pointsMap[cell.tile.character] || 0;
  }

  private characterAt(position: number): string {
    if (this.isFilled(position)) {
      return this.boardCharacters[this.globalIndex(position)];
    }

    return this.alphabet[this.placementAt(position).alpha];
  }

  private placementAt(position: number): ReferencePlacement {
    return this.placements[this.emptyPositions.indexOf(position)];
  }

  private spanPositions(): number[] {
    const positions: number[] = [];

    for (let position = this.start; position <= this.end; ++position) {
      positions.push(position);
    }

    return positions;
  }

  private globalIndex(position: number): number {
    return this.yOf(position) * this.width + this.xOf(position);
  }

  private isFilled(position: number): boolean {
    return this.filled[this.globalIndex(position)];
  }

  private isFilledAt(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height && this.filled[y * this.width + x];
  }

  private xOf(position: number): number {
    return this.horizontal ? position : this.line;
  }

  private yOf(position: number): number {
    return this.horizontal ? this.line : position;
  }
}
