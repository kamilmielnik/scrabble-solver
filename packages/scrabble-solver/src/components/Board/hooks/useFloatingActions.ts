import { autoUpdate, offset, shift, useFloating } from '@floating-ui/react';

import { useAppLayout } from 'hooks';
import { BOARD_CELL_ACTIONS_OFFSET } from 'parameters';

const useFloatingActions = () => {
  const { actionsWidth } = useAppLayout();

  return useFloating({
    middleware: [
      offset({
        mainAxis: -BOARD_CELL_ACTIONS_OFFSET,
        alignmentAxis: BOARD_CELL_ACTIONS_OFFSET - actionsWidth,
      }),
      shift(),
    ],
    placement: 'top-end',
    whileElementsMounted: autoUpdate,
  });
};

export default useFloatingActions;
