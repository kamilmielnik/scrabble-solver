import { Board } from '@scrabble-solver/types';

import { createVerifiedWord } from '../../test/fixtures';
import { SortDirection, WordColumnId } from '../../types';
import { settingsInitialState } from '../settings';
import type { RootState } from '../types';

import { verifyInitialState } from './initialState';
import { groupWords } from './lib';
import {
  selectCreatedWords,
  selectInvalidWords,
  selectIsWordMatching,
  selectLastVerifiedBoard,
  selectProcessedWords,
  selectValidWords,
  selectVerify,
  selectWordCoordinates,
  selectWordsQuery,
  selectWordsSort,
} from './selectors';
import { verifySlice } from './slice';

const { actions, reducer } = verifySlice;
const cat = createVerifiedWord({ word: 'cat', x: 1, y: 1 });
const dog = createVerifiedWord({ isValid: false, word: 'dog', x: 2, y: 2 });

describe('verifySlice', () => {
  it('starts loading on submit', () => {
    expect(reducer(verifyInitialState, actions.submit()).isLoading).toBe(true);
  });

  it('stops loading on failure and keeps the previous words', () => {
    const state = { ...verifyInitialState, isLoading: true, validWords: [cat] };

    expect(reducer(state, actions.submitFailure())).toEqual({ ...state, isLoading: false });
  });

  it('stores the verified board and words on success', () => {
    const board = Board.create(1, 1);
    const state = reducer(
      { ...verifyInitialState, isLoading: true },
      actions.submitSuccess({ board, invalidWords: [dog], validWords: [cat] }),
    );

    expect(state).toEqual({
      ...verifyInitialState,
      invalidWords: [dog],
      lastSolvedParameters: { board },
      validWords: [cat],
    });
  });

  it('changes the query', () => {
    expect(reducer(verifyInitialState, actions.changeQuery('x')).query).toBe('x');
  });

  it('toggles direction on the active column and keeps it on a new one', () => {
    const toggled = reducer(verifyInitialState, actions.sort(WordColumnId.Word));
    const moved = reducer(toggled, actions.sort(WordColumnId.Validity));

    expect(toggled.sort).toEqual({ column: WordColumnId.Word, direction: SortDirection.Descending });
    expect(moved.sort).toEqual({ column: WordColumnId.Validity, direction: SortDirection.Descending });
  });
});

describe('groupWords', () => {
  it('splits words by a case-insensitive regular expression', () => {
    expect(groupWords([cat, dog], 'C.T')).toEqual({ matching: [cat], other: [dog] });
  });

  it('matches everything for an empty or invalid query', () => {
    expect(groupWords([cat, dog], '')).toEqual({ matching: [cat, dog], other: [] });
    expect(groupWords([cat], '[')).toEqual({ matching: [cat], other: [] });
  });
});

describe('selectors', () => {
  it('select raw fields', () => {
    const state = createState({ query: 'q' });

    expect(selectVerify(state)).toBe(state.verify);
    expect(selectLastVerifiedBoard(state)).toBe(state.verify.lastSolvedParameters.board);
    expect(selectInvalidWords(state)).toEqual([dog]);
    expect(selectValidWords(state)).toEqual([cat]);
    expect(selectWordsQuery(state)).toBe('q');
    expect(selectWordsSort(state)).toBe(state.verify.sort);
  });

  it('joins invalid and valid words', () => {
    expect(selectCreatedWords(createState())).toEqual([dog, cat]);
  });

  it('sorts words and floats query matches to the top', () => {
    expect(selectProcessedWords(createState())).toEqual([cat, dog]);
    expect(selectProcessedWords(createState({ query: 'dog' }))).toEqual([dog, cat]);
  });

  it('marks a row as matching by its processed position', () => {
    const state = createState({ query: 'dog' });

    expect(selectIsWordMatching(state, 0)).toBe(true);
    expect(selectIsWordMatching(state, 1)).toBe(false);
  });

  it('gives each row its coordinates', () => {
    expect(selectWordCoordinates(createState(), 0)).toBe('2B');
  });
});

function createState(verify: Partial<RootState['verify']> = {}): RootState {
  return {
    settings: settingsInitialState,
    verify: { ...verifyInitialState, invalidWords: [dog], validWords: [cat], ...verify },
  } as RootState;
}
