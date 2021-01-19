import classNames from 'classnames';
import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';

import styles from './Well.module.scss';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

const Well = forwardRef<HTMLDivElement, Props>(({ children, className, ...props }, ref) => (
  <div className={classNames(styles.well, className)} ref={ref} {...props}>
    {children}
  </div>
));

export default Well;
