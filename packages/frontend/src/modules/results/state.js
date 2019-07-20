import { createAction, handleActions } from 'redux-actions';

export const CHANGE_RESULTS = 'results/change-results';
export const CHANGE_SORTED_COLUMN = 'results/change-sorted-column';
export const HIGHLIGHT_RESULT = 'results/highlight-result';
export const UNHIGHLIGHT_RESULT = 'results/unhighlight-result';

export const changeResults = createAction(CHANGE_RESULTS);
export const changeSortedColumn = createAction(CHANGE_SORTED_COLUMN);
export const highlightResult = createAction(HIGHLIGHT_RESULT);
export const unhighlightResult = createAction(UNHIGHLIGHT_RESULT);

const initialState = {
  results: [],
  sortingDirection: 'descending',
  sortedColumnName: 'points'
};

export default handleActions(
  {
    [CHANGE_RESULTS]: (state, { payload: results }) => ({
      ...state,
      results
    }),

    [CHANGE_SORTED_COLUMN]: (state, { payload: sortedColumnName }) => ({
      ...state,
      sortedColumnName,
      sortingDirection:
        state.sortedColumnName === sortedColumnName
          ? toggleSortingDirection(state.sortingDirection)
          : initialState.sortingDirection
    })
  },
  initialState
);

const toggleSortingDirection = (sortingDirection) => (sortingDirection === 'ascending' ? 'descending' : 'ascending');
