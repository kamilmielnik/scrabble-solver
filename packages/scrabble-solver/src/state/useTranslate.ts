import { useCallback } from 'react';

import { Translate } from 'types';

import { selectLocale, selectTranslations } from './selectors';
import useTypedSelector from './useTypedSelector';

const useTranslate = (): Translate => {
  const translations = useTypedSelector(selectTranslations);
  const locale = useTypedSelector(selectLocale);
  const translate: Translate = useCallback(
    (id) => {
      const translation = translations[id];

      if (typeof translation === 'undefined') {
        throw new Error(`Untranslated key "${id}" in locale "${locale}"`);
      }

      return translation;
    },
    [translations, locale],
  );

  return translate;
};

export default useTranslate;
