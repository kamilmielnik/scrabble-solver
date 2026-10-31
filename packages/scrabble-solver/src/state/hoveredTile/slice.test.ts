import type { RootState } from '../types';

import { hoveredTileInitialState } from './initialState';
import { selectHoveredCharacter } from './selectors';
import { hoveredTileSlice } from './slice';

const { actions, reducer } = hoveredTileSlice;

describe('hoveredTileSlice', () => {
  it('sets and clears the hovered character', () => {
    const state = reducer(hoveredTileInitialState, actions.set('a'));

    expect(selectHoveredCharacter({ hoveredTile: state } as RootState)).toBe('a');
    expect(reducer(state, actions.clear()).character).toBeNull();
  });
});
