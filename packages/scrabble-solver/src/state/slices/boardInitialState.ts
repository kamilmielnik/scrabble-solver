import { getLocaleConfig } from '@scrabble-solver/configs';
import { Board } from '@scrabble-solver/models';

import settingsInitialState from './settingsInitialState';

const { configId, locale } = settingsInitialState;
const { boardHeight, boardWidth } = getLocaleConfig(configId, locale);
const boardInitialState: Board = Board.create(boardWidth, boardHeight);

export default boardInitialState;
