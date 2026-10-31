/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Board } from '@scrabble-solver/types';

import { resultsInitialState } from '../../state/results';
import { settingsInitialState } from '../../state/settings';
import { solveInitialState } from '../../state/solve';
import type { RootState } from '../../state/types';
import { verifyInitialState } from '../../state/verify';
import { createResult, createVerifiedWord } from '../../test/fixtures';
import { createTestStore } from '../../test/store';

import { selectHoveredWordCells, selectReachableCells, selectRowsWithCandidate } from './selectors';

describe('selectRowsWithCandidate', () => {
  it('returns board cells without a candidate', () => {
    const board = Board.create(2, 1);
    const rows = selectRowsWithCandidate(createState({ board }));

    expect(rows[0][0]).toBe(board.rows[0][0]);
  });

  it('overlays the candidate cells on the board', () => {
    const candidate = createResult({ word: 'at', x: 0, y: 0 });
    const rows = selectRowsWithCandidate(
      createState({ board: Board.create(3, 1), results: { ...resultsInitialState, candidate } }),
    );

    expect(rows[0][0]).toBe(candidate.cells[0]);
    expect(rows[0][1]).toBe(candidate.cells[1]);
    expect(rows[0][2].isEmpty).toBe(true);
  });
});

/**
 * #427 - Highlight created words on board on hover
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/427
 */
describe('selectHoveredWordCells', () => {
  const board = Board.fromStringArray(['at', '  ']);
  const verify = { ...verifyInitialState, lastSolvedParameters: { board } };

  it('is null without a hovered word (#427)', () => {
    expect(selectHoveredWordCells(createState({ board, verify }))).toBeNull();
  });

  it('marks the cells of the hovered word (#427)', () => {
    const hoveredWord = { word: createVerifiedWord({ word: 'at', x: 0, y: 0 }) };

    expect(selectHoveredWordCells(createState({ board, hoveredWord, verify }))).toEqual([
      [true, true],
      [false, false],
    ]);
  });

  it('is null once the board moved past the verified one (#427)', () => {
    const hoveredWord = { word: createVerifiedWord({ word: 'at', x: 0, y: 0 }) };

    expect(selectHoveredWordCells(createState({ board: Board.create(2, 2), hoveredWord, verify }))).toBeNull();
  });
});

/**
 * #198 - Highlight unreachable cells
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/198
 */
describe('selectReachableCells', () => {
  const board = Board.fromStringArray(['     ', '     ', '  a  ', '     ', '     ']);
  const settings = { ...settingsInitialState, highlightUnreachableCells: true };

  it('is null when the setting is off (#198)', () => {
    expect(selectReachableCells(createState({ board, rack: ['a'] }))).toBeNull();
  });

  it('is null with an empty rack (#198)', () => {
    expect(selectReachableCells(createState({ board, rack: [null], settings }))).toBeNull();
  });

  it('estimates from the rack size while results are not available (#198)', () => {
    const reachable = selectReachableCells(createState({ board, rack: ['a'], settings }));

    expect(reachable?.[1][2]).toBe(true);
    expect(reachable?.[0][2]).toBe(false);
  });

  /**
   * #430 - Highlight unreachable cells includes current results
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/430
   */
  it('uses the exact cells of up-to-date results (#430)', () => {
    const results = { ...resultsInitialState, results: [createResult({ word: 'at', x: 0, y: 0 })] };
    const solve = { ...solveInitialState, lastSolvedParameters: { board, characters: ['a'] } };
    const reachable = selectReachableCells(createState({ board, rack: ['a'], results, settings, solve }));

    expect(reachable?.[0][0]).toBe(true);
    expect(reachable?.[1][2]).toBe(false);
  });

  /**
   * #430 - Highlight unreachable cells includes current results
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/430
   */
  it('falls back to the estimate once results are outdated (#430)', () => {
    const results = { ...resultsInitialState, results: [createResult({ word: 'at', x: 0, y: 0 })] };
    const solve = { ...solveInitialState, lastSolvedParameters: { board, characters: ['a'] } };
    const reachable = selectReachableCells(createState({ board, rack: ['a', 'b'], results, settings, solve }));

    expect(reachable?.[1][2]).toBe(true);
  });

  /**
   * #430 - Highlight unreachable cells includes current results
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/430
   */
  it('reaches no empty cell when up-to-date results are empty (#430)', () => {
    const results = { ...resultsInitialState, results: [] };
    const solve = { ...solveInitialState, lastSolvedParameters: { board, characters: ['a'] } };
    const reachable = selectReachableCells(createState({ board, rack: ['a'], results, settings, solve }));

    expect(reachable?.[1][2]).toBe(false);
    expect(reachable?.[2][2]).toBe(true);
  });
});

function createState(overrides: Partial<RootState>): RootState {
  return { ...createTestStore().getState(), ...overrides };
}
