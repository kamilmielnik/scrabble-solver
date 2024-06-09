import { FloatingPortal, useDelayGroup, useMergeRefs, useTransitionStyles } from '@floating-ui/react';
import { HTMLProps, forwardRef } from 'react';

import { useTooltipContext } from './context';

type Props = HTMLProps<HTMLDivElement>;

export const TooltipContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const state = useTooltipContext();
  const { isInstantPhase, currentId } = useDelayGroup(state.context, { id: state.context.floatingId });
  const finalRef = useMergeRefs([state.refs.setFloating, ref]);

  const instantDuration = 0;
  const duration = 250;

  const instantPhaseDuration = {
    open: instantDuration,
    close: currentId === state.context.floatingId ? duration : instantDuration,
  };

  const { isMounted, styles } = useTransitionStyles(state.context, {
    duration: isInstantPhase ? instantPhaseDuration : duration,
    initial: {
      opacity: 0,
    },
  });

  if (!isMounted) {
    return null;
  }

  return (
    <FloatingPortal>
      <div
        ref={finalRef}
        style={{
          ...state.floatingStyles,
          ...props.style,
          ...styles,
        }}
        {...state.getFloatingProps(props)}
      >
        {props.children}
      </div>
    </FloatingPortal>
  );
});
