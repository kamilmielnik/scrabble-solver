import { useSelector } from 'react-redux';

import { selectLocale, selectTranslations } from './selectors';
import { formatMessage } from './utils';

export const useLocale = () => useSelector(selectLocale);

export const useTranslations = () => useSelector(selectTranslations);

export const useMessage = ({ id, locale: localeOverride, values }) => {
  const locale = useLocale();
  const translations = useTranslations();
  const messages = translations[localeOverride || locale];
  const message = messages[id];

  return formatMessage(message, values);
};
