import { Board } from '@scrabble-solver/types';
import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { noop } from '../../lib/noop';
import { resultsInitialState, resultsSlice } from '../../state/results';
import { solveInitialState, solveSlice } from '../../state/solve';
import type { RootState } from '../../state/types';
import { createResult } from '../../test/fixtures';
import { setLayout } from '../../test/media';
import { renderWithStore } from '../../test/render';
import { installFixedSizeResizeObserver } from '../../test/virtualList';

import { Solver } from './Solver';

installFixedSizeResizeObserver();

const cat = createResult({ id: 1, points: 30, word: 'cat', x: 0, y: 0 });
const dog = createResult({ id: 2, points: 10, word: 'dog', x: 0, y: 1 });
const board = Board.create(15, 15);

describe('layout', () => {
  it('renders the board, the rack, results and dictionary', () => {
    setup();

    expect(screen.getByTestId('board')).toBeDefined();
    expect(screen.getByTestId('rack')).toBeDefined();
    expect(screen.getByTestId('results')).toBeDefined();
    expect(screen.getByTestId('dictionary')).toBeDefined();
  });

  it('submits a solve from both the board and the rack', () => {
    const { store } = setup();

    const forms = [screen.getByTestId('board').closest('form')!, screen.getByTestId('rack').closest('form')!];

    for (const form of forms) {
      expect(fireEvent.submit(form)).toBe(false);
    }

    expect(store.actions.filter(({ type }) => type === solveSlice.actions.submit.type)).toHaveLength(2);
  });

  it('opens the results from the compact picker', () => {
    const onShowResults = mock();

    setup({}, { onShowResults });
    fireEvent.click(screen.getByTestId('result-candidate-picker'));

    expect(onShowResults).toHaveBeenCalledTimes(1);
  });

  it('shows the solve error next to the rack', () => {
    setup({ solve: { ...createSolveState(), error: new Error('Failed') } });

    expect(screen.getAllByText('Failed').length).toBeGreaterThan(0);
    expect(document.querySelector('.alert')).not.toBeNull();
  });

  it('warns next to the rack when no words can be made', () => {
    setup({ results: { ...resultsInitialState, results: [] } });

    expect(document.querySelector('.alert')?.textContent).toContain('No results');
  });

  it('shows no warning before solving', () => {
    setup({ results: resultsInitialState });

    expect(document.querySelector('.alert')).toBeNull();
  });
});

describe('desktop with a pointer', () => {
  it('previews on hover and clears when leaving the list', () => {
    const { store } = setup();
    const [row] = screen.getAllByTestId('result');

    fireEvent.mouseEnter(row);
    expect(store.getState().results.candidate).toBe(cat);

    fireEvent.mouseLeave(row.closest('[dir]')!);
    expect(store.getState().results.candidate).toBeNull();
  });

  it('previews on focus and clears on blur', () => {
    const { store } = setup();
    const [row] = screen.getAllByTestId('result');

    fireEvent.focus(row);
    expect(store.getState().results.candidate).toBe(cat);

    fireEvent.blur(row);
    expect(store.getState().results.candidate).toBeNull();
  });

  it('applies the result on the first click', () => {
    const { store } = setup();

    fireEvent.click(screen.getAllByTestId('result')[0]);

    expect(store.actions.map(({ type }) => type)).toContain(resultsSlice.actions.applyResult.type);
  });

  it('does not preselect the best result', () => {
    const { store } = setup();

    expect(store.getState().results.candidate).toBeNull();
  });

  it('marks the previewed row through the candidate, not through focus', () => {
    setup({ results: { ...resultsInitialState, candidate: dog, results: [cat, dog] } });

    expect(screen.getAllByTestId('result')[1].getAttribute('aria-current')).toBe('true');
  });
});

describe('touch', () => {
  it('previews on the first tap and applies on the second', () => {
    setLayout({ isCompact: false, isTouch: true });
    const { store } = setup();
    const [row] = screen.getAllByTestId('result');

    fireEvent.click(row);
    expect(store.getState().results.candidate).toBe(cat);
    expect(store.actions.map(({ type }) => type)).not.toContain(resultsSlice.actions.applyResult.type);

    fireEvent.click(row);
    expect(store.actions.map(({ type }) => type)).toContain(resultsSlice.actions.applyResult.type);
  });

  it('does nothing on hover', () => {
    setLayout({ isCompact: false, isTouch: true });
    const { store } = setup();

    fireEvent.mouseEnter(screen.getAllByTestId('result')[0]);

    expect(store.getState().results.candidate).toBeNull();
  });
});

describe('compact layout', () => {
  it('previews the best result automatically', () => {
    setLayout({ isCompact: true });
    const { store } = setup();

    expect(store.getState().results.candidate).toBe(cat);
  });

  it('does not preview outdated results', () => {
    setLayout({ isCompact: true });
    const { store } = setup({ rack: ['z'] });

    expect(store.getState().results.candidate).toBeNull();
  });

  it('previews the new best result when results change', () => {
    setLayout({ isCompact: true });
    const { store } = setup();

    act(() => {
      store.dispatch(resultsSlice.actions.changeResults([dog]));
    });

    expect(store.getState().results.candidate).toBe(dog);
  });
});

function setup(state: Partial<RootState> = {}, { onShowResults = noop } = {}) {
  return renderWithStore(<Solver onShowResults={onShowResults} />, {
    state: {
      board,
      rack: Array(7).fill(null),
      results: { ...resultsInitialState, results: [cat, dog] },
      solve: createSolveState(),
      ...state,
    },
  });
}

function createSolveState() {
  return { ...solveInitialState, lastSolvedParameters: { board, characters: [] } };
}
