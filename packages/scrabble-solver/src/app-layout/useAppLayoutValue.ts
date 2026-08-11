/* eslint-disable max-statements */

import { useColumns, useMediaQueries, useViewportSize } from '@/hooks';
import {
  BOARD_TILE_SIZE_MAX,
  BORDER_WIDTH,
  BUTTON_HEIGHT,
  COMPONENTS_SPACING,
  COMPONENTS_SPACING_SMALL,
  DICTIONARY_HEIGHT,
  DICTIONARY_HEIGHT_MOBILE,
  LOGO_HEIGHT,
  LOGO_HEIGHT_SMALL,
  MODAL_WIDTH,
  NAV_PADDING,
  RACK_TILE_SIZE_MAX,
  RESULTS_COLUMN_WIDTH,
  SOLVER_COLUMN_WIDTH,
  TEXT_INPUT_HEIGHT,
} from '@/parameters';
import { selectConfig, selectShowCoordinates, useTypedSelector } from '@/state';
import { type ResultColumnId } from '@/types';

/**
 * Post-hydration-only numbers. Nothing rendered by the server may consume them.
 * Keep in sync with `packages/scrabble-solver/src/styles/variables.scss`.
 */
export const useAppLayoutValue = () => {
  const { viewportHeight, viewportWidth } = useViewportSize();
  const config = useTypedSelector(selectConfig);
  const showCoordinates = useTypedSelector(selectShowCoordinates);
  const { isLessThanS, isLessThanM, isLessThanL, isLessThanXl } = useMediaQueries();
  const columns = useColumns();
  const isBoardFullWidth = isLessThanM;
  const componentsSpacing = isLessThanXl ? COMPONENTS_SPACING_SMALL : COMPONENTS_SPACING;
  const showColumn = !isLessThanL;
  const columnWidth = showColumn ? SOLVER_COLUMN_WIDTH : 0;
  const logoHeight = isLessThanL ? LOGO_HEIGHT_SMALL : LOGO_HEIGHT;
  const navHeight = 2 * NAV_PADDING + logoHeight;
  const solverHeight = viewportHeight - navHeight;
  const maxBoardWidth = viewportWidth - columnWidth - (showColumn ? componentsSpacing : 0) - 2 * componentsSpacing;
  const tileSize = Math.min((maxBoardWidth - 2 * BORDER_WIDTH) / config.rackSize, RACK_TILE_SIZE_MAX);
  const candidatePickerHeight = showColumn ? 0 : BUTTON_HEIGHT + componentsSpacing;
  const bottomContainerHeight = candidatePickerHeight + tileSize + 2 * componentsSpacing;
  const maxBoardHeight = isBoardFullWidth
    ? Number.POSITIVE_INFINITY
    : Math.max(solverHeight - bottomContainerHeight, 0);

  const coordinatesSizeRatio = showCoordinates === 'hidden' ? 0 : 0.5;
  const coordinatesBorderWidth = showCoordinates === 'hidden' ? 0 : 1;
  const cellWidth =
    (maxBoardWidth - (config.boardWidth + 1 + coordinatesBorderWidth) * BORDER_WIDTH) /
    (config.boardWidth + coordinatesSizeRatio);
  const cellHeight =
    (maxBoardHeight - (config.boardHeight + 1 + coordinatesBorderWidth) * BORDER_WIDTH) /
    (config.boardHeight + coordinatesSizeRatio);
  const cellSize = Math.min(Math.min(cellWidth, cellHeight), BOARD_TILE_SIZE_MAX);

  const showResultsInModal = isLessThanL;
  const dictionaryHeight = showResultsInModal ? DICTIONARY_HEIGHT_MOBILE : DICTIONARY_HEIGHT;
  const modalWidth = isLessThanS ? viewportWidth : MODAL_WIDTH;
  const resultsWidth = isLessThanL ? modalWidth - 2 * componentsSpacing : SOLVER_COLUMN_WIDTH;
  const columnsWidth = Object.keys(columns).reduce(
    (sum, column) => sum + (RESULTS_COLUMN_WIDTH[column as ResultColumnId] ?? 0),
    0,
  );

  return {
    actionsWidth: 2 * BUTTON_HEIGHT - BORDER_WIDTH,
    cellSize,
    dictionaryResultsHeight: dictionaryHeight - TEXT_INPUT_HEIGHT - 2 * BORDER_WIDTH,
    rackHeight: tileSize,
    rackWidth: tileSize * config.rackSize,
    resultWordWidth: resultsWidth - 2 * BORDER_WIDTH - columnsWidth,
    showCompactControls: !showColumn,
    showResultsInModal,
  };
};

export type AppLayout = ReturnType<typeof useAppLayoutValue>;
