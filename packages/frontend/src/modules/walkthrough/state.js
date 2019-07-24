import { createAction, handleActions } from 'redux-actions';

export const HIDE_WALKTHROUGH = 'walktrough/hide';
export const SHOW_WALKTHROUGH = 'walktrough/show';

export const hideWalkthrough = createAction(HIDE_WALKTHROUGH);
export const showWalkthrough = createAction(SHOW_WALKTHROUGH);

const initialState = {
  walkthroughShown: false
};

export const reducer = handleActions(
  {
    [HIDE_WALKTHROUGH]: (state) => ({
      ...state,
      walkthroughShown: false
    }),

    [SHOW_WALKTHROUGH]: (state) => ({
      ...state,
      walkthroughShown: true
    })
  },
  initialState
);
