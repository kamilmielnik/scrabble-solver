import { createAction, handleActions } from 'redux-actions';

export const CHANGE_CHARACTER = 'tiles/change-character';
export const CHANGE_INPUT = 'tiles/change-input';
export const CLEAR_INPUT = 'tiles/clear-input';
export const SUBMIT = 'tiles/submit';

export const changeCharacter = createAction(CHANGE_CHARACTER);
export const changeInput = createAction(CHANGE_INPUT);
export const clearInput = createAction(CLEAR_INPUT);
export const submit = createAction(SUBMIT);

const initialState = [null, null, null, null, null, null, null]; //TODO: when config is changed, initialize this with empty array of appropriate length

export default handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: input }) => input,

    [CHANGE_CHARACTER]: (state, { payload: { character, index } }) => [
      ...state.slice(0, index),
      character,
      ...state.slice(index + 1)
    ],

    [CLEAR_INPUT]: (state) => initialState
  },
  initialState
);
