import { HorizontalPattern, VerticalPattern } from 'scrabble-solver-commons/models';

class PatternsGenerator {
  constructor(config) {
    this.config = config;
  }

  generate(board) {
    return {
      horizontal: this.generatePatterns({
        board,
        Pattern: HorizontalPattern,
        numberOfVectors: this.config.boardHeight,
        getNthVector: (index) => board.getRow(index)
      }),
      vertical: this.generatePatterns({
        board,
        Pattern: VerticalPattern,
        numberOfVectors: this.config.boardWidth,
        getNthVector: (index) => board.getColumn(index)
      })
    };
  }

  generatePatterns({ board, Pattern, getNthVector, numberOfVectors }) {
    return this.generateVectors({ getNthVector, numberOfVectors })
      .reduce(
        (patterns, cells) => patterns.concat(this.generateCellsPatterns({ board, Pattern, cells })),
        []
      );
  }

  generateVectors({ getNthVector, numberOfVectors }) {
    return Array(numberOfVectors)
      .fill(0)
      .map((_, index) => getNthVector(index));
  }

  generateCellsPatterns({ board, Pattern, cells }) {
    return this.generateStartIndices({ cells })
      .reduce(
        (patterns, startIndex) => patterns.concat(this.generateEndIndices({ cells, startIndex }).reduce(
          (patterns, endIndex) => {
            const pattern = new Pattern({
              board,
              cells: cells.slice(startIndex, endIndex + 1)
            });
            if (pattern.canBePlaced()) {
              patterns.push(pattern);
            }
            return patterns;
          },
          []
        )),
        []
      );
  }

  generateStartIndices({ cells }) {
    return Array(cells.length - 1)
      .fill(0)
      .map((_, startIndex) => startIndex)
      .filter((startIndex) => startIndex === 0 || !cells[startIndex - 1].hasTile());
  }

  generateEndIndices({ cells, startIndex }) {
    return Array(cells.length - startIndex - 1)
      .fill(0)
      .map((_, endIndex) => endIndex + startIndex + 1)
      .filter((endIndex) => endIndex >= cells.length - 1 || !cells[endIndex + 1].hasTile());
  }
}

export default PatternsGenerator;
