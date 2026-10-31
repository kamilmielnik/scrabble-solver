import { Game } from '@scrabble-solver/types';

import { createResult } from '../../test/fixtures';
import { ResultColumnId, SortDirection } from '../../types';
import { cellFiltersInitialState } from '../cellFilters';
import { settingsInitialState } from '../settings';
import type { RootState } from '../types';

import { resultsInitialState } from './initialState';
import {
  selectIsResultMatching,
  selectProcessedResults,
  selectResultCandidate,
  selectResultCandidateCells,
  selectResultCandidateIndex,
  selectResultCandidateTiles,
  selectResultCoordinates,
  selectResultsQuery,
  selectResultsResults,
  selectResultsSort,
} from './selectors';
import { resultsSlice } from './slice';

const { actions, reducer } = resultsSlice;

describe('resultsSlice', () => {
  const candidate = createResult();

  it('forgets everything when a result is applied', () => {
    const state = { ...resultsInitialState, candidate, query: 'x', results: [candidate] };

    expect(reducer(state, actions.applyResult(candidate))).toBe(resultsInitialState);
  });

  it('changes the query', () => {
    expect(reducer(resultsInitialState, actions.changeQuery('cat')).query).toBe('cat');
  });

  it('changes the candidate and keeps the state identity when it is the same one', () => {
    const state = reducer(resultsInitialState, actions.changeResultCandidate(candidate));

    expect(state.candidate).toBe(candidate);
    expect(reducer(state, actions.changeResultCandidate(candidate))).toBe(state);
  });

  it('clears the candidate and the query when new results arrive but keeps the sort', () => {
    const sort = { column: ResultColumnId.Word, direction: SortDirection.Ascending };
    const state = { ...resultsInitialState, candidate, query: 'cat', sort };
    const results = [candidate];

    expect(reducer(state, actions.changeResults(results))).toEqual({ candidate: null, query: '', results, sort });
  });

  it('toggles direction on the same column and keeps direction on a new column', () => {
    const toggled = reducer(resultsInitialState, actions.sort(ResultColumnId.Points));
    const moved = reducer(toggled, actions.sort(ResultColumnId.Word));

    expect(toggled.sort).toEqual({ column: ResultColumnId.Points, direction: SortDirection.Ascending });
    expect(moved.sort).toEqual({ column: ResultColumnId.Word, direction: SortDirection.Ascending });
  });

  it('resets', () => {
    expect(reducer({ ...resultsInitialState, query: 'x' }, actions.reset())).toBe(resultsInitialState);
  });
});

describe('selectors', () => {
  const low = createResult({ id: 1, points: 5, word: 'dog', x: 1, y: 1 });
  const high = createResult({ id: 2, points: 50, word: 'cat', x: 2, y: 2 });

  it('selects raw fields', () => {
    const state = createState({ candidate: low, query: 'q', results: [low] });

    expect(selectResultCandidate(state)).toBe(low);
    expect(selectResultsQuery(state)).toBe('q');
    expect(selectResultsResults(state)).toEqual([low]);
    expect(selectResultsSort(state)).toBe(state.results.sort);
  });

  it('derives candidate cells and tiles, empty without a candidate', () => {
    const withCandidate = createState({ candidate: low });
    const withoutCandidate = createState({});

    expect(selectResultCandidateCells(withCandidate)).toBe(low.cells);
    expect(selectResultCandidateTiles(withCandidate)).toBe(low.tiles);
    expect(selectResultCandidateCells(withoutCandidate)).toEqual([]);
    expect(selectResultCandidateTiles(withoutCandidate)).toEqual([]);
  });

  it('sorts results by the current sort', () => {
    expect(selectProcessedResults(createState({ results: [low, high] }))).toEqual([high, low]);
  });

  it('is undefined before any solve', () => {
    expect(selectProcessedResults(createState({}))).toBeUndefined();
  });

  /**
   * #342 - Incorrect sorting when filtering
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/342
   */
  it('floats query matches to the top instead of filtering the rest out (#342)', () => {
    expect(selectProcessedResults(createState({ query: 'dog', results: [low, high] }))).toEqual([low, high]);
  });

  it('floats cell filter matches to the top', () => {
    const state = createState({ results: [low, high] }, [{ type: 'include', x: 1, y: 1 }]);

    expect(selectProcessedResults(state)).toEqual([low, high]);
  });

  describe('selectResultCandidateIndex', () => {
    it('finds the candidate in processed order, by id', () => {
      expect(selectResultCandidateIndex(createState({ candidate: low, results: [low, high] }))).toBe(1);
    });

    it('is undefined with no candidate, no results or a candidate outside results', () => {
      const other = createResult({ id: 3 });

      expect(selectResultCandidateIndex(createState({ results: [low] }))).toBeUndefined();
      expect(selectResultCandidateIndex(createState({ candidate: low }))).toBeUndefined();
      expect(selectResultCandidateIndex(createState({ candidate: other, results: [low] }))).toBeUndefined();
    });
  });

  describe('selectIsResultMatching', () => {
    it('is false without results', () => {
      expect(selectIsResultMatching(createState({}), 0)).toBe(false);
    });

    it('is true for a match and false for a dimmed row', () => {
      const state = createState({ query: 'dog', results: [low, high] });

      expect(selectIsResultMatching(state, 0)).toBe(true);
      expect(selectIsResultMatching(state, 1)).toBe(false);
    });

    it('applies cell filters on top of the query', () => {
      const state = createState({ query: 'dog', results: [low] }, [{ type: 'exclude', x: 1, y: 1 }]);

      expect(selectIsResultMatching(state, 0)).toBe(false);
    });
  });

  describe('selectResultCoordinates', () => {
    it('is empty without results', () => {
      expect(selectResultCoordinates(createState({}), 0)).toBe('');
    });

    it('locates the result at an index', () => {
      expect(selectResultCoordinates(createState({ results: [low] }), 0)).toBe('2B');
    });

    it('follows the coordinates setting', () => {
      const state = createState({ results: [low] });
      const alternative = { ...state, settings: { ...state.settings, showCoordinates: 'alternative' as const } };

      expect(selectResultCoordinates(alternative, 0)).toBe('B2');
    });
  });
});

function createState(
  results: Partial<RootState['results']>,
  cellFilters: RootState['cellFilters'] = cellFiltersInitialState,
): RootState {
  return {
    cellFilters,
    results: { ...resultsInitialState, ...results },
    settings: { ...settingsInitialState, game: Game.Scrabble },
  } as RootState;
}
