import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { detectLocale } from 'lib';
import { localStorage, selectLocale, settingsSlice, useTypedSelector } from 'state';

import useEffectOnce from '../useEffectOnce';

const useLocalStorageLocale = (): void => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffectOnce(() => {
    const persistedLocale = localStorage.getLocale();

    if (persistedLocale) {
      dispatch(settingsSlice.actions.init({ locale: persistedLocale }));
    } else {
      dispatch(settingsSlice.actions.init({ locale: detectLocale() }));
    }

    setIsLoaded(true);
  });

  useEffect(() => {
    if (locale && isLoaded) {
      localStorage.setLocale(locale);
    }
  }, [locale, isLoaded]);
};

export default useLocalStorageLocale;
