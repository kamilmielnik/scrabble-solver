import { initialize } from '../actions';
import type { RootState } from '../types';

import { appInitialState } from './initialState';
import { selectIsHydrated, selectVersion } from './selectors';
import { appSlice } from './slice';

const { actions, reducer } = appSlice;

describe('appSlice', () => {
  it('becomes hydrated', () => {
    expect(reducer(appInitialState, actions.hydrated()).isHydrated).toBe(true);
  });

  it('records the version carried by initialize without marking hydration', () => {
    expect(reducer(appInitialState, initialize({ version: '1.2.3' }))).toEqual({ isHydrated: false, version: '1.2.3' });
  });

  it('exposes hydration and version through selectors', () => {
    const state = { app: { isHydrated: true, version: '1' } } as RootState;

    expect(selectIsHydrated(state)).toBe(true);
    expect(selectVersion(state)).toBe('1');
  });
});
