import { COMPONENTS_SPACING, COMPONENTS_SPACING_SMALL } from 'parameters';

import useIsTouchDevice from './useIsTouchDevice';
import useMediaQuery from './useMediaQuery';

const useAppLayout = () => {
  const isTouchDevice = useIsTouchDevice();
  const isLessThanXs = useMediaQuery('<xs');
  const isLessThanS = useMediaQuery('<s');
  const isLessThanM = useMediaQuery('<m');
  const isLessThanL = useMediaQuery('<l');
  const isLessThanXl = useMediaQuery('<xl');
  const showColumn = !isLessThanL;

  return {
    animateTile: !isLessThanXs,
    componentsSpacing: isLessThanXl ? COMPONENTS_SPACING_SMALL : COMPONENTS_SPACING,
    isBoardFullWidth: isLessThanM,
    isModalFullWidth: isLessThanS,
    showColumn,
    showCompactControls: !showColumn,
    showFloatingSolveButton: isTouchDevice,
    showKeyMap: !isTouchDevice,
    showResultsInModal: isLessThanL,
    showShortNav: isLessThanS,
    showTilePoints: !isLessThanXs,
  };
};

export default useAppLayout;
