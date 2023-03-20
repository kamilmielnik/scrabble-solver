import { BONUS_WORD } from '@scrabble-solver/constants';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import { useAppLayout } from 'hooks';
import { FlagFill, Star } from 'icons';
import { getTileSizes } from 'lib';
import {
  BORDER_COLOR,
  BORDER_COLOR_LIGHT,
  BORDER_RADIUS,
  BORDER_WIDTH,
  COLOR_BONUS_START,
  COLOR_FILTERED,
} from 'parameters';
import { selectCellFilter, selectConfig, store, useTypedSelector } from 'state';
import { Point } from 'types';

import { getBonusColor } from '../lib';

const useBackgroundImage = () => {
  const { boardSize, cellSize } = useAppLayout();
  const config = useTypedSelector(selectConfig);
  const center = { x: Math.floor(config.boardWidth / 2), y: Math.floor(config.boardHeight / 2) };
  const cellFilter = useTypedSelector(selectCellFilter);
  const viewBoxHeight = boardSize;
  const viewBoxWidth = boardSize;
  const bonusSize = cellSize * 0.8;
  const bonusOffset = cellSize * 0.1;
  const iconSize = cellSize * 0.4;
  const iconOffset = (cellSize - iconSize) / 2;
  const { tileFontSize } = getTileSizes(cellSize);
  const fontSize = tileFontSize * 0.6;
  const fontOffset = cellSize / 2;

  const getX = (point: Point): number => point.x * (cellSize + BORDER_WIDTH);

  const getY = (point: Point): number => point.y * (cellSize + BORDER_WIDTH);

  const backgroundSvg = renderToString(
    <Provider store={store}>
      <svg
        height={viewBoxHeight}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width={viewBoxWidth}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          stroke={BORDER_COLOR}
          fill="white"
          height={viewBoxHeight}
          rx={BORDER_RADIUS}
          width={viewBoxWidth}
          x="0"
          y="0"
        />

        {Array.from({ length: config.boardHeight - 1 }).map((_value, index) => (
          <rect
            fill={BORDER_COLOR_LIGHT}
            height={1}
            key={index}
            width={viewBoxWidth}
            x="0"
            y={(index + 1) * (cellSize + BORDER_WIDTH) - BORDER_WIDTH}
          />
        ))}

        {Array.from({ length: config.boardWidth - 1 }).map((_value, index) => (
          <rect
            fill={BORDER_COLOR_LIGHT}
            height={viewBoxHeight}
            key={index}
            width={1}
            x={(index + 1) * (cellSize + BORDER_WIDTH) - BORDER_WIDTH}
            y="0"
          />
        ))}

        {config.bonuses.map((bonus, index) => {
          const fill = getBonusColor(bonus);

          return (
            <>
              <rect
                fill={fill}
                height={bonusSize}
                key={index}
                rx={BORDER_RADIUS}
                width={bonusSize}
                x={getX(bonus) + bonusOffset}
                y={getY(bonus) + bonusOffset}
              />

              {bonus.type === BONUS_WORD && (
                <text
                  dominantBaseline="central"
                  fill="white"
                  fontFamily="system-ui, sans-serif"
                  fontSize={fontSize}
                  fontWeight="bold"
                  textAnchor="middle"
                  x={getX(bonus) + fontOffset}
                  y={getY(bonus) + fontOffset}
                >
                  x{bonus.multiplier}
                </text>
              )}
            </>
          );
        })}

        <rect
          fill={COLOR_BONUS_START}
          height={bonusSize}
          rx={BORDER_RADIUS}
          width={bonusSize}
          x={getX(center) + bonusOffset}
          y={getY(center) + bonusOffset}
        />

        <Star
          color="white"
          height={iconSize}
          width={iconSize}
          x={getX(center) + iconOffset}
          y={getY(center) + iconOffset}
        />

        {cellFilter.map((cell, index) => (
          <>
            <rect
              fill={COLOR_FILTERED}
              height={bonusSize}
              key={index}
              rx={BORDER_RADIUS}
              width={bonusSize}
              x={getX(cell) + bonusOffset}
              y={getY(cell) + bonusOffset}
            />

            <FlagFill
              color="white"
              height={iconSize}
              width={iconSize}
              x={getX(cell) + iconOffset}
              y={getY(cell) + iconOffset}
            />
          </>
        ))}
      </svg>
    </Provider>,
  );

  const encodedSvg = globalThis.btoa(backgroundSvg);
  const dataUrl = `data:image/svg+xml;base64,${encodedSvg}`;
  const url = `url(${dataUrl})`;

  return url;
};

export default useBackgroundImage;
