import { useMergeRefs } from '@floating-ui/react';
import { HTMLProps, cloneElement, forwardRef, isValidElement } from 'react';

import { useTooltipContext } from './context';

type Props = HTMLProps<HTMLElement>;

export const TooltipTrigger = forwardRef<HTMLElement, Props>(({ children, ...props }, ref) => {
  const state = useTooltipContext();
  const childrenElement = children as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const finalRef = useMergeRefs([state.refs.setReference, ref, childrenElement.ref]);

  if (!isValidElement(children)) {
    throw new Error("TooltipTrigger's children are not a valid element");
  }

  return cloneElement(
    children,
    state.getReferenceProps({
      ref: finalRef,
      ...props,
      ...children.props,
      'data-state': state.open ? 'open' : 'closed',
    }),
  );
});
