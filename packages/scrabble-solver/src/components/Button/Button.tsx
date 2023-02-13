import classNames from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler, ReactNode, SVGAttributes } from 'react';

import { useTooltip } from '../Tooltip';

import styles from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  onClick: MouseEventHandler<HTMLButtonElement>;
  tooltip?: ReactNode;
}

const Button: FunctionComponent<Props> = ({ children, className, Icon, tooltip, ...props }) => {
  const triggerProps = useTooltip(tooltip, props);

  return (
    <button className={classNames(styles.button, className)} type="button" {...props} {...triggerProps}>
      <span className={styles.content}>
        <Icon className={styles.icon} />
        <span className={styles.label}>{children}</span>
      </span>
    </button>
  );
};

export default Button;
