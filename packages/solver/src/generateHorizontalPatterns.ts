import { Board, Config, HorizontalPattern, Pattern } from '@scrabble-solver/types';

import generatePattern from './generatePattern';
import generateVectors from './generateVectors';

const generateHorizontalPatterns = (config: Config, board: Board): Pattern[] => {
  const getNthVector = (index: number) => board.getRow(index);
  const horizontalVectors = generateVectors({ getNthVector, vectorsCount: config.boardSize });
  const horizontalPatterns = horizontalVectors.flatMap((cells) => {
    return generatePattern({ board, config, PatternModel: HorizontalPattern, cells });
  });

  return horizontalPatterns;
};

export default generateHorizontalPatterns;
