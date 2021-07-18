import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler } from 'react';

import { noop } from 'lib';

import SvgIcon from '../SvgIcon';
import Tooltip from '../Tooltip';

import Link from './Link';
import styles from './SquareButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: never;
  icon: BrowserSpriteSymbol;
  tooltip: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const SquareButton: FunctionComponent<Props> = ({
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
        className={classNames(styles.squareButton, className)}
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
          <SvgIcon className={styles.icon} icon={icon} />
        </span>
      </button>
    )}
  </Tooltip>
);

export default Object.assign(SquareButton, {
  Link,
});
