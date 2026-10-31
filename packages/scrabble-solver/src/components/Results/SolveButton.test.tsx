import { Board } from '@scrabble-solver/types';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { solveInitialState, solveSlice } from '../../state/solve';
import type { RootState } from '../../state/types';
import { renderWithStore } from '../../test/render';

import { SolveButton } from './SolveButton';

describe('SolveButton', () => {
  it('solves on click when the rack has tiles and results are outdated', () => {
    const { store } = setup({ rack: ['a'] });

    fireEvent.click(getButton());

    expect(store.actions.map(({ type }) => type)).toContain(solveSlice.actions.submit.type);
  });

  it('is disabled without tiles', () => {
    setup({ board: Board.fromStringArray(['a']), rack: [null] });

    expect(getButton().disabled).toBe(true);
  });

  it('is disabled while solving', () => {
    setup({ rack: ['a'], solve: { ...solveInitialState, isLoading: true } });

    expect(getButton().disabled).toBe(true);
  });

  it('is disabled when results are up to date', () => {
    const board = Board.create(1, 1);

    setup({ board, rack: ['a'], solve: { ...solveInitialState, lastSolvedParameters: { board, characters: ['a'] } } });

    expect(getButton().disabled).toBe(true);
  });
});

function setup(state: Partial<RootState>) {
  return renderWithStore(<SolveButton />, { state });
}

function getButton(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Solve' });
}
