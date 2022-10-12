import { Board, Config, HorizontalPattern, Pattern } from '@scrabble-solver/types';

import generatePattern from './generatePattern';
import generateVectors from './generateVectors';

const generateHorizontalPatterns = (config: Config, board: Board): Pattern[] => {
  const getNthVector = (index: number) => board.getRow(index);
  const vectorsCount = config.boardHeight;
  const horizontalVectors = generateVectors({ getNthVector, vectorsCount });
  const horizontalPatterns = horizontalVectors.flatMap((cells) => {
    return generatePattern({ board, config, PatternModel: HorizontalPattern, cells });
  });

  return horizontalPatterns;
};

export default generateHorizontalPatterns;
