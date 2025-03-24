/* eslint-disable max-statements */

import {
  BOARD_TILE_SIZE_MAX,
  BORDER_WIDTH,
  BUTTON_HEIGHT,
  COMPONENTS_SPACING,
  COMPONENTS_SPACING_SMALL,
  DICTIONARY_HEIGHT,
  DICTIONARY_HEIGHT_MOBILE,
  LOGO_ASPECT_RATIO,
  LOGO_HEIGHT,
  LOGO_HEIGHT_SMALL,
  MODAL_HEADER_HEIGHT,
  MODAL_WIDTH,
  NAV_PADDING,
  RACK_TILE_SIZE_MAX,
  RESULTS_COLUMN_WIDTH,
  SOLVER_COLUMN_WIDTH,
  TEXT_INPUT_HEIGHT,
} from 'parameters';
import { selectConfig, selectShowCoordinates, useTypedSelector } from 'state';
import { ResultColumnId } from 'types';

import { useColumns } from './useColumns';
import { useIsTouchDevice } from './useIsTouchDevice';
import { useMediaQueries } from './useMediaQueries';
import { useViewportSize } from './useViewportSize';

export const useAppLayout = () => {
  const { viewportHeight, viewportWidth } = useViewportSize();
  const config = useTypedSelector(selectConfig);
  const showCoordinates = useTypedSelector(selectShowCoordinates);
  const isTouchDevice = useIsTouchDevice();
  const { isLessThanXs, isLessThanS, isLessThanM, isLessThanL, isLessThanXl } = useMediaQueries();
  const columns = useColumns();
  const isBoardFullWidth = isLessThanM;
  const showResultCandidatePicker = isLessThanL;
  const componentsSpacing = isLessThanXl ? COMPONENTS_SPACING_SMALL : COMPONENTS_SPACING;
  const showColumn = !isLessThanL;
  const columnWidth = showColumn ? SOLVER_COLUMN_WIDTH : 0;
  const logoHeight = isLessThanL ? LOGO_HEIGHT_SMALL : LOGO_HEIGHT;
  const navHeight = 2 * NAV_PADDING + logoHeight;
  const solverHeight = viewportHeight - navHeight;
  const solverWidth = viewportWidth;
  const maxBoardWidth = solverWidth - columnWidth - (showColumn ? componentsSpacing : 0) - 2 * componentsSpacing;
  const tileSize = Math.min((maxBoardWidth - 2 * BORDER_WIDTH) / config.rackSize, RACK_TILE_SIZE_MAX);
  const candidatePickerHeight = showResultCandidatePicker ? BUTTON_HEIGHT + componentsSpacing : 0;
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
  const coordinatesSize = coordinatesSizeRatio * cellSize;
  const boardWidth =
    (cellSize + BORDER_WIDTH) * config.boardWidth +
    BORDER_WIDTH +
    (showCoordinates === 'hidden' ? 0 : coordinatesSize + BORDER_WIDTH);
  const boardHeight =
    (cellSize + BORDER_WIDTH) * config.boardHeight +
    BORDER_WIDTH +
    (showCoordinates === 'hidden' ? 0 : coordinatesSize + BORDER_WIDTH);

  const maxControlsWidth = tileSize * config.rackSize + 2 * BORDER_WIDTH;
  const showResultsInModal = isLessThanL;
  const dictionaryHeight = showResultsInModal ? DICTIONARY_HEIGHT_MOBILE : DICTIONARY_HEIGHT;
  const dictionaryResultsHeight = dictionaryHeight - TEXT_INPUT_HEIGHT - 2 * BORDER_WIDTH;
  const modalWidth = isLessThanS ? viewportWidth : MODAL_WIDTH;
  const resultsHeight = isLessThanL
    ? viewportHeight - dictionaryHeight - BUTTON_HEIGHT - MODAL_HEADER_HEIGHT - 5 * componentsSpacing
    : boardHeight - componentsSpacing - dictionaryHeight;
  const rackWidth = tileSize * config.rackSize;
  const resultsWidth = isLessThanL ? modalWidth - 2 * componentsSpacing : SOLVER_COLUMN_WIDTH;
  const columnsWidth = Object.keys(columns).reduce(
    (sum, column) => sum + (RESULTS_COLUMN_WIDTH[column as ResultColumnId] ?? 0),
    0,
  );
  const resultWordWidth = resultsWidth - 2 * BORDER_WIDTH - columnsWidth;

  return {
    actionsWidth: 2 * BUTTON_HEIGHT - BORDER_WIDTH,
    boardHeight,
    boardWidth,
    cellSize,
    coordinatesFontSize: coordinatesSize * 0.6,
    coordinatesSize,
    dictionaryHeight,
    dictionaryResultsHeight,
    isModalFullWidth: isLessThanS,
    logoHeight,
    logoWidth: logoHeight * LOGO_ASPECT_RATIO,
    maxControlsWidth,
    rackHeight: tileSize,
    rackWidth,
    resultsHeight,
    resultsWidth,
    resultWordWidth,
    showCompactControls: !showColumn,
    showKeyMap: !isTouchDevice,
    showResultsInModal,
    showShortNav: isLessThanS,
    showTilePoints: !isLessThanXs,
    tileSize,
  };
};
