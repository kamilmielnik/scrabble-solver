import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import styles from './Well.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
}

const Well: FunctionComponent<Props> = ({ children, className }) => (
  <div className={classNames(styles.well, className)}>{children}</div>
);

export default Well;
