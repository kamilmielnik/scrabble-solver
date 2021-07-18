import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler, ReactNode } from 'react';

import SvgIcon from '../SvgIcon';
import { useTooltip } from '../Tooltip';

import styles from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: BrowserSpriteSymbol;
  onClick: MouseEventHandler<HTMLButtonElement>;
  tooltip?: ReactNode;
}

const Button: FunctionComponent<Props> = ({ children, className, icon, tooltip, ...props }) => {
  const triggerProps = useTooltip(tooltip, props);

  return (
    <button className={classNames(styles.button, className)} type="button" {...triggerProps} {...props}>
      <span className={styles.content}>
        <span className={styles.label}>{children}</span>
        <SvgIcon className={styles.icon} icon={icon} />
      </span>
    </button>
  );
};

export default Button;
