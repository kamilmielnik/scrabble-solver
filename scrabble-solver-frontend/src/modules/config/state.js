import { createAction, handleActions } from 'redux-actions';
import { literaki } from 'scrabble-solver-commons/configs';
import { Config } from 'scrabble-solver-commons/models';

export const CHANGE_CONFIG = 'config/change-config';
export const CHANGE_LOCALE = 'config/change-locale';

export const changeConfig = createAction(CHANGE_CONFIG);
export const changeLocale = createAction(CHANGE_LOCALE);

export const initialState = new Config(literaki);

export default handleActions({
  [CHANGE_CONFIG]: (state, { payload: config }) => new Config(config)
}, initialState);
