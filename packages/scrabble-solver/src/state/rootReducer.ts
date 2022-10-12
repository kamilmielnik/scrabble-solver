import { combineReducers } from 'redux';

import {
  boardSlice,
  dictionarySlice,
  cellFilterSlice,
  rackSlice,
  resultsSlice,
  settingsSlice,
  solveSlice,
  verifySlice,
} from './slices';

const rootReducer = combineReducers({
  board: boardSlice.reducer,
  cellFilter: cellFilterSlice.reducer,
  dictionary: dictionarySlice.reducer,
  rack: rackSlice.reducer,
  results: resultsSlice.reducer,
  settings: settingsSlice.reducer,
  solve: solveSlice.reducer,
  verify: verifySlice.reducer,
});

export default rootReducer;
