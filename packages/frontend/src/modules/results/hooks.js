import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectResultCandidate, selectResults } from './selectors';
import { applyResult, highlightResult, unhighlightResult } from './state';

export const useApplyResult = (id) => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(applyResult(id)), [dispatch, id]);
};

export const useResultCandidate = () => useSelector(selectResultCandidate);

export const useHighlightResult = (id) => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(highlightResult(id)), [dispatch, id]);
};

export const useResults = () => useSelector(selectResults);

export const useUnhighlightResult = () => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(unhighlightResult()), [dispatch]);
};
