/* eslint-disable max-statements */

import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import { useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import { useAppLayout, useMediaQueries } from 'hooks';
import { FlagFill, Star } from 'icons';
import { dataUrlToBlob, getTileSizes } from 'lib';
import { BORDER_COLOR_LIGHT, BORDER_RADIUS, BORDER_WIDTH, COLOR_BONUS_START, COLOR_FILTERED } from 'parameters';
import { selectCellFilter, selectConfig, store, useTypedSelector } from 'state';
import { Point } from 'types';

import { getBonusColor } from '../lib';

const BORDER_RADIUS_XS = 3;
const GRID_LINE_SIZE = 1;
const HORIZONTAL_LINE = 'h';
const VERTICAL_LINE = 'v';
const BONUS = 'b';
const BONUS_WORD_2 = 'b2';
const BONUS_WORD_3 = 'b3';
const CELL_FILTER = 'c';

const useBackgroundImage = () => {
  const { boardSize, cellSize } = useAppLayout();
  const { isLessThanXs } = useMediaQueries();
  const borderRadius = isLessThanXs ? BORDER_RADIUS_XS : BORDER_RADIUS;
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
  const characterBonuses = config.bonuses.filter((bonus) => bonus.type === BONUS_CHARACTER);
  const word2Bonuses = config.bonuses.filter((bonus) => bonus.type === BONUS_WORD && bonus.multiplier === 2);
  const word3Bonuses = config.bonuses.filter((bonus) => bonus.type === BONUS_WORD && bonus.multiplier === 3);

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
        <defs>
          <symbol id={HORIZONTAL_LINE}>
            <rect fill={BORDER_COLOR_LIGHT} height={GRID_LINE_SIZE} width={viewBoxWidth} />
          </symbol>

          <symbol id={VERTICAL_LINE}>
            <rect fill={BORDER_COLOR_LIGHT} height={viewBoxHeight} width={GRID_LINE_SIZE} />
          </symbol>

          <symbol id={BONUS}>
            <rect height={bonusSize} rx={borderRadius} width={bonusSize} x={bonusOffset} y={bonusOffset} />
          </symbol>

          <symbol id={BONUS_WORD_2}>
            <rect height={bonusSize} rx={borderRadius} width={bonusSize} x={bonusOffset} y={bonusOffset} />

            <text
              dominantBaseline="central"
              fill="white"
              fontFamily="system-ui, sans-serif"
              fontSize={fontSize}
              fontWeight="bold"
              textAnchor="middle"
              x={fontOffset}
              y={fontOffset}
            >
              x2
            </text>
          </symbol>

          <symbol id={BONUS_WORD_3}>
            <rect height={bonusSize} rx={borderRadius} width={bonusSize} x={bonusOffset} y={bonusOffset} />

            <text
              dominantBaseline="central"
              fill="white"
              fontFamily="system-ui, sans-serif"
              fontSize={fontSize}
              fontWeight="bold"
              textAnchor="middle"
              x={fontOffset}
              y={fontOffset}
            >
              x3
            </text>
          </symbol>

          <symbol id={CELL_FILTER}>
            <rect
              fill={COLOR_FILTERED}
              height={bonusSize}
              rx={borderRadius}
              width={bonusSize}
              x={bonusOffset}
              y={bonusOffset}
            />

            <FlagFill color="white" height={iconSize} width={iconSize} x={iconOffset} y={iconOffset} />
          </symbol>
        </defs>

        <rect fill="white" height={viewBoxHeight} rx={borderRadius} width={viewBoxWidth} x="0" y="0" />

        {Array.from({ length: config.boardHeight - 1 }).map((_value, index) => (
          <use key={index} href={`#${HORIZONTAL_LINE}`} y={(index + 1) * (cellSize + BORDER_WIDTH) - BORDER_WIDTH} />
        ))}

        {Array.from({ length: config.boardWidth - 1 }).map((_value, index) => (
          <use key={index} href={`#${VERTICAL_LINE}`} x={(index + 1) * (cellSize + BORDER_WIDTH) - BORDER_WIDTH} />
        ))}

        {characterBonuses.map((bonus, index) => (
          <use fill={getBonusColor(bonus)} key={index} href={`#${BONUS}`} x={getX(bonus)} y={getY(bonus)} />
        ))}

        {word2Bonuses.map((bonus, index) => (
          <use fill={getBonusColor(bonus)} key={index} href={`#${BONUS_WORD_2}`} x={getX(bonus)} y={getY(bonus)} />
        ))}

        {word3Bonuses.map((bonus, index) => (
          <use fill={getBonusColor(bonus)} key={index} href={`#${BONUS_WORD_3}`} x={getX(bonus)} y={getY(bonus)} />
        ))}

        <rect
          fill={COLOR_BONUS_START}
          height={bonusSize}
          rx={borderRadius}
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
          <use key={index} href={`#${CELL_FILTER}`} x={getX(cell)} y={getY(cell)} />
        ))}
      </svg>
    </Provider>,
  );

  const encodedSvg = globalThis.btoa(backgroundSvg);
  const dataUrl = `data:image/svg+xml;base64,${encodedSvg}`;
  const blob = useMemo(() => dataUrlToBlob(dataUrl), [dataUrl]);
  const blobUrl = useMemo(() => URL.createObjectURL(blob), [blob]);
  const url = `url(${blobUrl})`;

  return url;
};

export default useBackgroundImage;
