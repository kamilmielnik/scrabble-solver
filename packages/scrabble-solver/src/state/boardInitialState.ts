import { Board } from '@scrabble-solver/models';

import configInitialState from './configInitialState';
import i18nInitialState from './i18nInitialState';

const { locale } = i18nInitialState;
const { boardHeight, boardWidth } = configInitialState[locale];
const boardInitialState: Board = Board.create(boardWidth, boardHeight);

export default boardInitialState;
