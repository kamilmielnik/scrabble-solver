import classNames from 'classnames';
import { forwardRef, HTMLProps } from 'react';

import styles from './Sizer.module.scss';

const Sizer = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className={classNames(styles.sizer, className)} ref={ref} {...props} />
));

export default Sizer;
