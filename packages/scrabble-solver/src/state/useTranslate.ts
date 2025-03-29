import { useCallback } from 'react';

import type { Translate } from 'types';

import { selectLocale, selectTranslations } from './settings';
import { useTypedSelector } from './useTypedSelector';

export const useTranslate = (): Translate => {
  const translations = useTypedSelector(selectTranslations);
  const locale = useTypedSelector(selectLocale);
  const translate: Translate = useCallback(
    (id, replacements) => {
      const translation = translations[id];

      if (typeof translation === 'undefined') {
        throw new Error(`Untranslated key "${id}" in locale "${locale}"`);
      }

      if (!replacements) {
        return translation;
      }

      return Object.entries(replacements).reduce(
        (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
        translation,
      );
    },
    [translations, locale],
  );

  return translate;
};
