import { combineActions, createAction, handleActions } from 'redux-actions';

export const SUBMIT_SOLVE = 'shared/submit-solve';
export const SUBMIT_SOLVE_FAILURE = 'shared/submit-solve-failure';
export const SUBMIT_SOLVE_SUCCESS = 'shared/submit-solve-success';

export const submitSolve = createAction(SUBMIT_SOLVE);
export const submitSolveFailure = createAction(SUBMIT_SOLVE_FAILURE);
export const submitSolveSuccess = createAction(SUBMIT_SOLVE_SUCCESS);

const initialState = {
  isLoading: false
};

export const reducer = handleActions(
  {
    [SUBMIT_SOLVE]: (state) => ({
      ...state,
      isLoading: true
    }),

    [combineActions(SUBMIT_SOLVE_FAILURE, SUBMIT_SOLVE_SUCCESS)]: (state) => ({
      ...state,
      isLoading: false
    })
  },
  initialState
);
