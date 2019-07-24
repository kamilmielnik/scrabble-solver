import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsLoading, selectResultCandidate } from './selectors';
import { applyResult } from './state';

export const useApplyResult = (id) => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(applyResult(id)), [dispatch, id]);
};

export const useIsLoading = () => useSelector(selectIsLoading);

export const useResultCandidate = () => useSelector(selectResultCandidate);
