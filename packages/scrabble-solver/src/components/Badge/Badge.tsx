import classNames from 'classnames';
import { FunctionComponent, ReactNode } from 'react';

import styles from './Badge.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
}

export const Badge: FunctionComponent<Props> = ({ children, className }) => (
  <div className={classNames(styles.badge, className)}>{children}</div>
);
