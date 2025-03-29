import {
  type Placement,
  arrow,
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
import { useMemo, useRef, useState } from 'react';

const ARROW_SIZE = 7;
const ARROW_GAP = 3;
const PADDING = 10;

interface TooltipOptions {
  placement?: Placement;
}

export const useTooltip = ({ placement = 'top' }: TooltipOptions = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const data = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [flip(), shift({ padding: PADDING }), offset(ARROW_SIZE + ARROW_GAP), arrow({ element: arrowRef })],
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
      arrowRef,
      open: isOpen,
      setOpen: setIsOpen,
      ...interactions,
      ...data,
    }),
    [arrowRef, isOpen, setIsOpen, interactions, data],
  );
};
