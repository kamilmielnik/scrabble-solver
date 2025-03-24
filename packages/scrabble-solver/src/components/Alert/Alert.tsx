import classNames from 'classnames';
import { FunctionComponent, HTMLProps, ReactNode, SVGAttributes } from 'react';

import { Check, CrossCircleFill, ExclamationTriangleFill, InfoCircleFill } from 'icons';

import styles from './Alert.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant: 'error' | 'info' | 'success' | 'warning';
}

const ICON_PER_TYPE: Record<Props['variant'], FunctionComponent<SVGAttributes<SVGElement>>> = {
  error: CrossCircleFill,
  info: InfoCircleFill,
  success: Check,
  warning: ExclamationTriangleFill,
};

export const Alert: FunctionComponent<Props> = ({ children, className, variant, ...props }) => {
  const Icon = ICON_PER_TYPE[variant];

  return (
    <div
      className={classNames(styles.alert, className, {
        [styles.error]: variant === 'error',
        [styles.info]: variant === 'info',
        [styles.success]: variant === 'success',
        [styles.warning]: variant === 'warning',
      })}
      {...props}
    >
      <div className={styles.iconContainer}>
        <Icon aria-hidden="true" className={styles.icon} role="img" />
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
};
