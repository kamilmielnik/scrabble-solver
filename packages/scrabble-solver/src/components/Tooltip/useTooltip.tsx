import classNames from 'classnames';
import React, { FocusEventHandler, MouseEventHandler, ReactNode, useState } from 'react';
import { usePopper } from 'react-popper';

import { useUniqueId } from 'hooks';
import { noop } from 'lib';

import { MODIFIERS } from './constants';
import styles from './Tooltip.module.scss';
import usePortal from './usePortal';

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
  const ariaAttributes = isShown ? { 'aria-describedby': id } : {};

  const onHide = () => {
    setIsShown(false);
  };

  const onShow = () => {
    setIsShown(true);
  };

  usePortal(
    isEnabled && isShown && (
      <div
        className={classNames(styles.tooltip, className, {
          [styles.top]: computedPlacement === 'top',
          [styles.right]: computedPlacement === 'right',
          [styles.bottom]: computedPlacement === 'bottom',
          [styles.left]: computedPlacement === 'left',
        })}
        ref={setPopperElement}
        style={popperStyles.popper}
        onMouseEnter={onShow}
        onMouseLeave={onHide}
        {...attributes.popper}
      >
        <div>{tooltip}</div>
        <div className={styles.arrow} ref={setArrowElement} style={popperStyles.arrow} />
      </div>
    ),
  );

  return {
    ...ariaAttributes,
    ref: setReferenceElement,
    onBlur: (event) => {
      onBlur(event);
      onHide();
    },
    onFocus: (event) => {
      onFocus(event);
      onShow();
    },
    onMouseOut: (event) => {
      onMouseOut(event);
      onHide();
    },
    onMouseOver: (event) => {
      onMouseOver(event);
      onShow();
    },
  };
};

export default useTooltip;
