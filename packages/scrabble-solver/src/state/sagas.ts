import { PayloadAction } from '@reduxjs/toolkit';
import { Result } from '@scrabble-solver/types';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { memoize } from 'lib';
import { findWordDefinition, solve, visit } from 'sdk';

import { initialize } from './actions';
import {
  selectAutoGroupTiles,
  selectBoard,
  selectCharacters,
  selectConfig,
  selectDictionaryRoot,
  selectLocale,
} from './selectors';
import { boardSlice, dictionarySlice, resultsSlice, settingsSlice, solveSlice, tilesSlice } from './slices';

const SUBMIT_DELAY = 150;

const memoizedFindWordDefinition = memoize(findWordDefinition);

export function* rootSaga(): Generator {
  yield takeEvery(resultsSlice.actions.applyResult.type, onApplyResult);
  yield takeEvery(resultsSlice.actions.changeResultCandidate.type, onResultCandidateChange);
  yield takeEvery(settingsSlice.actions.changeConfigId.type, onConfigIdChange);
  yield takeEvery(settingsSlice.actions.changeLocale.type, onLocaleChange);
  yield takeLatest(dictionarySlice.actions.submit.type, onDictionarySubmit);
  yield takeLatest(initialize.type, onInitialize);
  yield takeLatest(solveSlice.actions.submit.type, onSubmit);
}

function* onApplyResult({ payload: result }: PayloadAction<Result>) {
  const autoGroupTiles = yield select(selectAutoGroupTiles);
  yield put(boardSlice.actions.applyResult(result));
  yield put(tilesSlice.actions.removeTiles(result.tiles));
  yield put(tilesSlice.actions.groupTiles(autoGroupTiles));
}

function* onConfigIdChange() {
  yield put(resultsSlice.actions.reset());
  yield put(solveSlice.actions.submit());
  yield* ensureProperTilesCount();
}

function* onDictionarySubmit() {
  const { input: word } = yield select(selectDictionaryRoot);
  const locale = yield select(selectLocale);

  if (!memoizedFindWordDefinition.hasCache(locale, word)) {
    yield delay(SUBMIT_DELAY);
  }

  try {
    const wordDefinition = yield call(memoizedFindWordDefinition, locale, word);
    yield put(dictionarySlice.actions.submitSuccess(wordDefinition));
  } catch (error) {
    yield put(dictionarySlice.actions.submitFailure());
  }
}

function* onInitialize() {
  yield call(visit);
  yield* ensureProperTilesCount();
}

function* onLocaleChange() {
  yield put(solveSlice.actions.submit());
  yield put(resultsSlice.actions.changeResultCandidate(null));
  yield put(dictionarySlice.actions.reset());
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

  if (characters.length === 0) {
    yield put(solveSlice.actions.submitSuccess({ board, characters }));
    yield put(resultsSlice.actions.changeResults([]));
    return;
  }

  try {
    const results = yield call(solve, {
      board: board.toJson(),
      characters,
      configId: config.id,
      locale,
    });
    yield put(solveSlice.actions.submitSuccess({ board, characters }));
    yield put(resultsSlice.actions.changeResults(results.map(Result.fromJson)));
  } catch (error) {
    yield put(resultsSlice.actions.changeResults([]));
    yield put(solveSlice.actions.submitFailure());
  }
}

function* ensureProperTilesCount() {
  const { config } = yield select(selectConfig);
  const characters = yield select(selectCharacters);

  if (config.maximumNumberOfCharacters > characters.length) {
    const differenceCount = Math.abs(config.maximumNumberOfCharacters - characters.length);
    yield put(tilesSlice.actions.init([...characters, ...Array(differenceCount).fill(null)]));
  } else if (config.maximumNumberOfCharacters < characters.length) {
    const nonNulls = characters.filter(Boolean).slice(0, config.maximumNumberOfCharacters);
    const differenceCount = Math.abs(config.maximumNumberOfCharacters - nonNulls.length);
    const autoGroupTiles = yield select(selectAutoGroupTiles);
    yield put(tilesSlice.actions.init([...nonNulls, ...Array(differenceCount).fill(null)]));
    yield put(tilesSlice.actions.groupTiles(autoGroupTiles));
  }
}
