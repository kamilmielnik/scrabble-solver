import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectShowWalkthrough, selectSteps, selectTranslations } from './selectors';
import { hideWalkthrough } from './state';

export const useHideWalkthrough = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(hideWalkthrough());
  }, [dispatch]);
};

export const useShowWalkthrough = () => useSelector(selectShowWalkthrough);

export const useSteps = () => useSelector(selectSteps);

export const useTranslations = () => useSelector(selectTranslations);

