import { FloatingArrow, FloatingPortal, useDelayGroup, useMergeRefs, useTransitionStyles } from '@floating-ui/react';
import { forwardRef, HTMLProps } from 'react';

import { useTooltipContext } from './context';
import styles from './Tooltip.module.scss';

type Props = HTMLProps<HTMLDivElement>;

export const TooltipContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const state = useTooltipContext();
  const { context } = state;
  const { isInstantPhase, currentId } = useDelayGroup(context, { id: context.floatingId });
  const finalRef = useMergeRefs([state.refs.setFloating, ref]);

  const instantDuration = 0;
  const duration = 250;

  const instantPhaseDuration = {
    open: instantDuration,
    close: currentId === context.floatingId ? duration : instantDuration,
  };

  const { isMounted, styles: style } = useTransitionStyles(context, {
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
        className={styles.tooltip}
        ref={finalRef}
        style={{
          ...state.floatingStyles,
          ...props.style,
          ...style,
        }}
        {...state.getFloatingProps(props)}
      >
        <div>{props.children}</div>

        <FloatingArrow className={styles.arrow} context={context} ref={state.arrowRef} />
      </div>
    </FloatingPortal>
  );
});
