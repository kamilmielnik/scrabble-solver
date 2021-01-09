import classNames from 'classnames';
import React, { FunctionComponent, MouseEventHandler } from 'react';

import { SvgIcon } from 'components';

import styles from './IconButton.module.scss';

interface CommonProps {
  className?: string;
  icon: BrowserSpriteSymbol;
  title: string;
}

interface LinkProps extends CommonProps {
  as: 'a';
  disabled?: never;
  href: string;
  rel?: string;
  target?: string;
  onClick?: never;
}

interface ButtonProps extends CommonProps {
  as?: 'button';
  disabled?: boolean;
  href?: never;
  rel?: never;
  target?: never;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

type Props = LinkProps | ButtonProps;

const IconButton: FunctionComponent<Props> = ({
  as = 'button',
  className,
  disabled,
  href,
  icon,
  rel,
  target,
  title,
  onClick,
}) => {
  if (as === 'a') {
    return (
      <a className={classNames(styles.iconButton, className)} href={href} rel={rel} target={target} title={title}>
        <SvgIcon className={styles.icon} icon={icon} />
      </a>
    );
  }

  return (
    <button
      className={classNames(styles.iconButton, className)}
      disabled={disabled}
      title={title}
      type="button"
      onClick={onClick}
    >
      <SvgIcon className={styles.icon} icon={icon} />
    </button>
  );
};

export default IconButton;
