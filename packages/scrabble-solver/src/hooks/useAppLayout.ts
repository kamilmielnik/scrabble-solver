/* eslint-disable max-statements */

import {
  BOARD_TILE_SIZE_MAX,
  BOARD_TILE_SIZE_MIN,
  BORDER_WIDTH,
  BUTTON_HEIGHT,
  COMPONENTS_SPACING,
  COMPONENTS_SPACING_SMALL,
  DICTIONARY_HEIGHT,
  LOGO_HEIGHT,
  LOGO_HEIGHT_SMALL,
  NAV_PADDING,
  RACK_TILE_SIZE_MAX,
  RESULTS_HEADER_HEIGHT,
  SOLVER_COLUMN_WIDTH,
  TEXT_INPUT_HEIGHT,
} from 'parameters';
import { selectConfig, useTypedSelector } from 'state';

import useIsTouchDevice from './useIsTouchDevice';
import useMediaQueries from './useMediaQueries';
import useViewportSize from './useViewportSize';

const useAppLayout = () => {
  const { viewportHeight, viewportWidth } = useViewportSize();
  const config = useTypedSelector(selectConfig);
  const isTouchDevice = useIsTouchDevice();
  const { isLessThanXs, isLessThanS, isLessThanM, isLessThanL, isLessThanXl } = useMediaQueries();
  const isBoardFullWidth = isLessThanM;
  const showResultCandidatePicker = isLessThanL;
  const componentsSpacing = isLessThanXl ? COMPONENTS_SPACING_SMALL : COMPONENTS_SPACING;
  const showColumn = !isLessThanL;
  const columnWidth = showColumn ? SOLVER_COLUMN_WIDTH : 0;
  const navHeight = 2 * NAV_PADDING + (isLessThanL ? LOGO_HEIGHT_SMALL : LOGO_HEIGHT);
  const solverHeight = viewportHeight - navHeight;
  const solverWidth = viewportWidth;
  const maxBoardWidth = solverWidth - columnWidth - (showColumn ? componentsSpacing : 0) - 2 * componentsSpacing;
  const tileSize = Math.min((maxBoardWidth - 2 * BORDER_WIDTH) / config.maximumCharactersCount, RACK_TILE_SIZE_MAX);
  const candidatePickerHeight = showResultCandidatePicker ? BUTTON_HEIGHT + componentsSpacing : 0;
  const bottomContainerHeight = candidatePickerHeight + tileSize + 2 * componentsSpacing;
  const maxBoardHeight = isBoardFullWidth
    ? Number.POSITIVE_INFINITY
    : Math.max(solverHeight - bottomContainerHeight, 0);
  const boardSize = Math.min(maxBoardHeight, maxBoardWidth);
  const cellWidth = (maxBoardWidth - (config.boardWidth + 1) * BORDER_WIDTH) / config.boardWidth;
  const cellHeight = (maxBoardHeight - (config.boardHeight + 1) * BORDER_WIDTH) / config.boardHeight;
  const cellSize = Math.min(Math.max(Math.min(cellWidth, cellHeight), BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);
  const maxControlsWidth = tileSize * config.maximumCharactersCount + 2 * BORDER_WIDTH;

  return {
    actionsWidth: 2 * BUTTON_HEIGHT - BORDER_WIDTH,
    animateTile: !isLessThanXs,
    cellSize,
    isModalFullWidth: isLessThanS,
    maxControlsWidth,
    resultsHeight: showColumn
      ? boardSize - RESULTS_HEADER_HEIGHT - TEXT_INPUT_HEIGHT - BORDER_WIDTH - componentsSpacing - DICTIONARY_HEIGHT
      : 0,
    resultsWidth: showColumn ? SOLVER_COLUMN_WIDTH - 2 * BORDER_WIDTH : 0,
    showCompactControls: !showColumn,
    showFloatingSolveButton: isTouchDevice,
    showKeyMap: !isTouchDevice,
    showResultsInModal: isLessThanL,
    showShortNav: isLessThanS,
    showTilePoints: !isLessThanXs,
    tileSize,
  };
};

export default useAppLayout;
