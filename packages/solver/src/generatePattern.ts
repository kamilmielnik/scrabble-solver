import { Board, Cell, Config, Pattern } from '@scrabble-solver/types';

import generateEndIndices from './generateEndIndices';
import generateStartIndices from './generateStartIndices';

const generatePattern = <P extends Pattern>({
  board,
  cells,
  config,
  PatternModel,
}: {
  board: Board;
  cells: Cell[];
  config: Config;
  PatternModel: new (parameters: { board: Board; cells: Cell[] }) => P;
}): P[] => {
  const startIndices = generateStartIndices(cells);

  return startIndices.flatMap((startIndex) => {
    const endIndices = generateEndIndices(cells, startIndex);
    const patterns: P[] = [];

    for (const endIndex of endIndices) {
      const pattern = new PatternModel({
        board,
        cells: cells.slice(startIndex, endIndex + 1),
      });

      if (pattern.canBePlaced(config)) {
        patterns.push(pattern);
      }
    }

    return patterns;
  });
};

export default generatePattern;
