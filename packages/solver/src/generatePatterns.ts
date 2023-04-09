import { Board, Config, Pattern } from '@scrabble-solver/types';

import generateHorizontalPatterns from './generateHorizontalPatterns';
import generateVerticalPatterns from './generateVerticalPatterns';

const generatePatterns = (config: Config, board: Board): Pattern[] => {
  const horizontalPatterns = generateHorizontalPatterns(config, board);
  const verticalPatterns = generateVerticalPatterns(config, board);
  const uniqueVerticalPatterns = verticalPatterns.filter((pattern) => {
    const emptyCells = pattern.cells.filter((cell) => cell.isEmpty);

    return horizontalPatterns.every((otherPattern) => {
      const otherEmptyCells = otherPattern.cells.filter((cell) => cell.isEmpty);

      if (emptyCells.length !== otherEmptyCells.length) {
        return true;
      }

      return emptyCells.every((cell1) => {
        return otherEmptyCells.every((cell2) => cell1.x !== cell2.x || cell1.y !== cell2.y);
      });
    });
  });

  return horizontalPatterns.concat(uniqueVerticalPatterns);
};

export default generatePatterns;
