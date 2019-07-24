import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectSteps, selectTranslations, selectWalkthroughShown } from './selectors';
import { hideWalkthrough, showWalkthrough } from './state';

export const useHideWalkthrough = () => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(hideWalkthrough()), [dispatch]);
};

export const useShowWalkthrough = () => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(showWalkthrough()), [dispatch]);
};

export const useSteps = () => useSelector(selectSteps);

export const useTranslations = () => useSelector(selectTranslations);

export const useWalkthroughShown = () => useSelector(selectWalkthroughShown);
