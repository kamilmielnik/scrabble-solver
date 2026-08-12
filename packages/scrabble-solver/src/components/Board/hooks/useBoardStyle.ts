import { type CSSProperties, useMemo } from 'react';

import { LOCALE_FEATURES } from '@/i18n/constants';
import { selectConfig, selectLocale, useTypedSelector } from '@/state';

import { getBoardBackground } from '../getBoardBackground';

/**
 * Everything here is derived from Redux state only, so the style on the server matches the client.
 */
export const useBoardStyle = () => {
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const backgroundImage = getBoardBackground({ config, direction });
  const boardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: '100% 100%',
      gridTemplateColumns: `var(--coordinate-track-size) repeat(${config.boardWidth}, var(--cell-size))`,
      gridTemplateRows: `var(--coordinate-track-size) repeat(${config.boardHeight}, var(--cell-size))`,
    }),
    [backgroundImage, config.boardHeight, config.boardWidth],
  );

  return boardStyle;
};
