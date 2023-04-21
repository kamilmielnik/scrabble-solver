import { Board, Config, Pattern } from '@scrabble-solver/types';

import generateHorizontalPatterns from './generateHorizontalPatterns';
import generateVerticalPatterns from './generateVerticalPatterns';

const generatePatterns = (config: Config, board: Board): Pattern[] => {
  const horizontalPatterns = generateHorizontalPatterns(config, board);
  const verticalPatterns = generateVerticalPatterns(config, board);

  return horizontalPatterns.concat(verticalPatterns);
};

export default generatePatterns;
