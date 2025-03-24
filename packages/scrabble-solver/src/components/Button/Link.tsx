import classNames from 'classnames';
import { AnchorHTMLAttributes, FunctionComponent, ReactNode, SVGAttributes } from 'react';

import { Tooltip } from '../Tooltip';

import styles from './Button.module.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  'aria-label': string;
  href: string;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  iconClassName?: string;
  tooltip?: ReactNode;
  variant?: 'default' | 'primary';
  wide?: boolean;
}

export const Link: FunctionComponent<Props> = ({
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
      <a
        className={classNames(styles.button, className, {
          [styles.default]: variant === 'default',
          [styles.primary]: variant === 'primary',
          [styles.wide]: wide,
        })}
        {...props}
      >
        <span className={styles.content}>
          {Icon && <Icon className={classNames(styles.icon, iconClassName)} />}
          {children && <span className={styles.label}>{children}</span>}
        </span>
      </a>
    </Tooltip>
  );
};
