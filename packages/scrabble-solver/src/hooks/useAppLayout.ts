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
  SOLVER_COLUMN_WIDTH,
} from 'parameters';
import { selectConfig, selectShowCoordinates, useTypedSelector } from 'state';

import useIsTouchDevice from './useIsTouchDevice';
import useMediaQueries from './useMediaQueries';
import useViewportSize from './useViewportSize';
import useColumns from 'src/components/Results/useColumns';

const useAppLayout = () => {
  const { viewportHeight, viewportWidth } = useViewportSize();
  const config = useTypedSelector(selectConfig);
  const showCoordinates = useTypedSelector(selectShowCoordinates);
  const isTouchDevice = useIsTouchDevice();
  const { isLessThanXs, isLessThanS, isLessThanM, isLessThanL, isLessThanXl } = useMediaQueries();
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
    (maxBoardWidth - (config.boardSize + 1 + coordinatesBorderWidth) * BORDER_WIDTH) /
    (config.boardSize + coordinatesSizeRatio);
  const cellHeight =
    (maxBoardHeight - (config.boardSize + 1 + coordinatesBorderWidth) * BORDER_WIDTH) /
    (config.boardSize + coordinatesSizeRatio);
  const cellSize = Math.min(Math.min(cellWidth, cellHeight), BOARD_TILE_SIZE_MAX);
  const coordinatesSize = coordinatesSizeRatio * cellSize;
  const boardSize =
    (cellSize + BORDER_WIDTH) * config.boardSize +
    BORDER_WIDTH +
    (showCoordinates === 'hidden' ? 0 : coordinatesSize + BORDER_WIDTH);
  const maxControlsWidth = tileSize * config.rackSize + 2 * BORDER_WIDTH;
  const showResultsInModal = isLessThanL;
  const dictionaryHeight = showResultsInModal ? DICTIONARY_HEIGHT_MOBILE : DICTIONARY_HEIGHT;
  const modalWidth = isLessThanS ? viewportWidth : MODAL_WIDTH;
  const resultsHeight = isLessThanL
    ? viewportHeight - dictionaryHeight - BUTTON_HEIGHT - MODAL_HEADER_HEIGHT - 5 * componentsSpacing
    : boardSize - componentsSpacing - dictionaryHeight;
  const rackWidth = tileSize * config.rackSize;
  const resultsWidth = isLessThanL ? modalWidth - 2 * componentsSpacing : SOLVER_COLUMN_WIDTH;
  const columns = useColumns(); // TODO: move useColumns to /hooks
  const resultWordWidth =
    resultsWidth - 2 * BORDER_WIDTH - columns.reduce((sum, column) => sum + (column.width ?? 0), 0);

  return {
    actionsWidth: 2 * BUTTON_HEIGHT - BORDER_WIDTH,
    boardSize,
    cellSize,
    coordinatesFontSize: coordinatesSize * 0.6,
    coordinatesSize,
    dictionaryHeight,
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

export default useAppLayout;
