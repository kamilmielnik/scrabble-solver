import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { i18nSlice, localStorage, selectLocale, useTypedSelector } from 'state';

const useLocalStorageLocale = () => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);

  useEffectOnce(() => {
    if (localStorage.locale) {
      dispatch(i18nSlice.actions.changeLocale(localStorage.locale));
    }
  });

  useEffect(() => {
    if (locale) {
      localStorage.locale = locale;
    }
  }, [locale]);
};

export default useLocalStorageLocale;
