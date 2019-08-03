import { createAction, handleActions } from 'redux-actions';

export const APPLY_RESULT = 'result-candidate/apply';
export const CHANGE_RESULT_CANDIDATE = 'result-candidate/change';

export const applyResult = createAction(APPLY_RESULT);
export const changeResultCandidate = createAction(CHANGE_RESULT_CANDIDATE);

const initialState = null;

export const reducer = handleActions(
  {
    [APPLY_RESULT]: () => initialState,

    [CHANGE_RESULT_CANDIDATE]: (state, { payload: resultCandidate }) => resultCandidate
  },
  initialState
);
