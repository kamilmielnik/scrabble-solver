import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler, SVGAttributes } from 'react';

import { useTooltip } from '../Tooltip';

import Link from './Link';
import styles from './SquareButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: never;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  tooltip: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const SquareButton: FunctionComponent<Props> = ({ className, Icon, tooltip, ...props }) => {
  const triggerProps = useTooltip(tooltip, props);

  return (
    <button className={classNames(styles.squareButton, className)} type="button" {...props} {...triggerProps}>
      <span className={styles.content}>
        <Icon className={styles.icon} />
      </span>
    </button>
  );
};

export default Object.assign(SquareButton, {
  Link,
});
