import { combineReducers } from 'redux';

import { boardSlice, configSlice, i18nSlice, resultsSlice, solveSlice, tilesSlice } from './slices';

const rootReducer = combineReducers({
  board: boardSlice.reducer,
  config: configSlice.reducer,
  i18n: i18nSlice.reducer,
  results: resultsSlice.reducer,
  solve: solveSlice.reducer,
  tiles: tilesSlice.reducer,
});

export default rootReducer;
