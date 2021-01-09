import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { configIdSlice, localStorage, selectConfigId, useTypedSelector } from 'state';

const useLocalStorageConfigId = () => {
  const dispatch = useDispatch();
  const configId = useTypedSelector(selectConfigId);

  useEffectOnce(() => {
    const persistedConfigId = localStorage.getConfigId();

    if (persistedConfigId) {
      dispatch(configIdSlice.actions.change(persistedConfigId));
    }
  });

  useEffect(() => {
    if (configId) {
      localStorage.setConfigId(configId);
    }
  }, [configId]);
};

export default useLocalStorageConfigId;
