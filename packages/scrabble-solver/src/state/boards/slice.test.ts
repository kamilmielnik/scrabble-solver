import { describe, expect, it } from 'bun:test';

import { boardsInitialState } from './initialState';
import { getNextActiveBoardId, getNextBoardId } from './lib';
import { boardsSlice } from './slice';
import { type BoardSnapshot, type BoardsState } from './types';

const { activated, created, init, removed, renamed } = boardsSlice.actions;
const reduce = boardsSlice.reducer;

const snapshot = (character: string): BoardSnapshot => ({
  board: [[{ isEmpty: false, tile: { character, isBlank: false }, x: 0, y: 0 }]],
  cellFilters: [],
  rack: [character],
});

const outgoing = (id: string, character = 'a') => ({ id, snapshot: snapshot(character) });

/**
 * The slice's invariant -- that `saved` never holds the active board, whose
 * state lives in the board/rack/cellFilters slices instead -- is a convention
 * rather than something the types enforce, so it is asserted directly here
 * after every transition.
 */
const expectInvariant = (state: BoardsState): void => {
  expect(Object.keys(state.saved)).not.toContain(state.activeId);
  expect(state.order).toContain(state.activeId);

  for (const id of Object.keys(state.saved)) {
    expect(state.order).toContain(id);
  }
};

describe('boardsSlice', () => {
  describe('activated', () => {
    it('stores the outgoing board and takes over the incoming one', () => {
      const withTwo = reduce(boardsInitialState, created({ id: 'board-2', outgoing: outgoing('board-1') }));
      const state = reduce(withTwo, activated({ id: 'board-1', outgoing: outgoing('board-2', 'b') }));

      expect(state.activeId).toBe('board-1');
      expect(state.saved['board-2']).toEqual(snapshot('b'));
      expect(state.saved['board-1']).toBeUndefined();
      expectInvariant(state);
    });

    it('ignores a board that does not exist, rather than stranding the active one', () => {
      const state = reduce(boardsInitialState, activated({ id: 'nope', outgoing: outgoing('board-1') }));

      expect(state).toBe(boardsInitialState);
      expectInvariant(state);
    });
  });

  describe('created', () => {
    it('appends the board, names it, and makes it active', () => {
      const state = reduce(boardsInitialState, created({ id: 'board-2', outgoing: outgoing('board-1') }));

      expect(state.order).toEqual(['board-1', 'board-2']);
      expect(state.activeId).toBe('board-2');
      // Unnamed: the tab is labelled by its position until renamed.
      expect(state.names['board-2']).toBeUndefined();
      // The new board is active and therefore empty, not saved.
      expect(state.saved['board-2']).toBeUndefined();
      expect(state.saved['board-1']).toEqual(snapshot('a'));
      expectInvariant(state);
    });
  });

  describe('removed', () => {
    const withThree = [
      created({ id: 'board-2', outgoing: outgoing('board-1') }),
      created({ id: 'board-3', outgoing: outgoing('board-2', 'b') }),
    ].reduce(reduce, boardsInitialState);

    it('removes an inactive board without disturbing the active one', () => {
      const state = reduce(withThree, removed({ id: 'board-1' }));

      expect(state.order).toEqual(['board-2', 'board-3']);
      expect(state.activeId).toBe('board-3');
      expect(state.saved['board-1']).toBeUndefined();
      expect(state.names['board-1']).toBeUndefined();
      expectInvariant(state);
    });

    it('hands over to the requested board when removing the active one', () => {
      const state = reduce(withThree, removed({ id: 'board-3', nextActiveId: 'board-2' }));

      expect(state.order).toEqual(['board-1', 'board-2']);
      expect(state.activeId).toBe('board-2');
      expectInvariant(state);
    });

    it('falls back to the first board when handed a next board that does not exist', () => {
      const state = reduce(withThree, removed({ id: 'board-3', nextActiveId: 'nope' }));

      expect(state.activeId).toBe('board-1');
      expectInvariant(state);
    });

    it('refuses to remove the last board, which would leave no way back', () => {
      const state = reduce(boardsInitialState, removed({ id: 'board-1' }));

      expect(state).toBe(boardsInitialState);
      expect(state.order).toHaveLength(1);
    });
  });

  describe('renamed', () => {
    it('trims the name and ignores unknown boards', () => {
      expect(reduce(boardsInitialState, renamed({ id: 'board-1', name: '  Anna  ' })).names['board-1']).toBe('Anna');
      expect(reduce(boardsInitialState, renamed({ id: 'nope', name: 'x' }))).toBe(boardsInitialState);
    });
  });

  describe('init', () => {
    it('restores a persisted collection, dropping the active board from saved', () => {
      const state = reduce(
        boardsInitialState,
        init({
          metadata: { activeId: 'b', names: { a: 'One' }, order: ['a', 'b'] },
          saved: { a: snapshot('a'), b: snapshot('b') },
        }),
      );

      expect(state.order).toEqual(['a', 'b']);
      expect(state.activeId).toBe('b');
      expect(state.saved.b).toBeUndefined();
      expect(state.saved.a).toEqual(snapshot('a'));
      expectInvariant(state);
    });

    it('ignores metadata whose active board is not in its own order', () => {
      const state = reduce(
        boardsInitialState,
        init({ metadata: { activeId: 'missing', names: {}, order: ['a'] }, saved: {} }),
      );

      expect(state).toBe(boardsInitialState);
    });

    it('ignores an empty collection', () => {
      const state = reduce(boardsInitialState, init({ metadata: { activeId: 'a', names: {}, order: [] }, saved: {} }));

      expect(state).toBe(boardsInitialState);
    });
  });
});

describe('getNextBoardId', () => {
  it('skips ids already in use, so a removal cannot alias a saved board', () => {
    expect(getNextBoardId({ order: [] })).toBe('board-1');
    expect(getNextBoardId({ order: ['board-1', 'board-3'] })).toBe('board-2');
    expect(getNextBoardId({ order: ['board-1', 'board-2'] })).toBe('board-3');
  });
});

describe('getNextActiveBoardId', () => {
  it('moves right, or left when removing the last tab', () => {
    expect(getNextActiveBoardId({ id: 'a', order: ['a', 'b', 'c'] })).toBe('b');
    expect(getNextActiveBoardId({ id: 'c', order: ['a', 'b', 'c'] })).toBe('b');
    expect(getNextActiveBoardId({ id: 'a', order: ['a'] })).toBeUndefined();
  });
});
