import { Board, Config, Pattern, VerticalPattern } from '@scrabble-solver/types';

import generatePattern from './generatePattern';
import generateVectors from './generateVectors';

const generateVerticalPatterns = (config: Config, board: Board): Pattern[] => {
  const getNthVector = (index: number) => board.getColumn(index);
  const verticalVectors = generateVectors({ getNthVector, vectorsCount: config.boardSize });
  const verticalPatterns = verticalVectors.flatMap((cells) => {
    return generatePattern({ board, config, PatternModel: VerticalPattern, cells });
  });

  return verticalPatterns;
};

export default generateVerticalPatterns;
