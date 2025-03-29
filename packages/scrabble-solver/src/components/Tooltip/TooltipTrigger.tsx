import { useMergeRefs } from '@floating-ui/react';
import { isObject } from '@scrabble-solver/types';
import { type HTMLProps, type ReactElement, type RefObject, cloneElement, forwardRef, isValidElement } from 'react';

import { useTooltipContext } from './context';

type Props = HTMLProps<HTMLElement>;

export const TooltipTrigger = forwardRef<HTMLElement, Props>(({ children, ...props }, ref) => {
  const state = useTooltipContext();
  const childrenElement = children as ReactElement<{
    ref: RefObject<HTMLElement>;
  }>;
  const finalRef = useMergeRefs([state.refs.setReference, ref, childrenElement.props.ref]);

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
