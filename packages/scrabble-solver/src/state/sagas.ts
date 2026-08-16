/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type PayloadAction } from '@reduxjs/toolkit';
import { hasConfig, languages } from '@scrabble-solver/configs';
import { Board, type BoardWord, Locale, type Result } from '@scrabble-solver/types';
import { call, delay, put, select, spawn, takeEvery, takeLatest } from 'redux-saga/effects';

import { LOCALE_FEATURES } from '@/i18n/constants';
import { loadTranslations } from '@/i18n/i18n';
import { memoize } from '@/lib/memoize';
import { waitForFirstIntent, waitForIdleOrFirstIntent } from '@/lib/waitForIdleOrFirstIntent';
import { findWordDefinitions, solve, verify, visit } from '@/sdk';
import { prefetchDictionary } from '@/solver-worker';

import { initialize, reset } from './actions';
import { appSlice, selectVersion } from './app';
import { boardSlice, selectBoard } from './board';
import { cellFiltersSlice, selectCellFilter } from './cellFilters';
import { dictionarySlice, selectDictionary } from './dictionary';
import { hoveredWordSlice } from './hoveredWord';
import { i18nSlice, selectLoadedTranslations } from './i18n';
import { localStorage } from './localStorage';
import { rackSlice, selectCharacters, selectRack } from './rack';
import { resultsSlice } from './results';
import {
  selectConfig,
  selectGame,
  selectLocale,
  selectLocaleAutoGroupTiles,
  selectRemoveCellFilters,
  settingsInitialState,
  settingsSlice,
  type SettingsState,
} from './settings';
import { guessLocale } from './settings/lib';
import { solveSlice } from './solve';
import { verifySlice } from './verify';

const SUBMIT_DELAY = 150;

const memoizedFindWordDefinitions = memoize(findWordDefinitions);

// Can't conveniently type generators for sagas yet,
// see: https://github.com/microsoft/TypeScript/issues/43632
type AnyGenerator = Generator<any, any, any>;

export function* rootSaga(): AnyGenerator {
  yield takeEvery(boardSlice.actions.changeCellValue.type, onCellValueChange);
  yield takeEvery([rackSlice.actions.changeCharacter.type, rackSlice.actions.changeCharacters.type], onRackValueChange);
  yield takeEvery(resultsSlice.actions.applyResult.type, onApplyResult);
  yield takeLatest(resultsSlice.actions.changeResultCandidate.type, onResultCandidateChange);
  yield takeLatest(hoveredWordSlice.actions.set.type, onHoveredWordChange);
  yield takeEvery(settingsSlice.actions.changeGame.type, onGameChange);
  yield takeEvery(settingsSlice.actions.changeLocale.type, onLocaleChange);
  yield takeLatest(dictionarySlice.actions.submit.type, onDictionarySubmit);
  yield takeLatest(initialize.type, onInitialize);
  yield takeLatest(reset.type, onReset);
  yield takeLatest(solveSlice.actions.submit.type, onSolve);
  yield takeLatest(verifySlice.actions.submit.type, onVerify);
}

function* onCellValueChange({ payload }: PayloadAction<{ value: string; x: number; y: number }>): AnyGenerator {
  const filter = yield select((state) => selectCellFilter(state, payload));

  if (filter) {
    yield put(cellFiltersSlice.actions.cancel(payload));
  }

  yield put(resultsSlice.actions.changeResultCandidate(null));
  yield put(verifySlice.actions.submit());
}

function* onRackValueChange(): AnyGenerator {
  yield put(resultsSlice.actions.changeResultCandidate(null));
}

function* onApplyResult({ payload: result }: PayloadAction<Result>): AnyGenerator {
  const autoGroupTiles = yield select(selectLocaleAutoGroupTiles);
  const removeCellFilters = yield select(selectRemoveCellFilters);
  yield put(boardSlice.actions.applyResult(result));
  if (removeCellFilters === 'never') {
    yield put(cellFiltersSlice.actions.removeCells(result.cells));
  } else {
    yield put(cellFiltersSlice.actions.reset());
  }
  yield put(rackSlice.actions.removeTiles(result.tiles));
  yield put(rackSlice.actions.groupTiles(autoGroupTiles));
  yield put(verifySlice.actions.submit());
}

function* onGameChange(): AnyGenerator {
  const characters = yield select(selectCharacters);

  if (characters.length > 0) {
    yield put(solveSlice.actions.submit());
  } else {
    yield put(resultsSlice.actions.reset());
  }

  yield put(resultsSlice.actions.reset());
  yield* resetRack();
  yield put(verifySlice.actions.submit());
}

function* onDictionarySubmit(): AnyGenerator {
  const { input: word } = yield select(selectDictionary);
  const locale = yield select(selectLocale);

  if (!memoizedFindWordDefinitions.hasCache(locale, word)) {
    yield delay(SUBMIT_DELAY);
  }

  try {
    const wordDefinitions = yield call(memoizedFindWordDefinitions, locale, word);
    const { input: currentWord } = yield select(selectDictionary);

    if (word === currentWord) {
      yield put(dictionarySlice.actions.submitSuccess(wordDefinitions));
    }
  } catch (error) {
    const { input: currentWord } = yield select(selectDictionary);

    if (word === currentWord) {
      yield put(dictionarySlice.actions.submitFailure(error));
    }
  }
}

function* onInitialize({ payload }: PayloadAction<{ version: string }>): AnyGenerator {
  try {
    yield* hydratePersistedState(payload.version);
    // oxlint-disable-next-line no-empty
  } catch {
  } finally {
    yield put(appSlice.actions.hydrated());
  }

  const board = yield select(selectBoard);
  const locale = yield select(selectLocale);

  yield spawn(prefetchDictionaryOnFirstIntent);
  yield spawn(loadLocaleTranslations, locale);
  yield spawn(preloadTranslationsWhenIdle);
  yield spawn(visitWhenIdle);

  if (!board.isEmpty()) {
    yield* resetRack();
    yield put(verifySlice.actions.submit());
  }
}

function* hydratePersistedState(version: string): AnyGenerator {
  const isTouchScreen = globalThis.matchMedia?.('(hover: none)').matches ?? false;
  const settings: Pick<SettingsState, 'game' | 'inputMode' | 'locale'> & Partial<SettingsState> = {
    game: settingsInitialState.game,
    inputMode: isTouchScreen ? ('touchscreen' as const) : ('keyboard' as const),
    locale: guessLocale(),
    ...localStorage.getSettings(),
  };

  if (!hasConfig(settings.game, settings.locale)) {
    const localeDefault = Object.values(languages).find((config) => config.locale === settings.locale);
    settings.game = localeDefault?.game ?? settingsInitialState.game;
    settings.locale = localeDefault?.locale ?? guessLocale();
  }

  yield put(settingsSlice.actions.init(settings));
  yield* hydratePersistedTranslations(settings.locale, version);

  const config = yield select(selectConfig);
  const currentBoard: Board = yield select(selectBoard);
  const board = localStorage.getBoard();

  if (board) {
    yield put(boardSlice.actions.init(board));
  } else if (currentBoard.rows.length !== config.boardHeight || currentBoard.rows[0].length !== config.boardWidth) {
    yield put(boardSlice.actions.init(Board.create(config.boardWidth, config.boardHeight)));
  }

  const currentRack = yield select(selectRack);
  const rack = localStorage.getRack();

  if (rack) {
    yield put(rackSlice.actions.init(rack));
  } else if (currentRack.length !== config.rackSize) {
    yield put(rackSlice.actions.init(Array(config.rackSize).fill(null)));
  }
}

// Applied synchronously so the first post-hydration paint is already translated
function* hydratePersistedTranslations(locale: Locale, version: string): AnyGenerator {
  const translations = localStorage.getTranslations(locale, version);

  if (translations) {
    yield put(i18nSlice.actions.loaded({ locale, translations }));
  }
}

function* visitWhenIdle(): AnyGenerator {
  yield call(waitForIdleOrFirstIntent);
  yield call(visit);
}

function* prefetchDictionaryOnFirstIntent(): AnyGenerator {
  yield call(waitForFirstIntent);
  const locale = yield select(selectLocale);
  yield call(prefetchDictionary, locale);
}

function* loadLocaleTranslations(locale: Locale): AnyGenerator {
  const loaded = yield select(selectLoadedTranslations);

  if (loaded[locale]) {
    return;
  }

  const translations = yield call(loadTranslations, locale);
  yield put(i18nSlice.actions.loaded({ locale, translations }));

  const activeLocale = yield select(selectLocale);

  if (locale === activeLocale) {
    const version = yield select(selectVersion);
    localStorage.setTranslations(locale, version, translations);
  }
}

// The cache makes the next boot's first paint translated without waiting for a chunk download
function* persistTranslationsCache(locale: Locale): AnyGenerator {
  const loaded = yield select(selectLoadedTranslations);
  const version = yield select(selectVersion);

  if (loaded[locale]) {
    localStorage.setTranslations(locale, version, loaded[locale]);
  }
}

function* preloadTranslationsWhenIdle(): AnyGenerator {
  yield call(waitForIdleOrFirstIntent);

  for (const locale of Object.values(Locale)) {
    yield spawn(loadLocaleTranslations, locale);
  }
}

function* onReset(): AnyGenerator {
  const config = yield select(selectConfig);

  yield put(boardSlice.actions.init(Board.create(config.boardWidth, config.boardHeight)));
  yield put(cellFiltersSlice.actions.reset());
  yield put(dictionarySlice.actions.reset());
  yield put(rackSlice.actions.reset());
  yield put(resultsSlice.actions.reset());
  yield put(solveSlice.actions.reset());
  yield put(verifySlice.actions.submit());
}

function* onLocaleChange({ payload: locale }: PayloadAction<Locale>): AnyGenerator {
  yield spawn(loadLocaleTranslations, locale);
  yield spawn(prefetchDictionary, locale);
  yield* persistTranslationsCache(locale);

  const game = yield select(selectGame);

  if (!hasConfig(game, locale)) {
    const defaultConfig = Object.values(languages).find((config) => config.locale === locale);

    if (defaultConfig) {
      yield put(settingsSlice.actions.changeGame(defaultConfig.game));
    }
  }

  const characters = yield select(selectCharacters);

  if (characters.length > 0) {
    yield put(solveSlice.actions.submit());
  } else {
    yield put(resultsSlice.actions.reset());
  }

  yield put(dictionarySlice.actions.reset());
  yield put(resultsSlice.actions.changeResultCandidate(null));
  yield put(verifySlice.actions.submit());
}

function* onResultCandidateChange({ payload: result }: PayloadAction<Result | null>): AnyGenerator {
  if (!result) {
    return;
  }

  yield put(hoveredWordSlice.actions.clear());
  yield* searchDictionary(result.words);
}

function* onHoveredWordChange({ payload: word }: PayloadAction<BoardWord>): AnyGenerator {
  yield put(resultsSlice.actions.changeResultCandidate(null));

  const board: Board = yield select(selectBoard);
  const collidingWords = board.getCollidingWords(word);

  yield* searchDictionary([word.word, ...collidingWords.map((collidingWord) => collidingWord.word)]);
}

function* searchDictionary(words: string[]): AnyGenerator {
  const locale: Locale = yield select(selectLocale);
  const uniqueWords = Array.from(new Set(words));
  const input = uniqueWords.join(LOCALE_FEATURES[locale].separator);

  if (!memoizedFindWordDefinitions.hasCache(locale, input)) {
    yield delay(SUBMIT_DELAY);
  }

  yield put(dictionarySlice.actions.changeInput(input));
  yield put(dictionarySlice.actions.submit());
}

function* onSolve(): AnyGenerator {
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
      game: config.game,
      locale,
    });
    yield put(resultsSlice.actions.changeResults(results));
    yield put(solveSlice.actions.submitSuccess({ board, characters }));
  } catch (error) {
    yield put(resultsSlice.actions.changeResults([]));
    yield put(solveSlice.actions.submitFailure(error));
  }
}

function* onVerify(): AnyGenerator {
  yield delay(SUBMIT_DELAY);

  const board = yield select(selectBoard);
  const { config } = yield select(selectConfig);
  const locale = yield select(selectLocale);

  try {
    const { invalidWords, validWords } = yield call(verify, {
      board: board.toJson(),
      game: config.game,
      locale,
    });
    yield put(verifySlice.actions.submitSuccess({ board, invalidWords, validWords }));
  } catch (_error) {
    yield put(verifySlice.actions.submitFailure());
  }
}

function* resetRack(): AnyGenerator {
  const { config } = yield select(selectConfig);
  const rack = yield select(selectRack);

  if (config.rackSize > rack.length) {
    const differenceCount = Math.abs(config.rackSize - rack.length);
    yield put(rackSlice.actions.init([...rack, ...Array(differenceCount).fill(null)]));
  } else if (config.rackSize < rack.length) {
    const nonNulls = rack.filter(Boolean).slice(0, config.rackSize);
    const differenceCount = Math.abs(config.rackSize - nonNulls.length);
    const autoGroupTiles = yield select(selectLocaleAutoGroupTiles);
    yield put(rackSlice.actions.init([...nonNulls, ...Array(differenceCount).fill(null)]));
    yield put(rackSlice.actions.groupTiles(autoGroupTiles));
  }
}
