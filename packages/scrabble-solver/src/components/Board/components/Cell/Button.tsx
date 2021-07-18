import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler, ReactNode } from 'react';

import { useTooltip } from '../../../Tooltip';

import styles from './Cell.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: MouseEventHandler<HTMLButtonElement>;
  tooltip: ReactNode;
}

const Button: FunctionComponent<Props> = ({ children, className, tooltip, ...props }) => {
  const triggerProps = useTooltip(tooltip, props);

  return (
    <button
      className={classNames(styles.action, className)}
      // It's fine to make it not focusable with TAB from a11y point of view
      // because alternative key combos are provided.
      tabIndex={-1}
      type="button"
      {...triggerProps}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
