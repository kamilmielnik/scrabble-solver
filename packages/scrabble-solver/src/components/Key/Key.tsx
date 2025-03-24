import classNames from 'classnames';
import { FunctionComponent, ReactNode } from 'react';

import styles from './Key.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
}

export const Key: FunctionComponent<Props> = ({ children, className }) => (
  <kbd className={classNames(styles.key, className)}>{children}</kbd>
);
