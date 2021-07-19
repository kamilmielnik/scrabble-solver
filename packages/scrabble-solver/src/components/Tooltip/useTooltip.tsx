import classNames from 'classnames';
import React, { FocusEventHandler, MouseEventHandler, ReactNode, useCallback, useMemo, useState } from 'react';
import { usePopper } from 'react-popper';

import { usePortal, useUniqueId } from 'hooks';
import { noop } from 'lib';

import { MODIFIERS } from './constants';
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

const useTooltip = (
  tooltip: ReactNode,
  { className, placement = 'top', onBlur = noop, onFocus = noop, onMouseOut = noop, onMouseOver = noop }: Props = {},
): TriggerProps => {
  const id = useUniqueId();
  const isEnabled = Boolean(tooltip) || tooltip === 0;
  const [isShown, setIsShown] = useState<boolean>(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const { attributes, styles: popperStyles } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }, ...MODIFIERS],
    placement,
  });
  const computedPlacement = attributes.popper ? attributes.popper['data-popper-placement'] : placement;
  const ariaAttributes = useMemo(() => (isShown ? { 'aria-describedby': id } : {}), [id, isShown]);

  const handleBlur = useCallback(
    (event) => {
      onBlur(event);
      setIsShown(false);
    },
    [onBlur],
  );

  const handleFocus = useCallback(
    (event) => {
      onFocus(event);
      setIsShown(true);
    },
    [onFocus],
  );

  const handleMouseOut = useCallback(
    (event) => {
      onMouseOut(event);
      setIsShown(false);
    },
    [onMouseOut],
  );

  const handleMouseOver = useCallback(
    (event) => {
      onMouseOver(event);
      setIsShown(true);
    },
    [onMouseOver],
  );

  const triggerProps = useMemo(
    () => ({
      ...ariaAttributes,
      ref: setReferenceElement,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onMouseOut: handleMouseOut,
      onMouseOver: handleMouseOver,
    }),
    [ariaAttributes, handleBlur, handleFocus, handleMouseOut, handleMouseOver],
  );

  usePortal(
    <div
      className={classNames(styles.tooltip, className, {
        [styles.top]: computedPlacement === 'top',
        [styles.right]: computedPlacement === 'right',
        [styles.bottom]: computedPlacement === 'bottom',
        [styles.left]: computedPlacement === 'left',
      })}
      ref={setPopperElement}
      style={popperStyles.popper}
      {...attributes.popper}
    >
      <div>{tooltip}</div>
      <div className={styles.arrow} ref={setArrowElement} style={popperStyles.arrow} />
    </div>,
    { disabled: !isEnabled || !isShown },
  );

  return triggerProps;
};

export default useTooltip;
