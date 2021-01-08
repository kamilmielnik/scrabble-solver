import { combineReducers } from 'redux';

import {
  boardSlice,
  configIdSlice,
  dictionarySlice,
  i18nSlice,
  resultsSlice,
  settingsSlice,
  solveSlice,
  tilesSlice,
} from './slices';

const rootReducer = combineReducers({
  board: boardSlice.reducer,
  configId: configIdSlice.reducer,
  dictionary: dictionarySlice.reducer,
  i18n: i18nSlice.reducer,
  results: resultsSlice.reducer,
  settings: settingsSlice.reducer,
  solve: solveSlice.reducer,
  tiles: tilesSlice.reducer,
});

export default rootReducer;
