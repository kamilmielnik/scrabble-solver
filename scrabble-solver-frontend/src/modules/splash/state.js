import { createAction, handleActions } from 'redux-actions';

export const HIDE = 'splash/hide';

export const hide = createAction(HIDE);

export const initialState = {
  isShown: true
};

export default handleActions({
  [HIDE]: (state) => ({
    ...state,
    isShown: false
  })
}, initialState);
