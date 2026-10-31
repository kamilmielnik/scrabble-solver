import { type Action, combineReducers, configureStore } from '@reduxjs/toolkit';
import reduxSaga from 'redux-saga';

import { appSlice } from '../state/app';
import { boardSlice } from '../state/board';
import { cellFiltersSlice } from '../state/cellFilters';
import { dictionarySlice } from '../state/dictionary';
import { hoveredTileSlice } from '../state/hoveredTile';
import { hoveredWordSlice } from '../state/hoveredWord';
import { i18nSlice } from '../state/i18n';
import { rackSlice } from '../state/rack';
import { resultsSlice } from '../state/results';
import { rootSaga } from '../state/sagas';
import { settingsSlice } from '../state/settings';
import { solveSlice } from '../state/solve';
import type { RootState } from '../state/types';
import { verifySlice } from '../state/verify';

interface Options {
  /** Most component tests assert dispatched state, so sagas (and the SDK calls they make) are opt-in. */
  sagas?: boolean;
  state?: Partial<RootState>;
}

const reducer = combineReducers({
  app: appSlice.reducer,
  board: boardSlice.reducer,
  cellFilters: cellFiltersSlice.reducer,
  dictionary: dictionarySlice.reducer,
  hoveredTile: hoveredTileSlice.reducer,
  hoveredWord: hoveredWordSlice.reducer,
  i18n: i18nSlice.reducer,
  rack: rackSlice.reducer,
  results: resultsSlice.reducer,
  settings: settingsSlice.reducer,
  solve: solveSlice.reducer,
  verify: verifySlice.reducer,
});

export function createTestStore({ sagas = false, state }: Options = {}) {
  const sagaMiddleware = reduxSaga();
  const actions: Action[] = [];
  const store = configureStore({
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({ serializableCheck: false }).concat([sagaMiddleware, recordActions(actions)]);
    },
    preloadedState: state as RootState | undefined,
    reducer,
  });

  if (sagas) {
    sagaMiddleware.run(rootSaga);
  }

  return Object.assign(store, { actions });
}

export type TestStore = ReturnType<typeof createTestStore>;

function recordActions(actions: Action[]) {
  return () => (next: (action: unknown) => unknown) => (action: unknown) => {
    actions.push(action as Action);
    return next(action);
  };
}
