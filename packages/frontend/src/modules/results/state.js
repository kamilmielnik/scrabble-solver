import { createAction, handleActions } from 'redux-actions';

export const APPLY_RESULT = 'results/apply-result';
export const CHANGE_RESULT_CANDIDATE = 'results/change-result-candidate';
export const CHANGE_RESULTS = 'results/change-results';
export const HIGHLIGHT_RESULT = 'results/highlight-result';
export const UNHIGHLIGHT_RESULT = 'results/unhighlight-result';

export const applyResult = createAction(APPLY_RESULT);
export const changeResultCandidate = createAction(CHANGE_RESULT_CANDIDATE);
export const changeResults = createAction(CHANGE_RESULTS);
export const highlightResult = createAction(HIGHLIGHT_RESULT);
export const unhighlightResult = createAction(UNHIGHLIGHT_RESULT);

const initialState = {
  candidate: null,
  results: [],
};

export const reducer = handleActions(
  {
    [APPLY_RESULT]: (state) => ({ ...state, candidate: initialState.candidate }),

    [CHANGE_RESULT_CANDIDATE]: (state, { payload: candidate }) => ({ ...state, candidate }),

    [CHANGE_RESULTS]: (state, { payload: results }) => ({ ...state, results }),
  },
  initialState,
);
