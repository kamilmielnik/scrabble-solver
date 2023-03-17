import { useState } from 'react';

import {
  COMPONENTS_SPACING,
  COMPONENTS_SPACING_SMALL,
  LOGO_HEIGHT,
  LOGO_HEIGHT_SMALL,
  NAV_PADDING,
  SOLVER_COLUMN_WIDTH,
} from 'parameters';

import useIsTouchDevice from './useIsTouchDevice';
import useMediaQuery from './useMediaQuery';
import useOnWindowResize from './useOnWindowResize';

const useAppLayout = () => {
  const [viewportHeight, setViewportHeight] = useState(typeof window === 'undefined' ? 0 : window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(typeof window === 'undefined' ? 0 : window.innerWidth);
  const isTouchDevice = useIsTouchDevice();
  const isLessThanXs = useMediaQuery('<xs');
  const isLessThanS = useMediaQuery('<s');
  const isLessThanM = useMediaQuery('<m');
  const isLessThanL = useMediaQuery('<l');
  const isLessThanXl = useMediaQuery('<xl');
  const showColumn = !isLessThanL;
  const navHeight = NAV_PADDING + (isLessThanL ? LOGO_HEIGHT_SMALL : LOGO_HEIGHT);

  useOnWindowResize(() => {
    setViewportHeight(window.innerHeight);
    setViewportWidth(window.innerWidth);
  });

  return {
    animateTile: !isLessThanXs,
    columnWidth: showColumn ? SOLVER_COLUMN_WIDTH : 0,
    componentsSpacing: isLessThanXl ? COMPONENTS_SPACING_SMALL : COMPONENTS_SPACING,
    isBoardFullWidth: isLessThanM,
    isModalFullWidth: isLessThanS,
    navHeight,
    showColumn,
    showCompactControls: !showColumn,
    showFloatingSolveButton: isTouchDevice,
    showKeyMap: !isTouchDevice,
    showResultsInModal: isLessThanL,
    showShortNav: isLessThanS,
    showTilePoints: !isLessThanXs,
    solverHeight: viewportHeight - navHeight,
    solverWidth: viewportWidth,
    viewportHeight,
    viewportWidth,
  };
};

export default useAppLayout;
