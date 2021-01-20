import { useCallback } from 'react';

import { Translations } from 'types';

import { selectLocale, selectTranslations } from './selectors';
import useTypedSelector from './useTypedSelector';

type Translate = (id: keyof Translations) => string;

const useTranslate = (): Translate => {
  const translations = useTypedSelector(selectTranslations);
  const locale = useTypedSelector(selectLocale);
  const translate = useCallback(
    (id: keyof Translations): string => {
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
