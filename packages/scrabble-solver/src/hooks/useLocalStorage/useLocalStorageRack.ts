import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { localStorage, rackSlice, selectRack, useTypedSelector } from 'state';

const useLocalStorageRack = (): void => {
  const dispatch = useDispatch();
  const rack = useTypedSelector(selectRack);

  useEffectOnce(() => {
    const persistedRack = localStorage.getRack();

    if (persistedRack) {
      dispatch(rackSlice.actions.init(persistedRack));
    }
  });

  useEffect(() => {
    if (rack) {
      localStorage.setRack(rack);
    }
  }, [rack]);
};

export default useLocalStorageRack;
