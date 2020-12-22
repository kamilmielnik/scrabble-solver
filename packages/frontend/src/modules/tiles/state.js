import { createAction, handleActions } from 'redux-actions';

import { zipCharactersAndTiles } from './utils';

export const CHANGE_CHARACTER = 'tiles/change-character';
export const REMOVE_TILES = 'tiles/remove-tiles';
export const SUBMIT = 'tiles/submit';

export const changeCharacter = createAction(CHANGE_CHARACTER);
export const removeTiles = createAction(REMOVE_TILES);
export const submit = createAction(SUBMIT);

// TODO: when config is changed, initialize this with empty array of appropriate length
const initialState = [null, null, null, null, null, null, null];

export const reducer = handleActions(
  {
    [CHANGE_CHARACTER]: (state, { payload: { character, index } }) => [
      ...state.slice(0, index),
      character,
      ...state.slice(index + 1),
    ],

    [REMOVE_TILES]: (state, { payload: tiles }) =>
      zipCharactersAndTiles(state, tiles).map(({ character, tile }) => (tile ? null : character)),
  },
  initialState,
);
