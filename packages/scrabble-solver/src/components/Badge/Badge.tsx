import classNames from 'classnames';
import { type FunctionComponent, type ReactNode } from 'react';

import styles from './Badge.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
}

export const Badge: FunctionComponent<Props> = ({ children, className }) => (
  <div className={classNames(styles.badge, className)}>{children}</div>
);
