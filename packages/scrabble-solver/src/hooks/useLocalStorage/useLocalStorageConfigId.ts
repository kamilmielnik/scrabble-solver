import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { localStorage, selectConfigId, settingsSlice, useTypedSelector } from 'state';

import useEffectOnce from '../useEffectOnce';

const useLocalStorageConfigId = (): void => {
  const dispatch = useDispatch();
  const configId = useTypedSelector(selectConfigId);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffectOnce(() => {
    const persistedConfigId = localStorage.getConfigId();

    if (persistedConfigId) {
      dispatch(settingsSlice.actions.init({ configId: persistedConfigId }));
    }

    setIsLoaded(true);
  });

  useEffect(() => {
    if (configId && isLoaded) {
      localStorage.setConfigId(configId);
    }
  }, [configId, isLoaded]);
};

export default useLocalStorageConfigId;
