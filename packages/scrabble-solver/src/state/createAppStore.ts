import { configureStore } from '@reduxjs/toolkit';
import reduxSaga from 'redux-saga';

import { rootSaga } from './sagas';
import {
  boardSlice,
  cellFilterSlice,
  dictionarySlice,
  rackSlice,
  resultsSlice,
  settingsSlice,
  solveSlice,
  verifySlice,
} from './slices';

const sagaMiddleware = reduxSaga();

const createAppStore = () => {
  const store = configureStore({
    reducer: {
      board: boardSlice.reducer,
      cellFilter: cellFilterSlice.reducer,
      dictionary: dictionarySlice.reducer,
      rack: rackSlice.reducer,
      results: resultsSlice.reducer,
      settings: settingsSlice.reducer,
      solve: solveSlice.reducer,
      verify: verifySlice.reducer,
    },
    middleware: [sagaMiddleware],
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export default createAppStore;
