import { createAction, handleActions } from 'redux-actions';
import { literaki } from 'scrabble-solver-commons/dist/configs';
import { Config } from 'scrabble-solver-commons/dist/models';

export const CHANGE_CONFIG = 'config/change-config';

export const changeConfig = createAction(CHANGE_CONFIG);

export const initialState = new Config(literaki);

export default handleActions({
  [CHANGE_CONFIG]: (state, { payload: config }) => new Config(config)
}, initialState);
