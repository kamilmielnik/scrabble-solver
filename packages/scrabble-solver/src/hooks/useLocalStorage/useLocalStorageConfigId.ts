import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { localStorage, selectConfigId, settingsSlice, useTypedSelector } from 'state';

const useLocalStorageConfigId = (): void => {
  const dispatch = useDispatch();
  const configId = useTypedSelector(selectConfigId);

  useEffectOnce(() => {
    const persistedConfigId = localStorage.getConfigId();

    if (persistedConfigId) {
      dispatch(settingsSlice.actions.init({ configId: persistedConfigId }));
    }
  });

  useEffect(() => {
    if (configId) {
      localStorage.setConfigId(configId);
    }
  }, [configId]);
};

export default useLocalStorageConfigId;
