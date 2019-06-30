import { createAction, handleActions } from 'redux-actions';

export const CHANGE_INPUT = 'tiles/change-input';
export const CLEAR_INPUT = 'tiles/clear-input';
export const SUBMIT = 'tiles/submit';

export const changeInput = createAction(CHANGE_INPUT);
export const clearInput = createAction(CLEAR_INPUT);
export const submit = createAction(SUBMIT);

const initialState = {
  input: ''
};

export default handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: input }) => ({
      ...state,
      input
    }),

    [CLEAR_INPUT]: (state) => ({
      ...state,
      input: initialState.input
    })
  },
  initialState
);
