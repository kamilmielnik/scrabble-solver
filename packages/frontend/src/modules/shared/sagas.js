import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { Result } from '@scrabble-solver/models';

import { applyResult, selectBoard } from 'board';
import { CHANGE_CONFIG, selectConfigId } from 'config';
import { changeInput as changeDictionaryInput, submit as submitDictionary } from 'dictionary/state';
import { CHANGE_LOCALE, selectLocale } from 'i18n';
import { HIGHLIGHT_RESULT, UNHIGHLIGHT_RESULT, changeResults, selectResults } from 'results';
import { APPLY_RESULT, changeResultCandidate } from 'result-candidate';
import { SUBMIT as SUBMIT_TILES, removeTiles, selectValidCharacters } from 'tiles';
import { postSolve } from 'api';

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
  yield put(changeDictionaryInput(result.word));
  yield put(submitDictionary());
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
