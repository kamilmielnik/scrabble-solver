import { createAction, handleActions } from 'redux-actions';

export const CHANGE_INPUT = 'dictionary/change-input';
export const CLEAR_INPUT = 'dictionary/clear-input';
export const SEARCH = 'dictionary/search';
export const SEARCH_FAILURE = 'dictionary/search-failure';
export const SEARCH_SUCCESS = 'dictionary/search-success';
export const SUBMIT = 'dictionary/submit';

export const changeInput = createAction(CHANGE_INPUT);
export const clearInput = createAction(CLEAR_INPUT);
export const search = createAction(SEARCH);
export const searchFailure = createAction(SEARCH_FAILURE);
export const searchSuccess = createAction(SEARCH_SUCCESS);
export const submit = createAction(SUBMIT);

const initialState = {
  definitions: [],
  word: '',
  input: '',
  isAllowed: null,
  isLoading: false
};

export default handleActions({
  [CHANGE_INPUT]: (state, { payload: input }) => ({
    ...state,
    input
  }),

  [CLEAR_INPUT]: (state) => ({
    ...state,
    input: initialState.input
  }),

  [SEARCH]: (state) => ({
    ...state,
    isLoading: true
  }),

  [SEARCH_FAILURE]: (state) => ({
    ...state,
    isLoading: false
  }),

  [SEARCH_SUCCESS]: (state, { payload: { isAllowed, definitions, word } }) => ({
    ...state,
    isAllowed,
    definitions,
    word,
    isLoading: false
  })
}, initialState);
