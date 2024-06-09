import { FunctionComponent, ReactNode } from 'react';

import { TooltipContext } from './context';
import { TooltipContent } from './TooltipContent';
import { TooltipTrigger } from './TooltipTrigger';
import { TooltipOptions, useTooltip } from './useTooltip';

interface Props extends TooltipOptions {
  children: ReactNode;
  tooltip?: ReactNode;
}

export const Tooltip: FunctionComponent<Props> = ({ children, tooltip, ...options }) => {
  const state = useTooltip(options);

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
