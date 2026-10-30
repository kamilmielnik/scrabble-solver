import { Board } from '@scrabble-solver/types';

import type { RootState } from '../types';

import { solveInitialState } from './initialState';
import { selectLastSolvedParameters, selectSolve, selectSolveError, selectSolveIsLoading } from './selectors';
import { solveSlice } from './slice';

const { actions, reducer } = solveSlice;

describe('solveSlice', () => {
  it('starts loading and clears the error on submit', () => {
    const state = { ...solveInitialState, error: new Error('x') };

    expect(reducer(state, actions.submit())).toEqual({ ...solveInitialState, error: undefined, isLoading: true });
  });

  it('stores the error and keeps the last parameters on failure', () => {
    const error = new Error('x');
    const state = { ...solveInitialState, isLoading: true };

    expect(reducer(state, actions.submitFailure(error))).toEqual({ ...solveInitialState, error, isLoading: false });
  });

  it('remembers solved parameters on success', () => {
    const parameters = { board: Board.create(1, 1), characters: ['a'] };
    const state = { ...solveInitialState, error: new Error('x'), isLoading: true };

    expect(reducer(state, actions.submitSuccess(parameters))).toEqual({
      error: undefined,
      isLoading: false,
      lastSolvedParameters: parameters,
    });
  });

  it('resets', () => {
    expect(reducer({ ...solveInitialState, isLoading: true }, actions.reset())).toBe(solveInitialState);
  });
});

describe('selectors', () => {
  it('select each field', () => {
    const solve = { ...solveInitialState, error: new Error('x'), isLoading: true };
    const state = { solve } as RootState;

    expect(selectSolve(state)).toBe(solve);
    expect(selectSolveError(state)).toBe(solve.error);
    expect(selectSolveIsLoading(state)).toBe(true);
    expect(selectLastSolvedParameters(state)).toBe(solve.lastSolvedParameters);
  });

  it('exposes only real errors', () => {
    expect(selectSolveError({ solve: { ...solveInitialState, error: 'text' } } as RootState)).toBeUndefined();
  });
});
