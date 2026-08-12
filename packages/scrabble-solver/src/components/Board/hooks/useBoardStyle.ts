import { type CSSProperties, useMemo } from 'react';

import { LOCALE_FEATURES } from '@/i18n';
import { selectConfig, selectLocale, selectShowCoordinates, useTypedSelector } from '@/state';

import { getBoardBackground } from '../getBoardBackground';

/**
 * Everything here is derived from Redux state only, so the style on the server matches the client.
 */
export const useBoardStyle = () => {
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const showCoordinates = useTypedSelector(selectShowCoordinates);
  const { direction } = LOCALE_FEATURES[locale];
  const backgroundImage = getBoardBackground({ config, direction, showCoordinates });
  const boardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: '100% 100%',
      gridTemplateColumns:
        showCoordinates === 'hidden'
          ? `repeat(${config.boardWidth}, var(--cell-size))`
          : `var(--coordinate-track-size) repeat(${config.boardWidth}, var(--cell-size))`,
      gridTemplateRows:
        showCoordinates === 'hidden'
          ? `repeat(${config.boardHeight}, var(--cell-size))`
          : `var(--coordinate-track-size) repeat(${config.boardHeight}, var(--cell-size))`,
    }),
    [backgroundImage, config.boardHeight, config.boardWidth, showCoordinates],
  );

  return boardStyle;
};
