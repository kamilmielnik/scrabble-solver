import { describe, expect, it } from 'bun:test';

import { createTestStore } from '../test/store';

import { store } from './store';

describe('store', () => {
  it('holds a slice for every part of the root state', () => {
    expect(Object.keys(store.getState()).sort()).toEqual([
      'app',
      'board',
      'cellFilters',
      'dictionary',
      'hoveredTile',
      'hoveredWord',
      'i18n',
      'rack',
      'results',
      'settings',
      'solve',
      'verify',
    ]);
  });

  it('has the same shape as the store used by tests', () => {
    expect(Object.keys(createTestStore().getState()).sort()).toEqual(Object.keys(store.getState()).sort());
  });

  it('accepts class instances in state, which a serializable check would reject', () => {
    const { board } = store.getState();

    expect(board.constructor.name).toBe('Board');
  });
});
