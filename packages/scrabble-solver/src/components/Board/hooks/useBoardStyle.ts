import { CSSProperties, useMemo } from 'react';

import { useAppLayout } from 'hooks';
import { getTileSizes } from 'lib';
import { BORDER_WIDTH } from 'parameters';
import { selectConfig, selectShowCoordinates, useTypedSelector } from 'state';

import useBackgroundImage from './useBackgroundImage';

const useBoardStyle = () => {
  const config = useTypedSelector(selectConfig);
  const { cellSize } = useAppLayout();
  const { tileFontSize } = getTileSizes(cellSize);
  const showCoordinates = useTypedSelector(selectShowCoordinates);
  const backgroundImage = useBackgroundImage();
  const coordinatesSize = 0.5 * cellSize - BORDER_WIDTH;
  const boardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
      fontSize: tileFontSize,
      gridTemplateColumns:
        showCoordinates === 'hidden'
          ? `repeat(${config.boardSize}, 1fr)`
          : `${coordinatesSize}px repeat(${config.boardSize}, 1fr)`,
      gridTemplateRows:
        showCoordinates === 'hidden'
          ? `repeat(${config.boardSize}, 1fr)`
          : `${coordinatesSize}px repeat(${config.boardSize}, 1fr)`,
    }),
    [backgroundImage, config.boardSize, tileFontSize],
  );

  return boardStyle;
};

export default useBoardStyle;
