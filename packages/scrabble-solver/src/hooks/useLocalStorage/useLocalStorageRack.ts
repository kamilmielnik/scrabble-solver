import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { localStorage, rackSlice, selectRack, useTypedSelector } from 'state';

const useLocalStorageRack = (): void => {
  const dispatch = useDispatch();
  const rack = useTypedSelector(selectRack);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffectOnce(() => {
    const persistedRack = localStorage.getRack();

    if (persistedRack) {
      dispatch(rackSlice.actions.init(persistedRack));
    }

    setIsLoaded(true);
  });

  useEffect(() => {
    if (rack && isLoaded) {
      localStorage.setRack(rack);
    }
  }, [isLoaded, rack]);
};

export default useLocalStorageRack;
