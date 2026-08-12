import { autoUpdate, offset, shift, useFloating } from '@floating-ui/react';

import { BOARD_CELL_ACTIONS_OFFSET } from '@/parameters';

export const useFloatingActions = () => {
  return useFloating({
    middleware: [
      offset(({ rects }) => ({
        mainAxis: -BOARD_CELL_ACTIONS_OFFSET,
        alignmentAxis: BOARD_CELL_ACTIONS_OFFSET - rects.floating.width,
      })),
      shift(),
    ],
    placement: 'top-end',
    whileElementsMounted: autoUpdate,
  });
};
