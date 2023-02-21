import classNames from 'classnames';
import { FunctionComponent, HTMLProps, ReactNode, SVGAttributes } from 'react';

import { CrossCircleFill, ExclamationTriangleFill, InfoCircleFill } from 'icons';

import styles from './EmptyState.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant: 'error' | 'info' | 'warning';
}

const ICON_PER_TYPE: Record<Props['variant'], FunctionComponent<SVGAttributes<SVGElement>>> = {
  error: CrossCircleFill,
  info: InfoCircleFill,
  warning: ExclamationTriangleFill,
};

const EmptyState: FunctionComponent<Props> = ({ children, className, variant, ...props }) => {
  const Icon = ICON_PER_TYPE[variant];

  return (
    <div
      className={classNames(styles.emptyState, className, {
        [styles.error]: variant === 'error',
        [styles.info]: variant === 'info',
        [styles.warning]: variant === 'warning',
      })}
      {...props}
    >
      <div className={styles.iconContainer}>
        <Icon className={styles.icon} />
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default EmptyState;
