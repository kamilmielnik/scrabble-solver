import { PayloadAction } from '@reduxjs/toolkit';
import { Result } from '@scrabble-solver/models';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { findWordDefinition, solve } from 'sdk';

import { selectBoard, selectCharacters, selectConfig, selectDictionaryRoot, selectLocale } from './selectors';
import { boardSlice, dictionarySlice, i18nSlice, resultsSlice, solveSlice, tilesSlice } from './slices';

const SUBMIT_DELAY = 100;

export function* rootSaga() {
  yield takeEvery(resultsSlice.actions.applyResult.type, onApplyResult);
  yield takeLatest(dictionarySlice.actions.submit.type, onDictionarySubmit);
  yield takeEvery(i18nSlice.actions.changeLocale.type, onLocaleChange);
  yield takeLatest(solveSlice.actions.submit.type, onSubmit);
  yield takeEvery(resultsSlice.actions.changeResultCandidate.type, onResultCandidateChange);
}

function* onApplyResult({ payload: result }: PayloadAction<Result>) {
  yield put(boardSlice.actions.applyResult(result));
  yield put(tilesSlice.actions.removeTiles(result.tiles));
  yield put(resultsSlice.actions.changeResults([]));
}

function* onDictionarySubmit() {
  yield delay(SUBMIT_DELAY);
  const { input: word } = yield select(selectDictionaryRoot);
  const locale = yield select(selectLocale);

  try {
    const wordDefinition = yield call(findWordDefinition, { locale, word });
    yield put(dictionarySlice.actions.submitSuccess(wordDefinition));
  } catch (error) {
    yield put(dictionarySlice.actions.submitFailure());
  }
}

function* onLocaleChange() {
  yield put(solveSlice.actions.submit());
  yield put(dictionarySlice.actions.reset());
  yield put(resultsSlice.actions.changeResultCandidate(null));
}

function* onResultCandidateChange({ payload: result }: PayloadAction<Result | null>) {
  if (result) {
    yield put(dictionarySlice.actions.changeInput(result.word));
    yield put(dictionarySlice.actions.submit());
  }
}

function* onSubmit() {
  const board = yield select(selectBoard);
  const { config } = yield select(selectConfig);
  const locale = yield select(selectLocale);
  const characters = yield select(selectCharacters);

  try {
    const results = yield call(solve, {
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
