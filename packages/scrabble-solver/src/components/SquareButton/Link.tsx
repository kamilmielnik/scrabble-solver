import classNames from 'classnames';
import React, { AnchorHTMLAttributes, FunctionComponent } from 'react';

import { noop } from 'lib';

import SvgIcon from '../SvgIcon';
import Tooltip from '../Tooltip';

import styles from './SquareButton.module.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: BrowserSpriteSymbol;
  href: string;
  title: string;
}

const Link: FunctionComponent<Props> = ({
  children,
  className,
  icon,
  onBlur = noop,
  onFocus = noop,
  onMouseOut = noop,
  onMouseOver = noop,
  title,
  ...props
}) => (
  <Tooltip tooltip={title}>
    {({ ariaAttributes, setReferenceElement, onHide, onShow }) => (
      <a
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
      </a>
    )}
  </Tooltip>
);

export default Link;
