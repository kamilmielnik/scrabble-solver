import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { usePopper } from 'react-popper';

import { useUniqueId } from 'hooks';

import { MODIFIERS } from './constants';
import styles from './Tooltip.module.scss';
import usePortal from './usePortal';

interface Props {
  className?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

interface Result {
  ariaAttributes: {
    'aria-describedby'?: string;
  };
  setReferenceElement: (referenceElement: HTMLElement | null) => void;
  onHide: () => void;
  onShow: () => void;
}

const useTooltip = (tooltip: ReactNode, { className, placement = 'top' }: Props = {}): Result => {
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
    ariaAttributes: isShown ? { 'aria-describedby': id } : {},
    onHide,
    onShow,
    setReferenceElement,
  };
};

export default useTooltip;
