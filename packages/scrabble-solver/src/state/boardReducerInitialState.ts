import { Board } from '@scrabble-solver/models';

import configReducerInitialState from './configReducerInitialState';
import i18nReducerInitialState from './i18nReducerInitialState';

const { locale } = i18nReducerInitialState;
const { boardHeight, boardWidth } = configReducerInitialState[locale];
const boardReducerInitialState: Board = Board.create(boardWidth, boardHeight);

export default boardReducerInitialState;
