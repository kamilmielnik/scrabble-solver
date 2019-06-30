import { createAction, handleActions } from 'redux-actions';
import { scrabble } from '@scrabble-solver/configs';

export const CHANGE_CONFIG = 'config/change-config';

export const changeConfig = createAction(CHANGE_CONFIG);

export const initialState = scrabble;

export default handleActions(
  {
    [CHANGE_CONFIG]: (state, { payload: config }) => config
  },
  initialState
);
