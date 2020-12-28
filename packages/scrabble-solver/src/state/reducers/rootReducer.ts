import { combineReducers } from 'redux';

import board from './board';
import config from './config';
import i18n from './i18n';
import results from './results';
import tiles from './tiles';
import solve from './solve';

const rootReducer = combineReducers({
  board: board.reducer,
  config: config.reducer,
  i18n: i18n.reducer,
  results: results.reducer,
  tiles: tiles.reducer,
  solve: solve.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
