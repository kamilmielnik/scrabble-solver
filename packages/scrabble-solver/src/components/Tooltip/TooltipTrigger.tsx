import { useMergeRefs } from '@floating-ui/react';
import { isObject } from '@scrabble-solver/types';
import { type HTMLProps, type RefObject, cloneElement, forwardRef, isValidElement } from 'react';

import { useTooltipContext } from './context';

type Props = HTMLProps<HTMLElement>;

interface ChildProps {
  ref: RefObject<HTMLElement>;
}

export const TooltipTrigger = forwardRef<HTMLElement, Props>(({ children, ...props }, ref) => {
  const state = useTooltipContext();
  const childrenRef = isValidElement<ChildProps>(children) ? children.props.ref : undefined;
  const finalRef = useMergeRefs([state.refs.setReference, ref, childrenRef]);

  if (!isValidElement(children)) {
    throw new Error("TooltipTrigger's children are not a valid element");
  }

  return cloneElement(
    children,
    state.getReferenceProps({
      ref: finalRef,
      ...props,
      ...(isObject(children.props) ? children.props : {}),
      // @ts-expect-error incorrect @floating-ui typings
      'data-state': state.open ? 'open' : 'closed',
    }),
  );
});
