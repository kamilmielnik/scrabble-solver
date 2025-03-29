import { type EffectCallback, useEffect } from 'react';

import { useLatest } from './useLatest';

export const useEffectOnce = (effect: EffectCallback) => {
  const effectRef = useLatest(effect);

  return useEffect(() => {
    effectRef.current();
  }, [effectRef]);
};
