import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler, ReactNode } from 'react';

import { noop } from 'lib';

import Tooltip from '../../../Tooltip';

import styles from './Cell.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: MouseEventHandler<HTMLButtonElement>;
  tooltip: ReactNode;
}

const Button: FunctionComponent<Props> = ({
  children,
  className,
  tooltip,
  onBlur = noop,
  onFocus = noop,
  onMouseOut = noop,
  onMouseOver = noop,
  ...props
}) => (
  <Tooltip tooltip={tooltip}>
    {({ ariaAttributes, setReferenceElement, onHide, onShow }) => (
      <button
        {...ariaAttributes}
        className={classNames(styles.action, className)}
        ref={setReferenceElement}
        // It's fine to make it not focusable with TAB from a11y point of view
        // because alternative key combos are provided.
        tabIndex={-1}
        type="button"
        onBlur={(event) => {
          onHide();
          onBlur(event);
        }}
        onFocus={(event) => {
          onShow();
          onFocus(event);
        }}
        onMouseOut={(event) => {
          onHide();
          onMouseOut(event);
        }}
        onMouseOver={(event) => {
          onShow();
          onMouseOver(event);
        }}
        {...props}
      >
        {children}
      </button>
    )}
  </Tooltip>
);

export default Button;
