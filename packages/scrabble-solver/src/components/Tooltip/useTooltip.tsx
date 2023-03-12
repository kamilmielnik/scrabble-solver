import { arrow, autoUpdate, flip, FloatingArrow, offset, shift, useFloating } from '@floating-ui/react';
import classNames from 'classnames';
import {
  FocusEvent,
  FocusEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useIsTouchDevice, usePortal } from 'hooks';
import { noop } from 'lib';

import styles from './Tooltip.module.scss';

interface Props {
  className?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  onBlur?: FocusEventHandler;
  onFocus?: FocusEventHandler;
  onMouseOut?: MouseEventHandler;
  onMouseOver?: MouseEventHandler;
}

interface TriggerProps {
  'aria-describedby'?: string;
  ref: (referenceElement: HTMLElement | null) => void;
  onBlur?: FocusEventHandler;
  onFocus?: FocusEventHandler;
  onMouseOut?: MouseEventHandler;
  onMouseOver?: MouseEventHandler;
}

const ARROW_SIZE = 7;
const ARROW_GAP = 3;
const PADDING = 10;

// eslint-disable-next-line max-statements
const useTooltip = (
  tooltip: ReactNode,
  { className, placement = 'top', onBlur = noop, onFocus = noop, onMouseOut = noop, onMouseOver = noop }: Props = {},
): TriggerProps => {
  const id = useId();
  const isTouchDevice = useIsTouchDevice();
  const isEnabled = Boolean(tooltip) || tooltip === 0;
  const [isShown, setIsShown] = useState<boolean>(false);
  const arrowRef = useRef(null);
  const ariaAttributes = useMemo(() => (isShown ? { 'aria-describedby': id } : {}), [id, isShown]);

  const { x, y, context, refs, strategy } = useFloating({
    middleware: [flip(), shift({ padding: PADDING }), offset(ARROW_SIZE + ARROW_GAP), arrow({ element: arrowRef })],
    placement,
    whileElementsMounted: autoUpdate,
  });

  const handleBlur = useCallback(
    (event: FocusEvent) => {
      onBlur(event);
      setIsShown(false);
    },
    [onBlur],
  );

  const handleFocus = useCallback(
    (event: FocusEvent) => {
      onFocus(event);
      setIsShown(true);
    },
    [onFocus],
  );

  const handleMouseOut = useCallback(
    (event: MouseEvent) => {
      onMouseOut(event);
      setIsShown(false);
    },
    [onMouseOut],
  );

  const handleMouseOver = useCallback(
    (event: MouseEvent) => {
      onMouseOver(event);
      setIsShown(true);
    },
    [onMouseOver],
  );

  const mouseTriggerProps = useMemo(
    () => ({
      ...ariaAttributes,
      ref: refs.setReference,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onMouseOut: handleMouseOut,
      onMouseOver: handleMouseOver,
    }),
    [ariaAttributes, handleBlur, handleFocus, handleMouseOut, handleMouseOver],
  );

  const touchTriggerProps = useMemo(
    () => ({
      ...ariaAttributes,
      ref: refs.setReference,
    }),
    [ariaAttributes],
  );

  const triggerProps = isTouchDevice ? touchTriggerProps : mouseTriggerProps;

  usePortal(
    <div
      className={classNames(styles.tooltip, className)}
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
    >
      <div>{tooltip}</div>
      <FloatingArrow className={styles.arrow} context={context} ref={arrowRef} />
    </div>,
    { disabled: !isEnabled || !isShown },
  );

  return triggerProps;
};

export default useTooltip;
