import type { Placement } from '@floating-ui/react';
import { type FunctionComponent, type ReactNode } from 'react';

import { TooltipContext } from './context';
import { TooltipContent } from './TooltipContent';
import { TooltipTrigger } from './TooltipTrigger';
import { useTooltip } from './useTooltip';

interface Props {
  children: ReactNode;
  placement?: Placement;
  tooltip?: ReactNode;
}

export const Tooltip: FunctionComponent<Props> = ({ children, placement, tooltip }) => {
  const state = useTooltip({ placement });

  if (!tooltip) {
    return children;
  }

  return (
    <TooltipContext.Provider value={state}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </TooltipContext.Provider>
  );
};
