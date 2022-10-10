import { PayloadAction } from '@reduxjs/toolkit';
import { Result } from '@scrabble-solver/types';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { memoize } from 'lib';
import { findWordDefinitions, solve, visit } from 'sdk';

import { initialize, reset } from './actions';
import {
  selectAutoGroupTiles,
  selectBoard,
  selectCharacters,
  selectConfig,
  selectDictionary,
  selectLocale,
} from './selectors';
import { boardSlice, dictionarySlice, rackSlice, resultsSlice, settingsSlice, solveSlice } from './slices';

const SUBMIT_DELAY = 150;

const memoizedFindWordDefinitions = memoize(findWordDefinitions);

// Can't conveniently type generators for sagas yet,
// see: https://github.com/microsoft/TypeScript/issues/43632
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyGenerator = Generator<any, any, any>;

export function* rootSaga(): AnyGenerator {
  yield takeEvery(resultsSlice.actions.applyResult.type, onApplyResult);
  yield takeEvery(resultsSlice.actions.changeResultCandidate.type, onResultCandidateChange);
  yield takeEvery(settingsSlice.actions.changeConfigId.type, onConfigIdChange);
  yield takeEvery(settingsSlice.actions.changeLocale.type, onLocaleChange);
  yield takeLatest(dictionarySlice.actions.submit.type, onDictionarySubmit);
  yield takeLatest(initialize.type, onInitialize);
  yield takeLatest(reset.type, onReset);
  yield takeLatest(solveSlice.actions.submit.type, onSubmit);
}

function* onApplyResult({ payload: result }: PayloadAction<Result>): AnyGenerator {
  const autoGroupTiles = yield select(selectAutoGroupTiles);
  yield put(boardSlice.actions.applyResult(result));
  yield put(rackSlice.actions.removeTiles(result.tiles));
  yield put(rackSlice.actions.groupTiles(autoGroupTiles));
}

function* onConfigIdChange(): AnyGenerator {
  yield put(resultsSlice.actions.reset());
  yield put(solveSlice.actions.submit());
  yield* ensureProperTilesCount();
}

function* onDictionarySubmit(): AnyGenerator {
  const { input: word } = yield select(selectDictionary);
  const locale = yield select(selectLocale);

  if (!memoizedFindWordDefinitions.hasCache(locale, word)) {
    yield delay(SUBMIT_DELAY);
  }

  try {
    const wordDefinitions = yield call(memoizedFindWordDefinitions, locale, word);
    yield put(dictionarySlice.actions.submitSuccess(wordDefinitions));
  } catch (error) {
    yield put(dictionarySlice.actions.submitFailure());
  }
}

function* onInitialize(): AnyGenerator {
  yield call(visit);
  yield* ensureProperTilesCount();
}

function* onReset(): AnyGenerator {
  yield put(boardSlice.actions.reset());
  yield put(dictionarySlice.actions.reset());
  yield put(rackSlice.actions.reset());
  yield put(resultsSlice.actions.reset());
}

function* onLocaleChange(): AnyGenerator {
  yield put(solveSlice.actions.submit());
  yield put(resultsSlice.actions.changeResultCandidate(null));
  yield put(dictionarySlice.actions.reset());
}

function* onResultCandidateChange({ payload: result }: PayloadAction<Result | null>): AnyGenerator {
  if (result) {
    yield put(dictionarySlice.actions.changeInput(result.words.join(', ')));
    yield put(dictionarySlice.actions.submit());
  }
}

function* onSubmit(): AnyGenerator {
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

function* ensureProperTilesCount(): AnyGenerator {
  const { config } = yield select(selectConfig);
  const characters = yield select(selectCharacters);

  if (config.maximumCharactersCount > characters.length) {
    const differenceCount = Math.abs(config.maximumCharactersCount - characters.length);
    yield put(rackSlice.actions.init([...characters, ...Array(differenceCount).fill(null)]));
  } else if (config.maximumCharactersCount < characters.length) {
    const nonNulls = characters.filter(Boolean).slice(0, config.maximumCharactersCount);
    const differenceCount = Math.abs(config.maximumCharactersCount - nonNulls.length);
    const autoGroupTiles = yield select(selectAutoGroupTiles);
    yield put(rackSlice.actions.init([...nonNulls, ...Array(differenceCount).fill(null)]));
    yield put(rackSlice.actions.groupTiles(autoGroupTiles));
  }
}
