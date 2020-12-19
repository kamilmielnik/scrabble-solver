import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { Result } from '@scrabble-solver/models';

import { postSolve } from 'api';
import { applyResult, selectBoard } from 'modules/board';
import { CHANGE_CONFIG, selectConfigId } from 'modules/config';
import { CHANGE_LOCALE, selectLocale } from 'modules/i18n';
import {
  APPLY_RESULT,
  HIGHLIGHT_RESULT,
  UNHIGHLIGHT_RESULT,
  changeResultCandidate,
  changeResults,
  selectResults
} from 'modules/results';
import { SUBMIT as SUBMIT_TILES, removeTiles, selectValidCharacters } from 'modules/tiles';

import { submitSolve, submitSolveFailure, submitSolveSuccess } from './state';

export function* sagas() {
  yield takeEvery(APPLY_RESULT, onApplyResult);
  yield takeEvery(HIGHLIGHT_RESULT, onHighlightResult);
  yield takeEvery(UNHIGHLIGHT_RESULT, onUnhighlightResult);
  yield takeLatest([SUBMIT_TILES, CHANGE_CONFIG, CHANGE_LOCALE], onTilesSubmit);
}

function* onApplyResult({ payload: id }) {
  const results = yield select(selectResults);
  const result = getResultById(results, id);
  yield put(applyResult(result));
  yield put(removeTiles(result.tiles));
  yield put(changeResults([]));
}

function* onHighlightResult({ payload: id }) {
  const results = yield select(selectResults);
  const result = getResultById(results, id);
  yield put(changeResultCandidate(result));
}

function* onUnhighlightResult() {
  yield put(changeResultCandidate(null));
}

function* onTilesSubmit() {
  const configId = yield select(selectConfigId);
  const board = yield select(selectBoard);
  const characters = yield select(selectValidCharacters);
  const locale = yield select(selectLocale);
  if (characters.length > 0) {
    try {
      yield put(submitSolve());
      const results = yield call(postSolve, {
        board: board.toJson(),
        characters,
        configId,
        locale
      });
      yield put(submitSolveSuccess());
      yield put(changeResults(results.map(Result.fromJson)));
    } catch (error) {
      yield put(changeResults([]));
      yield put(submitSolveFailure(error));
    }
  }
}

const getResultById = (results, id) => results.find((result) => result.id === id);
