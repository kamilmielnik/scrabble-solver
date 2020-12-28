import { combineReducers } from 'redux';

import board from './board';
import config from './config';
import i18n from './i18n';
import results from './results';
import solve from './solve';
import tiles from './tiles';

const rootReducer = combineReducers({
  board: board.reducer,
  config: config.reducer,
  i18n: i18n.reducer,
  results: results.reducer,
  solve: solve.reducer,
  tiles: tiles.reducer,
});

export default rootReducer;
