import {
  Placement,
  autoUpdate,
  flip,
  offset,
  shift,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useMemo, useState } from 'react';

export interface TooltipOptions {
  placement?: Placement;
}

export const useTooltip = ({ placement = 'top' }: TooltipOptions = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });
  const { context } = data;
  const { delay } = useDelayGroup(context);
  const hover = useHover(context, { move: false, delay });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      open: isOpen,
      setOpen: setIsOpen,
      ...interactions,
      ...data,
    }),
    [isOpen, setIsOpen, interactions, data],
  );
};
