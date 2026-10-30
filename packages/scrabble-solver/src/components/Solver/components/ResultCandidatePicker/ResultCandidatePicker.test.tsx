import { Locale } from '@scrabble-solver/types';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { noop } from '../../../../lib/noop';
import { resultsInitialState, resultsSlice } from '../../../../state/results';
import { settingsInitialState } from '../../../../state/settings';
import { solveInitialState } from '../../../../state/solve';
import type { RootState } from '../../../../state/types';
import { createResult } from '../../../../test/fixtures';
import { renderWithStore } from '../../../../test/render';

import { ResultCandidatePicker } from './ResultCandidatePicker';

const first = createResult({ id: 1, points: 1000, word: 'cat' });
const second = createResult({ id: 2, points: 20, word: 'dog' });
const third = createResult({ id: 3, points: 10, word: 'pig' });
const results = [first, second, third];

describe('ResultCandidatePicker', () => {
  it('is disabled before the first solve', () => {
    setup({ results: resultsInitialState });

    expect(getPicker().disabled).toBe(true);
    expect(getNext().disabled).toBe(true);
    expect(getPrevious().disabled).toBe(true);
  });

  it('is disabled without results', () => {
    setup({ results: { ...resultsInitialState, results: [] } });

    expect(getPicker().disabled).toBe(true);
  });

  it('is disabled when results are outdated', () => {
    setup({ rack: ['z'] });

    expect(getPicker().disabled).toBe(true);
    expect(getNext().disabled).toBe(true);
  });

  it('stays usable with fresh results and nothing picked, offering a placeholder (#450)', () => {
    setup();

    expect(getPicker().disabled).toBe(false);
    expect(getNext().disabled).toBe(false);
    expect(getPrevious().disabled).toBe(true);
    expect(getPicker().textContent).toContain('Select...');
  });

  it('picks the first result on next when nothing is picked', () => {
    const { store } = setup();

    fireEvent.click(getNext());

    expect(store.getState().results.candidate).toBe(first);
  });

  it('shows the localized points and word of the candidate', () => {
    setup({
      results: { ...resultsInitialState, candidate: first, results },
      settings: { ...settingsInitialState, locale: Locale.PL_PL },
    });

    expect(getPicker().textContent).toContain('cat');
    expect(getPicker().textContent).toContain((1000).toLocaleString(Locale.PL_PL));
    expect(getPicker().textContent).not.toContain('Select...');
  });

  it('walks forward and back through results', () => {
    const { store } = setup({ results: { ...resultsInitialState, candidate: first, results } });

    fireEvent.click(getNext());
    expect(store.getState().results.candidate).toBe(second);

    fireEvent.click(getPrevious());
    expect(store.getState().results.candidate).toBe(first);
  });

  it('has no previous on the first result and no next on the last', () => {
    const { unmount } = setup({ results: { ...resultsInitialState, candidate: first, results } });

    expect(getPrevious().disabled).toBe(true);
    unmount();

    setup({ results: { ...resultsInitialState, candidate: third, results } });

    expect(getNext().disabled).toBe(true);
    expect(getPrevious().disabled).toBe(false);
  });

  it('joins the buttons only while both are enabled', () => {
    setup({ results: { ...resultsInitialState, candidate: second, results } });

    expect(document.querySelector('.bothEnabled')).not.toBeNull();
  });

  it('opens the results on click', () => {
    const onResultClick = mock();

    setup({}, onResultClick);
    fireEvent.click(getPicker());

    expect(onResultClick).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner while solving and an arrow otherwise', () => {
    const { unmount } = setup({ solve: { ...solveInitialState, isLoading: true } });

    expect(screen.getByRole('status')).toBeDefined();
    expect(document.querySelector('[data-icon="ChevronDown.svg"]')).toBeNull();
    unmount();

    setup();

    expect(screen.queryByRole('status')).toBeNull();
    expect(document.querySelector('[data-icon="ChevronDown.svg"]')).not.toBeNull();
  });
});

describe('InsertButton', () => {
  it('is disabled without a candidate', () => {
    setup();

    expect(getInsert().disabled).toBe(true);
  });

  it('is disabled when results are outdated', () => {
    setup({ rack: ['z'], results: { ...resultsInitialState, candidate: first, results } });

    expect(getInsert().disabled).toBe(true);
  });

  it('applies the candidate', () => {
    const { store } = setup({ results: { ...resultsInitialState, candidate: first, results } });

    fireEvent.click(getInsert());

    expect(store.actions.at(-1)).toEqual(resultsSlice.actions.applyResult(first));
  });
});

function setup(state: Partial<RootState> = {}, onResultClick = noop) {
  return renderWithStore(<ResultCandidatePicker onResultClick={onResultClick} />, {
    state: { rack: [null], results: { ...resultsInitialState, results }, ...state },
  });
}

function getPicker(): HTMLButtonElement {
  return screen.getByTestId('result-candidate-picker');
}

function getNext(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Next' });
}

function getPrevious(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Previous' });
}

function getInsert(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Insert' });
}
