import classNames from 'classnames';
import React, { FunctionComponent, MouseEventHandler, ReactNode } from 'react';

import { SvgIcon } from 'components';

import styles from './Button.module.scss';

interface CommonProps {
  children?: ReactNode;
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

const Button: FunctionComponent<Props> = ({
  as = 'button',
  children,
  className,
  disabled,
  href,
  icon,
  rel,
  target,
  title,
  onClick,
}) => {
  const content = (
    <span className={styles.content}>
      <SvgIcon className={styles.icon} icon={icon} />
      <span className={styles.label}>{children}</span>
    </span>
  );

  if (as === 'a') {
    return (
      <a
        className={classNames(styles.button, className, {
          [styles.empty]: !children,
        })}
        href={href}
        rel={rel}
        target={target}
        title={title}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classNames(styles.button, className, {
        [styles.empty]: !children,
      })}
      disabled={disabled}
      title={title}
      type="button"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
