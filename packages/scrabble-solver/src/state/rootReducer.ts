import { combineReducers } from 'redux';

import {
  boardSlice,
  dictionarySlice,
  cellFilterSlice,
  rackSlice,
  resultsSlice,
  settingsSlice,
  solveSlice,
} from './slices';

const rootReducer = combineReducers({
  board: boardSlice.reducer,
  cellFilter: cellFilterSlice.reducer,
  dictionary: dictionarySlice.reducer,
  rack: rackSlice.reducer,
  results: resultsSlice.reducer,
  settings: settingsSlice.reducer,
  solve: solveSlice.reducer,
});

export default rootReducer;
