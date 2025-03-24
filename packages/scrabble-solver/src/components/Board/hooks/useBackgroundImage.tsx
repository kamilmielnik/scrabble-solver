/* eslint-disable max-lines, max-statements */

import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import { useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import { useAppLayout, useMediaQueries } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { Star } from 'icons';
import { getTileSizes } from 'lib';
import { BORDER_COLOR_LIGHT, BORDER_RADIUS, BORDER_WIDTH, COLOR_BACKGROUND, COLOR_BONUS_START } from 'parameters';
import { selectConfig, selectLocale, selectShowCoordinates, store, useTypedSelector } from 'state';
import { Point } from 'types';

import { getBonusColor } from '../lib';

const BORDER_RADIUS_XS = 3;
const GRID_LINE_SIZE = 1;
const HORIZONTAL_LINE = 'h';
const VERTICAL_LINE = 'v';
const BONUS = 'b';
const BONUS_WORD_2 = 'b2';
const BONUS_WORD_3 = 'b3';
const BONUS_WORD_4 = 'b4';

export const useBackgroundImage = () => {
  const { boardHeight, boardWidth, cellSize, coordinatesSize } = useAppLayout();
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const showCoordinates = useTypedSelector(selectShowCoordinates);
  const { isLessThanXs } = useMediaQueries();
  const borderRadius = isLessThanXs ? BORDER_RADIUS_XS : BORDER_RADIUS;
  const config = useTypedSelector(selectConfig);
  const center = { x: Math.floor(config.boardWidth / 2), y: Math.floor(config.boardHeight / 2) };
  const viewBoxHeight = boardHeight;
  const viewBoxWidth = boardWidth;
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
  const word4Bonuses = config.bonuses.filter((bonus) => bonus.type === BONUS_WORD && bonus.multiplier === 4);

  const getX = (point: Point): number =>
    (direction === 'ltr' ? coordinatesSize : 0) + point.x * (cellSize + BORDER_WIDTH);

  const getY = (point: Point): number => coordinatesSize + point.y * (cellSize + BORDER_WIDTH);

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

          <symbol id={BONUS_WORD_4}>
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
              x4
            </text>
          </symbol>
        </defs>

        {showCoordinates === 'hidden' && (
          <rect fill="white" height={viewBoxHeight} rx={borderRadius} width={viewBoxWidth} x="0" y="0" />
        )}

        {showCoordinates !== 'hidden' && (
          <>
            <rect fill={COLOR_BACKGROUND} height={viewBoxHeight} rx={borderRadius} width={viewBoxWidth} x="0" y="0" />
            <rect
              fill="white"
              height={viewBoxHeight - coordinatesSize}
              width={viewBoxWidth - coordinatesSize}
              x={direction === 'ltr' ? coordinatesSize : 0}
              y={coordinatesSize}
            />

            <rect fill={COLOR_BACKGROUND} height={coordinatesSize} rx={borderRadius} width={viewBoxWidth} x="0" y="0" />
            <rect
              fill={COLOR_BACKGROUND}
              height={viewBoxHeight}
              rx={borderRadius}
              x={direction === 'ltr' ? 0 : viewBoxWidth - coordinatesSize}
              y="0"
              width={coordinatesSize}
            />
            <use href={`#${HORIZONTAL_LINE}`} y={coordinatesSize - BORDER_WIDTH} />
            <use
              href={`#${VERTICAL_LINE}`}
              x={direction === 'ltr' ? coordinatesSize - BORDER_WIDTH : viewBoxWidth - coordinatesSize - BORDER_WIDTH}
            />
          </>
        )}

        {Array.from({ length: config.boardHeight - 1 }).map((_value, index) => (
          <use
            key={index}
            href={`#${HORIZONTAL_LINE}`}
            y={coordinatesSize + (index + 1) * (cellSize + BORDER_WIDTH) - BORDER_WIDTH}
          />
        ))}

        {Array.from({ length: config.boardWidth - 1 }).map((_value, index) => (
          <use
            key={index}
            href={`#${VERTICAL_LINE}`}
            x={(direction === 'ltr' ? coordinatesSize : 0) + (index + 1) * (cellSize + BORDER_WIDTH) - BORDER_WIDTH}
          />
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

        {word4Bonuses.map((bonus, index) => (
          <use fill={getBonusColor(bonus)} key={index} href={`#${BONUS_WORD_4}`} x={getX(bonus)} y={getY(bonus)} />
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
      </svg>
    </Provider>,
  );

  const encodedSvg = useMemo(() => globalThis.btoa(backgroundSvg), [backgroundSvg]);
  const dataUrl = `data:image/svg+xml;base64,${encodedSvg}`;
  return dataUrl;
};
