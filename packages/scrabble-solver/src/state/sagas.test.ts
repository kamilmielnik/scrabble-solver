/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { getConfig, languages } from '@scrabble-solver/configs';
import { type BoardWord, Board, Cell, Game, Locale, Tile, WordDefinition } from '@scrabble-solver/types';
import { afterEach, beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test';

import english from '../i18n/languages/english.json';
import { noop } from '../lib/noop';
import type * as testAsyncModule from '../test/async';
import type * as testFixturesModule from '../test/fixtures';
import type * as testMediaModule from '../test/media';
import type * as testStoreModule from '../test/store';
import { type Translations } from '../types';

import type * as actionsModule from './actions';
import type * as boardModule from './board';
import type * as cellFiltersModule from './cellFilters';
import type * as dictionaryModule from './dictionary';
import type * as hoveredWordModule from './hoveredWord';
import type * as localStorageModule from './localStorage';
import type * as rackModule from './rack';
import type * as resultsModule from './results';
import type * as settingsModule from './settings';
import type * as solveModule from './solve';
import type { RootState } from './types';
import type * as verifyModule from './verify';

const SUBMIT_DELAY = 150;

const sdk = {
  findWordDefinitions: mock((_locale: Locale, _word: string): Promise<WordDefinition[]> => Promise.resolve([])),
  solve: mock((_payload: unknown): Promise<unknown[]> => Promise.resolve([])),
  verify: mock((_payload: unknown): Promise<unknown> => Promise.resolve({ invalidWords: [], validWords: [] })),
  visit: mock((_payload: unknown): Promise<boolean> => Promise.resolve(true)),
};
const prefetchDictionary = mock<(locale: Locale) => void>();
const loadTranslations = mock((_locale: Locale): Promise<Translations> => Promise.resolve(english));
const idle = {
  waitForFirstIntent: mock(() => Promise.resolve()),
  waitForIdleOrFirstIntent: mock(() => Promise.resolve()),
};

await mock.module('@/sdk', () => sdk);
await mock.module('@/solver-worker', () => ({ prefetchDictionary }));
await mock.module('@/lib/waitForIdleOrFirstIntent', () => ({ ...idle, waitForIdle: () => Promise.resolve() }));
await mock.module('@/i18n/i18n', () => ({ englishTranslations: english, loadTranslations }));

const { advanceTimers, createDeferred, flushMicrotasks }: typeof testAsyncModule = await import('../test/async');
const { createResult, createVerifiedWord }: typeof testFixturesModule = await import('../test/fixtures');
const { setViewport }: typeof testMediaModule = await import('../test/media');
const { createTestStore }: typeof testStoreModule = await import('../test/store');
const { initialize, reset }: typeof actionsModule = await import('./actions');
const { boardSlice }: typeof boardModule = await import('./board');
const { cellFiltersSlice }: typeof cellFiltersModule = await import('./cellFilters');
const { dictionarySlice }: typeof dictionaryModule = await import('./dictionary');
const { hoveredWordSlice }: typeof hoveredWordModule = await import('./hoveredWord');
const { localStorage }: typeof localStorageModule = await import('./localStorage');
const { rackSlice }: typeof rackModule = await import('./rack');
const { resultsSlice }: typeof resultsModule = await import('./results');
const { settingsInitialState, settingsSlice }: typeof settingsModule = await import('./settings');
const { solveSlice }: typeof solveModule = await import('./solve');
const { verifySlice }: typeof verifyModule = await import('./verify');

let uniqueWordId = 0;

beforeEach(() => {
  jest.useFakeTimers();

  for (const fn of [...Object.values(sdk), ...Object.values(idle), prefetchDictionary, loadTranslations]) {
    fn.mockClear();
  }

  sdk.findWordDefinitions.mockImplementation(() => Promise.resolve([]));
  sdk.solve.mockImplementation(() => Promise.resolve([]));
  sdk.verify.mockImplementation(() => Promise.resolve({ invalidWords: [], validWords: [] }));
  sdk.visit.mockImplementation(() => Promise.resolve(true));
  loadTranslations.mockImplementation(() => Promise.resolve(english));
  idle.waitForFirstIntent.mockImplementation(() => Promise.resolve());
  idle.waitForIdleOrFirstIntent.mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  jest.useRealTimers();
  mock.restore();
});

describe('changing a board cell', () => {
  it('cancels the cell filter on that cell only', async () => {
    const store = setup({
      cellFilters: [
        { type: 'include', x: 1, y: 1 },
        { type: 'exclude', x: 2, y: 2 },
      ],
    });

    store.dispatch(boardSlice.actions.changeCellValue({ value: 'a', x: 1, y: 1 }));

    expect(store.getState().cellFilters).toEqual([{ type: 'exclude', x: 2, y: 2 }]);
  });

  it('does not touch filters when the cell has none', () => {
    const store = setup();

    store.dispatch(boardSlice.actions.changeCellValue({ value: 'a', x: 1, y: 1 }));

    expect(store.actions.map(({ type }) => type)).not.toContain(cellFiltersSlice.actions.cancel.type);
  });

  it('drops the previewed result and the highlighted word', () => {
    const store = setup({
      hoveredWord: { word: createVerifiedWord() },
      results: { ...initialState().results, candidate: createResult() },
    });

    store.dispatch(boardSlice.actions.changeCellValue({ value: 'a', x: 1, y: 1 }));

    expect(store.getState().results.candidate).toBeNull();
    expect(store.getState().hoveredWord.word).toBeNull();
  });

  it('verifies the new board after the delay', async () => {
    const store = setup();

    store.dispatch(boardSlice.actions.changeCellValue({ value: 'a', x: 0, y: 0 }));

    expect(store.getState().verify.isLoading).toBe(true);
    await advanceTimers(SUBMIT_DELAY - 1);
    expect(sdk.verify).not.toHaveBeenCalled();
    await advanceTimers(1);
    expect(sdk.verify).toHaveBeenCalledTimes(1);
  });
});

describe('changing the rack', () => {
  it.each([
    ['changeCharacter', rackSlice.actions.changeCharacter({ character: 'a', index: 0 })],
    ['changeCharacters', rackSlice.actions.changeCharacters({ characters: ['a'], index: 0 })],
  ])('drops the previewed result on %s', (_name, action) => {
    const store = setup({ results: { ...initialState().results, candidate: createResult() } });

    store.dispatch(action);

    expect(store.getState().results.candidate).toBeNull();
  });
});

describe('applying a result', () => {
  const result = createResult({ word: 'cat', x: 0, y: 0 });

  it('moves the tiles from the rack to the board, then verifies', async () => {
    const store = setup({ rack: ['c', 'x', 'a', 't'] });

    store.dispatch(resultsSlice.actions.applyResult(result));

    expect(store.getState().board.rows[0][0].tile.character).toBe('c');
    expect(store.getState().rack).toEqual([null, 'x', null, null]);
    expect(store.getState().results.results).toBeUndefined();
    await advanceTimers(SUBMIT_DELAY);
    expect(sdk.verify).toHaveBeenCalledTimes(1);
  });

  it('groups the remaining tiles as configured', () => {
    const store = setup({
      rack: ['c', 'x', 'a', 't'],
      settings: { ...settingsInitialState, autoGroupTiles: 'right' },
    });

    store.dispatch(resultsSlice.actions.applyResult(result));

    expect(store.getState().rack).toEqual([null, null, null, 'x']);
  });

  it('mirrors grouping in a right-to-left locale', () => {
    const store = setup({
      rack: ['c', 'x', 'a', 't'],
      settings: { ...settingsInitialState, autoGroupTiles: 'right', game: Game.Scrabble, locale: Locale.FA_IR },
    });

    store.dispatch(resultsSlice.actions.applyResult(result));

    expect(store.getState().rack).toEqual(['x', null, null, null]);
  });

  it("removes every cell filter when removeCellFilters is 'always'", () => {
    const store = setup({ cellFilters: [{ type: 'include', x: 9, y: 9 }] });

    store.dispatch(resultsSlice.actions.applyResult(result));

    expect(store.getState().cellFilters).toEqual([]);
  });

  it("removes only filters under the played cells when removeCellFilters is 'never'", () => {
    const store = setup({
      cellFilters: [
        { type: 'include', x: 0, y: 0 },
        { type: 'include', x: 9, y: 9 },
      ],
      settings: { ...settingsInitialState, removeCellFilters: 'never' },
    });

    store.dispatch(resultsSlice.actions.applyResult(result));

    expect(store.getState().cellFilters).toEqual([{ type: 'include', x: 9, y: 9 }]);
  });
});

describe('changing the game', () => {
  it('solves again when the rack has tiles', async () => {
    const store = setup({ rack: ['a', null] });

    store.dispatch(settingsSlice.actions.changeGame(Game.Scrabble));

    expect(sdk.solve).toHaveBeenCalledTimes(1);
    expect(store.getState().solve.isLoading).toBe(true);
    await flushMicrotasks();
  });

  it('does not solve with an empty rack and clears results', () => {
    const store = setup({ results: { ...initialState().results, results: [createResult()] } });

    store.dispatch(settingsSlice.actions.changeGame(Game.Scrabble));

    expect(sdk.solve).not.toHaveBeenCalled();
    expect(store.getState().results.results).toBeUndefined();
  });

  it('clears the highlighted word and verifies the board', async () => {
    const store = setup({ hoveredWord: { word: createVerifiedWord() } });

    store.dispatch(settingsSlice.actions.changeGame(Game.Scrabble));

    expect(store.getState().hoveredWord.word).toBeNull();
    await advanceTimers(SUBMIT_DELAY);
    expect(sdk.verify).toHaveBeenCalledTimes(1);
  });

  it('grows the rack with empty slots, keeping tiles in place', () => {
    const store = setup({ rack: ['a', null, 'b'] });

    store.dispatch(settingsSlice.actions.changeGame(Game.Scrabble));

    expect(store.getState().rack).toEqual(['a', null, 'b', null, null, null, null]);
  });

  it('shrinks the rack, dropping empty slots before tiles', () => {
    const store = setup({ rack: ['a', null, 'b', null, null, null, 'c', null, 'd'] });

    store.dispatch(settingsSlice.actions.changeGame(Game.Scrabble));

    expect(store.getState().rack).toEqual(['a', 'b', 'c', 'd', null, null, null]);
  });

  it('shrinks a full rack by dropping the last tiles', () => {
    const store = setup({ rack: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'] });

    store.dispatch(settingsSlice.actions.changeGame(Game.Scrabble));

    expect(store.getState().rack).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  });

  it('groups tiles after shrinking', () => {
    const store = setup({
      rack: ['a', null, 'b', null, null, null, null, null],
      settings: { ...settingsInitialState, autoGroupTiles: 'right' },
    });

    store.dispatch(settingsSlice.actions.changeGame(Game.Scrabble));

    expect(store.getState().rack).toEqual([null, null, null, null, null, 'a', 'b']);
  });

  it('leaves a rack of the right size untouched', () => {
    const rack = ['a', null, null, null, null, null, null];
    const store = setup({ rack });

    store.dispatch(settingsSlice.actions.changeGame(Game.Scrabble));

    expect(store.getState().rack).toBe(rack);
  });
});

describe('changing the locale', () => {
  it('loads translations, prefetches the dictionary and caches the translations', async () => {
    const store = setup({ app: { isHydrated: true, version: '1' } });

    store.dispatch(settingsSlice.actions.changeLocale(Locale.PL_PL));
    await flushMicrotasks();

    expect(loadTranslations).toHaveBeenCalledWith(Locale.PL_PL);
    expect(prefetchDictionary).toHaveBeenCalledWith(Locale.PL_PL);
    expect(store.getState().i18n.translations[Locale.PL_PL]).toEqual(english);
    expect(localStorage.getTranslations(Locale.PL_PL, '1')).toEqual(english);
  });

  it('reuses translations that are already loaded and still caches them', async () => {
    const store = setup({
      app: { isHydrated: true, version: '1' },
      i18n: { translations: { [Locale.PL_PL]: english } },
    });

    store.dispatch(settingsSlice.actions.changeLocale(Locale.PL_PL));
    await flushMicrotasks();

    expect(loadTranslations).not.toHaveBeenCalled();
    expect(localStorage.getTranslations(Locale.PL_PL, '1')).toEqual(english);
  });

  it('does not cache translations of a locale the user already left', async () => {
    const { promise, resolve } = createDeferred<Translations>();
    loadTranslations.mockImplementation((locale) => (locale === Locale.PL_PL ? promise : Promise.resolve(english)));
    const store = setup({ app: { isHydrated: true, version: '1' } });

    store.dispatch(settingsSlice.actions.changeLocale(Locale.PL_PL));
    store.dispatch(settingsSlice.actions.changeLocale(Locale.DE_DE));
    await flushMicrotasks();
    resolve(english);
    await flushMicrotasks();

    expect(store.getState().i18n.translations[Locale.PL_PL]).toEqual(english);
    expect(localStorage.getTranslations(Locale.DE_DE, '1')).toEqual(english);
  });

  it('falls back to the default game of a locale that lacks the current game', () => {
    const store = setup({ settings: { ...settingsInitialState, game: Game.Kelimelik, locale: Locale.TR_TR } });
    const defaultGame = Object.values(languages).find((config) => config.locale === Locale.DE_DE)?.game;

    store.dispatch(settingsSlice.actions.changeLocale(Locale.DE_DE));

    expect(store.getState().settings.game).toBe(defaultGame!);
  });

  it('keeps a game the new locale supports', () => {
    const store = setup();

    store.dispatch(settingsSlice.actions.changeLocale(Locale.EN_GB));

    expect(store.getState().settings.game).toBe(Game.Scrabble);
  });

  it('keeps the game when no language has the locale', () => {
    const store = setup({ settings: { ...settingsInitialState, game: Game.Kelimelik } });

    store.dispatch(settingsSlice.actions.changeLocale('xx-XX' as Locale));

    expect(store.getState().settings.game).toBe(Game.Kelimelik);
  });

  it('solves again when the rack has tiles', async () => {
    const store = setup({ rack: ['a'] });

    store.dispatch(settingsSlice.actions.changeLocale(Locale.EN_GB));

    expect(sdk.solve).toHaveBeenCalledTimes(1);
    await flushMicrotasks();
  });

  it('clears results with an empty rack', () => {
    const store = setup({ rack: [null], results: { ...initialState().results, results: [createResult()] } });

    store.dispatch(settingsSlice.actions.changeLocale(Locale.EN_GB));

    expect(sdk.solve).not.toHaveBeenCalled();
    expect(store.getState().results.results).toBeUndefined();
  });

  it('resets the dictionary, the highlights and verifies the board', async () => {
    const store = setup({
      dictionary: { ...initialState().dictionary, input: 'cat' },
      hoveredWord: { word: createVerifiedWord() },
      results: { ...initialState().results, candidate: createResult() },
    });

    store.dispatch(settingsSlice.actions.changeLocale(Locale.EN_GB));

    expect(store.getState().dictionary.input).toBe('');
    expect(store.getState().hoveredWord.word).toBeNull();
    expect(store.getState().results.candidate).toBeNull();
    await advanceTimers(SUBMIT_DELAY);
    expect(sdk.verify).toHaveBeenCalledTimes(1);
  });
});

describe('submitting the dictionary', () => {
  it('waits before looking up a new word, then stores definitions', async () => {
    const word = uniqueWord();
    const definitions = [new WordDefinition({ definitions: ['a'], exists: true, isAllowed: true, word })];
    sdk.findWordDefinitions.mockImplementation(() => Promise.resolve(definitions));
    const store = setup();

    submitDictionary(store, word);

    expect(store.getState().dictionary.isLoading).toBe(true);
    await advanceTimers(SUBMIT_DELAY - 1);
    expect(sdk.findWordDefinitions).not.toHaveBeenCalled();
    await advanceTimers(1);
    expect(sdk.findWordDefinitions).toHaveBeenCalledWith(Locale.EN_US, word);
    expect(store.getState().dictionary).toEqual({
      error: undefined,
      input: word,
      isLoading: false,
      results: definitions,
    });
  });

  it('looks up a cached word without waiting or asking the server again', async () => {
    const word = uniqueWord();
    const store = setup();

    submitDictionary(store, word);
    await advanceTimers(SUBMIT_DELAY);
    submitDictionary(store, word);
    await flushMicrotasks();

    expect(store.getState().dictionary.isLoading).toBe(false);
    expect(sdk.findWordDefinitions).toHaveBeenCalledTimes(1);
  });

  it('keeps the cache per locale', async () => {
    const word = uniqueWord();
    const store = setup();

    submitDictionary(store, word);
    await advanceTimers(SUBMIT_DELAY);
    store.dispatch(settingsSlice.actions.changeLocale(Locale.EN_GB));
    await flushMicrotasks();
    submitDictionary(store, word);
    await advanceTimers(SUBMIT_DELAY);

    expect(sdk.findWordDefinitions).toHaveBeenCalledTimes(2);
    expect(sdk.findWordDefinitions).toHaveBeenLastCalledWith(Locale.EN_GB, word);
  });

  it('collapses quick submits into the latest one', async () => {
    const [first, second] = [uniqueWord(), uniqueWord()];
    const store = setup();

    submitDictionary(store, first);
    await advanceTimers(SUBMIT_DELAY - 1);
    submitDictionary(store, second);
    await advanceTimers(SUBMIT_DELAY);

    expect(sdk.findWordDefinitions).toHaveBeenCalledTimes(1);
    expect(sdk.findWordDefinitions).toHaveBeenCalledWith(Locale.EN_US, second);
  });

  it('drops a response for a word the user typed over', async () => {
    const word = uniqueWord();
    const { promise, resolve } = createDeferred<WordDefinition[]>();
    sdk.findWordDefinitions.mockImplementation(() => promise);
    const store = setup();

    submitDictionary(store, word);
    await advanceTimers(SUBMIT_DELAY);
    store.dispatch(dictionarySlice.actions.changeInput('something else'));
    resolve([new WordDefinition({ definitions: [], exists: true, isAllowed: true, word })]);
    await flushMicrotasks();

    expect(store.getState().dictionary.results).toEqual([]);
    expect(store.getState().dictionary.isLoading).toBe(true);
  });

  it('drops a failure for a word the user typed over', async () => {
    const { promise, reject } = createDeferred<WordDefinition[]>();
    sdk.findWordDefinitions.mockImplementation(() => promise);
    const store = setup();

    submitDictionary(store, uniqueWord());
    await advanceTimers(SUBMIT_DELAY);
    store.dispatch(dictionarySlice.actions.changeInput('something else'));
    reject(new Error('stale'));
    await flushMicrotasks();

    expect(store.getState().dictionary.error).toBeUndefined();
  });

  it('stores the failure and retries next time instead of caching it', async () => {
    const word = uniqueWord();
    const error = new Error('down');
    sdk.findWordDefinitions.mockImplementation(() => Promise.reject(error));
    const store = setup();

    submitDictionary(store, word);
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().dictionary).toEqual({ error, input: word, isLoading: false, results: [] });

    sdk.findWordDefinitions.mockImplementation(() => Promise.resolve([]));
    submitDictionary(store, word);
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().dictionary.error).toBeUndefined();
    expect(sdk.findWordDefinitions).toHaveBeenCalledTimes(2);
  });
});

describe('initializing', () => {
  describe('hydration', () => {
    it('records the version and marks the app as hydrated', async () => {
      const store = await boot();

      expect(store.getState().app).toEqual({ isHydrated: true, version: '1.0.0' });
    });

    it('changes no state identity on an empty-storage boot', async () => {
      idle.waitForFirstIntent.mockImplementation(() => new Promise(noop));
      idle.waitForIdleOrFirstIntent.mockImplementation(() => new Promise(noop));
      loadTranslations.mockImplementation(() => new Promise(noop));
      const store = setup();
      const before = store.getState();

      store.dispatch(initialize({ version: '1.0.0' }));
      await flushMicrotasks();

      const after = store.getState();
      const changedKeys = (Object.keys(before) as (keyof RootState)[]).filter((key) => before[key] !== after[key]);

      expect(changedKeys).toEqual(['app']);
    });

    it('still fires hydrated, and still boots, when hydration throws', async () => {
      spyOn(localStorage, 'getSettings').mockImplementation(() => {
        throw new Error('storage disabled');
      });

      const store = await boot();

      expect(store.getState().app.isHydrated).toBe(true);
      expect(loadTranslations).toHaveBeenCalled();
      expect(store.getState().settings).toBe(settingsInitialState);
    });

    it('applies persisted settings, board and rack', async () => {
      const board = Board.fromStringArray(['ab']);
      localStorage.setSettings({ ...settingsInitialState, highlightUnreachableCells: true, locale: Locale.EN_GB });
      localStorage.setBoard(board);
      localStorage.setRack(['a']);

      const store = await boot();

      expect(store.getState().settings.highlightUnreachableCells).toBe(true);
      expect(store.getState().settings.locale).toBe(Locale.EN_GB);
      expect(store.getState().board.equals(board)).toBe(true);
      expect(store.getState().rack).toEqual(['a', null, null, null, null, null, null]);
    });

    it('prefers persisted translations synchronously, before the chunk loads', async () => {
      const translations = { ...english, menu: 'Cached menu' };
      loadTranslations.mockImplementation(() => new Promise(noop));
      localStorage.setSettings({ ...settingsInitialState, game: Game.Scrabble, locale: Locale.PL_PL });
      localStorage.setTranslations(Locale.PL_PL, '1.0.0', translations);
      const store = setup();

      store.dispatch(initialize({ version: '1.0.0' }));

      expect(store.getState().i18n.translations[Locale.PL_PL]?.menu).toBe('Cached menu');
      expect(store.getState().app.isHydrated).toBe(true);
    });

    it('does not reload translations already hydrated from the cache', async () => {
      localStorage.setTranslations(Locale.EN_US, '1.0.0', english);
      idle.waitForIdleOrFirstIntent.mockImplementation(() => new Promise(noop));

      await boot();

      expect(loadTranslations).not.toHaveBeenCalled();
    });

    it('picks the touchscreen input mode on touch devices', async () => {
      setViewport({ isTouch: true });

      const store = await boot();

      expect(store.getState().settings.inputMode).toBe('touchscreen');
    });

    it('lets a persisted input mode win over the detected one', async () => {
      setViewport({ isTouch: true });
      localStorage.setSettings({ ...settingsInitialState, inputMode: 'keyboard' });

      const store = await boot();

      expect(store.getState().settings.inputMode).toBe('keyboard');
    });

    it('guesses the locale when none is persisted', async () => {
      const descriptor = Object.getOwnPropertyDescriptor(navigator, 'languages');
      Object.defineProperty(navigator, 'languages', { configurable: true, value: ['pl'] });

      const store = await boot();

      expect(store.getState().settings.locale).toBe(Locale.PL_PL);

      if (descriptor) {
        Object.defineProperty(navigator, 'languages', descriptor);
      } else {
        Reflect.deleteProperty(navigator, 'languages');
      }
    });

    it('falls back to the default game when the persisted game is not available in the locale', async () => {
      localStorage.setSettings({ ...settingsInitialState, game: Game.Kelimelik, locale: Locale.EN_US });

      const store = await boot();
      const defaultGame = Object.values(languages).find((config) => config.locale === Locale.EN_US)?.game;

      expect(store.getState().settings.game).toBe(defaultGame!);
      expect(store.getState().settings.locale).toBe(Locale.EN_US);
    });

    it('falls back to the initial game and a guessed locale for an unknown persisted locale', async () => {
      localStorage.setSettings({ ...settingsInitialState, game: Game.Literaki, locale: 'xx-XX' as Locale });

      const store = await boot();

      expect(store.getState().settings.game).toBe(settingsInitialState.game);
      expect(store.getState().settings.locale).toBe(Locale.EN_US);
    });

    it('sizes an empty board and rack for the persisted game', async () => {
      localStorage.setSettings({ ...settingsInitialState, game: Game.SuperScrabble });
      const config = getConfig(Game.SuperScrabble, Locale.EN_US);

      const store = await boot();

      expect(store.getState().board.rowsCount).toBe(config.boardHeight);
      expect(store.getState().board.columnsCount).toBe(config.boardWidth);
      expect(store.getState().rack).toEqual(Array(config.rackSize).fill(null));
    });

    it('resizes a board that differs in width only', async () => {
      const store = setup({ board: Board.create(11, 15) });

      store.dispatch(initialize({ version: '1' }));
      await flushMicrotasks();

      expect(store.getState().board.columnsCount).toBe(15);
    });
  });

  describe('after hydration', () => {
    it('loads translations of the active locale and caches them', async () => {
      localStorage.setSettings({ ...settingsInitialState, locale: Locale.EN_GB });
      const store = await boot();

      expect(loadTranslations).toHaveBeenCalledWith(Locale.EN_GB);
      expect(store.getState().i18n.translations[Locale.EN_GB]).toEqual(english);
      expect(localStorage.getTranslations(Locale.EN_GB, '1.0.0')).toEqual(english);
    });

    it('preloads every other locale when idle, without caching them', async () => {
      const store = await boot();

      expect(loadTranslations).toHaveBeenCalledTimes(Object.values(Locale).length);
      expect(Object.keys(store.getState().i18n.translations).sort()).toEqual(Object.values(Locale).sort());
      expect(localStorage.getTranslations(Locale.DE_DE, '1.0.0')).toBeUndefined();
    });

    it('does not preload before idle', async () => {
      idle.waitForIdleOrFirstIntent.mockImplementation(() => new Promise(noop));

      await boot();

      expect(loadTranslations).toHaveBeenCalledTimes(1);
      expect(sdk.visit).not.toHaveBeenCalled();
    });

    it('reports the visit when idle with the current game, locale and landing page', async () => {
      await boot();

      expect(sdk.visit).toHaveBeenCalledWith({
        game: Game.Scrabble,
        locale: Locale.EN_US,
        referrer: document.referrer,
        url: location.href,
      });
    });

    it('ignores a failed visit report', async () => {
      sdk.visit.mockImplementation(() => Promise.reject(new Error('offline')));

      const store = await boot();

      expect(store.getState().app.isHydrated).toBe(true);
    });

    it('prefetches the dictionary only on the first intent, for the locale of that moment', async () => {
      const { promise, resolve } = createDeferred<void>();
      idle.waitForFirstIntent.mockImplementation(() => promise);

      const store = await boot();

      expect(prefetchDictionary).not.toHaveBeenCalled();

      store.dispatch(settingsSlice.actions.init({ locale: Locale.EN_GB }));
      resolve();
      await flushMicrotasks();

      expect(prefetchDictionary).toHaveBeenCalledWith(Locale.EN_GB);
    });

    it('verifies a non-empty board and fits the rack to the game', async () => {
      localStorage.setBoard(Board.fromStringArray(['a']));
      localStorage.setRack(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);

      const store = await boot();

      expect(store.getState().rack).toHaveLength(7);
      await advanceTimers(SUBMIT_DELAY);
      expect(sdk.verify).toHaveBeenCalledTimes(1);
    });

    it('does not verify an empty board', async () => {
      await boot();
      await advanceTimers(SUBMIT_DELAY);

      expect(sdk.verify).not.toHaveBeenCalled();
    });
  });
});

describe('resetting', () => {
  it('clears the whole game but keeps settings', async () => {
    const store = setup({
      board: Board.fromStringArray(['a']),
      cellFilters: [{ type: 'include', x: 0, y: 0 }],
      dictionary: { ...initialState().dictionary, input: 'cat' },
      hoveredWord: { word: createVerifiedWord() },
      rack: ['a'],
      results: { ...initialState().results, results: [createResult()] },
      settings: { ...settingsInitialState, game: Game.SuperScrabble },
      solve: { ...initialState().solve, error: new Error('x') },
    });

    store.dispatch(reset());

    const state = store.getState();

    expect(state.board.isEmpty()).toBe(true);
    expect(state.board.rowsCount).toBe(21);
    expect(state.cellFilters).toEqual([]);
    expect(state.dictionary.input).toBe('');
    expect(state.hoveredWord.word).toBeNull();
    expect(state.rack).toEqual(Array(7).fill(null));
    expect(state.results.results).toBeUndefined();
    expect(state.solve.error).toBeUndefined();
    expect(state.settings.game).toBe(Game.SuperScrabble);
    await advanceTimers(SUBMIT_DELAY);
    expect(sdk.verify).toHaveBeenCalledTimes(1);
  });
});

describe('previewing a result', () => {
  it('clears the highlighted word and looks up every unique word it creates', async () => {
    const result = createResult({ collisions: ['ax', 'cat'], word: uniqueWord() });
    const store = setup({ hoveredWord: { word: createVerifiedWord() } });

    store.dispatch(resultsSlice.actions.changeResultCandidate(result));

    expect(store.getState().hoveredWord.word).toBeNull();
    await advanceTimers(SUBMIT_DELAY);
    expect(store.getState().dictionary.input).toBe(`${result.word}, ax, cat`);
    await advanceTimers(SUBMIT_DELAY);
    expect(sdk.findWordDefinitions).toHaveBeenCalledWith(Locale.EN_US, `${result.word}, ax, cat`);
  });

  it('removes duplicates of the same word', async () => {
    const word = uniqueWord();
    const store = setup();

    store.dispatch(resultsSlice.actions.changeResultCandidate(createResult({ collisions: [word], word })));
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().dictionary.input).toBe(word);
  });

  it("joins words with the locale's separator", async () => {
    const word = uniqueWord();
    const store = setup({ settings: { ...settingsInitialState, locale: Locale.FA_IR } });

    store.dispatch(resultsSlice.actions.changeResultCandidate(createResult({ collisions: ['ax'], word })));
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().dictionary.input).toBe(`${word}، ax`);
  });

  it('abandons the lookup when the preview ends before the delay', async () => {
    const store = setup();

    store.dispatch(resultsSlice.actions.changeResultCandidate(createResult({ word: uniqueWord() })));
    await advanceTimers(SUBMIT_DELAY - 1);
    store.dispatch(resultsSlice.actions.changeResultCandidate(null));
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().dictionary.input).toBe('');
  });

  it('looks up cached words immediately', async () => {
    const word = uniqueWord();
    const store = setup();

    store.dispatch(resultsSlice.actions.changeResultCandidate(createResult({ word })));
    await advanceTimers(SUBMIT_DELAY * 2);
    store.dispatch(dictionarySlice.actions.reset());
    store.dispatch(resultsSlice.actions.changeResultCandidate(createResult({ id: 2, word })));

    expect(store.getState().dictionary.input).toBe(word);
  });
});

describe('highlighting a created word', () => {
  it('clears the previewed result and looks up the word with the words it crosses', async () => {
    const board = Board.create(4, 4);
    placeWord(board, 'bar', { direction: 'horizontal', x: 0, y: 1 });
    placeWord(board, 'oat', { direction: 'vertical', x: 1, y: 0 });
    const store = setup({ board, results: { ...initialState().results, candidate: createResult() } });

    store.dispatch(hoveredWordSlice.actions.set(createVerifiedWord({ word: 'bar', x: 0, y: 1 })));

    expect(store.getState().results.candidate).toBeNull();
    await advanceTimers(SUBMIT_DELAY);
    expect(store.getState().dictionary.input).toBe('bar, oat');
  });

  it('abandons the lookup when the highlight clears before the delay', async () => {
    const store = setup();

    store.dispatch(hoveredWordSlice.actions.set(createVerifiedWord({ word: uniqueWord() })));
    store.dispatch(hoveredWordSlice.actions.clear());
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().dictionary.input).toBe('');
  });

  it('ends a pending preview lookup', async () => {
    const word = uniqueWord();
    const store = setup();

    store.dispatch(resultsSlice.actions.changeResultCandidate(createResult({ word: uniqueWord() })));
    store.dispatch(hoveredWordSlice.actions.set(createVerifiedWord({ word })));
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().dictionary.input).toBe(word);
  });
});

describe('solving', () => {
  it('skips the server with an empty rack and reports no results', async () => {
    const board = Board.create(15, 15);
    const store = setup({ board, rack: [null] });

    store.dispatch(solveSlice.actions.submit());

    expect(sdk.solve).not.toHaveBeenCalled();
    expect(store.getState().results.results).toEqual([]);
    expect(store.getState().solve.isLoading).toBe(false);
    expect(store.getState().solve.lastSolvedParameters).toEqual({ board, characters: [] });
  });

  it('asks the SDK with the current board, rack, game and locale', async () => {
    const results = [createResult()];
    sdk.solve.mockImplementation(() => Promise.resolve(results));
    const board = Board.fromStringArray(['a ']);
    const store = setup({ board, rack: ['b', null] });

    store.dispatch(solveSlice.actions.submit());
    await flushMicrotasks();

    expect(sdk.solve).toHaveBeenCalledWith({
      board: board.toJson(),
      characters: ['b'],
      game: Game.Scrabble,
      locale: Locale.EN_US,
    });
    expect(store.getState().results.results).toEqual(results);
    expect(store.getState().solve).toEqual({
      error: undefined,
      isLoading: false,
      lastSolvedParameters: { board, characters: ['b'] },
    });
  });

  it('empties results and stores the error on failure', async () => {
    const error = new Error('down');
    sdk.solve.mockImplementation(() => Promise.reject(error));
    const store = setup({ rack: ['a'], results: { ...initialState().results, results: [createResult()] } });

    store.dispatch(solveSlice.actions.submit());
    await flushMicrotasks();

    expect(store.getState().results.results).toEqual([]);
    expect(store.getState().solve.error).toBe(error);
    expect(store.getState().solve.isLoading).toBe(false);
  });

  it('keeps only the latest solve when submits overlap', async () => {
    const first = createDeferred<unknown[]>();
    const second = createDeferred<unknown[]>();
    const newest = [createResult({ id: 2 })];
    sdk.solve.mockImplementationOnce(() => first.promise);
    sdk.solve.mockImplementationOnce(() => second.promise);
    const store = setup({ rack: ['a'] });

    store.dispatch(solveSlice.actions.submit());
    store.dispatch(solveSlice.actions.submit());
    second.resolve(newest);
    await flushMicrotasks();
    first.resolve([createResult({ id: 1 })]);
    await flushMicrotasks();

    expect(store.getState().results.results).toEqual(newest);
  });
});

describe('verifying', () => {
  it('collapses quick submits into one request with the latest board', async () => {
    const board = Board.fromStringArray(['b']);
    const store = setup();

    store.dispatch(verifySlice.actions.submit());
    await advanceTimers(SUBMIT_DELAY - 1);
    store.dispatch(boardSlice.actions.init(board));
    store.dispatch(verifySlice.actions.submit());
    await advanceTimers(SUBMIT_DELAY);

    expect(sdk.verify).toHaveBeenCalledTimes(1);
    expect(sdk.verify).toHaveBeenCalledWith({ board: board.toJson(), game: Game.Scrabble, locale: Locale.EN_US });
  });

  it('stores the verified board and words', async () => {
    const validWords = [createVerifiedWord()];
    const invalidWords = [createVerifiedWord({ isValid: false, word: 'zz' })];
    const board = Board.fromStringArray(['b']);
    sdk.verify.mockImplementation(() => Promise.resolve({ invalidWords, validWords }));
    const store = setup({ board });

    store.dispatch(verifySlice.actions.submit());
    await advanceTimers(SUBMIT_DELAY);

    const { verify } = store.getState();

    expect(verify.isLoading).toBe(false);
    expect(verify.validWords).toEqual(validWords);
    expect(verify.invalidWords).toEqual(invalidWords);
    expect(verify.lastSolvedParameters.board).toBe(board);
  });

  it('stops loading on failure', async () => {
    sdk.verify.mockImplementation(() => Promise.reject(new Error('down')));
    const store = setup();

    store.dispatch(verifySlice.actions.submit());
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().verify.isLoading).toBe(false);
  });

  it('drops the response of a request overtaken by a newer board', async () => {
    const stale = createDeferred<unknown>();
    sdk.verify.mockImplementationOnce(() => stale.promise);
    const store = setup();

    store.dispatch(verifySlice.actions.submit());
    await advanceTimers(SUBMIT_DELAY);
    store.dispatch(verifySlice.actions.submit());
    stale.resolve({ invalidWords: [], validWords: [createVerifiedWord()] });
    await advanceTimers(SUBMIT_DELAY);

    expect(store.getState().verify.validWords).toEqual([]);
  });
});

function setup(state: Partial<RootState> = {}) {
  return createTestStore({ sagas: true, state });
}

function initialState(): RootState {
  return createTestStore().getState();
}

async function boot() {
  const store = setup();

  store.dispatch(initialize({ version: '1.0.0' }));
  await flushMicrotasks();

  return store;
}

function submitDictionary(store: ReturnType<typeof setup>, word: string): void {
  store.dispatch(dictionarySlice.actions.changeInput(word));
  store.dispatch(dictionarySlice.actions.submit());
}

function uniqueWord(): string {
  return `word${++uniqueWordId}`;
}

function placeWord(board: Board, word: string, { direction, x, y }: Omit<BoardWord, 'word'>): void {
  Array.from(word).forEach((character, index) => {
    const cellX = direction === 'horizontal' ? x + index : x;
    const cellY = direction === 'horizontal' ? y : y + index;

    board.updateCell(cellX, cellY, () => {
      return new Cell({ isEmpty: false, tile: new Tile({ character }), x: cellX, y: cellY });
    });
  });
}
