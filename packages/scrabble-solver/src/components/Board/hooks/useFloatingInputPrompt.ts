import { autoUpdate, offset, shift, useFloating } from '@floating-ui/react';

import { BOARD_CELL_ACTIONS_OFFSET } from 'parameters';

const useFloatingInputPrompt = () => {
  return useFloating({
    middleware: [
      offset({
        mainAxis: -BOARD_CELL_ACTIONS_OFFSET,
        alignmentAxis: BOARD_CELL_ACTIONS_OFFSET,
      }),
      shift(),
    ],
    placement: 'top',
    whileElementsMounted: autoUpdate,
  });
};

export default useFloatingInputPrompt;
