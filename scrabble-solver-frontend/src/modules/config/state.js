import { createAction, handleActions } from 'redux-actions';
import { literaki } from 'scrabble-solver-commons/configs';

export const CHANGE_CONFIG = 'config/change-config';

export const changeConfig = createAction(CHANGE_CONFIG);

export const initialState = literaki;

export default handleActions({
  [CHANGE_CONFIG]: (state, { payload: config }) => config
}, initialState);
