import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent } from 'react';

import styles from './Cell.module.scss';

const Button: FunctionComponent<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    className={classNames(styles.action, className)}
    // It's fine to make it not focusable with TAB from a11y point of view
    // because alternative key combos are provided.
    tabIndex={-1}
    type="button"
    {...props}
  >
    {children}
  </button>
);

export default Button;
