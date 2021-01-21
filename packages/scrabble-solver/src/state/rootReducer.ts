import { combineReducers } from 'redux';

import { boardSlice, dictionarySlice, rackSlice, resultsSlice, settingsSlice, solveSlice } from './slices';

const rootReducer = combineReducers({
  board: boardSlice.reducer,
  dictionary: dictionarySlice.reducer,
  rack: rackSlice.reducer,
  results: resultsSlice.reducer,
  settings: settingsSlice.reducer,
  solve: solveSlice.reducer,
});

export default rootReducer;
