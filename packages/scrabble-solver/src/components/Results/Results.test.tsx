/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Locale } from '@scrabble-solver/types';
import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, jest, mock } from 'bun:test';

import { resultsInitialState, resultsSlice } from '../../state/results';
import { settingsInitialState } from '../../state/settings';
import { solveInitialState } from '../../state/solve';
import type { RootState } from '../../state/types';
import { flushTimers } from '../../test/async';
import { createResult } from '../../test/fixtures';
import { setViewport } from '../../test/media';
import { renderWithStore } from '../../test/render';
import { installFixedSizeResizeObserver } from '../../test/virtualList';
import { ResultColumnId, SortDirection } from '../../types';

import { Results } from './Results';
import { type ResultCallbacks } from './types';

installFixedSizeResizeObserver();

const cat = createResult({ id: 1, points: 30, word: 'cat', x: 0, y: 0 });
const dog = createResult({ collisions: ['ox'], id: 2, points: 10, word: 'dog', x: 0, y: 1 });

describe('empty states', () => {
  it('invites to solve before the first solve', () => {
    setup({ results: resultsInitialState, solve: solveInitialState });

    expect(screen.getByText(/Words generated from your letters/)).toBeDefined();
    expect(screen.getByRole('button', { name: 'Solve' })).toBeDefined();
  });

  it('shows the solve error instead of results', () => {
    setup({ solve: { ...solveInitialState, error: new Error('Solver failed') } });

    expect(screen.getByText('Solver failed')).toBeDefined();
    expect(screen.queryAllByTestId('result')).toHaveLength(0);
  });

  it('asks to solve again when results are outdated', () => {
    setup({ rack: ['z'] });

    expect(screen.getByText('Results are outdated.')).toBeDefined();
    expect(screen.queryByPlaceholderText(/Search results/)).toBeNull();
    expect(screen.getByTestId('results').getAttribute('data-outdated')).toBe('true');
  });

  it('warns when no words can be made', () => {
    setup({ results: { ...resultsInitialState, results: [] } });

    expect(screen.getByText(/No results/)).toBeDefined();
    expect(screen.queryByPlaceholderText(/Search results/)).toBeNull();
  });

  it('shows nothing but the loader during the first solve', () => {
    setup({ results: resultsInitialState, solve: { ...solveInitialState, isLoading: true } });

    expect(screen.queryByRole('button', { name: 'Solve' })).toBeNull();
    expect(screen.getByTestId('loading')).toBeDefined();
    expect(screen.getByTestId('results').getAttribute('aria-busy')).toBe('true');
  });
});

describe('list', () => {
  it('renders one row per result, best score first', () => {
    setup();

    expect(readWords()).toEqual(['cat', 'dog']);
  });

  it('virtualises long lists instead of rendering every row', () => {
    const results = Array.from({ length: 200 }, (_, index) => createResult({ id: index + 3, points: 1, word: 'at' }));

    setup({ results: { ...resultsInitialState, results } });

    expect(screen.getAllByTestId('result').length).toBeLessThan(results.length);
    expect(screen.getAllByTestId('result').length).toBeGreaterThan(0);
  });

  it('shows points and coordinates', () => {
    setup();

    expect(screen.getAllByTestId('points')[0].textContent).toBe('30');
    expect(screen.getAllByTestId('result')[0].textContent).toContain('1A');
  });

  it('renders the list right-to-left for a right-to-left locale', () => {
    setup({ settings: { ...settingsInitialState, locale: Locale.FA_IR } });

    expect(screen.getAllByTestId('result')[0].closest('[dir]')?.getAttribute('dir')).toBe('rtl');
  });

  it('shows vowels and consonants columns only where the locale supports them', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Vowels' })).toBeDefined();
  });

  it('hides vowel columns for Persian', () => {
    setup({ settings: { ...settingsInitialState, locale: Locale.FA_IR } });

    expect(document.querySelector('[data-icon="SquareA.svg"]')).toBeNull();
    expect(document.querySelector('[data-icon="SquareB.svg"]')).toBeNull();
  });

  it('shows only coordinates, word and points below the medium breakpoint', () => {
    setViewport({ width: 800 });
    setup();

    expect(document.querySelectorAll('.headerButton')).toHaveLength(3);
  });

  it('adds blanks and words columns on small screens', () => {
    setViewport({ width: 600 });
    setup();

    expect(document.querySelectorAll('.headerButton')).toHaveLength(5);
  });

  it('shows only the essentials on the smallest screens', () => {
    setViewport({ width: 400 });
    setup();

    expect(document.querySelectorAll('.headerButton')).toHaveLength(3);
  });
});

describe('list updates', () => {
  it('drops rows when results shrink, without a row reading past the end of the list', () => {
    const { store } = setup();

    act(() => {
      store.dispatch(resultsSlice.actions.changeResults([dog]));
    });

    expect(readWords()).toEqual(['dog']);
  });
});

describe('search', () => {
  it('keeps every row, floating matches to the top and dimming the rest', () => {
    const { store } = setup();

    fireEvent.change(screen.getByPlaceholderText(/Search results/), { target: { value: 'dog' } });

    expect(store.getState().results.query).toBe('dog');
    expect(readWords()).toEqual(['dog', 'cat']);

    const rows = document.querySelectorAll('[data-testid="result"]');

    expect(rows[0].getAttribute('aria-hidden')).toBeNull();
    expect(rows[1].getAttribute('aria-hidden')).toBe('true');
  });

  it('highlights the matching part of the word', () => {
    setup({ results: { ...resultsInitialState, query: 'do', results: [cat, dog] } });

    expect(document.querySelector('mark')?.textContent).toBe('do');
  });

  it('marks nothing for a blank query', () => {
    setup();

    expect(document.querySelector('mark')).toBeNull();
  });
});

describe('sorting', () => {
  it('sorts by a column on click and toggles on the next click', () => {
    const { store } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Word' }));

    expect(store.getState().results.sort).toEqual({ column: ResultColumnId.Word, direction: SortDirection.Descending });
    expect(readWords()).toEqual(['dog', 'cat']);

    fireEvent.click(screen.getByRole('button', { name: 'Word' }));

    expect(readWords()).toEqual(['cat', 'dog']);
  });

  it.each([
    ['Tiles', ResultColumnId.TilesCount],
    ['Vowels', ResultColumnId.VowelsCount],
    ['Consonants', ResultColumnId.ConsonantsCount],
    ['Blanks', ResultColumnId.BlanksCount],
    ['Points', ResultColumnId.Points],
    ['Coordinates', ResultColumnId.Coordinates],
  ])('sorts by %s', (name, column) => {
    const { store } = setup();

    fireEvent.click(screen.getByRole('button', { name }));

    expect(store.getState().results.sort.column).toBe(column);
  });

  it('sorts by created words', () => {
    const { store } = setup();

    fireEvent.click(screen.getAllByRole('button', { name: 'Words' })[0]);

    expect(store.getState().results.sort.column).toBe(ResultColumnId.WordsCount);
  });
});

describe('row callbacks', () => {
  it('passes the result to each callback', () => {
    const callbacks = createCallbacks();

    setup({}, { callbacks });

    const row = screen.getAllByTestId('result')[0];

    fireEvent.mouseEnter(row);
    fireEvent.focus(row);
    fireEvent.blur(row);
    fireEvent.click(row);

    expect(callbacks.onMouseEnter.mock.calls[0][0]).toBe(cat);
    expect(callbacks.onFocus.mock.calls[0][0]).toBe(cat);
    expect(callbacks.onBlur.mock.calls[0][0]).toBe(cat);
    expect(callbacks.onClick.mock.calls[0][0]).toBe(cat);
  });

  it('calls onMouseLeave when the pointer leaves the list', () => {
    const callbacks = createCallbacks();

    setup({}, { callbacks });
    fireEvent.mouseLeave(screen.getAllByTestId('result')[0].closest('[dir]')!);

    expect(callbacks.onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('does not advertise a click without a click callback', () => {
    setup({}, { callbacks: {} });

    expect(screen.getAllByTestId('result')[0].className).not.toContain('clickable');
  });

  it('marks the row at highlightedIndex', () => {
    setup({}, { highlightedIndex: 1 });

    const rows = screen.getAllByTestId('result');

    expect(rows[0].getAttribute('aria-current')).toBeNull();
    expect(rows[1].getAttribute('aria-current')).toBe('true');
  });
});

describe('loading', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the loader only after the delay, so quick solves do not flash', () => {
    const { store } = setup();

    act(() => {
      store.dispatch({ type: 'solve/submit' });
    });
    expect(screen.queryByTestId('loading')).toBeNull();

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByTestId('loading')).toBeDefined();
  });
});

describe('scrolling', () => {
  it('scrolls the highlighted row into view after rendering', async () => {
    const scrollTo = mock<(options: ScrollToOptions) => void>();
    const results = Array.from({ length: 200 }, (_, index) => createResult({ id: index + 3, points: 1, word: 'at' }));

    setup({ results: { ...resultsInitialState, results } }, { highlightedIndex: 100 });
    Object.assign(screen.getAllByTestId('result')[0].closest('[dir]')!, { scrollTo });

    expect(scrollTo).not.toHaveBeenCalled();

    await flushTimers();

    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo.mock.calls[0][0]).toMatchObject({ top: 100 * 40 + 20 - 200 });
  });
});

function setup(
  state: Partial<RootState> = {},
  { callbacks = createCallbacks(), highlightedIndex }: { callbacks?: ResultCallbacks; highlightedIndex?: number } = {},
) {
  return renderWithStore(<Results callbacks={callbacks} highlightedIndex={highlightedIndex} />, {
    state: { rack: [null], results: { ...resultsInitialState, results: [cat, dog] }, ...state },
  });
}

function createCallbacks() {
  return {
    onBlur: mock<(result: unknown) => void>(),
    onClick: mock<(result: unknown) => void>(),
    onFocus: mock<(result: unknown) => void>(),
    onMouseEnter: mock<(result: unknown) => void>(),
    onMouseLeave: mock(),
  };
}

function readWords(): (string | null)[] {
  return Array.from(document.querySelectorAll('[data-testid="result"]'), (row) => row.getAttribute('aria-label'));
}
