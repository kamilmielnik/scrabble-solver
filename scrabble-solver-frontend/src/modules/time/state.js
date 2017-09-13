import { createAction, handleActions } from 'redux-actions';

export const CHANGE_TIME = 'time/change';
export const RESET_TIME = 'time/reset';

export const changeTime = createAction(CHANGE_TIME);
export const resetTime = createAction(RESET_TIME);

const initialState = null;

export default handleActions({
  [RESET_TIME]: () => initialState,

  [CHANGE_TIME]: (state, { payload: time }) => time
}, initialState);
