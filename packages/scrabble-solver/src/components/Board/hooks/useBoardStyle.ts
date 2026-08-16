import { type CSSProperties, useMemo } from 'react';

import { LOCALE_FEATURES } from '@/i18n/constants';
import { selectConfig, selectLocale, useTypedSelector } from '@/state';

import { getBoardBackground } from '../getBoardBackground';

/**
 * Everything here is derived from Redux state only, so the style on the server matches the client
 */
export const useBoardStyle = () => {
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const backgroundImage = getBoardBackground({ config, direction });
  const boardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
    }),
    [backgroundImage],
  );

  return boardStyle;
};
