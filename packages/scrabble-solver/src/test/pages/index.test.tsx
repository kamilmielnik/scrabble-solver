/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Board, Game, Locale } from '@scrabble-solver/types';
import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import fs from 'fs';

import english from '../../i18n/languages/english.json';
import { noop } from '../../lib/noop';
import type * as pagesModule from '../../pages/index';
import type * as parametersModule from '../../parameters';
import type * as stateHoveredWordModule from '../../state/hoveredWord';
import type * as stateResultsModule from '../../state/results';
import type * as stateSettingsModule from '../../state/settings';
import type * as stateSolveModule from '../../state/solve';
import type * as asyncModule from '../async';
import type * as fixturesModule from '../fixtures';
import type * as mediaModule from '../media';
import type * as renderModule from '../render';
import type * as virtualListModule from '../virtualList';

const registerServiceWorker = mock(() => Promise.resolve());
const schedulePreloadModals = mock();
const execSync = mock((_command: string) => Buffer.from('abc123\n'));
function never(): Promise<void> {
  return new Promise<void>(noop);
}
const realChildProcess = await import('child_process');

await mock.module('child_process', () => ({ ...realChildProcess, execSync }));
await mock.module('@/serviceWorkerManager', () => ({ registerServiceWorker }));
await mock.module('@/modals/preload', () => ({ schedulePreloadModals }));
await mock.module('@/lib/waitForIdleOrFirstIntent', () => ({
  waitForFirstIntent: never,
  waitForIdle: never,
  waitForIdleOrFirstIntent: never,
}));
await mock.module('@/solver-worker', () => ({ prefetchDictionary: noop }));
await mock.module('@/sdk', () => ({
  findWordDefinitions: () => Promise.resolve([]),
  solve: () => Promise.resolve([]),
  verify: () => Promise.resolve({ invalidWords: [], validWords: [] }),
  visit: () => Promise.resolve(true),
}));

const { default: Index, getStaticProps }: typeof pagesModule = await import('../../pages/index');
const { hoveredWordSlice }: typeof stateHoveredWordModule = await import('../../state/hoveredWord');
const { resultsInitialState, resultsSlice }: typeof stateResultsModule = await import('../../state/results');
const { settingsInitialState, settingsSlice }: typeof stateSettingsModule = await import('../../state/settings');
const { solveInitialState }: typeof stateSolveModule = await import('../../state/solve');
const { CONFIG_PENDING_CLASS, SITE_DESCRIPTION }: typeof parametersModule = await import('../../parameters');
const { flushEffects, flushTimers }: typeof asyncModule = await import('../async');
const { createResult, createVerifiedWord }: typeof fixturesModule = await import('../fixtures');
const { setViewport }: typeof mediaModule = await import('../media');
const { renderWithStore }: typeof renderModule = await import('../render');
const { installFixedSizeResizeObserver }: typeof virtualListModule = await import('../virtualList');

installFixedSizeResizeObserver();

const root = document.documentElement;
const board = Board.create(15, 15);

beforeEach(() => {
  registerServiceWorker.mockClear();
  schedulePreloadModals.mockClear();
  root.removeAttribute('style');
  root.removeAttribute('class');
  root.removeAttribute('dir');
  root.removeAttribute('lang');
});

describe('page', () => {
  it('renders the navigation and the solver', () => {
    setup();

    expect(screen.getByRole('navigation')).toBeDefined();
    expect(screen.getByRole('main')).toBeDefined();
    expect(screen.getByTestId('board')).toBeDefined();
  });

  it('shows the version on the logo link', () => {
    setup();

    expect(document.querySelector('nav a[href="/"]')?.getAttribute('title')).toBe('v1.2.3');
  });

  it('describes the app as JSON-LD', () => {
    setup();

    const script = document.querySelector('script[type="application/ld+json"]')!;
    const data = JSON.parse(script.textContent!);

    expect(data['@type']).toBe('WebApplication');
    expect(data.description).toBe(SITE_DESCRIPTION);
    expect(data.inLanguage.sort()).toEqual(Object.values(Locale).sort());
  });
});

describe('boot', () => {
  it('initializes with the version', () => {
    const { store } = setup();

    expect(store.getState().app.version).toBe('v1.2.3');
    expect(store.getState().app.isHydrated).toBe(true);
  });

  it('schedules modal preloading once', () => {
    const { rerender } = setup();

    rerender(<Index version="v1.2.3" />);

    expect(schedulePreloadModals).toHaveBeenCalledTimes(1);
  });

  it('does not register the service worker outside production', () => {
    setup();

    expect(registerServiceWorker).not.toHaveBeenCalled();
  });

  it('registers the service worker in production', () => {
    const nodeEnv = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: 'production' });

    setup();

    Object.assign(process.env, { NODE_ENV: nodeEnv });

    expect(registerServiceWorker).toHaveBeenCalledTimes(1);
  });

  it('reveals the board once hydration applied a persisted game', () => {
    root.classList.add(CONFIG_PENDING_CLASS);

    setup();

    expect(root.classList.contains(CONFIG_PENDING_CLASS)).toBe(false);
  });

  it('keeps the pending class until hydrated', () => {
    root.classList.add(CONFIG_PENDING_CLASS);

    const { rerender } = setup({ sagas: false });

    expect(root.classList.contains(CONFIG_PENDING_CLASS)).toBe(true);

    rerender(<Index version="v1.2.3" />);

    expect(root.classList.contains(CONFIG_PENDING_CLASS)).toBe(true);
  });
});

describe('document', () => {
  it('applies the direction and language of the locale', () => {
    const { store } = setup();

    act(() => {
      store.dispatch(settingsSlice.actions.init({ locale: Locale.FA_IR }));
    });

    expect(root.dir).toBe('rtl');
    expect(root.lang).toBe(Locale.FA_IR);
  });

  it('writes no layout variables for the default game', () => {
    setup();

    expect(root.getAttribute('style')).toBeNull();
  });

  it('keeps variables the pre-paint script already set', () => {
    root.style.setProperty('--board-cols', '15');

    const setProperty = spyOn(root.style, 'setProperty');

    setup();

    expect(setProperty).not.toHaveBeenCalled();
    setProperty.mockRestore();
  });

  it('writes layout variables for another game', () => {
    const { store } = setup();

    act(() => {
      store.dispatch(settingsSlice.actions.changeGame(Game.SuperScrabble));
    });

    expect(root.style.getPropertyValue('--board-cols')).toBe('21');
    expect(root.style.getPropertyValue('--board-rows')).toBe('21');
  });

  it('corrects a persisted variable that disagrees with the game', () => {
    root.style.setProperty('--board-cols', '21');

    setup();

    expect(root.style.getPropertyValue('--board-cols')).toBe('15');
  });
});

describe('layout changes', () => {
  it('clears both highlights when the layout crosses the breakpoint', () => {
    const { store } = setup();

    act(() => {
      store.dispatch(hoveredWordSlice.actions.set(createVerifiedWord()));
    });
    act(() => {
      setViewport({ width: 800 });
    });

    expect(store.getState().results.candidate).toBeNull();
    expect(store.getState().hoveredWord.word).toBeNull();
  });

  it('leaves highlights alone on a resize inside one layout', () => {
    const { store } = setup();
    const word = createVerifiedWord();

    act(() => {
      store.dispatch(hoveredWordSlice.actions.set(word));
    });
    act(() => {
      setViewport({ width: 1300 });
    });

    expect(store.getState().hoveredWord.word).toEqual(word);
  });
});

describe('modals', () => {
  it('mounts no modal chunk before it is first opened', () => {
    setup();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it.each([
    [english.settings, 'Settings'],
    [english.keyMap, 'Keyboard shortcuts'],
    [english['remaining-tiles'], 'Remaining tiles'],
    [english.words, 'Created words'],
  ])('opens %s from the navigation and closes it', async (button, title) => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: button }));

    expect(await screen.findByRole('dialog', { name: title })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: english['common.close'] }));
    await flushEffects();

    expect(document.querySelector('.ReactModal__Overlay--before-close')).not.toBeNull();
  });

  it('keeps a modal mounted after closing, so reopening needs no chunk', async () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: english.settings }));
    const dialog = await screen.findByRole('dialog', { name: 'Settings' });

    fireEvent.click(screen.getByRole('button', { name: english['common.close'] }));
    fireEvent.click(screen.getAllByRole('button', { hidden: true, name: english.settings })[0]);
    await flushEffects();

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBe(dialog);
  });

  it('goes from the menu to other modals', async () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: english.menu }));
    await screen.findByRole('dialog', { name: english.menu });

    fireEvent.click(screen.getAllByRole('button', { hidden: true, name: english.dictionary })[0]);

    expect(await screen.findByRole('dialog', { name: english.dictionary })).toBeDefined();
  });

  it('opens results from the compact picker', async () => {
    setViewport({ width: 800 });
    const result = createResult({ word: 'at', x: 0, y: 0 });

    setup({
      state: {
        board,
        results: { ...resultsInitialState, results: [result] },
        solve: { ...solveInitialState, lastSolvedParameters: { board, characters: [] } },
      },
    });

    fireEvent.click(screen.getByTestId('result-candidate-picker'));

    expect(await screen.findByRole('dialog', { name: english.results })).toBeDefined();
  });

  it('closes words and the menu on Preview, keeping the highlight', async () => {
    setViewport({ width: 800 });
    const word = createVerifiedWord();
    const { store } = setup({
      state: { verify: { ...createVerifyState(), validWords: [word] } },
    });

    fireEvent.click(screen.getByRole('button', { name: english.menu }));
    await screen.findByRole('dialog', { name: english.menu });
    fireEvent.click(screen.getAllByRole('button', { hidden: true, name: english.words })[0]);

    fireEvent.click(await screen.findByRole('button', { name: english['words.preview'] }));
    await flushEffects();

    expect(store.getState().hoveredWord.word).toEqual(word);
    expect(document.querySelectorAll('.ReactModal__Overlay--before-close').length).toBeGreaterThan(0);
  });

  it('stops rendering remaining tiles for a game that cannot count them', async () => {
    const { store } = setup();

    fireEvent.click(screen.getByRole('button', { name: english['remaining-tiles'] }));
    await screen.findByRole('dialog', { name: english['remaining-tiles'] });

    act(() => {
      store.dispatch(settingsSlice.actions.changeGame(Game.LetterLeague));
    });
    await flushTimers();

    expect(screen.queryByRole('dialog', { name: english['remaining-tiles'] })).toBeNull();
  });
});

describe('clear', () => {
  it('resets the game', () => {
    const { store } = setup({
      state: { rack: ['a', null, null, null, null, null, null], results: resultsInitialState },
    });

    act(() => {
      store.dispatch(resultsSlice.actions.changeQuery('x'));
    });
    fireEvent.click(screen.getByRole('button', { name: english['common.clear'] }));

    expect(store.getState().rack).toEqual(Array(7).fill(null));
  });
});

describe('getStaticProps', () => {
  it('passes the package version and the build sha', async () => {
    const readFile = spyOn(fs.promises, 'readFile').mockImplementation((() => {
      return Promise.resolve('{"version":"9.9.9"}');
    }) as never);

    expect(await getStaticProps()).toEqual({ props: { buildSha: 'abc123', version: 'v9.9.9' } });
    expect(execSync).toHaveBeenCalledWith('git rev-parse HEAD');
    readFile.mockRestore();
  });

  it.each(['{}', '{"version":1}', 'null'])('rejects the package.json %s', async (content) => {
    const readFile = spyOn(fs.promises, 'readFile').mockImplementation((() => Promise.resolve(content)) as never);

    await expect(getStaticProps()).rejects.toThrow('Invalid package.json');
    readFile.mockRestore();
  });
});

function setup({ sagas = true, state = {} }: Parameters<typeof renderWithStore>[1] = {}) {
  return renderWithStore(<Index version="v1.2.3" />, {
    sagas,
    state: { settings: settingsInitialState, ...state },
  });
}

function createVerifyState() {
  return {
    invalidWords: [],
    isLoading: false,
    lastSolvedParameters: { board },
    query: '',
    sort: defaultSort(),
    validWords: [],
  };
}

function defaultSort() {
  return { column: 'word', direction: 'ascending' } as never;
}
