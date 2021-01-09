import { getLocaleConfig } from '@scrabble-solver/configs';
import { Board } from '@scrabble-solver/models';

import i18nInitialState from './i18nInitialState';
import settingsInitialState from './settingsInitialState';

const { locale } = i18nInitialState;
const { boardHeight, boardWidth } = getLocaleConfig(settingsInitialState.configId, locale);
const boardInitialState: Board = Board.create(boardWidth, boardHeight);

export default boardInitialState;
