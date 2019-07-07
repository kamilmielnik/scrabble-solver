import { createAction, handleActions } from 'redux-actions';

import localStorage, { SPLASH_COMPLETE } from 'local-storage';

export const HIDE_SPLASH = 'splash/hide';

export const hideSplash = createAction(HIDE_SPLASH);

export const initialState = {
  isShown: !localStorage.get(SPLASH_COMPLETE, false)
};

export default handleActions(
  {
    [HIDE_SPLASH]: (state) => ({
      ...state,
      isShown: false
    })
  },
  initialState
);
