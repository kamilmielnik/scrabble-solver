import { createAction, handleActions } from 'redux-actions';

export const CHANGE_RESULTS = 'results/change-results';
export const HIGHLIGHT_RESULT = 'results/highlight-result';
export const UNHIGHLIGHT_RESULT = 'results/unhighlight-result';

export const changeResults = createAction(CHANGE_RESULTS);
export const highlightResult = createAction(HIGHLIGHT_RESULT);
export const unhighlightResult = createAction(UNHIGHLIGHT_RESULT);

const initialState = [];

export const reducer = handleActions(
  {
    [CHANGE_RESULTS]: (state, { payload: results }) => results
  },
  initialState
);
