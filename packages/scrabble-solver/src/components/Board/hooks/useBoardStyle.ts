import { type CSSProperties, useMemo } from 'react';

import { useAppLayout } from '@/app-layout';
import { LOCALE_FEATURES } from '@/i18n';
import { getTileSizes } from '@/lib';
import { BORDER_WIDTH } from '@/parameters';
import { selectConfig, selectLocale, selectShowCoordinates, useTypedSelector } from '@/state';

import { getBoardBackground } from '../getBoardBackground';

export const useBoardStyle = () => {
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const { cellSize } = useAppLayout();
  const { tileFontSize } = getTileSizes(cellSize);
  const showCoordinates = useTypedSelector(selectShowCoordinates);
  const { direction } = LOCALE_FEATURES[locale];
  const backgroundImage = getBoardBackground({ config, direction, showCoordinates });
  const coordinatesSize = 0.5 * cellSize - BORDER_WIDTH;
  const boardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: '100% 100%',
      fontSize: tileFontSize,
      gridTemplateColumns:
        showCoordinates === 'hidden'
          ? `repeat(${config.boardWidth}, 1fr)`
          : `${coordinatesSize}px repeat(${config.boardWidth}, 1fr)`,
      gridTemplateRows:
        showCoordinates === 'hidden'
          ? `repeat(${config.boardHeight}, 1fr)`
          : `${coordinatesSize}px repeat(${config.boardHeight}, 1fr)`,
    }),
    [backgroundImage, config.boardHeight, config.boardWidth, coordinatesSize, showCoordinates, tileFontSize],
  );

  return boardStyle;
};
