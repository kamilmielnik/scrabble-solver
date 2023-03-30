import { autoUpdate, offset, Placement, shift, useFloating } from '@floating-ui/react';

import { useAppLayout } from 'hooks';
import { BOARD_CELL_ACTIONS_OFFSET } from 'parameters';

const useFloatingActions = (placement: Placement) => {
  const { actionsWidth } = useAppLayout();

  return useFloating({
    middleware: [
      offset({
        mainAxis: -BOARD_CELL_ACTIONS_OFFSET,
        alignmentAxis: BOARD_CELL_ACTIONS_OFFSET - actionsWidth,
      }),
      shift(),
    ],
    placement,
    whileElementsMounted: autoUpdate,
  });
};

export default useFloatingActions;
