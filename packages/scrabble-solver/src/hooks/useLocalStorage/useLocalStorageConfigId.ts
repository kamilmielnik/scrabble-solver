import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { configIdSlice, localStorage, selectConfigId, useTypedSelector } from 'state';

const useLocalStorageConfigId = () => {
  const dispatch = useDispatch();
  const configId = useTypedSelector(selectConfigId);

  useEffectOnce(() => {
    if (localStorage.configId) {
      dispatch(configIdSlice.actions.change(localStorage.configId));
    }
  });

  useEffect(() => {
    if (configId) {
      localStorage.configId = configId;
    }
  }, [configId]);
};

export default useLocalStorageConfigId;
