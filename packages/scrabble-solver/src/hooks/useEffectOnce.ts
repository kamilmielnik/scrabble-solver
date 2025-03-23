import { EffectCallback, useEffect } from 'react';

import useLatest from './useLatest';

const useEffectOnce = (effect: EffectCallback) => {
  const effectRef = useLatest(effect);

  return useEffect(() => {
    effectRef.current();
  }, [effectRef]);
};

export default useEffectOnce;
