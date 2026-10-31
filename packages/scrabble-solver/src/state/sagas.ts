/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type PayloadAction } from '@reduxjs/toolkit';
import { hasConfig, languages } from '@scrabble-solver/configs';
import { type Result, Board, Locale } from '@scrabble-solver/types';
import { call, delay, put, select, spawn, takeEvery, takeLatest } from 'redux-saga/effects';

import { LOCALE_FEATURES } from '@/i18n/constants';
import { loadTranslations } from '@/i18n/i18n';
import { fitBoardToSize, fitRackToSize } from '@/lib/fitBoardToSize';
import { memoize } from '@/lib/memoize';
import { waitForFirstIntent, waitForIdleOrFirstIntent } from '@/lib/waitForIdleOrFirstIntent';
import { findWordDefinitions, solve, verify, visit } from '@/sdk';
import { prefetchDictionary } from '@/solver-worker';
import { type VerifiedWord } from '@/types';

import { createBoard, initialize, removeBoard, reset, switchBoard } from './actions';
import { appSlice, selectVersion } from './app';
import { boardSlice, selectBoard } from './board';
import { type BoardSnapshot, boardsSlice, getNextActiveBoardId, getNextBoardId, selectBoards } from './boards';
import { cellFiltersSlice, selectCellFilter, selectCellFilters } from './cellFilters';
import { dictionarySlice, selectDictionary } from './dictionary';
import { hoveredWordSlice } from './hoveredWord';
import { i18nSlice, selectLoadedTranslations } from './i18n';
import { localStorage } from './localStorage';
import { rackSlice, selectCharacters, selectRack } from './rack';
import { resultsSlice } from './results';
import {
  type SettingsState,
  selectConfig,
  selectGame,
  selectLocale,
  selectLocaleAutoGroupTiles,
  selectRemoveCellFilters,
  settingsInitialState,
  settingsSlice,
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
  yield takeLatest([hoveredWordSlice.actions.set.type, hoveredWordSlice.actions.clear.type], onHoveredWordChange);
  yield takeEvery(settingsSlice.actions.changeGame.type, onGameChange);
  yield takeEvery(settingsSlice.actions.changeLocale.type, onLocaleChange);
  yield takeLatest(dictionarySlice.actions.submit.type, onDictionarySubmit);
  yield takeLatest(initialize.type, onInitialize);
  yield takeLatest(reset.type, onReset);
  yield takeLatest(switchBoard.type, onSwitchBoard);
  yield takeLatest(createBoard.type, onCreateBoard);
  yield takeLatest(removeBoard.type, onRemoveBoard);
  yield takeLatest(solveSlice.actions.submit.type, onSolve);
  yield takeLatest(verifySlice.actions.submit.type, onVerify);
}

function* onCellValueChange({ payload }: PayloadAction<{ value: string; x: number; y: number }>): AnyGenerator {
  const filter = yield select((state) => selectCellFilter(state, payload));

  if (filter) {
    yield put(cellFiltersSlice.actions.cancel(payload));
  }

  yield put(resultsSlice.actions.changeResultCandidate(null));
  yield put(hoveredWordSlice.actions.clear());
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
  yield put(hoveredWordSlice.actions.clear());
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

  yield* hydrateBoards();
}

/**
 * Restores the saved boards and loads the one that was last in play.
 *
 * Only the active board's snapshot is read eagerly; the others are read as a
 * group so their tabs can be shown, but each is only turned back into a
 * `Board` when it is actually switched to.
 */
function* hydrateBoards(): AnyGenerator {
  const config = yield select(selectConfig);
  const metadata = localStorage.getBoards();

  if (!metadata) {
    const currentBoard: Board = yield select(selectBoard);
    const currentRack = yield select(selectRack);

    if (currentBoard.rowsCount !== config.boardHeight || currentBoard.columnsCount !== config.boardWidth) {
      yield put(boardSlice.actions.init(Board.create(config.boardWidth, config.boardHeight)));
    }

    if (currentRack.length !== config.rackSize) {
      yield put(rackSlice.actions.init(Array(config.rackSize).fill(null)));
    }

    return;
  }

  const saved: Record<string, BoardSnapshot> = {};

  for (const id of metadata.order) {
    const snapshot = localStorage.getBoardSnapshot(id);

    if (snapshot) {
      saved[id] = snapshot;
    }
  }

  yield put(boardsSlice.actions.init({ metadata, saved }));
  yield* loadBoardSnapshot(saved[metadata.activeId]);
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
  const locale = yield select(selectLocale);
  const game = yield select(selectGame);

  try {
    yield call(visit, { game, locale, referrer: document.referrer, url: location.href });
    // oxlint-disable-next-line no-empty
  } catch {}
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
  yield put(hoveredWordSlice.actions.clear());
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
  yield put(hoveredWordSlice.actions.clear());
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

function* onHoveredWordChange({ payload: word }: PayloadAction<VerifiedWord | undefined>): AnyGenerator {
  if (!word) {
    return;
  }

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

/**
 * Captures everything that belongs to the board currently in play.
 *
 * The active board lives in the `board`, `rack` and `cellFilters` slices
 * rather than in the `boards` collection, so it has to be gathered up before
 * any switch -- see `BoardsState` for why it is arranged that way.
 */
function* snapshotActiveBoard(): AnyGenerator {
  const board: Board = yield select(selectBoard);
  const rack = yield select(selectRack);
  const cellFilters = yield select(selectCellFilters);
  return { board: board.toJson(), cellFilters, rack } satisfies BoardSnapshot;
}

/**
 * Loads a saved board into the slices, fitting it to the configuration in
 * force.
 *
 * The fit matters because the game variant is a global setting: a board saved
 * while playing Scrabble is 15x15, and loading it after switching to Super
 * Scrabble would otherwise leave a 15x15 board in a 21x21 game.
 */
function* loadBoardSnapshot(snapshot: BoardSnapshot | undefined): AnyGenerator {
  const config = yield select(selectConfig);

  if (!snapshot) {
    yield put(boardSlice.actions.init(Board.create(config.boardWidth, config.boardHeight)));
    yield put(rackSlice.actions.init(Array(config.rackSize).fill(null)));
    yield put(cellFiltersSlice.actions.init([]));
    return;
  }

  const board = fitBoardToSize(Board.fromJson(snapshot.board), {
    height: config.boardHeight,
    width: config.boardWidth,
  });

  yield put(boardSlice.actions.init(board));
  yield put(rackSlice.actions.init(fitRackToSize(snapshot.rack, config.rackSize)));
  yield put(cellFiltersSlice.actions.init(snapshot.cellFilters));
}

/** Clears everything derived from whichever board was previously in play. */
function* resetDerivedState(): AnyGenerator {
  yield put(dictionarySlice.actions.reset());
  yield put(hoveredWordSlice.actions.clear());
  yield put(resultsSlice.actions.reset());
  yield put(solveSlice.actions.reset());
  yield put(verifySlice.actions.submit());
}

function* onSwitchBoard({ payload: id }: PayloadAction<string>): AnyGenerator {
  const boards = yield select(selectBoards);

  if (id === boards.activeId || !boards.order.includes(id)) {
    return;
  }

  // Read before dispatching: `activated` drops the incoming board's snapshot
  // from the collection, since it is about to become the active one.
  const incoming = boards.saved[id];
  const snapshot = yield* snapshotActiveBoard();

  yield put(boardsSlice.actions.activated({ id, outgoing: { id: boards.activeId, snapshot } }));
  yield* loadBoardSnapshot(incoming);
  yield* resetDerivedState();
}

function* onCreateBoard(): AnyGenerator {
  const boards = yield select(selectBoards);
  const snapshot = yield* snapshotActiveBoard();
  const id = getNextBoardId(boards);

  yield put(boardsSlice.actions.created({ id, outgoing: { id: boards.activeId, snapshot } }));
  yield* loadBoardSnapshot(undefined);
  yield* resetDerivedState();
}

function* onRemoveBoard({ payload: id }: PayloadAction<string>): AnyGenerator {
  const boards = yield select(selectBoards);

  if (!boards.order.includes(id)) {
    return;
  }

  // The last board is cleared rather than removed: a tab strip with nothing
  // in it has no way back.
  if (boards.order.length === 1) {
    yield put(reset());
    return;
  }

  if (id !== boards.activeId) {
    yield put(boardsSlice.actions.removed({ id }));
    return;
  }

  const nextActiveId = getNextActiveBoardId({ id, order: boards.order });
  const incoming = nextActiveId ? boards.saved[nextActiveId] : undefined;

  yield put(boardsSlice.actions.removed({ id, nextActiveId }));
  yield* loadBoardSnapshot(incoming);
  yield* resetDerivedState();
}
