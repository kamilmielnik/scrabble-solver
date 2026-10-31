import { createVerifiedWord } from '../../test/fixtures';
import type { RootState } from '../types';

import { hoveredWordInitialState } from './initialState';
import { selectHoveredWord } from './selectors';
import { hoveredWordSlice } from './slice';

const { actions, reducer } = hoveredWordSlice;

describe('hoveredWordSlice', () => {
  it('sets and clears the hovered word', () => {
    const word = createVerifiedWord();
    const state = reducer(hoveredWordInitialState, actions.set(word));

    expect(selectHoveredWord({ hoveredWord: state } as RootState)).toEqual(word);
    expect(reducer(state, actions.clear()).word).toBeNull();
  });
});
