import { createAction, handleActions } from 'redux-actions';
import * as configs from '@scrabble-solver/configs';
import localStorage, { CONFIG } from 'local-storage';

export const CHANGE_CONFIG = 'config/change-config';

export const changeConfig = createAction(CHANGE_CONFIG);

export const initialState = configs[localStorage.get(CONFIG, 'scrabble')];

export default handleActions(
  {
    [CHANGE_CONFIG]: (state, { payload: config }) => config
  },
  initialState
);
