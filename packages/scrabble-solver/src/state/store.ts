import { configureStore } from '@reduxjs/toolkit';
import reduxSaga from 'redux-saga';

import { boardSlice } from './board';
import { cellFiltersSlice } from './cellFilters';
import { dictionarySlice } from './dictionary';
import { rackSlice } from './rack';
import { resultsSlice } from './results';
import { rootSaga } from './sagas';
import { settingsSlice } from './settings';
import { solveSlice } from './solve';
import { verifySlice } from './verify';

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
