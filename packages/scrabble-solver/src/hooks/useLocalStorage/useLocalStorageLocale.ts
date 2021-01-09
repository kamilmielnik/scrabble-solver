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
      dispatch(settingsSlice.actions.changeLocale(persistedLocale));
    } else {
      dispatch(settingsSlice.actions.changeLocale(detectLocale()));
    }
  });

  useEffect(() => {
    if (locale) {
      localStorage.setLocale(locale);
    }
  }, [locale]);
};

export default useLocalStorageLocale;
