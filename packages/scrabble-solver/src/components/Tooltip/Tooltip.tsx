import type { Placement } from '@floating-ui/react';
import { type FunctionComponent, type ReactNode } from 'react';

import { useDeferredRender } from '@/hooks/useDeferredRender';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';

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
  const canRenderTooltip = useDeferredRender();
  const isTouchDevice = useIsTouchDevice();

  if (!tooltip || !canRenderTooltip || isTouchDevice) {
    return children;
  }

  return (
    <TooltipBase placement={placement} tooltip={tooltip}>
      {children}
    </TooltipBase>
  );
};

const TooltipBase: FunctionComponent<Props> = ({ children, placement, tooltip }) => {
  const state = useTooltip({ placement });

  return (
    <TooltipContext.Provider value={state}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </TooltipContext.Provider>
  );
};
