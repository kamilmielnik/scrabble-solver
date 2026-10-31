import { BLANK } from '@scrabble-solver/constants';
import { Tile } from '@scrabble-solver/types';

import type { RootState } from '../types';

import { rackDefaultState } from './initialState';
import { selectCharacters, selectRack } from './selectors';
import { rackSlice } from './slice';

const { actions, reducer } = rackSlice;

describe('rackSlice', () => {
  describe('changeCharacter', () => {
    it('replaces one slot', () => {
      expect(reducer(['a', 'b', null], actions.changeCharacter({ character: 'x', index: 1 }))).toEqual([
        'a',
        'x',
        null,
      ]);
    });

    it('clears a slot with null', () => {
      expect(reducer(['a'], actions.changeCharacter({ character: null, index: 0 }))).toEqual([null]);
    });
  });

  describe('changeCharacters', () => {
    it('writes characters from the given index', () => {
      expect(reducer([null, null, null], actions.changeCharacters({ characters: ['a', 'b'], index: 1 }))).toEqual([
        null,
        'a',
        'b',
      ]);
    });

    it('never grows the rack past its size', () => {
      expect(reducer([null, null], actions.changeCharacters({ characters: ['a', 'b', 'c'], index: 1 }))).toEqual([
        null,
        'a',
      ]);
    });

    it('keeps the same state when there is nothing to write', () => {
      const state = ['a'];

      expect(reducer(state, actions.changeCharacters({ characters: [], index: 0 }))).toBe(state);
    });
  });

  describe('groupTiles', () => {
    it('moves tiles left, keeping their order', () => {
      expect(reducer([null, 'b', null, 'a'], actions.groupTiles('left'))).toEqual(['b', 'a', null, null]);
    });

    it('moves tiles right, keeping their order', () => {
      expect(reducer(['b', null, 'a', null], actions.groupTiles('right'))).toEqual([null, null, 'b', 'a']);
    });

    it('does nothing when grouping is off', () => {
      const state = [null, 'a'];

      expect(reducer(state, actions.groupTiles(null))).toBe(state);
    });

    it('keeps the state identity when tiles are already grouped', () => {
      const state = ['a', null];

      expect(reducer(state, actions.groupTiles('left'))).toBe(state);
    });
  });

  describe('init', () => {
    it('replaces the rack', () => {
      expect(reducer(['a'], actions.init(['b']))).toEqual(['b']);
    });

    it('keeps the state identity when the rack is unchanged', () => {
      const state = ['a', null];

      expect(reducer(state, actions.init(['a', null]))).toBe(state);
    });
  });

  describe('removeTiles', () => {
    it('removes used letters', () => {
      const tiles = [new Tile({ character: 'a' })];

      expect(reducer(['a', 'b'], actions.removeTiles(tiles))).toEqual([null, 'b']);
    });

    it('removes a blank from the rack for a tile played as a blank', () => {
      const tiles = [new Tile({ character: 'x', isBlank: true })];

      expect(reducer(['a', BLANK], actions.removeTiles(tiles))).toEqual(['a', null]);
    });

    it('removes each tile only once when the rack holds duplicates', () => {
      const tiles = [new Tile({ character: 'a' })];

      expect(reducer(['a', 'a'], actions.removeTiles(tiles))).toEqual([null, 'a']);
    });
  });

  it('resets to empty slots', () => {
    expect(reducer(['a'], actions.reset())).toBe(rackDefaultState);
  });
});

describe('selectors', () => {
  it('selects the rack and its characters without empty slots', () => {
    const state = { rack: ['a', null, 'b'] } as RootState;

    expect(selectRack(state)).toBe(state.rack);
    expect(selectCharacters(state)).toEqual(['a', 'b']);
  });
});
