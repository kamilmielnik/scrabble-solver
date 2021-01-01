import { PayloadAction } from '@reduxjs/toolkit';
import { Result } from '@scrabble-solver/models';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { solve } from 'api';

import { board as boardSlice, i18n, results as resultsSlice, solve as solveSlice, tiles } from './reducers';
import { selectBoard, selectCharacters, selectConfig, selectLocale } from './selectors';

export function* rootSaga() {
  yield takeEvery(resultsSlice.actions.applyResult.type, onApplyResult);
  yield takeEvery(i18n.actions.changeLocale.type, onLocaleChange);
  yield takeLatest(solveSlice.actions.submit.type, onSubmit);
}

function* onApplyResult({ payload: result }: PayloadAction<Result>) {
  yield put(boardSlice.actions.applyResult(result));
  yield put(tiles.actions.removeTiles(result.tiles));
  yield put(resultsSlice.actions.changeResults([]));
}

function* onLocaleChange() {
  yield put(solveSlice.actions.submit());
}

function* onSubmit() {
  const board = yield select(selectBoard);
  const { config } = yield select(selectConfig);
  const locale = yield select(selectLocale);
  const characters = yield select(selectCharacters);

  try {
    const results = yield call(solve, {
      // TODO: send proper params
      board: board.toJson(),
      characters,
      configId: config.id,
      locale,
    });
    yield put(solveSlice.actions.submitSuccess());
    yield put(resultsSlice.actions.changeResults(results.map(Result.fromJson)));
  } catch (error) {
    yield put(resultsSlice.actions.changeResults([]));
    yield put(solveSlice.actions.submitFailure());
  }
}
