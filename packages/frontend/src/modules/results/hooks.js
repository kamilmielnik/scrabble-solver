import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectResults } from './selectors';
import { highlightResult, unhighlightResult } from './state';

export const useHighlightResult = (id) => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(highlightResult(id)), [dispatch, id]);
};

export const useResults = () => useSelector(selectResults);

export const useUnhighlightResult = () => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(unhighlightResult()), [dispatch]);
};
