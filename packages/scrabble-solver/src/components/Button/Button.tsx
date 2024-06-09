import classNames from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent, ReactNode, SVGAttributes } from 'react';

import { Tooltip } from '../Tooltip';

import styles from './Button.module.scss';
import Link from './Link';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  Icon?: FunctionComponent<SVGAttributes<SVGElement>>;
  iconClassName?: string;
  tooltip?: ReactNode;
  variant?: 'default' | 'primary';
}

const Button: FunctionComponent<Props> = ({
  children,
  className,
  Icon,
  iconClassName,
  tooltip,
  variant = 'default',
  ...props
}) => {
  return (
    <Tooltip tooltip={tooltip}>
      <button
        className={classNames(styles.button, className, {
          [styles.default]: variant === 'default',
          [styles.primary]: variant === 'primary',
        })}
        type="button"
        {...props}
      >
        <span className={styles.content}>
          {Icon && <Icon className={classNames(styles.icon, iconClassName)} />}
          {children && <span className={styles.label}>{children}</span>}
        </span>
      </button>
    </Tooltip>
  );
};

export default Object.assign(Button, {
  Link,
});
