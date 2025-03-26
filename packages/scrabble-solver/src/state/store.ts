import { configureStore } from '@reduxjs/toolkit';
import reduxSaga from 'redux-saga';

import { rootSaga } from './sagas';
import {
  boardSlice,
  cellFiltersSlice,
  dictionarySlice,
  rackSlice,
  resultsSlice,
  settingsSlice,
  solveSlice,
  verifySlice,
} from './slices';

const sagaMiddleware = reduxSaga();

export const store = configureStore({
  reducer: {
    board: boardSlice.reducer,
    cellFilters: cellFiltersSlice.reducer,
    dictionary: dictionarySlice.reducer,
    rack: rackSlice.reducer,
    results: resultsSlice.reducer,
    settings: settingsSlice.reducer,
    solve: solveSlice.reducer,
    verify: verifySlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([sagaMiddleware]),
});

sagaMiddleware.run(rootSaga);
