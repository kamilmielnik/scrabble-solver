import classNames from 'classnames';
import { FunctionComponent, ReactNode } from 'react';

import styles from './Key.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
  size?: 'medium' | 'small';
}

const Key: FunctionComponent<Props> = ({ children, className, size = 'medium' }) => (
  <kbd
    className={classNames(styles.key, className, {
      [styles.small]: size === 'small',
    })}
  >
    {children}
  </kbd>
);

export default Key;
