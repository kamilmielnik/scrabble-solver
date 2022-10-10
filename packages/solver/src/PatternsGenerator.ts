import { Board, Cell, Config, HorizontalPattern, Pattern, VerticalPattern } from '@scrabble-solver/types';

class PatternsGenerator {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public generate(board: Board): Pattern[] {
    return [...this.generateHorizontal(board), ...this.generateVertical(board)];
  }

  public generateHorizontal(board: Board): HorizontalPattern[] {
    return this.generatePatterns({
      board,
      getNthVector: (index) => board.getRow(index),
      PatternModel: HorizontalPattern,
      vectorsCount: this.config.boardHeight,
    });
  }

  public generateVertical(board: Board): VerticalPattern[] {
    return this.generatePatterns({
      board,
      getNthVector: (index) => board.getColumn(index),
      PatternModel: VerticalPattern,
      vectorsCount: this.config.boardWidth,
    });
  }

  public generatePatterns<P extends Pattern>({
    board,
    getNthVector,
    vectorsCount,
    PatternModel,
  }: {
    board: Board;
    getNthVector: (index: number) => Cell[];
    PatternModel: new (parameters: { board: Board; cells: Cell[] }) => P;
    vectorsCount: number;
  }): P[] {
    return this.generateVectors({ getNthVector, vectorsCount }).reduce<P[]>((patterns, cells) => {
      return patterns.concat(this.generateCellsPatterns<P>({ board, PatternModel, cells }));
    }, []);
  }

  public generateVectors({
    getNthVector,
    vectorsCount,
  }: {
    getNthVector: (index: number) => Cell[];
    vectorsCount: number;
  }): Cell[][] {
    return Array(vectorsCount)
      .fill(0)
      .map((_, index) => getNthVector(index));
  }

  public generateCellsPatterns<P extends Pattern>({
    board,
    cells,
    PatternModel,
  }: {
    board: Board;
    cells: Cell[];
    PatternModel: new (parameters: { board: Board; cells: Cell[] }) => P;
  }): P[] {
    return this.generateStartIndices(cells).flatMap((startIndex) => {
      const endIndices = this.generateEndIndices(cells, startIndex);
      const patterns: P[] = [];

      for (const endIndex of endIndices) {
        const pattern = new PatternModel({
          board,
          cells: cells.slice(startIndex, endIndex + 1),
        });

        if (pattern.canBePlaced(this.config)) {
          patterns.push(pattern);
        }
      }

      return patterns;
    });
  }

  public generateStartIndices(cells: Cell[]): number[] {
    return Array(cells.length - 1)
      .fill(0)
      .map((_, startIndex) => startIndex)
      .filter((startIndex) => startIndex === 0 || !cells[startIndex - 1].hasTile());
  }

  public generateEndIndices(cells: Cell[], startIndex: number): number[] {
    return Array(cells.length - startIndex - 1)
      .fill(0)
      .map((_, endIndex) => endIndex + startIndex + 1)
      .filter((endIndex) => endIndex >= cells.length - 1 || !cells[endIndex + 1].hasTile());
  }
}

export default PatternsGenerator;
