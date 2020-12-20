import classNames from 'classnames';
import React, { FunctionComponent, HTMLAttributes, ReactNode } from 'react';

import styles from './Well.module.scss';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

const Well: FunctionComponent<Props> = ({ children, className, ...props }) => (
  <div className={classNames(styles.well, className)} {...props}>
    {children}
  </div>
);

export default Well;
