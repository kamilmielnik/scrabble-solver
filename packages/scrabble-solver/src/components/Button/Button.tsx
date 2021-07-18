import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler, ReactNode } from 'react';

import { noop } from 'lib';

import SvgIcon from '../SvgIcon';
import Tooltip from '../Tooltip';

import styles from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: BrowserSpriteSymbol;
  onClick: MouseEventHandler<HTMLButtonElement>;
  tooltip?: ReactNode;
}

const Button: FunctionComponent<Props> = ({
  children,
  className,
  icon,
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
        className={classNames(styles.button, className)}
        ref={setReferenceElement}
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
        <span className={styles.content}>
          <span className={styles.label}>{children}</span>
          <SvgIcon className={styles.icon} icon={icon} />
        </span>
      </button>
    )}
  </Tooltip>
);

export default Button;
