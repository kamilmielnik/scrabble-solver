import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { detectLocale } from 'lib';
import { localStorage, selectLocale, settingsSlice, useTypedSelector } from 'state';

const useLocalStorageLocale = () => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);

  useEffectOnce(() => {
    const persistedLocale = localStorage.getLocale();

    if (persistedLocale) {
      dispatch(settingsSlice.actions.init({ locale: persistedLocale }));
    } else {
      dispatch(settingsSlice.actions.init({ locale: detectLocale() }));
    }
  });

  useEffect(() => {
    if (locale) {
      localStorage.setLocale(locale);
    }
  }, [locale]);
};

export default useLocalStorageLocale;
