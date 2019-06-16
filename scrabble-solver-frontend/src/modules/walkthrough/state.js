import { createAction, handleActions } from 'redux-actions';

export const HIDE_WALKTHROUGH = 'walktrough/hide';
export const SHOW_WALKTHROUGH = 'walktrough/show';

export const hideWalkthrough = createAction(HIDE_WALKTHROUGH);
export const showWalkthrough = createAction(SHOW_WALKTHROUGH);

const initialState = {
  showWalkthrough: false
};

export default handleActions(
  {
    [HIDE_WALKTHROUGH]: (state) => ({
      ...state,
      showWalkthrough: false
    }),

    [SHOW_WALKTHROUGH]: (state) => ({
      ...state,
      showWalkthrough: true
    })
  },
  initialState
);
