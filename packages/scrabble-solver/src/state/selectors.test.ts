/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Board } from '@scrabble-solver/types';

import { createResult, createVerifiedWord } from '../test/fixtures';
import { createTestStore } from '../test/store';

import { boardInitialState } from './board';
import { hoveredWordInitialState } from './hoveredWord';
import { resultsInitialState } from './results';
import {
  selectAreResultsOutdated,
  selectRemainingTiles,
  selectUpToDateHoveredWord,
  selectUpToDateResults,
} from './selectors';
import { solveInitialState } from './solve';
import type { RootState } from './types';
import { verifyInitialState } from './verify';

describe('selectAreResultsOutdated', () => {
  const board = Board.fromStringArray(['a ']);

  it('is false while board and rack match the last solve, in any tile order', () => {
    const state = createState({
      board,
      rack: ['b', null, 'a'],
      solve: { ...solveInitialState, lastSolvedParameters: { board: board.clone(), characters: ['a', 'b'] } },
    });

    expect(selectAreResultsOutdated(state)).toBe(false);
  });

  it('is true when the board changed', () => {
    const state = createState({
      board: Board.fromStringArray(['ab']),
      solve: { ...solveInitialState, lastSolvedParameters: { board, characters: [] } },
    });

    expect(selectAreResultsOutdated(state)).toBe(true);
  });

  it('is true when the rack changed', () => {
    const state = createState({
      board,
      rack: ['a'],
      solve: { ...solveInitialState, lastSolvedParameters: { board, characters: ['b'] } },
    });

    expect(selectAreResultsOutdated(state)).toBe(true);
  });
});

describe('selectUpToDateResults', () => {
  const result = createResult();
  const results = { ...resultsInitialState, results: [result] };

  it('returns results that match the current board and rack', () => {
    expect(selectUpToDateResults(createState({ results }))).toEqual([result]);
  });

  it('hides outdated results', () => {
    expect(selectUpToDateResults(createState({ rack: ['z'], results }))).toBeNull();
  });

  it('hides results after a failed solve', () => {
    const solve = { ...solveInitialState, error: new Error('x') };

    expect(selectUpToDateResults(createState({ results, solve }))).toBeNull();
  });

  it('is null before any solve', () => {
    expect(selectUpToDateResults(createState({}))).toBeNull();
  });
});

describe('selectUpToDateHoveredWord', () => {
  const word = createVerifiedWord();
  const hoveredWord = { word };

  it('returns the word while the board is the verified one', () => {
    expect(selectUpToDateHoveredWord(createState({ hoveredWord }))).toBe(word);
  });

  it('hides the word once the board moved on from the verified board', () => {
    expect(selectUpToDateHoveredWord(createState({ board: Board.create(2, 2), hoveredWord }))).toBeNull();
  });

  it('is null when no word is hovered', () => {
    expect(selectUpToDateHoveredWord(createState({ hoveredWord: hoveredWordInitialState }))).toBeNull();
  });
});

describe('selectRemainingTiles', () => {
  it('counts tiles from the board and the rack', () => {
    const state = createState({ board: Board.fromStringArray(['a ']), rack: ['a', 'b'] });
    const tiles = selectRemainingTiles(state);

    expect(tiles.find((tile) => tile.character === 'a')?.usedCount).toBe(2);
    expect(tiles.find((tile) => tile.character === 'b')?.usedCount).toBe(1);
  });
});

function createState(overrides: Partial<RootState>): RootState {
  return {
    ...createTestStore().getState(),
    board: boardInitialState,
    verify: verifyInitialState,
    rack: [],
    ...overrides,
  };
}
