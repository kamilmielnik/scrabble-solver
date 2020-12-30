import { PayloadAction } from '@reduxjs/toolkit';
import { Result } from '@scrabble-solver/models';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { solve } from 'api';

import { board, i18n, results, solve as solveSlice, tiles } from './reducers';
import { selectBoard, selectCharacters, selectConfig, selectLocale } from './selectors';

export function* rootSaga() {
  yield takeEvery(results.actions.applyResult.type, onApplyResult);
  yield takeEvery(i18n.actions.changeLocale.type, onLocaleChange);
  yield takeLatest(solveSlice.actions.submit.type, onSubmit);
}

function* onApplyResult({ payload: result }: PayloadAction<Result>) {
  yield put(board.actions.applyResult(result));
  yield put(tiles.actions.removeTiles(result.tiles));
  yield put(results.actions.changeResults([]));
}

function* onLocaleChange() {
  yield put(solveSlice.actions.submit());
}

function* onSubmit() {
  const board = yield select(selectBoard);
  const config = yield select(selectConfig);
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
    yield put(results.actions.changeResults(results.map(Result.fromJson)));
  } catch (error) {
    yield put(results.actions.changeResults([]));
    yield put(solveSlice.actions.submitFailure(error));
  }
}
