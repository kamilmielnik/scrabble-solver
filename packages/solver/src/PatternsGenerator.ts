import { Board, Cell, Config, HorizontalPattern, Pattern, VerticalPattern } from '@scrabble-solver/models';

class PatternsGenerator {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public generate(board: Board): { horizontal: Pattern[]; vertical: Pattern[] } {
    return {
      horizontal: this.generatePatterns({
        board,
        getNthVector: (index) => board.getRow(index),
        numberOfVectors: this.config.boardHeight,
        PatternModel: HorizontalPattern
      }),
      vertical: this.generatePatterns({
        board,
        getNthVector: (index) => board.getColumn(index),
        numberOfVectors: this.config.boardWidth,
        PatternModel: VerticalPattern
      })
    };
  }

  public generatePatterns({
    board,
    getNthVector,
    numberOfVectors,
    PatternModel
  }: {
    board: Board;
    getNthVector: (index: number) => Cell[];
    numberOfVectors: number;
    PatternModel: new (parameters: { board: Board; cells: Cell[] }) => Pattern;
  }): Pattern[] {
    return this.generateVectors({ getNthVector, numberOfVectors }).reduce<Pattern[]>(
      (patterns, cells) => patterns.concat(this.generateCellsPatterns({ board, PatternModel, cells })),
      []
    );
  }

  public generateVectors({
    getNthVector,
    numberOfVectors
  }: {
    getNthVector: (index: number) => Cell[];
    numberOfVectors: number;
  }): Cell[][] {
    return Array(numberOfVectors)
      .fill(0)
      .map((_, index) => getNthVector(index));
  }

  public generateCellsPatterns({
    board,
    cells,
    PatternModel
  }: {
    board: Board;
    cells: Cell[];
    PatternModel: new (parameters: { board: Board; cells: Cell[] }) => Pattern;
  }): Pattern[] {
    return this.generateStartIndices({ cells }).reduce<Pattern[]>(
      (patterns, startIndex) =>
        patterns.concat(
          this.generateEndIndices({ cells, startIndex }).reduce<Pattern[]>((placeablePatterns, endIndex) => {
            const pattern = new PatternModel({
              board,
              cells: cells.slice(startIndex, endIndex + 1)
            });
            if (pattern.canBePlaced()) {
              placeablePatterns.push(pattern);
            }
            return placeablePatterns;
          }, [])
        ),
      []
    );
  }

  public generateStartIndices({ cells }: { cells: Cell[] }): number[] {
    return Array(cells.length - 1)
      .fill(0)
      .map((_, startIndex) => startIndex)
      .filter((startIndex) => startIndex === 0 || !cells[startIndex - 1].hasTile());
  }

  generateEndIndices({ cells, startIndex }: { cells: Cell[]; startIndex: number }): number[] {
    return Array(cells.length - startIndex - 1)
      .fill(0)
      .map((_, endIndex) => endIndex + startIndex + 1)
      .filter((endIndex) => endIndex >= cells.length - 1 || !cells[endIndex + 1].hasTile());
  }
}

export default PatternsGenerator;
