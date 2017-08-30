import { combineActions, createAction, handleActions } from 'redux-actions';
import { literaki } from 'scrabble-solver-commons/dist/configs';
import { Config } from 'scrabble-solver-commons/dist/models';

export const APPLY_RESULT = 'shared/apply-result';
export const CHANGE_RESULT_CANDIDATE = 'shared/change-result-candidate';
export const SUBMIT_SOLVE = 'shared/submit-solve';
export const SUBMIT_SOLVE_FAILURE = 'shared/submit-solve-failure';
export const SUBMIT_SOLVE_SUCCESS = 'shared/submit-solve-success';

export const applyResult = createAction(APPLY_RESULT);
export const changeResultCandidate = createAction(CHANGE_RESULT_CANDIDATE);
export const submitSolve = createAction(SUBMIT_SOLVE);
export const submitSolveFailure = createAction(SUBMIT_SOLVE_FAILURE);
export const submitSolveSuccess = createAction(SUBMIT_SOLVE_SUCCESS);

const initialState = {
  config: new Config(literaki),
  isLoading: false,
  resultCandidate: null
};

export default handleActions({
  [APPLY_RESULT]: (state) => ({
    ...state,
    resultCandidate: initialState.resultCandidate
  }),

  [CHANGE_RESULT_CANDIDATE]: (state, { payload: resultCandidate }) => ({
    ...state,
    resultCandidate
  }),

  [SUBMIT_SOLVE]: (state) => ({
    ...state,
    isLoading: true
  }),

  [combineActions(SUBMIT_SOLVE_FAILURE, SUBMIT_SOLVE_SUCCESS)]: (state) => ({
    ...state,
    isLoading: false
  })
}, initialState);
