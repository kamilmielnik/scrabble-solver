import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectConfig, selectConfigId } from './selectors';
import { changeConfig } from './state';

export const useChangeConfig = () => {
  const dispatch = useDispatch();

  return useCallback((config) => dispatch(changeConfig(config)), [dispatch]);
};

export const useConfig = () => useSelector(selectConfig);

export const useConfigId = () => useSelector(selectConfigId);
