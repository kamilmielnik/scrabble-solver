import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectLocale, selectTranslations } from './selectors';
import { changeLocale } from './state';
import { formatMessage } from './utils';

export const useChangeLocale = () => {
  const dispatch = useDispatch();

  return useCallback((locale) => dispatch(changeLocale(locale)), [dispatch]);
};

export const useLocale = () => useSelector(selectLocale);

export const useTranslations = () => useSelector(selectTranslations);

export const useMessage = ({ id, locale: localeOverride, values }) => {
  const locale = useLocale();
  const translations = useTranslations();
  const messages = translations[localeOverride || locale];
  const message = messages[id];

  return formatMessage(message, values);
};
