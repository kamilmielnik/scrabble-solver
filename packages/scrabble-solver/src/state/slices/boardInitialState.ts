import { getLocaleConfig } from '@scrabble-solver/configs';
import { Board } from '@scrabble-solver/models';

import configIdInitialState from './configIdInitialState';
import i18nInitialState from './i18nInitialState';

const { locale } = i18nInitialState;
const { boardHeight, boardWidth } = getLocaleConfig(configIdInitialState, locale);
const boardInitialState: Board = Board.create(boardWidth, boardHeight);

export default boardInitialState;
