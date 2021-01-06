import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import styles from './Screen.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  hidden?: boolean;
}

const Screen: FunctionComponent<Props> = ({ children, className, hidden }) => (
  <div
    className={classNames(styles.screen, className, {
      [styles.hidden]: hidden,
    })}
  >
    <div className={styles.content}>{children}</div>
  </div>
);

export default Screen;
