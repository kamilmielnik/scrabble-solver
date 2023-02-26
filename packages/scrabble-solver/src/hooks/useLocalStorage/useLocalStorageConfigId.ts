import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { localStorage, selectConfigId, settingsSlice, useTypedSelector } from 'state';

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
