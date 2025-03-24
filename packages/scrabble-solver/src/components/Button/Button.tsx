import classNames from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent, ReactNode, SVGAttributes } from 'react';

import { Tooltip } from '../Tooltip';

import styles from './Button.module.scss';
import { Link } from './Link';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  Icon?: FunctionComponent<SVGAttributes<SVGElement>>;
  iconClassName?: string;
  tooltip?: ReactNode;
  variant?: 'default' | 'primary';
  wide?: boolean;
}

const ButtonBase: FunctionComponent<Props> = ({
  children,
  className,
  Icon,
  iconClassName,
  tooltip,
  variant = 'default',
  wide,
  ...props
}) => {
  return (
    <Tooltip tooltip={tooltip}>
      <button
        className={classNames(styles.button, className, {
          [styles.default]: variant === 'default',
          [styles.primary]: variant === 'primary',
          [styles.wide]: wide,
        })}
        type="button"
        {...props}
      >
        <span className={styles.content}>
          {Icon && <Icon aria-hidden="true" className={classNames(styles.icon, iconClassName)} role="img" />}
          {children && <span className={styles.label}>{children}</span>}
        </span>
      </button>
    </Tooltip>
  );
};

export const Button = Object.assign(ButtonBase, {
  Link,
});
