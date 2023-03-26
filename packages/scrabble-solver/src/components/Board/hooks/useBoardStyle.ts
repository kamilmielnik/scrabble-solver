import { CSSProperties, useMemo } from 'react';

import { useAppLayout } from 'hooks';
import { getTileSizes } from 'lib';
import { selectConfig, useTypedSelector } from 'state';

import useBackgroundImage from './useBackgroundImage';

const useBoardStyle = () => {
  const config = useTypedSelector(selectConfig);
  const { cellSize } = useAppLayout();
  const { tileFontSize } = getTileSizes(cellSize);
  const backgroundImage = useBackgroundImage();
  const boardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundImage,
      fontSize: tileFontSize,
      gridTemplateColumns: `repeat(${config.boardWidth}, 1fr)`,
      gridTemplateRows: `repeat(${config.boardHeight}, 1fr)`,
    }),
    [backgroundImage, config.boardHeight, config.boardWidth, tileFontSize],
  );

  return boardStyle;
};

export default useBoardStyle;
