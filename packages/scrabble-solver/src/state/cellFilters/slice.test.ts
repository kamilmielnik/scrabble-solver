import { Cell } from '@scrabble-solver/types';

import type { RootState } from '../types';

import { cellFiltersInitialState } from './initialState';
import { toggleCellFilterState } from './lib';
import { selectCellFilter, selectCellFilters } from './selectors';
import { cellFiltersSlice } from './slice';

const { actions, reducer } = cellFiltersSlice;

describe('toggleCellFilterState', () => {
  it('cycles include, exclude, none', () => {
    expect(toggleCellFilterState('include')).toBe('exclude');
    expect(toggleCellFilterState('exclude')).toBeNull();
  });
});

describe('cellFiltersSlice', () => {
  describe('toggle', () => {
    it('cycles a cell through include, exclude and no filter', () => {
      const included = reducer(cellFiltersInitialState, actions.toggle({ x: 1, y: 2 }));
      const excluded = reducer(included, actions.toggle({ x: 1, y: 2 }));
      const removed = reducer(excluded, actions.toggle({ x: 1, y: 2 }));

      expect(included).toEqual([{ type: 'include', x: 1, y: 2 }]);
      expect(excluded).toEqual([{ type: 'exclude', x: 1, y: 2 }]);
      expect(removed).toEqual([]);
    });

    it('keeps filters of other cells while toggling', () => {
      const state = [
        { type: 'include' as const, x: 0, y: 0 },
        { type: 'exclude' as const, x: 0, y: 1 },
        { type: 'exclude' as const, x: 1, y: 0 },
      ];

      expect(reducer(state, actions.toggle({ x: 0, y: 1 }))).toEqual([state[0], state[2]]);
      expect(reducer(state, actions.toggle({ x: 0, y: 0 }))).toEqual([
        { ...state[0], type: 'exclude' },
        state[1],
        state[2],
      ]);
    });
  });

  it('cancels the filter of one cell only', () => {
    const state = [
      { type: 'include' as const, x: 0, y: 0 },
      { type: 'include' as const, x: 1, y: 0 },
      { type: 'include' as const, x: 0, y: 1 },
    ];

    expect(reducer(state, actions.cancel({ x: 0, y: 0 }))).toEqual([state[1], state[2]]);
  });

  it('removes filters only of the given cells', () => {
    const state = [
      { type: 'include' as const, x: 0, y: 0 },
      { type: 'exclude' as const, x: 1, y: 1 },
    ];

    expect(reducer(state, actions.removeCells([new Cell({ x: 0, y: 0 })]))).toEqual([state[1]]);
    expect(reducer(state, actions.removeCells([]))).toEqual(state);
  });

  it('resets to no filters', () => {
    expect(reducer([{ type: 'include', x: 0, y: 0 }], actions.reset())).toEqual([]);
  });
});

describe('selectors', () => {
  const state = { cellFilters: [{ type: 'include', x: 1, y: 2 }] } as unknown as RootState;

  it('selects all filters', () => {
    expect(selectCellFilters(state)).toBe(state.cellFilters);
  });

  it('finds the filter of a cell by both coordinates', () => {
    expect(selectCellFilter(state, { x: 1, y: 2 })).toBe(state.cellFilters[0]);
    expect(selectCellFilter(state, { x: 2, y: 1 })).toBeUndefined();
    expect(selectCellFilter(state, { x: 1, y: 0 })).toBeUndefined();
  });
});
